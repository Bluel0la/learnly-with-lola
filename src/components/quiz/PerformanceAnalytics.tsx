
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Brain, 
  Loader2, 
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  Trophy,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie
} from 'recharts';
import { quizApi, PerformanceResponse } from '@/services/quizApi';
import { useToast } from '@/hooks/use-toast';

interface PerformanceAnalyticsProps {
  onClose: () => void;
}

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4'];

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
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analyzing Your Performance</h3>
            <p className="text-gray-600 text-center">Crunching the numbers to show your progress...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!performance || performance.performance_by_topic.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl">No Analytics Yet</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <p className="text-gray-600 mb-6 text-lg">Complete some quizzes to unlock detailed performance insights!</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                <Trophy className="h-8 w-8 text-blue-500 mb-2" />
                <span className="font-medium text-blue-700">Track Progress</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                <Target className="h-8 w-8 text-green-500 mb-2" />
                <span className="font-medium text-green-700">Find Strengths</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
                <Award className="h-8 w-8 text-purple-500 mb-2" />
                <span className="font-medium text-purple-700">Improve Skills</span>
              </div>
            </div>
            <Button onClick={onClose} size="lg">
              Start Your First Quiz
            </Button>
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

  const strongestTopics = performance.performance_by_topic
    .filter(topic => topic.total_answered >= 3)
    .sort((a, b) => b.accuracy_percent - a.accuracy_percent)
    .slice(0, 3);

  const weakestTopics = performance.performance_by_topic
    .filter(topic => topic.total_answered >= 3)
    .sort((a, b) => a.accuracy_percent - b.accuracy_percent)
    .slice(0, 3);

  const chartData = performance.performance_by_topic
    .sort((a, b) => b.total_answered - a.total_answered)
    .slice(0, 8)
    .map(topic => ({
      topic: topic.topic.charAt(0).toUpperCase() + topic.topic.slice(1),
      accuracy: topic.accuracy_percent,
      questions: topic.total_answered
    }));

  const pieData = [
    { name: 'Correct', value: overallStats.totalCorrect, color: '#22c55e' },
    { name: 'Wrong', value: overallStats.totalWrong, color: '#ef4444' }
  ];

  const getPerformanceLevel = (accuracy: number) => {
    if (accuracy >= 85) return { label: 'Excellent', color: 'bg-green-500', icon: Trophy };
    if (accuracy >= 70) return { label: 'Good', color: 'bg-blue-500', icon: Target };
    if (accuracy >= 50) return { label: 'Fair', color: 'bg-yellow-500', icon: Star };
    return { label: 'Needs Work', color: 'bg-red-500', icon: AlertCircle };
  };

  const performanceLevel = getPerformanceLevel(overallAccuracy);
  const PerformanceIcon = performanceLevel.icon;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium capitalize">{`${label}`}</p>
          <p className="text-blue-600">
            {`Accuracy: ${payload[0].value.toFixed(1)}%`}
          </p>
          {payload[1] && (
            <p className="text-green-600">
              {`Questions: ${payload[1].value}`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p style={{ color: data.color }}>
            {`Count: ${data.value}`}
          </p>
          <p className="text-gray-600">
            {`${((data.value / (overallStats.totalCorrect + overallStats.totalWrong)) * 100).toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            Performance Analytics
          </h1>
          <p className="text-gray-600 mt-1">Detailed insights into your quiz performance</p>
        </div>
        <Button onClick={onClose} variant="outline" size="lg">
          Back to Quizzes
        </Button>
      </div>

      {/* Overall Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Questions</p>
                <p className="text-2xl lg:text-3xl font-bold">{overallStats.totalAnswered}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Correct Answers</p>
                <p className="text-2xl lg:text-3xl font-bold">{overallStats.totalCorrect}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Wrong Answers</p>
                <p className="text-2xl lg:text-3xl font-bold">{overallStats.totalWrong}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br from-purple-500 to-purple-600 text-white`}>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Overall Accuracy</p>
                <p className="text-2xl lg:text-3xl font-bold">{overallAccuracy.toFixed(1)}%</p>
                <Badge variant="secondary" className="mt-1 text-xs bg-white/20 text-white">
                  <PerformanceIcon className="h-3 w-3 mr-1" />
                  {performanceLevel.label}
                </Badge>
              </div>
              <PerformanceIcon className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed analytics */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="topics" className="text-xs sm:text-sm">By Topics</TabsTrigger>
          <TabsTrigger value="strengths" className="text-xs sm:text-sm">Insights</TabsTrigger>
          <TabsTrigger value="progress" className="text-xs sm:text-sm hidden lg:block">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Answer Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Answer Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <PieTooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Topic Performance Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance by Topic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="topic" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis domain={[0, 100]} />
                      <CustomTooltip />
                      <Bar dataKey="accuracy" fill="#3b82f6" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Topic Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performance.performance_by_topic
                  .sort((a, b) => b.accuracy_percent - a.accuracy_percent)
                  .map((topic, index) => {
                    const level = getPerformanceLevel(topic.accuracy_percent);
                    const LevelIcon = level.icon;
                    return (
                      <div key={topic.topic} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${level.color} rounded-full flex items-center justify-center text-white`}>
                              <LevelIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold capitalize text-lg">{topic.topic}</h4>
                              <p className="text-sm text-gray-600">
                                {topic.total_answered} questions • {topic.correct} correct • {topic.wrong} wrong
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={topic.accuracy_percent >= 70 ? "default" : "destructive"}>
                              {topic.accuracy_percent.toFixed(1)}%
                            </Badge>
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${level.color} transition-all duration-500`}
                                style={{ width: `${topic.accuracy_percent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strengths" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strongest Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Trophy className="h-5 w-5" />
                  Your Strongest Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {strongestTopics.length > 0 ? (
                  <div className="space-y-3">
                    {strongestTopics.map((topic, index) => (
                      <div key={topic.topic} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium capitalize">{topic.topic}</p>
                          <p className="text-sm text-gray-600">{topic.accuracy_percent.toFixed(1)}% accuracy</p>
                        </div>
                        <Trophy className="h-5 w-5 text-green-500" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Complete more quizzes to identify your strengths!</p>
                )}
              </CardContent>
            </Card>

            {/* Areas for Improvement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Target className="h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weakestTopics.length > 0 ? (
                  <div className="space-y-3">
                    {weakestTopics.map((topic, index) => (
                      <div key={topic.topic} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium capitalize">{topic.topic}</p>
                          <p className="text-sm text-gray-600">{topic.accuracy_percent.toFixed(1)}% accuracy</p>
                        </div>
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                      </div>
                    ))}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700 font-medium">💡 Tip: Focus on practicing these topics to improve your overall performance!</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Great job! No weak areas identified yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progress Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Progress Tracking Coming Soon</h3>
                <p className="text-gray-600">We're working on detailed progress tracking to show your improvement over time.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceAnalytics;
