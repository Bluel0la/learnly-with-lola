
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import EnhancedPasswordStrength from './EnhancedPasswordStrength';

interface SignupFormProps {
  firstname: string;
  setFirstname: (firstname: string) => void;
  lastname: string;
  setLastname: (lastname: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  handleSignUp: (e: React.FormEvent) => Promise<void>;
  isSignupLoading: boolean;
}

const SignupForm = ({
  firstname,
  setFirstname,
  lastname,
  setLastname,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleSignUp,
  isSignupLoading
}: SignupFormProps) => {
  return (
    <form onSubmit={handleSignUp} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstname" className="text-sm font-medium text-gray-700">First Name</label>
            <Input 
              id="firstname" 
              type="text" 
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="John" 
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
              maxLength={50}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastname" className="text-sm font-medium text-gray-700">Last Name</label>
            <Input 
              id="lastname" 
              type="text" 
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Doe" 
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
              maxLength={50}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="signupEmail" className="text-sm font-medium text-gray-700">Email</label>
          <Input 
            id="signupEmail" 
            type="email" 
            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="name@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="signupPassword" className="text-sm font-medium text-gray-700">Password</label>
          <Input 
            id="signupPassword" 
            type="password" 
            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <EnhancedPasswordStrength password={password} />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
          <Input 
            id="confirmPassword" 
            type="password" 
            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="••••••••" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-sm text-red-600">Passwords don't match</p>
          )}
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
        disabled={isSignupLoading}
      >
        {isSignupLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : 'Create Account'}
      </Button>
    </form>
  );
};

export default SignupForm;
