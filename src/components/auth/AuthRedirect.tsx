
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { secureTokenStorage } from '@/services/secureTokenStorage';

interface AuthRedirectProps {
  children: React.ReactNode;
}

const AuthRedirect = ({ children }: AuthRedirectProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const hasShownToast = useRef(false);
  
  useEffect(() => {
    const checkAuth = () => {
      // Don't redirect if already on login or signup page
      const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
      
      if (!secureTokenStorage.isAuthenticated() && !isAuthPage) {
        // Only show toast once per session to avoid spam
        if (!hasShownToast.current) {
          toast({
            title: "Session expired",
            description: "Please log in to continue",
            variant: "destructive"
          });
          hasShownToast.current = true;
        }
        navigate('/login', { state: { from: location.pathname } });
      } else if (secureTokenStorage.isAuthenticated() && isAuthPage) {
        // If user is authenticated but on auth page, redirect to chat
        navigate('/chat');
      }
    };

    // Check immediately
    checkAuth();
    
    // Set up interval to check token expiration every 30 seconds (reduced from 1 minute for better UX)
    const interval = setInterval(checkAuth, 30000);
    
    return () => clearInterval(interval);
  }, [location.pathname, navigate, toast]);

  // Listen for storage changes (when user logs out in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
      if (!secureTokenStorage.isAuthenticated() && !isAuthPage) {
        navigate('/login');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location.pathname, navigate]);

  return <>{children}</>;
};

export default AuthRedirect;
