
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Calculator, FileText, BookOpen, MessageSquare } from "lucide-react";
import { ChatSession } from "@/services/api";

interface SidebarSessionsListProps {
  sessions: ChatSession[];
  searchQuery: string;
  isLoading: boolean;
}

const getSessionIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (
    lowerTitle.includes("math") ||
    lowerTitle.includes("calc") ||
    lowerTitle.includes("equation")
  ) {
    return <Calculator className="h-4 w-4 text-green-500" />;
  } else if (lowerTitle.includes("summary") || lowerTitle.includes("explain")) {
    return <FileText className="h-4 w-4 text-blue-500" />;
  } else if (lowerTitle.includes("flash") || lowerTitle.includes("card")) {
    return <BookOpen className="h-4 w-4 text-accent" />;
  } else {
    return <MessageSquare className="h-4 w-4 text-gray-500" />;
  }
};

const SidebarSessionsList: React.FC<SidebarSessionsListProps> = ({
  sessions,
  searchQuery,
  isLoading,
}) => {
  const location = useLocation();

  const filteredSessions = sessions
    .filter(
      (session) =>
        searchQuery === "" ||
        session.chat_title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const isSessionActive = (id: string) =>
    location.pathname === `/chat/${id}`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="flex-1 overflow-y-auto p-2">
      <div className="text-xs font-medium text-gray-500 px-2 pt-2 pb-1">
        RECENT SESSIONS
      </div>
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
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-gray-100"
              } transition-colors`}
            >
              <div className="flex items-center">
                {getSessionIcon(session.chat_title)}
                <span className="ml-2 text-sm font-medium truncate">
                  {session.chat_title}
                </span>
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
  );
};

export default SidebarSessionsList;
