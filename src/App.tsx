
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AuthRedirect from "./components/auth/AuthRedirect";
import Index from "./pages/Index";
import ChatPage from "./pages/ChatPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import QuizzesPage from "./pages/QuizzesPage";
import ResourcesPage from "./pages/ResourcesPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
