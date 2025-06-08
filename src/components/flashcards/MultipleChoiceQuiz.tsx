
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, ArrowRight, Target, Flame } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Ready to Quiz?
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {quizCards.length} questions • 30 seconds each
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{quizCards.length}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">30s</div>
                <div className="text-sm text-muted-foreground">Per Question</div>
              </div>
            </div>
            
            <Button onClick={startQuiz} size="lg" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              <Target className="mr-2 h-4 w-4" />
              Start Quiz
            </Button>
            <Button onClick={onComplete} variant="outline" className="w-full">
              Back to Deck
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentCard = quizCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / quizCards.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Stats */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Question</span>
              <span className="text-lg font-bold text-primary">{currentCardIndex + 1}</span>
              <span className="text-sm text-muted-foreground">of {quizCards.length}</span>
            </div>
            <div className="flex items-center gap-4">
              {streak > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-full">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-700">{streak}</span>
                </div>
              )}
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                timeLeft <= 10 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <Clock className="h-4 w-4" />
                <span className="font-mono font-bold">{timeLeft}s</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCardIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="shadow-xl border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl leading-relaxed">
                  {currentCard.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentCard.options.map((option, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      variant={selectedAnswer === option ? "default" : "outline"}
                      className={`w-full text-left h-auto p-4 justify-start transition-all ${
                        selectedAnswer === option 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md' 
                          : 'hover:bg-blue-50 hover:border-blue-200'
                      }`}
                      onClick={() => setSelectedAnswer(option)}
                    >
                      <div className={`mr-3 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        selectedAnswer === option ? 'bg-white text-blue-600' : 'bg-muted text-muted-foreground'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="break-words text-left">{option}</span>
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button onClick={onComplete} variant="outline" className="px-6">
            Exit Quiz
          </Button>
          <Button
            onClick={() => handleAnswerSubmit()}
            disabled={!selectedAnswer}
            className="px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50"
          >
            {currentCardIndex === quizCards.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceQuiz;
