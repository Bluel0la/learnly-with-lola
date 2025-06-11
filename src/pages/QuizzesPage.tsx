
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import MathQuizSelector from '@/components/quiz/MathQuizSelector';
import SimulatedExamSelector from '@/components/quiz/SimulatedExamSelector';
import ActiveMathQuiz from '@/components/quiz/ActiveMathQuiz';
import QuizResults from '@/components/quiz/QuizResults';
import PerformanceAnalytics from '@/components/quiz/PerformanceAnalytics';
import RecentActivities from '@/components/quiz/RecentActivities';
import PerformanceTrackingCard from '@/components/quiz/PerformanceTrackingCard';
import { SubmitResultResponse } from '@/services/quizApi';
import { Target, TrendingUp, Star, Users, Brain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="w-full min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto py-4 lg:py-8 px-4">
        {quizState === 'selection' && (
          <div className="space-y-6 lg:space-y-8">
            {/* Feature Cards Section */}
            <div className="text-center space-y-6 lg:space-y-8">
              <div className="flex justify-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Math Quiz Challenge
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                  Level up your math skills with adaptive quizzes that grow with your progress!
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-5xl mx-auto">
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardContent className="p-4 lg:p-6 text-center">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-base lg:text-lg mb-2 text-green-800">Progress Tracking</h3>
                    <p className="text-xs lg:text-sm text-green-600">Monitor your improvement over time</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardContent className="p-4 lg:p-6 text-center">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-base lg:text-lg mb-2 text-purple-800">Detailed Feedback</h3>
                    <p className="text-xs lg:text-sm text-purple-600">Learn from explanations and tips</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
                  <CardContent className="p-4 lg:p-6 text-center">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-base lg:text-lg mb-2 text-yellow-800">Multi-Topic Exams</h3>
                    <p className="text-xs lg:text-sm text-yellow-600">Test across multiple subjects</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quiz Mode Selection */}
            <div className="w-full">
              <Tabs defaultValue="single" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                  <TabsTrigger value="single" className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4" />
                    <span className="hidden sm:inline">Single Topic</span>
                    <span className="sm:hidden">Single</span>
                  </TabsTrigger>
                  <TabsTrigger value="exam" className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Simulated Exam</span>
                    <span className="sm:hidden">Exam</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="single" className="mt-6 lg:mt-8">
                  <MathQuizSelector onQuizStart={handleQuizStart} />
                </TabsContent>
                
                <TabsContent value="exam" className="mt-6 lg:mt-8">
                  <SimulatedExamSelector 
                    topics={[]}
                    onExamStart={handleExamStart} 
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Performance Analytics and Recent Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8 mt-8 lg:mt-12">
              <div className="xl:col-span-1">
                <PerformanceTrackingCard onViewAnalytics={handleViewAnalytics} />
              </div>
              <div className="xl:col-span-3">
                <RecentActivities />
              </div>
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
    </div>
  );
};

export default QuizzesPage;
