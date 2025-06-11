
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Award, Brain, Loader2, ArrowLeft } from 'lucide-react';
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
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Quizzes
          </Button>
          <h1 className="text-2xl font-bold">Performance Analytics</h1>
        </div>
        
        <Card>
          <CardContent className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-lg">Loading performance data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!performance || performance.performance_by_topic.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Quizzes
          </Button>
          <h1 className="text-2xl font-bold">Performance Analytics</h1>
        </div>
        
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No performance data yet</h3>
              <p className="text-gray-600 mb-4">Complete some quizzes to see your performance analytics!</p>
            </div>
          </CardContent>
        </Card>
      </div>
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
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Quizzes
        </Button>
        <h1 className="text-2xl font-bold">Performance Analytics</h1>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-blue-700">{overallStats.totalAnswered}</div>
            <div className="text-sm text-blue-600">Total Questions</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-green-700">{overallStats.totalCorrect}</div>
            <div className="text-sm text-green-600">Correct Answers</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-purple-700">{overallAccuracy.toFixed(1)}%</div>
            <div className="text-sm text-purple-600">Overall Accuracy</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance by Topic */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Performance by Topic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {performance.performance_by_topic.map((topic) => (
            <div key={topic.topic} className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium capitalize text-lg">{topic.topic}</h4>
                <span className="text-lg font-bold text-gray-700">
                  {topic.accuracy_percent.toFixed(1)}%
                </span>
              </div>
              <Progress value={topic.accuracy_percent} className="mb-3 h-2" />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-700">{topic.total_answered}</div>
                  <div className="text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">{topic.correct}</div>
                  <div className="text-gray-500">Correct</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-red-600">{topic.wrong}</div>
                  <div className="text-gray-500">Wrong</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAnalytics;
