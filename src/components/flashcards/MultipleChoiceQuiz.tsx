import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { flashcardApi, QuizCard, QuizResponse } from '@/services/api';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import ScoreMeter from './ScoreMeter';
import QuizReview from './QuizReview';

interface MultipleChoiceQuizProps {
  deckId: string;
  onComplete?: () => void;
}

const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({ deckId, onComplete }) => {
  const [quizCards, setQuizCards] = useState<QuizCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<QuizResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Score tracking
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [rank, setRank] = useState('E');
  const [multiplier, setMultiplier] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [startTime] = useState(Date.now());

  const { toast } = useToast();
  const { profile, isLoading: profileLoading, error: profileError } = useUserProfile();

  // Show loading state while profile is loading
  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading user profile...</div>
      </div>
    );
  }

  // Show error if profile failed to load
  if (profileError) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2 text-red-600">Authentication Error</h3>
        <p className="text-gray-600 mb-4">Please log in to access the quiz.</p>
        <Button onClick={onComplete}>Back to Deck</Button>
      </div>
    );
  }

  useEffect(() => {
    const startQuiz = async () => {
      try {
        setIsLoading(true);
        const quizData = await flashcardApi.startQuiz(deckId, 10);
        setQuizCards(quizData.cards);
      } catch (error) {
        console.error('Failed to start quiz:', error);
        toast({
          title: "Error",
          description: "Failed to start quiz. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Only start quiz if we have a valid profile
    if (profile?.user_id) {
      startQuiz();
    }
  }, [deckId, toast, profile]);

  const calculateRank = (currentStreak: number, totalQuestions: number): string => {
    const rankThresholds = {
      'S+': Math.max(8, Math.floor(totalQuestions * 0.90)),
      'S': Math.max(7, Math.floor(totalQuestions * 0.75)),
      'A': Math.max(6, Math.floor(totalQuestions * 0.60)),
      'B': Math.max(5, Math.floor(totalQuestions * 0.45)),
      'C': Math.max(4, Math.floor(totalQuestions * 0.35)),
      'D': Math.max(3, Math.floor(totalQuestions * 0.25)),
      'E': Math.max(2, Math.floor(totalQuestions * 0.15))
    };

    for (const [rankName, threshold] of Object.entries(rankThresholds)) {
      if (currentStreak >= threshold) {
        return rankName;
      }
    }
    return 'E';
  };

  const calculateMultiplier = (currentStreak: number): number => {
    return Math.min(1 + Math.floor(currentStreak / 2), 6);
  };

  const handleAnswerSelect = (answer: string) => {
    if (hasAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || hasAnswered) return;

    const currentCard = quizCards[currentCardIndex];
    const correctAnswer = currentCard.options[currentCard.correct_answer_index];
    const isCorrect = selectedAnswer === correctAnswer;

    setHasAnswered(true);

    const response: QuizResponse = {
      card_id: currentCard.card_id,
      user_answer: selectedAnswer,
      is_correct: isCorrect
    };

    setUserResponses(prev => [...prev, response]);

    // Update score tracking
    let newStreak = streak;
    let newRank = rank;
    let newMultiplier = multiplier;

    if (isCorrect) {
      newStreak = streak + 1;
      setMaxStreak(prev => Math.max(prev, newStreak));
      
      newRank = calculateRank(newStreak, quizCards.length);
      newMultiplier = calculateMultiplier(newStreak);
      
      const points = 100 * newMultiplier;
      setTotalScore(prev => prev + points);
    } else {
      newStreak = 0;
      newRank = calculateRank(newStreak, quizCards.length);
      newMultiplier = 1;
    }

    setStreak(newStreak);
    setRank(newRank);
    setMultiplier(newMultiplier);

    // Smooth transition - wait a moment then transition
    setTimeout(() => {
      if (currentCardIndex < quizCards.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentCardIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setHasAnswered(false);
          setIsTransitioning(false);
        }, 400);
      } else {
        finishQuiz([...userResponses, response]);
      }
    }, 1200);
  };

  const finishQuiz = async (allResponses: QuizResponse[]) => {
    try {
      const endTime = Date.now();
      const timeTakenSeconds = Math.floor((endTime - startTime) / 1000);
      
      // Save quiz attempt to database only if user is authenticated
      if (profile?.user_id) {
        const correctAnswers = allResponses.filter(r => r.is_correct).length;
        const wrongAnswers = allResponses.length - correctAnswers;
        
        // Store in the existing quiz table with best score tracking
        const { error: insertError } = await supabase.from('quiz').insert({
          quiz_id: crypto.randomUUID(),
          user_id: profile.user_id,
          best_score: totalScore,
          date_created: new Date().toISOString()
        });

        if (insertError) {
          console.error('Error saving quiz attempt:', insertError);
          toast({
            title: "Warning",
            description: "Quiz completed but results couldn't be saved.",
            variant: "default"
          });
        } else {
          console.log('Quiz attempt saved successfully');
        }
      } else {
        console.log('Quiz completed without saving - user not authenticated');
        toast({
          title: "Quiz Completed",
          description: "Results not saved - please log in to track your progress.",
          variant: "default"
        });
      }

      setIsComplete(true);
    } catch (error) {
      console.error('Failed to save quiz attempt:', error);
      toast({
        title: "Warning", 
        description: "Quiz completed but results couldn't be saved.",
        variant: "default"
      });
      // Still complete the quiz even if saving fails
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setUserResponses([]);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setIsComplete(false);
    setStreak(0);
    setMaxStreak(0);
    setRank('E');
    setMultiplier(1);
    setTotalScore(0);
    setIsTransitioning(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading quiz...</div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <QuizReview
        deckId={deckId}
        quizCards={quizCards}
        userResponses={userResponses}
        onRestart={handleRestart}
        onExit={onComplete}
      />
    );
  }

  if (quizCards.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2">No Quiz Available</h3>
        <p className="text-gray-600 mb-4">This deck doesn't have enough cards for a quiz.</p>
        <Button onClick={onComplete}>Back to Deck</Button>
      </div>
    );
  }

  const currentCard = quizCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / quizCards.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <ScoreMeter 
        streak={streak} 
        rank={rank} 
        multiplier={multiplier} 
        totalQuestions={quizCards.length}
      />
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Question {currentCardIndex + 1} of {quizCards.length}
          </span>
          <span className="text-sm font-medium text-blue-600">
            Score: {totalScore}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Card className={`transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-30 scale-95 blur-sm' : 'opacity-100 scale-100'}`}>
        <CardHeader>
          <CardTitle className="text-lg">{currentCard.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentCard.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = hasAnswered && option === currentCard.options[currentCard.correct_answer_index];
            const isWrong = hasAnswered && isSelected && !isCorrect;
            
            return (
              <Button
                key={index}
                variant={isSelected ? "default" : "outline"}
                className={`w-full text-left justify-start h-auto p-4 transition-all duration-300 ${
                  hasAnswered
                    ? isCorrect
                      ? 'bg-green-500 hover:bg-green-500 text-white border-green-500'
                      : isWrong
                      ? 'bg-red-500 hover:bg-red-500 text-white border-red-500'
                      : 'opacity-50'
                    : isSelected
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={hasAnswered}
              >
                {option}
              </Button>
            );
          })}

          {!hasAnswered && (
            <Button 
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="w-full mt-4"
            >
              Submit Answer
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MultipleChoiceQuiz;
