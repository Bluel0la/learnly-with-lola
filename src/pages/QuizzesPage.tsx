
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import MathQuizSelector from '@/components/quiz/MathQuizSelector';
import ActiveMathQuiz from '@/components/quiz/ActiveMathQuiz';
import QuizResults from '@/components/quiz/QuizResults';
import { SubmitResultResponse } from '@/services/quizApi';

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
      <h1 className="text-3xl font-serif font-bold mb-6">Math Quizzes</h1>
      
      {quizState === 'selection' && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-serif font-semibold mb-4">Interactive Math Practice</h2>
            <p className="text-gray-600 mb-6">
              Challenge yourself with adaptive math quizzes that adjust to your skill level!
            </p>
          </div>

          <MathQuizSelector onQuizStart={handleQuizStart} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-serif">Adaptive Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="font-medium">Adapts to your performance</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Topics:</span>
                    <span className="font-medium">Multiple math subjects</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Feedback:</span>
                    <span className="font-medium">Detailed explanations</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => toast({ title: "Select a topic above to get started!" })}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-serif">Performance Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-medium">Track improvement over time</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Analytics:</span>
                    <span className="font-medium">Detailed performance insights</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">History:</span>
                    <span className="font-medium">Review past quiz results</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => toast({ title: "Performance tracking coming soon!" })}
                >
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-serif font-semibold mb-4">Recent Activity</h2>
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  No quiz results yet. Start your first math quiz to see your performance here!
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

      {quizState === 'results' && quizResults && activeQuiz && (
        <QuizResults
          results={quizResults}
          topic={activeQuiz.topic}
          onStartNewQuiz={handleStartNewQuiz}
          onBackToQuizzes={handleBackToQuizzes}
        />
      )}
    </div>
  );
};

export default QuizzesPage;
