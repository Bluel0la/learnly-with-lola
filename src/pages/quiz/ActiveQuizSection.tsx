
import React from 'react';
import ActiveMathQuiz from '@/components/quiz/ActiveMathQuiz';

interface ActiveQuizSectionProps {
  activeQuiz: {
    sessionId: string;
    topic: string;
    totalQuestions: number;
    isFirstAttempt?: boolean;
    mode: string;
  };
  isHistoryLoading: boolean;
  onQuizComplete: (results: any) => void;
  onBack: () => void;
}

// Wraps ActiveMathQuiz, handles "active" state logic
const ActiveQuizSection: React.FC<ActiveQuizSectionProps> = ({
  activeQuiz,
  isHistoryLoading,
  onQuizComplete,
  onBack,
}) => {
  if (!activeQuiz || isHistoryLoading) {
    return null;
  }
  return (
    <ActiveMathQuiz
      sessionId={activeQuiz.sessionId}
      topic={activeQuiz.topic}
      totalQuestions={activeQuiz.totalQuestions}
      onQuizComplete={onQuizComplete}
      onBack={onBack}
      isFirstAttempt={activeQuiz.mode === 'single' ? activeQuiz.isFirstAttempt : false}
    />
  );
};

export default ActiveQuizSection;
