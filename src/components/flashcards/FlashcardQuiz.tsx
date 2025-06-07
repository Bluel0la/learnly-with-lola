
import React from 'react';
import MultipleChoiceQuiz from './MultipleChoiceQuiz';

interface FlashcardQuizProps {
  deckId: string;
  onComplete?: () => void;
}

const FlashcardQuiz: React.FC<FlashcardQuizProps> = ({ deckId, onComplete }) => {
  return <MultipleChoiceQuiz deckId={deckId} onComplete={onComplete} />;
};

export default FlashcardQuiz;
