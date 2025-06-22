
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, BookOpen, HelpCircle, Library, User } from 'lucide-react';

const navItems = [
  { label: "Chat",    path: "/chat",      icon: MessageSquare },
  { label: "Cards",   path: "/flashcards",icon: BookOpen },
  { label: "Quizzes", path: "/quizzes",   icon: HelpCircle },
  { label: "Resources", path: "/resources", icon: Library },
  { label: "Profile", path: "/profile",   icon: User },
];

const MobileNav = () => {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-gray-200 shadow md:hidden flex justify-evenly px-2 py-1">
      {navItems.map(({ label, path, icon: Icon }) => (
        <Link
          to={path}
          key={label}
          className={`flex flex-col items-center flex-1 px-2 py-1 touch-target text-xs font-medium 
            ${location.pathname.startsWith(path) ? 'text-primary' : 'text-gray-600 hover:text-blue-600 transition-colors'}
          `}
        >
          <Icon className="w-6 h-6 mb-0.5" />
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default MobileNav;
