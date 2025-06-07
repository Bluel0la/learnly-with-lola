
import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  // Enhanced password strength calculation
  const getStrength = () => {
    if (!password) return 0;
    
    // Basic length check
    let strength = 0;
    if (password.length < 4) strength = 1;
    else if (password.length < 8) strength = 2; 
    else strength = 3;
    
    // Add additional checks for password complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    
    // Bonus points for complexity
    let complexityBonus = 0;
    if (hasUpperCase) complexityBonus += 0.25;
    if (hasLowerCase) complexityBonus += 0.25;
    if (hasNumbers) complexityBonus += 0.25;
    if (hasSpecial) complexityBonus += 0.25;
    
    // Apply complexity bonus (max strength is still 3)
    strength = Math.min(3, strength + complexityBonus);
    
    return strength;
  };
  
  const strength = getStrength();
  
  const getColor = () => {
    switch (Math.floor(strength)) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };
  
  const getLabel = () => {
    switch (Math.floor(strength)) {
      case 1: return 'Weak';
      case 2: return 'Medium';
      case 3: return 'Strong';
      default: return '';
    }
  };
  
  return (
    <div className="mt-1">
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor()} transition-all duration-300`} 
          style={{ width: `${(strength / 3) * 100}%` }}
        ></div>
      </div>
      <div className="text-xs text-right mt-1 text-gray-500">
        {getLabel()}
      </div>
    </div>
  );
};

export default PasswordStrength;
