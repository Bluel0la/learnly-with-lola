
import React from 'react';
import QuizResults from '@/components/quiz/QuizResults';

interface QuizResultsSectionProps {
  sessionId: string;
  topic: string;
  onStartNewQuiz: () => void;
  onBackToQuizzes: () => void;
}

// Simple wrapper for QuizResults
const QuizResultsSection: React.FC<QuizResultsSectionProps> = ({
  sessionId, topic, onStartNewQuiz, onBackToQuizzes
}) => {
  return (
    <QuizResults
      sessionId={sessionId}
      topic={topic}
      onStartNewQuiz={onStartNewQuiz}
      onBackToQuizzes={onBackToQuizzes}
    />
  );
};

export default QuizResultsSection;
