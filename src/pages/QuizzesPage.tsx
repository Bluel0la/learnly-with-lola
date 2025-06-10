
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import MathQuizSelector from '@/components/quiz/MathQuizSelector';
import ActiveMathQuiz from '@/components/quiz/ActiveMathQuiz';
import QuizResults from '@/components/quiz/QuizResults';
import { SubmitResultResponse } from '@/services/quizApi';
import { Trophy, Target, TrendingUp, Star, Brain, Zap } from 'lucide-react';

type QuizState = 'selection' | 'active' | 'results';

interface ActiveQuizData {
  sessionId: string;
  topic: string;
  totalQuestions: number;
}

const QuizzesPage = () => {
  const [quizState, setQuizState] = useState<QuizState>('selection');
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuizData | null>(null);
  const [quizResults, setQuizResults] = useState<SubmitResultResponse | null>(null);
  const { toast } = useToast();

  const handleQuizStart = (sessionId: string, topic: string, totalQuestions: number) => {
    setActiveQuiz({ sessionId, topic, totalQuestions });
    setQuizState('active');
  };

  const handleQuizComplete = (results: SubmitResultResponse) => {
    setQuizResults(results);
    setQuizState('results');
  };

  const handleStartNewQuiz = () => {
    setActiveQuiz(null);
    setQuizResults(null);
    setQuizState('selection');
  };

  const handleBackToSelection = () => {
    setActiveQuiz(null);
    setQuizState('selection');
  };

  const handleBackToQuizzes = () => {
    setActiveQuiz(null);
    setQuizResults(null);
    setQuizState('selection');
  };

  return (
    <div className="container max-w-6xl mx-auto py-8">
      {quizState === 'selection' && (
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Brain className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Math Quiz Challenge
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Level up your math skills with adaptive quizzes that grow with your progress!
            </p>
          </div>

          {/* Quiz Selector */}
          <MathQuizSelector onQuizStart={handleQuizStart} />

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-blue-800">Adaptive Learning</h3>
                <p className="text-sm text-blue-600">Questions adapt to your skill level</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-green-800">Progress Tracking</h3>
                <p className="text-sm text-green-600">Monitor your improvement over time</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-purple-800">Detailed Feedback</h3>
                <p className="text-sm text-purple-600">Learn from explanations and tips</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-yellow-800">Quick Practice</h3>
                <p className="text-sm text-yellow-600">5-20 question sessions</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Target className="h-6 w-6" />
                  Adaptive Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100">Difficulty:</span>
                    <span className="font-medium">Adapts to your performance</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100">Topics:</span>
                    <span className="font-medium">Multiple math subjects</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100">Feedback:</span>
                    <span className="font-medium">Detailed explanations</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                  onClick={() => toast({ title: "Select a topic above to get started!" })}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-blue-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Trophy className="h-6 w-6" />
                  Performance Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-100">Progress:</span>
                    <span className="font-medium">Track improvement over time</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-100">Analytics:</span>
                    <span className="font-medium">Detailed performance insights</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-100">History:</span>
                    <span className="font-medium">Review past quiz results</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  className="w-full border-white text-white hover:bg-white hover:text-green-600 font-semibold"
                  onClick={() => toast({ title: "Performance tracking coming soon!" })}
                >
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Recent Activity</h2>
            <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
              <CardContent className="p-8">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No quiz results yet</h3>
                  <p>Start your first math quiz to see your performance here!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {quizState === 'active' && activeQuiz && (
        <ActiveMathQuiz
          sessionId={activeQuiz.sessionId}
          topic={activeQuiz.topic}
          totalQuestions={activeQuiz.totalQuestions}
          onQuizComplete={handleQuizComplete}
          onBack={handleBackToSelection}
        />
      )}

      {quizState === 'results' && activeQuiz && (
        <QuizResults
          sessionId={activeQuiz.sessionId}
          topic={activeQuiz.topic}
          onStartNewQuiz={handleStartNewQuiz}
          onBackToQuizzes={handleBackToQuizzes}
        />
      )}
    </div>
  );
};

export default QuizzesPage;
