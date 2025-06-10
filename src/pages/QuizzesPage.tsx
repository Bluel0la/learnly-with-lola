
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import MathQuizSelector from '@/components/quiz/MathQuizSelector';
import SimulatedExamSelector from '@/components/quiz/SimulatedExamSelector';
import ActiveMathQuiz from '@/components/quiz/ActiveMathQuiz';
import QuizResults from '@/components/quiz/QuizResults';
import PerformanceAnalytics from '@/components/quiz/PerformanceAnalytics';
import RecentActivities from '@/components/quiz/RecentActivities';
import { SubmitResultResponse } from '@/services/quizApi';
import { Trophy, Target, TrendingUp, Star, Brain, Zap, Users } from 'lucide-react';

type QuizState = 'selection' | 'active' | 'results' | 'analytics';
type QuizMode = 'single' | 'exam';

interface ActiveQuizData {
  sessionId: string;
  topic: string | string[];
  totalQuestions: number;
  mode: QuizMode;
}

const QuizzesPage = () => {
  const [quizState, setQuizState] = useState<QuizState>('selection');
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuizData | null>(null);
  const [quizResults, setQuizResults] = useState<SubmitResultResponse | null>(null);
  const { toast } = useToast();

  const handleQuizStart = (sessionId: string, topic: string, totalQuestions: number) => {
    setActiveQuiz({ sessionId, topic, totalQuestions, mode: 'single' });
    setQuizState('active');
  };

  const handleExamStart = (sessionId: string, topics: string[], totalQuestions: number) => {
    setActiveQuiz({ sessionId, topic: topics, totalQuestions, mode: 'exam' });
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

  const handleViewAnalytics = () => {
    setQuizState('analytics');
  };

  const getTopicDisplayName = () => {
    if (!activeQuiz) return '';
    if (activeQuiz.mode === 'exam') {
      const topics = activeQuiz.topic as string[];
      return `Mixed Topics (${topics.length} topics)`;
    }
    return activeQuiz.topic as string;
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 overflow-x-hidden">
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

          {/* Quiz Mode Selection */}
          <Tabs defaultValue="single" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="single" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Single Topic
              </TabsTrigger>
              <TabsTrigger value="exam" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Simulated Exam
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="single" className="mt-8">
              <MathQuizSelector onQuizStart={handleQuizStart} />
            </TabsContent>
            
            <TabsContent value="exam" className="mt-8">
              <SimulatedExamSelector 
                topics={[]} // Will be loaded inside the component
                onExamStart={handleExamStart} 
              />
            </TabsContent>
          </Tabs>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
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
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-yellow-800">Multi-Topic Exams</h3>
                <p className="text-sm text-yellow-600">Test across multiple subjects</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Analytics Card */}
          <div className="mt-12">
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
                  onClick={handleViewAnalytics}
                >
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Recent Activity</h2>
            <RecentActivities />
          </div>
        </div>
      )}

      {quizState === 'active' && activeQuiz && (
        <ActiveMathQuiz
          sessionId={activeQuiz.sessionId}
          topic={getTopicDisplayName()}
          totalQuestions={activeQuiz.totalQuestions}
          onQuizComplete={handleQuizComplete}
          onBack={handleBackToSelection}
        />
      )}

      {quizState === 'results' && activeQuiz && (
        <QuizResults
          sessionId={activeQuiz.sessionId}
          topic={getTopicDisplayName()}
          onStartNewQuiz={handleStartNewQuiz}
          onBackToQuizzes={handleBackToQuizzes}
        />
      )}

      {quizState === 'analytics' && (
        <PerformanceAnalytics onClose={handleBackToQuizzes} />
      )}
    </div>
  );
};

export default QuizzesPage;
