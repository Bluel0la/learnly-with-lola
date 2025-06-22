import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ChatPageSkeleton from "@/components/skeletons/ChatPageSkeleton";
import FlashcardsPageSkeleton from "@/components/skeletons/FlashcardsPageSkeleton";
import QuizzesPageSkeleton from "@/components/skeletons/QuizzesPageSkeleton";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import LoginPageSkeleton from "@/components/skeletons/LoginPageSkeleton";
import IndexPageSkeleton from "@/components/skeletons/IndexPageSkeleton";
import ProfilePageSkeleton from "@/components/skeletons/ProfilePageSkeleton";
import ResourcesPageSkeleton from "@/components/skeletons/ResourcesPageSkeleton";

// Lazy load all route components
const Layout = lazy(() => import("./components/layout/Layout"));
const AuthRedirect = lazy(() => import("./components/auth/AuthRedirect"));
const Index = lazy(() => import("./pages/Index"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const FlashcardsPage = lazy(() => import("./pages/FlashcardsPage"));
const QuizzesPage = lazy(() => import("./pages/QuizzesPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Use a loader that doesn't cover the sidebar/navbar, only the main content area
function RouteAwareSkeleton() {
  const location = useLocation();
  const pathname = location.pathname;

  // Import the new skeleton components
  const ChatPageSkeleton = lazy(() => import("./components/skeletons/ChatPageSkeleton"));
  const FlashcardsPageSkeleton = lazy(() => import("./components/skeletons/FlashcardsPageSkeleton"));
  const QuizzesPageSkeleton = lazy(() => import("./components/skeletons/QuizzesPageSkeleton"));
  const LoginPageSkeleton = lazy(() => import("./components/skeletons/LoginPageSkeleton"));
  const IndexPageSkeleton = lazy(() => import("./components/skeletons/IndexPageSkeleton"));
  const ProfilePageSkeleton = lazy(() => import("./components/skeletons/ProfilePageSkeleton"));
  const ResourcesPageSkeleton = lazy(() => import("./components/skeletons/ResourcesPageSkeleton"));
  const PageSkeleton = lazy(() => import("./components/skeletons/PageSkeleton"));

  if (pathname === "/login" || pathname === "/signup") {
    return <LoginPageSkeleton />;
  }
  if (pathname === "/") {
    return <IndexPageSkeleton />;
  }
  if (pathname.startsWith("/chat")) {
    return <ChatPageSkeleton />;
  }
  if (pathname.startsWith("/flashcards")) {
    return <FlashcardsPageSkeleton />;
  }
  if (pathname.startsWith("/quizzes")) {
    return <QuizzesPageSkeleton />;
  }
  if (pathname.startsWith("/profile")) {
    return <ProfilePageSkeleton />;
  }
  if (pathname.startsWith("/resources")) {
    return <ResourcesPageSkeleton />;
  }
  // fallback
  return <PageSkeleton />;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={
          // Only load skeleton over main content, not sidebar
          <div className="min-h-screen flex w-full">
            {/* Sidebar area is not covered */}
            <div className="hidden md:block">
              {/* Keep AppSidebar always visible, do not show skeleton here */}
              {/* Instead of importing AppSidebar directly, Layout handles it */}
              <div className="w-64 h-full" />
            </div>
            <div className="flex-1 flex flex-col min-h-screen max-h-screen">
              <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 border-b px-3 md:px-4 bg-white sticky top-0 z-10" />
              <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
                <RouteAwareSkeleton />
              </main>
            </div>
          </div>
        }>
          <ErrorBoundary>
            <Suspense fallback={<PageSkeleton />}>
              <AuthRedirect>
                <Routes>
                  <Route path="/" element={<Layout><Index /></Layout>} />
                  <Route path="/chat" element={<Layout><ChatPage /></Layout>} />
                  <Route path="/chat/:sessionId" element={<Layout><ChatPage /></Layout>} />
                  <Route path="/flashcards" element={<Layout><FlashcardsPage /></Layout>} />
                  <Route path="/quizzes" element={<Layout><QuizzesPage /></Layout>} />
                  <Route path="/resources" element={<Layout><ResourcesPage /></Layout>} />
                  <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
                  <Route path="/login" element={<Layout><LoginPage /></Layout>} />
                  <Route path="/signup" element={<Layout><LoginPage /></Layout>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthRedirect>
            </Suspense>
          </ErrorBoundary>
        </Suspense>
      </BrowserRouter>
      {/* Only show React Query Devtools in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
