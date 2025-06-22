
import React from "react";
import { Link } from "react-router-dom";

const SidebarLogo = () => (
  <div className="p-4 border-b border-gray-200 flex justify-center">
    <Link to="/" className="flex items-center">
      <img
        src="/lovable-uploads/049297b5-b176-4687-b854-f87a9f0100ff.png"
        alt="Learnly Logo"
        className="h-8 w-auto"
      />
    </Link>
  </div>
);

export default SidebarLogo;
