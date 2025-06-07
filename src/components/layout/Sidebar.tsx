
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Calculator, FileText, Filter, MessageSquare, Library, HelpCircle, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from 'react-router-dom';
import { ChatSession, chatApi } from '@/services/api';

const Sidebar = () => {
  const { toast } = useToast();
  const location = useLocation();
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        const userSessions = await chatApi.getSessions();
        setSessions(userSessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        toast({
          title: "Error",
          description: "Failed to load chat sessions",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [toast]);

  const filteredSessions = sessions
    .filter(session => 
      searchQuery === '' || 
      session.chat_title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const getSessionIcon = (title: string) => {
    // Simple logic to determine icon based on title keywords
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('math') || lowerTitle.includes('calc') || lowerTitle.includes('equation')) {
      return <Calculator className="h-4 w-4 text-green-500" />;
    } else if (lowerTitle.includes('summary') || lowerTitle.includes('explain')) {
      return <FileText className="h-4 w-4 text-blue-500" />;
    } else if (lowerTitle.includes('flash') || lowerTitle.includes('card')) {
      return <BookOpen className="h-4 w-4 text-accent" />;
    } else {
      return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const isActive = (path: string) => {
    if (path === "/chat") {
      return location.pathname === "/chat" || location.pathname === "/";
    }
    return location.pathname === path;
  };

  const isSessionActive = (id: string) => {
    return location.pathname === `/chat/${id}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <aside className="w-64 h-full border-r border-gray-200 bg-white flex flex-col">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200 flex justify-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/049297b5-b176-4687-b854-f87a9f0100ff.png" 
            alt="Learnly Logo" 
            className="h-8 w-auto"
          />
        </Link>
      </div>

      {/* Search Input */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search sessions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Main Navigation Links */}
      <div className="px-3 py-3 border-b border-gray-200">
        <nav className="flex flex-col space-y-1">
          <NavItem 
            to="/chat" 
            active={isActive("/chat")}
            icon={<MessageSquare className="h-5 w-5" />}
          >
            Chat
          </NavItem>
          <NavItem 
            to="/flashcards" 
            active={isActive('/flashcards')}
            icon={<BookOpen className="h-5 w-5" />}
          >
            Flashcards
          </NavItem>
          <NavItem 
            to="/quizzes" 
            active={isActive('/quizzes')}
            icon={<HelpCircle className="h-5 w-5" />}
          >
            Quizzes
          </NavItem>
          <NavItem 
            to="/resources" 
            active={isActive('/resources')}
            icon={<Library className="h-5 w-5" />}
          >
            Resources
          </NavItem>
          <NavItem 
            to="/profile" 
            active={isActive('/profile')}
            icon={<User className="h-5 w-5" />}
          >
            Profile
          </NavItem>
        </nav>
      </div>
      
      {/* Sessions List - Now directly after navigation */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="text-xs font-medium text-gray-500 px-2 pt-2 pb-1">RECENT SESSIONS</div>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="h-5 w-5 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredSessions.map((session) => (
              <Link
                key={session.chat_id}
                to={`/chat/${session.chat_id}`}
                className={`block w-full text-left p-2 rounded-lg ${
                  isSessionActive(session.chat_id) 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-gray-100'
                } transition-colors`}
              >
                <div className="flex items-center">
                  {getSessionIcon(session.chat_title)}
                  <span className="ml-2 text-sm font-medium truncate">{session.chat_title}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatDate(session.created_at)}
                </div>
              </Link>
            ))}
            
            {filteredSessions.length === 0 && !isLoading && (
              <div className="text-center p-4 text-gray-500 text-sm">
                You currently don't have any chat sessions with me
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

const NavItem = ({ 
  children, 
  to, 
  active, 
  icon
}: { 
  children: React.ReactNode; 
  to: string;
  active: boolean;
  icon: React.ReactNode;
}) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
        active 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span className={`mr-3 ${active ? 'text-primary' : 'text-gray-500'}`}>{icon}</span>
      <span className="text-sm">{children}</span>
    </Link>
  );
};

export default Sidebar;
