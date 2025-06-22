import React, { useState } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { useToast } from '@/hooks/use-toast';
import { authApi, SignupRequest } from '@/services/api';
import { secureTokenStorage } from '@/services/secureTokenStorage';
import OnboardingModal from "@/components/onboarding/OnboardingModal";
const LoginPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    toast
  } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'signup' ? 'signup' : 'login');
  const navigate = useNavigate();
  const [showPostLoginOnboarding, setShowPostLoginOnboarding] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupFirstname, setSignupFirstname] = useState('');
  const [signupLastname, setSignupLastname] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Check if user is already authenticated - simplified logic
  const isAuthenticated = secureTokenStorage.isAuthenticated();
  const onboardingComplete = localStorage.getItem("learnly_onboarding_complete") === "true";

  // If authenticated and onboarding complete, redirect to chat
  if (isAuthenticated && onboardingComplete) {
    return <Navigate to="/chat" replace />;
  }

  // If authenticated but onboarding not complete, show onboarding
  if (isAuthenticated && !onboardingComplete && !showPostLoginOnboarding) {
    return <OnboardingModal open={true} onComplete={() => {
      localStorage.setItem("learnly_onboarding_complete", "true");
      window.location.href = '/chat';
    }} />;
  }
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authApi.login({
        email: loginEmail,
        password: loginPassword
      });
      secureTokenStorage.setToken(response.access_token);
      toast({
        title: "Success",
        description: "Logged in successfully!"
      });

      // Check if onboarding is complete
      const onboardingComplete = localStorage.getItem("learnly_onboarding_complete") === "true";
      if (!onboardingComplete) {
        setShowPostLoginOnboarding(true);
      } else {
        // Direct navigation to chat page
        window.location.href = '/chat';
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to log in",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const signupData: SignupRequest = {
        firstname: signupFirstname,
        lastname: signupLastname,
        email: signupEmail,
        password: signupPassword
      };
      await authApi.signup(signupData);
      toast({
        title: "Success",
        description: "Account created successfully! Please log in."
      });

      // Clear signup form
      setSignupFirstname('');
      setSignupLastname('');
      setSignupEmail('');
      setSignupPassword('');
      setConfirmPassword('');

      // Switch to login tab
      setActiveTab('login');
      setSearchParams({
        tab: 'login'
      });
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <>
      {showPostLoginOnboarding && <OnboardingModal open={showPostLoginOnboarding} onComplete={() => {
      localStorage.setItem("learnly_onboarding_complete", "true");
      setShowPostLoginOnboarding(false);
      window.location.href = '/chat';
    }} />}
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Welcome to Learnly
            </h1>
            <p className="text-gray-600">
              Your AI-powered learning companion
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Get Started
              </CardTitle>
              <CardDescription className="text-gray-600">
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded">
                  <TabsTrigger value="login" className="text-base font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="text-base font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm email={loginEmail} setEmail={setLoginEmail} password={loginPassword} setPassword={setLoginPassword} handleLogin={handleLogin} isLoginLoading={isLoading} />
                </TabsContent>
                <TabsContent value="signup">
                  <SignupForm firstname={signupFirstname} setFirstname={setSignupFirstname} lastname={signupLastname} setLastname={setSignupLastname} email={signupEmail} setEmail={setSignupEmail} password={signupPassword} setPassword={setSignupPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} handleSignUp={handleSignup} isSignupLoading={isLoading} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>;
};
export default LoginPage;