
import React from "react";
import { MessageSquare, BookOpen, HelpCircle, Library, User } from "lucide-react";
import SidebarNavItem from "./SidebarNavItem";
import { useLocation } from "react-router-dom";

const navLinks = [
  {
    to: "/chat",
    icon: <MessageSquare className="h-5 w-5" />,
    label: "Chat",
  },
  {
    to: "/flashcards",
    icon: <BookOpen className="h-5 w-5" />,
    label: "Flashcards",
  },
  {
    to: "/quizzes",
    icon: <HelpCircle className="h-5 w-5" />,
    label: "Quizzes",
  },
  {
    to: "/resources",
    icon: <Library className="h-5 w-5" />,
    label: "Resources",
  },
  {
    to: "/profile",
    icon: <User className="h-5 w-5" />,
    label: "Profile",
  },
];

function isActive(pathname: string, path: string) {
  if (path === "/chat") {
    return pathname === "/chat" || pathname === "/";
  }
  return pathname === path;
}

const SidebarNav = () => {
  const location = useLocation();

  return (
    <div className="px-3 py-3 border-b border-gray-200">
      <nav className="flex flex-col space-y-1">
        {navLinks.map((link) => (
          <SidebarNavItem
            key={link.to}
            to={link.to}
            icon={link.icon}
            active={isActive(location.pathname, link.to)}
          >
            {link.label}
          </SidebarNavItem>
        ))}
      </nav>
    </div>
  );
};

export default SidebarNav;
