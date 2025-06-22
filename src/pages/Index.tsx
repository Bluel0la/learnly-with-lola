
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { secureTokenStorage } from '@/services/secureTokenStorage';
import LandingNavigation from '@/components/landing/LandingNavigation';
import LandingHero from '@/components/landing/LandingHero';
import LandingStats from '@/components/landing/LandingStats';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingTestimonials from '@/components/landing/LandingTestimonials';
import LandingCTA from '@/components/landing/LandingCTA';
import LandingFooter from '@/components/landing/LandingFooter';

const Index = () => {
  const navigate = useNavigate();
  const isAuthenticated = secureTokenStorage.isAuthenticated();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/chat');
    } else {
      navigate('/login');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      <LandingNavigation
        isAuthenticated={isAuthenticated}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onGetStarted={handleGetStarted}
        onLogin={handleLogin}
      />
      <LandingHero isAuthenticated={isAuthenticated} onGetStarted={handleGetStarted} />
      <LandingStats />
      <LandingFeatures />
      <LandingTestimonials />
      <LandingCTA isAuthenticated={isAuthenticated} onGetStarted={handleGetStarted} />
      <LandingFooter />
    </div>
  );
};

export default Index;
