
import { useState, useEffect } from 'react';
import { authApi } from '@/services/api';
import { secureTokenStorage } from '@/services/secureTokenStorage';

interface UserProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!secureTokenStorage.isAuthenticated()) {
        setIsLoading(false);
        return;
      }

      try {
        const profileData = await authApi.getProfile();
        
        // Get user ID from token payload
        const token = secureTokenStorage.getToken();
        let userId = '';
        
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userId = payload.sub || payload.user_id || '';
          } catch (e) {
            console.error('Failed to parse token:', e);
          }
        }
        
        const profileWithId = {
          ...profileData,
          user_id: userId
        };
        
        setProfile(profileWithId);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, isLoading, error };
};
