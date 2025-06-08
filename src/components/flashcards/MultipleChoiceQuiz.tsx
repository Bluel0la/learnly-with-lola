
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { flashcardApi, QuizCard, QuizResponse, QuizResult } from '@/services/flashcardApi';
import { useToast } from '@/hooks/use-toast';
import QuizReview from './QuizReview';
import { motion, AnimatePresence } from 'framer-motion';

interface MultipleChoiceQuizProps {
  deckId: string;
  onComplete?: () => void;
}

const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({ deckId, onComplete }) => {
  const [quizCards, setQuizCards] = useState<QuizCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [userResponses, setUserResponses] = useState<QuizResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const { toast } = useToast();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0 && !quizCompleted) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, quizCompleted]);

  const handleTimeUp = () => {
    if (currentCardIndex < quizCards.length) {
      handleAnswerSubmit(true); // Auto-submit as wrong when time runs out
    }
  };

  const loadQuiz = async () => {
    try {
      setIsLoading(true);
      const quizData = await flashcardApi.startQuiz(deckId, 10);
      setQuizCards(quizData.cards);
      
      if (quizData.cards.length === 0) {
        toast({
          title: "No Cards Available",
          description: "This deck doesn't have enough cards for a quiz.",
          variant: "destructive"
        });
        if (onComplete) onComplete();
        return;
      }
    } catch (error) {
      console.error('Failed to load quiz:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz. Please try again.",
        variant: "destructive"
      });
      if (onComplete) onComplete();
    } finally {
      setIsLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setIsTimerActive(true);
    setStartTime(new Date());
    setTimeLeft(30);
  };

  const handleAnswerSubmit = (isTimeUp = false) => {
    if (!quizStarted || quizCompleted) return;

    const currentCard = quizCards[currentCardIndex];
    const isCorrect = !isTimeUp && selectedAnswer === currentCard.options[currentCard.correct_answer_index];
    
    // Update streak
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(Math.max(maxStreak, newStreak));
    } else {
      setStreak(0);
    }

    const response: QuizResponse = {
      card_id: currentCard.card_id,
      user_answer: isTimeUp ? 'Time Up' : selectedAnswer,
      is_correct: isCorrect
    };

    const newResponses = [...userResponses, response];
    setUserResponses(newResponses);

    if (currentCardIndex < quizCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setSelectedAnswer('');
      setTimeLeft(30);
    } else {
      completeQuiz(newResponses);
    }
  };

  const completeQuiz = async (responses: QuizResponse[]) => {
    try {
      setIsTimerActive(false);
      setQuizCompleted(true);
      
      console.log('Submitting quiz responses:', responses);
      
      // Submit to backend with proper format
      const result = await flashcardApi.submitQuiz(responses);
      console.log('Quiz result received:', result);
      
      setQuizResult(result);
      
      const endTime = new Date();
      const timeSpent = startTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0;
      
      toast({
        title: "Quiz Complete!",
        description: `You scored ${result.correct}/${result.total_questions} (${Math.round((result.correct / result.total_questions) * 100)}%)`,
      });
      
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      toast({
        title: "Error",
        description: "Failed to submit quiz results.",
        variant: "destructive"
      });
    }
  };

  const restartQuiz = () => {
    setCurrentCardIndex(0);
    setSelectedAnswer('');
    setUserResponses([]);
    setQuizStarted(false);
    setQuizCompleted(false);
    setQuizResult(null);
    setTimeLeft(30);
    setIsTimerActive(false);
    setStreak(0);
    setMaxStreak(0);
    setStartTime(null);
    loadQuiz();
  };

  useEffect(() => {
    loadQuiz();
  }, [deckId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 border-2 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (quizCompleted && quizResult) {
    return (
      <QuizReview
        result={quizResult}
        deckId={deckId}
        onRestart={restartQuiz}
        onExit={onComplete}
      />
    );
  }

  if (!quizStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Ready to Start Quiz?</CardTitle>
          <p className="text-muted-foreground">
            You'll have 30 seconds per question. {quizCards.length} questions total.
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl">🎯</div>
          <Button onClick={startQuiz} size="lg" className="w-full">
            Start Quiz
          </Button>
          <Button onClick={onComplete} variant="outline" className="w-full">
            Back to Deck
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentCard = quizCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / quizCards.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress and Stats */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            Question {currentCardIndex + 1} of {quizCards.length}
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <span>🔥 {streak}</span>
              {maxStreak > 0 && <span className="text-muted-foreground">(best: {maxStreak})</span>}
            </div>
            <div className={`flex items-center gap-1 text-sm ${timeLeft <= 10 ? 'text-red-600' : ''}`}>
              <Clock className="h-4 w-4" />
              {timeLeft}s
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCardIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{currentCard.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentCard.options.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={selectedAnswer === option ? "default" : "outline"}
                    className="w-full text-left h-auto p-4 justify-start"
                    onClick={() => setSelectedAnswer(option)}
                  >
                    <span className="mr-3 font-semibold">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="break-words">{option}</span>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Submit Button */}
      <div className="flex justify-between">
        <Button onClick={onComplete} variant="outline">
          Exit Quiz
        </Button>
        <Button
          onClick={() => handleAnswerSubmit()}
          disabled={!selectedAnswer}
          className="flex items-center gap-2"
        >
          {currentCardIndex === quizCards.length - 1 ? 'Finish Quiz' : 'Next Question'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MultipleChoiceQuiz;
