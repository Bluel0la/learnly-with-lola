
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SidebarSearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SidebarSearch: React.FC<SidebarSearchProps> = ({ value, onChange }) => (
  <div className="p-4 border-b border-gray-200">
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Search sessions..."
        className="pl-8"
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

export default SidebarSearch;
