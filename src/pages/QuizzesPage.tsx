import React, { useState, useEffect } from 'react';
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
import { quizApi, HistoryResponse } from '@/services/quizApi';
import QuizSelectionSection from './quiz/QuizSelectionSection';
import ActiveQuizSection from './quiz/ActiveQuizSection';
import QuizResultsSection from './quiz/QuizResultsSection';

type QuizState = 'selection' | 'active' | 'results' | 'analytics';
type QuizMode = 'single' | 'exam';

interface ActiveQuizData {
  sessionId: string;
  topic: string | string[];
  totalQuestions: number;
  mode: QuizMode;
  isFirstAttempt?: boolean;
}

const QuizzesPage = () => {
  const [quizState, setQuizState] = useState<QuizState>('selection');
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuizData | null>(null);
  const [quizResults, setQuizResults] = useState<SubmitResultResponse | null>(null);
  const [quizHistory, setQuizHistory] = useState<HistoryResponse | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const { toast } = useToast();

  // Load user quiz history on mount (and on refresh)
  useEffect(() => {
    setIsHistoryLoading(true);
    quizApi.getQuizHistory()
      .then(data => setQuizHistory(data))
      .catch(() => setQuizHistory(null))
      .finally(() => setIsHistoryLoading(false));
  }, []);

  // Check for first attempt per topic
  const isFirstAttemptForTopic = (topic: string) => {
    if (!quizHistory || !quizHistory.sessions) return true;
    // Allow for lowercased topic naming, just in case
    return !quizHistory.sessions.some(
      s => typeof s.topic === 'string' && s.topic.toLowerCase() === topic.toLowerCase()
    );
  };

  const handleQuizStart = (sessionId: string, topic: string, totalQuestions: number) => {
    // determine isFirstAttempt per topic
    const isFirstAttempt = isFirstAttemptForTopic(topic);
    setActiveQuiz({ sessionId, topic, totalQuestions, mode: 'single', isFirstAttempt });
    setQuizState('active');
  };

  const handleExamStart = (sessionId: string, topics: string[], totalQuestions: number) => {
    setActiveQuiz({ sessionId, topic: topics, totalQuestions, mode: 'exam', isFirstAttempt: false });
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
          <QuizSelectionSection
            onQuizStart={handleQuizStart}
            onExamStart={handleExamStart}
            onViewAnalytics={handleViewAnalytics}
          />
        )}

        {quizState === 'active' && activeQuiz && (
          <ActiveQuizSection
            activeQuiz={{
              ...activeQuiz,
              topic: getTopicDisplayName(),
            }}
            isHistoryLoading={isHistoryLoading}
            onQuizComplete={handleQuizComplete}
            onBack={handleBackToSelection}
          />
        )}

        {quizState === 'results' && activeQuiz && (
          <QuizResultsSection
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
