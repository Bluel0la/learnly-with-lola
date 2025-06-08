
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, MessageSquare, BookOpen, Trophy, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Learnly
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Your intelligent study companion powered by AI. Master any subject with interactive learning, 
            smart flashcards, and adaptive quizzes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8 py-6 text-lg shadow-lg"
              onClick={() => navigate('/chat')}
            >
              Start Learning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-6 text-lg border-2 hover:bg-blue-50"
              onClick={() => navigate('/flashcards')}
            >
              Explore Flashcards
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8" />}
              title="AI Chat Tutor"
              description="Get instant help with any topic. Ask questions, solve problems, and receive personalized explanations."
              color="from-blue-500 to-blue-600"
              onClick={() => navigate('/chat')}
            />
            <FeatureCard
              icon={<BookOpen className="h-8 w-8" />}
              title="Smart Flashcards"
              description="Create and study with intelligent flashcard decks. Adaptive learning that grows with you."
              color="from-indigo-500 to-indigo-600"
              onClick={() => navigate('/flashcards')}
            />
            <FeatureCard
              icon={<Trophy className="h-8 w-8" />}
              title="Adaptive Quizzes"
              description="Test your knowledge with scoring and analytics. Track progress and improve over time."
              color="from-purple-500 to-purple-600"
              onClick={() => navigate('/quizzes')}
            />
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Questions Answered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">5K+</div>
              <div className="text-gray-600">Flashcards Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  color, 
  onClick 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  color: string;
  onClick: () => void;
}) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg hover:scale-105" onClick={onClick}>
      <CardContent className="p-8 text-center">
        <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
        <div className="mt-6">
          <ArrowRight className="h-5 w-5 text-blue-500 mx-auto group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  );
};

export default Index;
