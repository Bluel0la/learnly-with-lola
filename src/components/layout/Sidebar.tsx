
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import SidebarLogo from "./SidebarLogo";
import SidebarSearch from "./SidebarSearch";
import SidebarNav from "./SidebarNav";
import SidebarSessionsList from "./SidebarSessionsList";
import { ChatSession, chatApi } from "@/services/api";

const Sidebar = () => {
  const { toast } = useToast();

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        const userSessions = await chatApi.getSessions();
        setSessions(userSessions);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        toast({
          title: "Error",
          description: "Failed to load chat sessions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [toast]);

  return (
    <aside className="w-64 h-full border-r border-gray-200 bg-white flex flex-col">
      <SidebarLogo />
      <SidebarSearch value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <SidebarNav />
      <SidebarSessionsList sessions={sessions} searchQuery={searchQuery} isLoading={isLoading} />
    </aside>
  );
};

export default Sidebar;
