
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, XCircle, Trophy, ArrowLeft, BookOpen, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { QuizCard, QuizResponse, QuizResult, flashcardApi } from '@/services/flashcardApi';
import LoadingSpinner from '@/components/ui/loading-spinner';
import QuizReview from './QuizReview';
import TiltedCard from '@/components/ui/TiltedCard';

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
        description: `You scored ${result.correct}/${result.total_questions}`
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
      <div className="max-w-4xl mx-auto">
        <TiltedCard
          containerHeight="auto"
          scaleOnHover={1.02}
          rotateAmplitude={6}
        >
          <Card className="w-full border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-3 text-3xl font-bold">
                <Trophy className="h-10 w-10 text-yellow-500" />
                Quiz Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="text-center space-y-6">
                <div className="text-8xl font-bold mb-6">
                  <span className={getScoreColor(percentage)}>{percentage}%</span>
                </div>
                
                <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
                  <div className="text-center p-4 rounded-xl bg-blue-50">
                    <div className="text-3xl font-bold text-blue-600">{quizResult.total_questions}</div>
                    <div className="text-sm text-muted-foreground font-medium">Total</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-green-50">
                    <div className="text-3xl font-bold text-green-600">{quizResult.correct}</div>
                    <div className="text-sm text-muted-foreground font-medium">Correct</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-red-50">
                    <div className="text-3xl font-bold text-red-600">{quizResult.wrong}</div>
                    <div className="text-sm text-muted-foreground font-medium">Wrong</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center flex-wrap">
                {hasFailedCards && (
                  <Button 
                    onClick={() => setShowReview(true)}
                    variant="outline"
                    size="lg"
                    className="hover:scale-105 transition-transform"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Review Missed Questions
                  </Button>
                )}
                <Button 
                  onClick={() => {
                    setIsCompleted(false);
                    setQuizResult(null);
                    setQuizCards([]);
                    setUserResponses([]);
                    setIsActive(false);
                    setShowReview(false);
                  }}
                  size="lg"
                  className="hover:scale-105 transition-transform"
                >
                  Retake Quiz
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onComplete}
                  size="lg"
                  className="hover:scale-105 transition-transform"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Deck
                </Button>
              </div>
            </CardContent>
          </Card>
        </TiltedCard>
      </div>
    );
  }

  if (!isActive && quizCards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <TiltedCard
          containerHeight="auto"
          scaleOnHover={1.03}
          rotateAmplitude={8}
        >
          <Card className="w-full border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <Target className="h-8 w-8 text-blue-600" />
                Multiple Choice Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold">Test your knowledge!</h3>
                <p className="text-muted-foreground text-lg">
                  Take a 5-minute multiple choice quiz with 10 questions from this deck.
                </p>
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={startQuiz} 
                  size="lg" 
                  className="hover:scale-105 transition-transform px-8"
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                  Start Quiz
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onComplete}
                  size="lg"
                  className="hover:scale-105 transition-transform px-8"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Deck
                </Button>
              </div>
            </CardContent>
          </Card>
        </TiltedCard>
      </div>
    );
  }

  const currentCard = quizCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / quizCards.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <TiltedCard
        containerHeight="auto"
        scaleOnHover={1.02}
        rotateAmplitude={6}
      >
        <Card className="w-full border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Clock className="h-6 w-6 text-blue-600" />
                Quiz Mode
              </CardTitle>
              <div className={`text-2xl font-mono font-bold px-4 py-2 rounded-lg ${timeLeft < 60 ? 'text-red-500 bg-red-50' : 'text-blue-600 bg-blue-50'}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
            
            <Progress value={progress} className="w-full h-3" />
            <div className="text-sm text-muted-foreground font-medium">
              Question {currentCardIndex + 1} of {quizCards.length}
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div>
              <h3 className="font-bold mb-6 text-xl text-gray-800">Question:</h3>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-l-4 border-blue-500">
                <div className="text-lg leading-relaxed whitespace-pre-wrap font-medium">
                  {currentCard?.question}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-xl text-gray-800">Choose your answer:</h3>
              <RadioGroup value={selectedOption} onValueChange={handleOptionSelect} disabled={isAnswered}>
                <div className="space-y-4">
                  {currentCard?.options.map((option, index) => {
                    const isSelected = selectedOption === index.toString();
                    const isCorrect = index === currentCard.correct_answer_index;
                    let optionClass = "p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-md";
                    
                    if (showAnswer) {
                      if (isCorrect) {
                        optionClass += " bg-green-100 border-green-500 text-green-800 shadow-lg";
                      } else if (isSelected && !isCorrect) {
                        optionClass += " bg-red-100 border-red-500 text-red-800 shadow-lg";
                      } else {
                        optionClass += " bg-gray-50 border-gray-300 text-gray-600";
                      }
                    } else if (isSelected) {
                      optionClass += " bg-blue-100 border-blue-500 shadow-lg transform scale-[1.02]";
                    } else {
                      optionClass += " hover:bg-gray-50 border-gray-300 hover:border-blue-300";
                    }
                    
                    return (
                      <div key={index} className={optionClass}>
                        <div className="flex items-center space-x-4">
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} className="scale-125" />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base font-medium">
                            {option}
                          </Label>
                          {showAnswer && isCorrect && (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          )}
                          {showAnswer && isSelected && !isCorrect && (
                            <XCircle className="h-6 w-6 text-red-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
            </div>
            
            {showAnswer && (
              <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                <div className="text-lg text-muted-foreground font-medium">
                  {currentCardIndex < quizCards.length - 1 
                    ? "Next question in a moment..." 
                    : "Finishing quiz..."}
                </div>
              </div>
            )}
            
            {isSubmitting && (
              <div className="flex justify-center">
                <LoadingSpinner size="lg" />
              </div>
            )}
          </CardContent>
        </Card>
      </TiltedCard>
    </div>
  );
};

export default MultipleChoiceQuiz;
