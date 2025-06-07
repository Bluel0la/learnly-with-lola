
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
    <form onSubmit={handleSignUp}>
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstname" className="text-sm font-medium">First Name</label>
            <Input 
              id="firstname" 
              type="text" 
              placeholder="John" 
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
              maxLength={50}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastname" className="text-sm font-medium">Last Name</label>
            <Input 
              id="lastname" 
              type="text" 
              placeholder="Doe" 
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
              maxLength={50}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="signupEmail" className="text-sm font-medium">Email</label>
          <Input 
            id="signupEmail" 
            type="email" 
            placeholder="name@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="signupPassword" className="text-sm font-medium">Password</label>
          <Input 
            id="signupPassword" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <EnhancedPasswordStrength password={password} />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
          <Input 
            id="confirmPassword" 
            type="password" 
            placeholder="••••••••" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-sm text-red-600">Passwords don't match</p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col">
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isSignupLoading}
        >
          {isSignupLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : 'Create Account'}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignupForm;
