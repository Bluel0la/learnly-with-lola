
import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordRequirement {
  label: string;
  met: boolean;
}

interface EnhancedPasswordStrengthProps {
  password: string;
}

const EnhancedPasswordStrength = ({ password }: EnhancedPasswordStrengthProps) => {
  const requirements: PasswordRequirement[] = [
    {
      label: 'At least 8 characters',
      met: password.length >= 8
    },
    {
      label: 'Contains uppercase letter',
      met: /[A-Z]/.test(password)
    },
    {
      label: 'Contains lowercase letter',
      met: /[a-z]/.test(password)
    },
    {
      label: 'Contains number',
      met: /\d/.test(password)
    },
    {
      label: 'Contains special character (@$!%*?&)',
      met: /[@$!%*?&]/.test(password)
    }
  ];

  const metCount = requirements.filter(req => req.met).length;
  const strength = metCount === 0 ? 'Very Weak' : 
                  metCount <= 2 ? 'Weak' : 
                  metCount <= 3 ? 'Fair' : 
                  metCount <= 4 ? 'Good' : 'Strong';

  const getStrengthColor = () => {
    switch (strength) {
      case 'Very Weak': return 'text-red-600';
      case 'Weak': return 'text-red-500';
      case 'Fair': return 'text-yellow-500';
      case 'Good': return 'text-blue-500';
      case 'Strong': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (password.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Password strength:</span>
        <span className={`text-sm font-medium ${getStrengthColor()}`}>
          {strength}
        </span>
      </div>
      
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center text-xs">
            {req.met ? (
              <Check className="w-3 h-3 text-green-500 mr-2" />
            ) : (
              <X className="w-3 h-3 text-red-500 mr-2" />
            )}
            <span className={req.met ? 'text-green-600' : 'text-red-600'}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedPasswordStrength;
