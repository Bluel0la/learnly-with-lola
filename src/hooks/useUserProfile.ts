
import { useState, useEffect } from 'react';
import { authApi } from '@/services/api';
import { secureTokenStorage } from '@/services/secureTokenStorage';

interface UserProfile {
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
        setProfile(profileData);
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
