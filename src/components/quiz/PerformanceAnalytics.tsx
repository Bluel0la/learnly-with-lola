
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Award, Brain, Loader2 } from 'lucide-react';
import { quizApi, PerformanceResponse } from '@/services/quizApi';
import { useToast } from '@/hooks/use-toast';

interface PerformanceAnalyticsProps {
  onClose: () => void;
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ onClose }) => {
  const [performance, setPerformance] = useState<PerformanceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const data = await quizApi.getUserPerformance();
        setPerformance(data);
      } catch (error) {
        console.error('Failed to fetch performance:', error);
        toast({
          title: "Error",
          description: "Failed to load performance data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformance();
  }, [toast]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-lg">Loading performance data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!performance || performance.performance_by_topic.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No performance data yet</h3>
            <p className="text-gray-600 mb-4">Complete some quizzes to see your performance analytics!</p>
            <Button onClick={onClose}>Back to Quizzes</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallStats = performance.performance_by_topic.reduce(
    (acc, topic) => ({
      totalAnswered: acc.totalAnswered + topic.total_answered,
      totalCorrect: acc.totalCorrect + topic.correct,
      totalWrong: acc.totalWrong + topic.wrong
    }),
    { totalAnswered: 0, totalCorrect: 0, totalWrong: 0 }
  );

  const overallAccuracy = overallStats.totalAnswered > 0 
    ? (overallStats.totalCorrect / overallStats.totalAnswered) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{overallStats.totalAnswered}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{overallStats.totalCorrect}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{overallAccuracy.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Overall Accuracy</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Performance by Topic</h3>
            {performance.performance_by_topic.map((topic) => (
              <div key={topic.topic} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium capitalize">{topic.topic}</h4>
                  <span className="text-sm text-gray-600">
                    {topic.accuracy_percent.toFixed(1)}% accuracy
                  </span>
                </div>
                <Progress value={topic.accuracy_percent} className="mb-2" />
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>Total: {topic.total_answered}</div>
                  <div>Correct: {topic.correct}</div>
                  <div>Wrong: {topic.wrong}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <Button onClick={onClose} variant="outline">
              Back to Quizzes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAnalytics;
