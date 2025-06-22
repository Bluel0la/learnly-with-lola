
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
      const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
      const isLandingPage = location.pathname === '/';
      const isAuthenticated = secureTokenStorage.isAuthenticated();

      console.log('Auth check:', { isAuthenticated, isAuthPage, isLandingPage, pathname: location.pathname });

      // Allow unauthenticated users to view the landing page
      if (!isAuthenticated && !isAuthPage && !isLandingPage) {
        if (!hasShownToast.current) {
          toast({
            title: "Session expired",
            description: "Please log in to continue",
            variant: "destructive"
          });
          hasShownToast.current = true;
        }
        navigate('/login', { replace: true, state: { from: location.pathname } });
      }
      // Remove the automatic redirect from auth pages when authenticated
      // Let the LoginPage component handle this logic instead
    };

    checkAuth();
    
    // Check less frequently to avoid performance issues
    const interval = setInterval(checkAuth, 60000);
    
    return () => clearInterval(interval);
  }, [location.pathname, navigate, toast]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Only respond to relevant storage changes
      if (e.key === 'learnly_token_expires' || e.key === null) {
        const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
        const isLandingPage = location.pathname === '/';
        if (!secureTokenStorage.isAuthenticated() && !isAuthPage && !isLandingPage) {
          navigate('/login', { replace: true });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location.pathname, navigate]);

  return <>{children}</>;
};

export default AuthRedirect;
