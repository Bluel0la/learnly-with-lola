
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { quizApi, QuizQuestion, QuestionResponse, SubmitResultResponse } from '@/services/quizApi';
import { ArrowLeft, Clock, Trophy, Zap } from 'lucide-react';

interface ActiveMathQuizProps {
  sessionId: string;
  topic: string;
  totalQuestions: number;
  onQuizComplete: (results: SubmitResultResponse) => void;
  onBack: () => void;
}

const ActiveMathQuiz: React.FC<ActiveMathQuizProps> = ({ 
  sessionId, 
  topic, 
  totalQuestions, 
  onQuizComplete, 
  onBack 
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<QuestionResponse[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await quizApi.getQuestionBatch(sessionId);
        setQuestions(response.current_batch);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        toast({
          title: "Error",
          description: "Failed to load quiz questions. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [sessionId, toast]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) {
      toast({
        title: "Answer Required",
        description: "Please select an answer before proceeding.",
        variant: "destructive"
      });
      return;
    }

    const newAnswer: QuestionResponse = {
      question_id: questions[currentQuestionIndex].question_id,
      selected_answer: selectedAnswer
    };

    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);
    setSelectedAnswer('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitQuiz(updatedAnswers);
    }
  };

  const submitQuiz = async (answers: QuestionResponse[]) => {
    setIsSubmitting(true);
    try {
      const response = await quizApi.submitAnswers(sessionId, { responses: answers });
      onQuizComplete(response);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading quiz...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <h3 className="text-xl font-semibold mb-2">No Questions Available</h3>
          <p className="text-gray-600 mb-4">Unable to load quiz questions.</p>
          <Button onClick={onBack}>Back to Quiz Selection</Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-500 bg-green-100';
      case 'medium': return 'text-yellow-500 bg-yellow-100';
      case 'hard': return 'text-red-500 bg-red-100';
      case 'pro': return 'text-purple-500 bg-purple-100';
      default: return 'text-blue-500 bg-blue-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          disabled={isSubmitting}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="text-center">
          <h2 className="font-bold text-lg">{topic.charAt(0).toUpperCase() + topic.slice(1)} Quiz</h2>
          <p className="text-blue-100">Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-mono">{formatTime(timeElapsed)}</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(currentQuestion.difficulty)}`}>
            {currentQuestion.difficulty.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm font-bold text-blue-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <Card className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {currentQuestionIndex + 1}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 leading-relaxed px-4">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {currentQuestion.choices.map((choice, index) => {
              const letters = ['A', 'B', 'C', 'D'];
              const isSelected = selectedAnswer === choice;
              
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full text-left justify-start p-6 h-auto min-h-[70px] transition-all duration-300 border-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500 shadow-lg scale-105'
                      : 'hover:bg-blue-50 hover:border-blue-300 border-gray-200 bg-white'
                  }`}
                  onClick={() => handleAnswerSelect(choice)}
                  disabled={isSubmitting}
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {letters[index]}
                    </div>
                    <div className="text-base leading-relaxed whitespace-normal break-words flex-1 text-left">
                      {choice}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          <div className="pt-6">
            <Button 
              onClick={handleNextQuestion}
              disabled={!selectedAnswer || isSubmitting}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting Quiz...
                  </>
                ) : currentQuestionIndex < questions.length - 1 ? (
                  <>
                    <Zap className="h-5 w-5" />
                    Next Question
                  </>
                ) : (
                  <>
                    <Trophy className="h-5 w-5" />
                    Finish Quiz
                  </>
                )}
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveMathQuiz;
