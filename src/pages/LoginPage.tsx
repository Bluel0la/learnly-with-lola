
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { authApi } from '@/services/authApi';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  // Signup state
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  
  // Get the current tab from URL path
  const currentTab = location.pathname === '/signup' ? 'signup' : 'login';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    
    try {
      await authApi.login({ email, password });
      
      const redirectPath = location.state?.from || '/chat';
      navigate(redirectPath);
      
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in."
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive"
      });
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      });
      return;
    }

    setIsSignupLoading(true);
    
    try {
      await authApi.signup({
        email: signupEmail,
        password: signupPassword,
        firstname: firstname,
        lastname: lastname
      });
      
      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account, then login below."
      });
      
      // Clear signup form
      setSignupEmail('');
      setSignupPassword('');
      setConfirmPassword('');
      setFirstname('');
      setLastname('');
      
      // Redirect to login tab
      navigate('/login');
      
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setIsSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">Learnly</h1>
          <p className="text-gray-600">Your AI Learning Assistant</p>
        </div>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {currentTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {currentTab === 'login' 
                ? 'Sign in to your account to continue learning' 
                : 'Join thousands of learners using AI to accelerate their studies'
              }
            </CardDescription>
          </CardHeader>
          
          <Tabs value={currentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mx-6 mb-4">
              <TabsTrigger value="login" asChild>
                <Link to="/login">Login</Link>
              </TabsTrigger>
              <TabsTrigger value="signup" asChild>
                <Link to="/signup">Sign Up</Link>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
                isLoginLoading={isLoginLoading}
              />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignupForm
                firstname={firstname}
                setFirstname={setFirstname}
                lastname={lastname}
                setLastname={setLastname}
                email={signupEmail}
                setEmail={setSignupEmail}
                password={signupPassword}
                setPassword={setSignupPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                handleSignUp={handleSignUp}
                isSignupLoading={isSignupLoading}
              />
            </TabsContent>
          </Tabs>
          
          <div className="p-6 pt-0 text-center text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
