
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
  const { profile } = useUserProfile();

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

    startQuiz();
  }, [deckId, toast]);

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
      const correctAnswers = allResponses.filter(r => r.is_correct).length;
      const finalRank = calculateRank(maxStreak, quizCards.length);
      
      // Save quiz attempt to database with comprehensive data
      if (profile?.user_id) {
        const { error } = await supabase.from('quiz').insert({
          quiz_id: crypto.randomUUID(),
          user_id: profile.user_id,
          best_score: totalScore,
          date_created: new Date().toISOString()
        });

        if (error) {
          console.error('Failed to save quiz attempt:', error);
          // Continue even if saving fails
        } else {
          console.log('Quiz attempt saved successfully', {
            score: totalScore,
            rank: finalRank,
            correctAnswers,
            maxStreak,
            timeTaken: timeTakenSeconds
          });
        }
      }

      setIsComplete(true);
      
      // Show completion toast with rank
      toast({
        title: `Quiz Complete! 🎉`,
        description: `You achieved rank ${finalRank} with a score of ${totalScore} points!`
      });

    } catch (error) {
      console.error('Failed to save quiz attempt:', error);
      // Still complete the quiz even if saving fails
      setIsComplete(true);
      toast({
        title: "Quiz Complete!",
        description: "Your performance was recorded locally.",
        variant: "default"
      });
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
    <div className="max-w-3xl mx-auto p-4">
      <ScoreMeter 
        streak={streak} 
        rank={rank} 
        multiplier={multiplier} 
        totalQuestions={quizCards.length}
      />
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-600 font-medium">
            Question {currentCardIndex + 1} of {quizCards.length}
          </span>
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Score: {totalScore}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Card className={`transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-30 scale-95 blur-sm' : 'opacity-100 scale-100'}`}>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl leading-relaxed">{currentCard.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentCard.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = hasAnswered && option === currentCard.options[currentCard.correct_answer_index];
            const isWrong = hasAnswered && isSelected && !isCorrect;
            
            return (
              <Button
                key={index}
                variant={isSelected ? "default" : "outline"}
                className={`w-full text-left justify-start min-h-[60px] p-4 whitespace-normal break-words transition-all duration-300 ${
                  hasAnswered
                    ? isCorrect
                      ? 'bg-green-500 hover:bg-green-500 text-white border-green-500'
                      : isWrong
                      ? 'bg-red-500 hover:bg-red-500 text-white border-red-500'
                      : 'opacity-60 bg-gray-100 text-gray-600'
                    : isSelected
                    ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
                    : 'hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={hasAnswered}
                style={{ height: 'auto' }}
              >
                <span className="text-left leading-relaxed">
                  {option}
                </span>
              </Button>
            );
          })}

          {!hasAnswered && (
            <Button 
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="w-full mt-6 h-12 text-base font-semibold"
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
