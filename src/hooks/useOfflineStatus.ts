
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export const useOfflineStatus = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast({
        title: "Connection restored",
        description: "You're back online!",
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: "Connection lost",
        description: "You're currently offline. Some features may be limited.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
};
