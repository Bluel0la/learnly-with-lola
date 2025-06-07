import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, XCircle, Trophy, ArrowLeft, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { QuizCard, QuizResponse, QuizResult, flashcardApi } from '@/services/flashcardApi';
import LoadingSpinner from '@/components/ui/loading-spinner';
import QuizReview from './QuizReview';
import ScoreMeter from './ScoreMeter';

interface MultipleChoiceQuizProps {
  deckId: string;
  onComplete?: () => void;
}

const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({ deckId, onComplete }) => {
  const { toast } = useToast();
  const [quizCards, setQuizCards] = useState<QuizCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [userResponses, setUserResponses] = useState<QuizResponse[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showReview, setShowReview] = useState(false);
  
  // Score meter system state
  const [currentStreak, setCurrentStreak] = useState(0);
  const [currentRank, setCurrentRank] = useState('E');
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [showRankUp, setShowRankUp] = useState(false);

  const BASE_POINTS = 100;

  const calculateRank = (streak: number): string => {
    if (streak >= 12) return 'S+';
    if (streak >= 10) return 'S';
    if (streak >= 8) return 'A';
    if (streak >= 6) return 'B';
    if (streak >= 4) return 'C';
    if (streak >= 2) return 'D';
    return 'E';
  };

  const calculateMultiplier = (streak: number): number => {
    return Math.min(Math.floor(streak / 2) + 1, 6); // Max 6x multiplier
  };

  const startQuiz = async () => {
    try {
      console.log('Starting quiz for deck:', deckId);
      setIsLoading(true);
      const quizData = await flashcardApi.startQuiz(deckId, 10);
      
      console.log('Quiz data received:', quizData);
      
      if (!quizData.cards || quizData.cards.length === 0) {
        toast({
          title: "No cards available",
          description: "This deck doesn't have enough cards for a quiz",
          variant: "destructive"
        });
        return;
      }
      
      setQuizCards(quizData.cards);
      setUserResponses([]);
      setIsActive(true);
      setTimeLeft(300);
      setCurrentCardIndex(0);
      setSelectedOption('');
      setShowAnswer(false);
      setIsAnswered(false);
      
      // Reset score meter system
      setCurrentStreak(0);
      setCurrentRank('E');
      setCurrentMultiplier(1);
      setTotalScore(0);
      setShowRankUp(false);
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start quiz",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (value: string) => {
    if (isAnswered) return;
    
    setSelectedOption(value);
    setIsAnswered(true);
    
    const currentCard = quizCards[currentCardIndex];
    const selectedIndex = parseInt(value);
    const isCorrect = selectedIndex === currentCard.correct_answer_index;
    const userAnswer = currentCard.options[selectedIndex];
    
    // Update streak, rank, and multiplier
    let newStreak = currentStreak;
    let newRank = currentRank;
    let newMultiplier = currentMultiplier;
    let pointsEarned = 0;
    
    if (isCorrect) {
      newStreak = currentStreak + 1;
      newRank = calculateRank(newStreak);
      newMultiplier = calculateMultiplier(newStreak);
      pointsEarned = BASE_POINTS * newMultiplier;
      
      // Show rank up animation
      if (newRank !== currentRank) {
        setShowRankUp(true);
        setTimeout(() => setShowRankUp(false), 2000);
      }
    } else {
      // Drop rank on incorrect answer
      newStreak = 0;
      const previousRankValue = ['E', 'D', 'C', 'B', 'A', 'S', 'S+'].indexOf(currentRank);
      const droppedRankIndex = Math.max(0, previousRankValue - 1);
      newRank = ['E', 'D', 'C', 'B', 'A', 'S', 'S+'][droppedRankIndex];
      newMultiplier = 1;
      pointsEarned = 0;
    }
    
    setCurrentStreak(newStreak);
    setCurrentRank(newRank);
    setCurrentMultiplier(newMultiplier);
    setTotalScore(prev => prev + pointsEarned);
    
    // Add response to array
    const response: QuizResponse = {
      card_id: currentCard.card_id,
      user_answer: userAnswer,
      is_correct: isCorrect
    };
    
    setUserResponses(prev => [...prev, response]);
    setShowAnswer(true);
    
    // Auto-advance after 2.5 seconds
    setTimeout(() => {
      if (currentCardIndex < quizCards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
        setSelectedOption('');
        setShowAnswer(false);
        setIsAnswered(false);
      } else {
        submitQuiz();
      }
    }, 2500);
  };

  const submitQuiz = async () => {
    try {
      console.log('Submitting quiz...');
      setIsSubmitting(true);
      
      const result = await flashcardApi.submitQuiz(userResponses);
      console.log('Quiz result received:', result);
      
      setQuizResult(result);
      setIsCompleted(true);
      setIsActive(false);
      
      toast({
        title: "Quiz Complete! 🎉",
        description: `Final Rank: ${currentRank} | Score: ${totalScore} points!`
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit quiz",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            submitQuiz();
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (showReview && quizCards.length > 0 && userResponses.length > 0) {
    return (
      <QuizReview
        quizCards={quizCards}
        userResponses={userResponses}
        onRetakeQuiz={() => {
          setShowReview(false);
          setIsCompleted(false);
          setQuizResult(null);
          setQuizCards([]);
          setUserResponses([]);
          setIsActive(false);
        }}
        onBackToDeck={() => {
          setShowReview(false);
          onComplete?.();
        }}
      />
    );
  }

  if (isCompleted && quizResult) {
    const percentage = Math.round((quizResult.correct / quizResult.total_questions) * 100);
    const hasFailedCards = quizResult.wrong > 0;
    
    return (
      <Card className="max-w-4xl mx-auto animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold mb-4">
              <span className={getScoreColor(percentage)}>{percentage}%</span>
            </div>
            
            <ScoreMeter 
              currentStreak={currentStreak}
              currentRank={currentRank}
              multiplier={currentMultiplier}
              totalScore={totalScore}
            />
            
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{quizResult.total_questions}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{quizResult.correct}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{quizResult.wrong}</div>
                <div className="text-sm text-muted-foreground">Wrong</div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 justify-center flex-wrap">
            {hasFailedCards && (
              <Button 
                onClick={() => setShowReview(true)}
                variant="outline"
                className="hover:scale-105 transition-transform"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Review Missed Questions
              </Button>
            )}
            <Button onClick={() => {
              setIsCompleted(false);
              setQuizResult(null);
              setQuizCards([]);
              setUserResponses([]);
              setIsActive(false);
              setShowReview(false);
            }} className="hover:scale-105 transition-transform">
              Retake Quiz
            </Button>
            <Button variant="outline" onClick={onComplete}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Deck
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isActive && quizCards.length === 0) {
    return (
      <Card className="max-w-xl mx-auto shadow-md border border-muted animate-fade-in rounded-2xl">
        <CardHeader className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-t-2xl p-6">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-indigo-800">
            <Clock className="h-5 w-5 text-indigo-700" />
            Multiple Choice Quiz
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            5-minute challenge • 10 questions • Ranking System
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Test Your Knowledge</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Climb the ranks from E to S+ with consecutive correct answers!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={startQuiz}
              size="lg"
              className="w-full hover:scale-[1.03] transition-transform"
              disabled={isLoading}
            >
              {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
              Start Quiz
            </Button>
            <Button variant="outline" onClick={onComplete} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Deck
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentCard = quizCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / quizCards.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Quiz Mode
            </CardTitle>
            <div className={`text-lg font-mono ${timeLeft < 60 ? 'text-red-500' : ''}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          
          <ScoreMeter 
            currentStreak={currentStreak}
            currentRank={currentRank}
            multiplier={currentMultiplier}
            totalScore={totalScore}
            showRankUp={showRankUp}
          />
          
          <Progress value={progress} className="w-full" />
          <div className="text-sm text-muted-foreground">
            Question {currentCardIndex + 1} of {quizCards.length}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4 text-lg">Question:</h3>
            <div className="bg-gray-50 p-4 rounded-lg border min-h-[100px]">
              <div className="text-base leading-relaxed whitespace-pre-wrap">
                {currentCard?.question}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-lg">Choose your answer:</h3>
            <RadioGroup value={selectedOption} onValueChange={handleOptionSelect} disabled={isAnswered}>
              <div className="space-y-3">
                {currentCard?.options.map((option, index) => {
                  const isSelected = selectedOption === index.toString();
                  const isCorrect = index === currentCard.correct_answer_index;
                  let optionClass = "p-4 rounded-lg border transition-all";
                  
                  if (showAnswer) {
                    if (isCorrect) {
                      optionClass += " bg-green-100 border-green-500 text-green-800";
                    } else if (isSelected && !isCorrect) {
                      optionClass += " bg-red-100 border-red-500 text-red-800";
                    } else {
                      optionClass += " bg-gray-50 border-gray-300 text-gray-600";
                    }
                  } else if (isSelected) {
                    optionClass += " bg-blue-100 border-blue-500";
                  } else {
                    optionClass += " hover:bg-gray-50 border-gray-300";
                  }
                  
                  return (
                    <div key={index} className={optionClass}>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                        {showAnswer && isCorrect && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {showAnswer && isSelected && !isCorrect && (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>
          
          {showAnswer && (
            <div className="text-center">
              {isAnswered && selectedOption && (
                <div className="mb-2">
                  {currentCard && parseInt(selectedOption) === currentCard.correct_answer_index ? (
                    <div className="text-green-600 font-medium">
                      +{BASE_POINTS * currentMultiplier} points! {currentMultiplier > 1 && `(${BASE_POINTS} × ${currentMultiplier}x)`}
                    </div>
                  ) : (
                    <div className="text-red-600 font-medium">
                      Streak broken! Rank dropped.
                    </div>
                  )}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                {currentCardIndex < quizCards.length - 1 
                  ? "Next question in a moment..." 
                  : "Finishing quiz..."}
              </div>
            </div>
          )}
          
          {isSubmitting && (
            <div className="flex justify-center">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MultipleChoiceQuiz;
