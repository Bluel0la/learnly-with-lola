
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { quizApi, QuizQuestion, QuestionResponse, SubmitResultResponse } from '@/services/quizApi';

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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          ← Back
        </Button>
        <div className="text-sm text-gray-600">
          {topic.charAt(0).toUpperCase() + topic.slice(1)} Quiz
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-blue-600">
            Difficulty: {currentQuestion.difficulty}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {currentQuestion.choices.map((choice, index) => (
              <Button
                key={index}
                variant={selectedAnswer === choice ? "default" : "outline"}
                className={`w-full text-left justify-start p-4 h-auto min-h-[60px] transition-all duration-300 ${
                  selectedAnswer === choice
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'hover:bg-blue-50 hover:border-blue-300'
                }`}
                onClick={() => handleAnswerSelect(choice)}
                disabled={isSubmitting}
              >
                <div className="text-sm leading-relaxed whitespace-normal break-words w-full text-left">
                  {choice}
                </div>
              </Button>
            ))}
          </div>

          <Button 
            onClick={handleNextQuestion}
            disabled={!selectedAnswer || isSubmitting}
            className="w-full mt-6 h-12 text-base font-medium"
          >
            {isSubmitting 
              ? 'Submitting Quiz...' 
              : currentQuestionIndex < questions.length - 1 
                ? 'Next Question' 
                : 'Finish Quiz'
            }
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveMathQuiz;
