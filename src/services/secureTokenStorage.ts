
import Cookies from 'js-cookie';

interface TokenData {
  token: string;
  expiresAt: number;
}

export const secureTokenStorage = {
  setToken: (token: string): void => {
    const expirationTime = Date.now() + (60 * 60 * 1000); // 60 minutes from now
    const tokenData: TokenData = {
      token,
      expiresAt: expirationTime
    };
    
    // Use secure, httpOnly-like approach with SameSite protection
    Cookies.set('learnly_auth_token', JSON.stringify(tokenData), {
      expires: 1/24, // 1 hour
      secure: window.location.protocol === 'https:',
      sameSite: 'strict'
    });
    
    // Also store expiration time separately for client-side checks
    localStorage.setItem('learnly_token_expires', expirationTime.toString());
  },
  
  getToken: (): string | null => {
    const tokenDataString = Cookies.get('learnly_auth_token');
    if (!tokenDataString) return null;
    
    try {
      const tokenData: TokenData = JSON.parse(tokenDataString);
      
      // Check if token has expired
      if (Date.now() > tokenData.expiresAt) {
        secureTokenStorage.removeToken();
        return null;
      }
      
      return tokenData.token;
    } catch (error) {
      secureTokenStorage.removeToken();
      return null;
    }
  },
  
  removeToken: (): void => {
    Cookies.remove('learnly_auth_token');
    localStorage.removeItem('learnly_token_expires');
  },
  
  isAuthenticated: (): boolean => {
    return !!secureTokenStorage.getToken();
  },
  
  getTokenExpiration: (): number | null => {
    const expiration = localStorage.getItem('learnly_token_expires');
    return expiration ? parseInt(expiration) : null;
  }
};
