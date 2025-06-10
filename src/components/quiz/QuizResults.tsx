
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Trophy, Target, Loader2 } from 'lucide-react';
import { QuizReviewResponse, quizApi } from '@/services/quizApi';
import { useToast } from '@/hooks/use-toast';

interface QuizResultsProps {
  sessionId: string;
  topic: string;
  onStartNewQuiz: () => void;
  onBackToQuizzes: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ 
  sessionId,
  topic, 
  onStartNewQuiz, 
  onBackToQuizzes 
}) => {
  const [reviewData, setReviewData] = useState<QuizReviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response = await quizApi.getQuizReview(sessionId);
        setReviewData(response);
      } catch (error) {
        console.error('Failed to fetch quiz review:', error);
        toast({
          title: "Error",
          description: "Failed to load quiz results. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewData();
  }, [sessionId, toast]);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return 'Outstanding performance! 🌟';
    if (percentage >= 80) return 'Excellent work! 🎉';
    if (percentage >= 70) return 'Great job! 👍';
    if (percentage >= 60) return 'Good effort! Keep practicing! 💪';
    return 'Keep practicing - you\'ll improve! 📚';
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-lg">Loading your results...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!reviewData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-semibold mb-2">Unable to Load Results</h3>
            <p className="text-gray-600 mb-4">There was an error loading your quiz results.</p>
            <Button onClick={onBackToQuizzes}>Back to Quizzes</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const correctCount = reviewData.results.filter(r => r.is_correct).length;
  const wrongCount = reviewData.results.length - correctCount;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
          <p className="text-gray-600">{reviewData.topic.charAt(0).toUpperCase() + reviewData.topic.slice(1)} Quiz Results</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-red-600">{wrongCount}</div>
              <div className="text-sm text-gray-600">Wrong</div>
            </div>
            <div className="space-y-2">
              <div className={`text-3xl font-bold ${getScoreColor(reviewData.score_percent)}`}>
                {reviewData.score_percent.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-medium mb-2">
              {getPerformanceMessage(reviewData.score_percent)}
            </p>
            <p className="text-sm text-gray-600">
              Total questions answered: <span className="font-medium">{reviewData.total_questions}</span>
            </p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                reviewData.score_percent >= 80 ? 'bg-green-500' : 
                reviewData.score_percent >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${reviewData.score_percent}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reviewData.results.map((answer, index) => (
            <div key={answer.question_id} className="border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {answer.is_correct ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="font-medium">Question {index + 1}</div>
                  <div className="text-sm text-gray-600">
                    Your answer: <span className={answer.is_correct ? 'text-green-600' : 'text-red-600'}>
                      {answer.selected_answer}
                    </span>
                  </div>
                  {!answer.is_correct && (
                    <div className="text-sm text-gray-600">
                      Correct answer: <span className="text-green-600">{answer.correct_answer}</span>
                    </div>
                  )}
                  {answer.explanation && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      💡 {answer.explanation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center">
        <Button onClick={onStartNewQuiz} className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Try Another Quiz
        </Button>
        <Button variant="outline" onClick={onBackToQuizzes}>
          Back to Quizzes
        </Button>
      </div>
    </div>
  );
};

export default QuizResults;
