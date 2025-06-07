
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the chat page
    navigate('/chat');
  }, [navigate]);

  // This will never render as we redirect immediately
  return null;
};

export default Index;
