
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarNavItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ to, icon, children, active }) => (
  <Link
    to={to}
    className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
      active
        ? "bg-primary/10 text-primary font-medium"
        : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <span className={`mr-3 ${active ? "text-primary" : "text-gray-500"}`}>{icon}</span>
    <span className="text-sm">{children}</span>
  </Link>
);

export default SidebarNavItem;
