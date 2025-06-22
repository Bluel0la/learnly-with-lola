
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import Navbar from './Navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNav from './MobileNav';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isLandingPage = location.pathname === '/';

  // Render landing page without sidebar and navigation
  if (isLandingPage) {
    return <>{children}</>;
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Hide sidebar on mobile */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        <SidebarInset className="flex flex-col flex-1 min-h-screen max-h-screen">
          <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 border-b px-3 md:px-4 bg-white sticky top-0 z-10">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <Navbar />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
            <div className="h-full min-h-0">
              {children}
            </div>
          </main>
          {/* Show bottom nav only on mobile and authenticated pages */}
          <MobileNav />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
