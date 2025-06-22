
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface LandingCTAProps {
  isAuthenticated: boolean;
  onGetStarted: () => void;
}

const LandingCTA = ({ isAuthenticated, onGetStarted }: LandingCTAProps) => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Ready to transform your learning?
        </h2>
        <p className="text-xl text-blue-100 mb-10 leading-relaxed">
          Join thousands of students who are already learning smarter with Learnly. Start your journey today - completely free.
        </p>
        <Button 
          onClick={onGetStarted}
          size="lg" 
          className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isAuthenticated ? 'Continue Learning' : 'Start Learning Free'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-blue-100">
          <CheckCircle className="h-4 w-4" />
          <span>Free forever • No credit card required • Start in 30 seconds</span>
        </div>
      </div>
    </section>
  );
};

export default LandingCTA;
