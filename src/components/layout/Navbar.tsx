
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Moon, Sun, User, LogIn, Menu, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { tokenStorage } from '@/services/api';
import { authApi } from '@/services/authApi';

const Navbar = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Check authentication status on component mount and when localStorage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      setIsAuthenticated(tokenStorage.isAuthenticated());
    };
    
    // Check initial auth status
    checkAuthStatus();
    
    // Listen for storage events (in case another tab logs in/out)
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    toast({
      title: `${!isDarkMode ? 'Dark' : 'Light'} mode activated`,
      description: "Theme preference saved",
    });
    // Theme toggle functionality would be implemented here
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authApi.logout();
      
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      });
      
      // Trigger auth status check
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="w-full bg-white px-2 md:px-4 py-2 md:py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo - Hidden on desktop since it's in sidebar */}
        <Link to="/" className="flex items-center space-x-2 md:hidden">
          <img 
            src="/lovable-uploads/049297b5-b176-4687-b854-f87a9f0100ff.png" 
            alt="Learnly Logo" 
            className="h-6 w-auto"
          />
          <span className="text-lg font-serif font-bold text-primary">Learnly</span>
        </Link>

        {/* Desktop Logo - Only shown on larger screens */}
        <Link to="/" className="hidden md:flex items-center space-x-2">
          <img 
            src="/lovable-uploads/049297b5-b176-4687-b854-f87a9f0100ff.png" 
            alt="Learnly Logo" 
            className="h-7 w-auto"
          />
          <span className="text-xl font-serif font-bold text-primary">Learnly</span>
        </Link>

        {/* Right Action Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-1 md:space-x-2">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile">
                  <User className="h-4 w-4" />
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <div className="flex flex-col space-y-4 mt-8">
                <Link to="/" className="flex items-center space-x-2 mb-6">
                  <img 
                    src="/lovable-uploads/049297b5-b176-4687-b854-f87a9f0100ff.png" 
                    alt="Learnly Logo" 
                    className="h-8 w-auto"
                  />
                  <span className="text-xl font-serif font-bold text-primary">Learnly</span>
                </Link>
                <Link to="/chat" className="text-base py-2 hover:text-primary transition-colors">
                  Chat
                </Link>
                <Link to="/flashcards" className="text-base py-2 hover:text-primary transition-colors">
                  Flashcards
                </Link>
                <Link to="/quizzes" className="text-base py-2 hover:text-primary transition-colors">
                  Quizzes
                </Link>
                <Link to="/resources" className="text-base py-2 hover:text-primary transition-colors">
                  Resources
                </Link>
                {isAuthenticated && (
                  <>
                    <Link to="/profile" className="text-base py-2 hover:text-primary transition-colors">
                      Profile
                    </Link>
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="justify-start text-sm"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                )}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                  <Button variant="outline" size="sm" onClick={toggleTheme}>
                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                  {!isAuthenticated && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/login">
                        <LogIn className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
