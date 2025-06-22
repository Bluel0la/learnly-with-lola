
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
  XCircle,
  Flame,
  Users,
  BookOpen
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
  Pie,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { quizApi, PerformanceResponse } from '@/services/quizApi';
import { useToast } from '@/hooks/use-toast';
import StatCard from "./analytics/StatCard";
import WeeklyActivitySparkline from "./analytics/WeeklyActivitySparkline";
import BestTopicCard from "./analytics/BestTopicCard";
import WeakTopicCard from "./analytics/WeakTopicCard";
import TopicPerformanceList from "./analytics/TopicPerformanceList";

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

  // Compute trends and previous stats (mocked for now; backend support can be added)
  // Mock previous stats to demonstrate trend display
  const prevOverallStats = {
    totalAnswered: overallStats.totalAnswered - 10,
    totalCorrect: overallStats.totalCorrect - 5,
    totalWrong: overallStats.totalWrong - 5,
    overallAccuracy: overallAccuracy - 3.5,
  };
  const accuracyTrend =
    overallStats.totalAnswered && prevOverallStats.totalAnswered
      ? (overallAccuracy - prevOverallStats.overallAccuracy).toFixed(1)
      : null;

  // Activity: questions answered by day (mock for now, could use API)
  const recentAnswersByDay = [
    { day: "Mon", count: 10 },
    { day: "Tue", count: 12 },
    { day: "Wed", count: 15 },
    { day: "Thu", count: 8 },
    { day: "Fri", count: 18 },
    { day: "Sat", count: 11 },
    { day: "Sun", count: 13 },
  ];

  // Trends for stat cards (mock delta for demo)
  const totalAnsweredDelta = overallStats.totalAnswered - prevOverallStats.totalAnswered;
  const accuracyDelta = accuracyTrend ? parseFloat(accuracyTrend) : null;
  const totalWrongDelta = overallStats.totalWrong - prevOverallStats.totalWrong;
  const streak = 12; // mock, replace with API value if possible

  // Insight calculations (if topics are available)
  const mostImprovedTopic =
    performance.performance_by_topic
      .slice()
      .sort((a, b) => (b.accuracy_percent - a.accuracy_percent))
      .at(0);

  const weakestTopic =
    performance.performance_by_topic
      .slice()
      .sort((a, b) => (a.accuracy_percent - b.accuracy_percent))
      .at(0);

  // Weekly accuracy data for the bar chart at the top
  const weeklyAccuracyData = [
    { week: "4w ago", percent: 58 },
    { week: "3w ago", percent: 67 },
    { week: "2w ago", percent: 75 },
    { week: "last wk", percent: 80 },
    { week: "this wk", percent: overallAccuracy }
  ];

  // Progress tracking data
  const progressOverTime = [
    { date: "Week 1", accuracy: 45, questions: 25 },
    { date: "Week 2", accuracy: 52, questions: 35 },
    { date: "Week 3", accuracy: 61, questions: 42 },
    { date: "Week 4", accuracy: 68, questions: 38 },
    { date: "Week 5", accuracy: 74, questions: 45 },
    { date: "Week 6", accuracy: overallAccuracy, questions: overallStats.totalAnswered },
  ];

  const milestones = [
    { title: "First Quiz", completed: true, date: "2 weeks ago" },
    { title: "50 Questions Answered", completed: true, date: "1 week ago" },
    { title: "70% Accuracy", completed: overallAccuracy >= 70, date: overallAccuracy >= 70 ? "Achieved!" : "In Progress" },
    { title: "100 Questions Answered", completed: overallStats.totalAnswered >= 100, date: overallStats.totalAnswered >= 100 ? "Achieved!" : "In Progress" },
    { title: "85% Accuracy", completed: overallAccuracy >= 85, date: overallAccuracy >= 85 ? "Achieved!" : "Goal" },
  ];

  const goals = [
    { title: "Maintain 80% Accuracy", progress: Math.min(100, (overallAccuracy / 80) * 100), target: "80%" },
    { title: "Answer 200 Questions", progress: Math.min(100, (overallStats.totalAnswered / 200) * 100), target: "200" },
    { title: "Master 5 Topics", progress: Math.min(100, (strongestTopics.length / 5) * 100), target: "5 topics" },
  ];

  // --- UI Rendering starts ---
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

      {/* Performance Overview Cards at the top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          icon={<Brain className="h-4 w-4" />}
          label="Total Questions"
          value={overallStats.totalAnswered}
          delta={totalAnsweredDelta}
          deltaLabel="since last week"
          accentColor="blue"
        />
        <StatCard
          icon={<CheckCircle className="h-4 w-4" />}
          label="Accuracy Rate"
          value={`${overallAccuracy.toFixed(1)}%`}
          delta={accuracyDelta}
          deltaLabel="% since last week"
          accentColor="green"
        />
        <StatCard
          icon={<XCircle className="h-4 w-4" />}
          label="Incorrect Answers"
          value={overallStats.totalWrong}
          delta={totalWrongDelta}
          deltaLabel="since last week"
          accentColor="red"
        />
        <StatCard
          icon={<Star className="h-4 w-4" />}
          label="Current Streak"
          value={streak}
          accentColor="purple"
        />
      </div>

      {/* Quiz accuracy over time - large chart at the top */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your quiz accuracy each week (last 5 weeks)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyAccuracyData}>
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="percent" fill="#60a5fa" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Activity and Performance insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyActivitySparkline data={recentAnswersByDay} />
            <div className="mt-2 text-xs text-muted-foreground text-center">
              Number of questions answered each day (last 7 days)
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <Star className="h-5 w-5" /> Personal Bests & Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <span className="font-medium">Longest Streak:</span> {streak} {streak > 1 ? 'days' : 'day'}
              </li>
              <li>
                <span className="font-medium">Best Accuracy:</span>{" "}
                {performance.performance_by_topic
                  .reduce((a, b) => a.accuracy_percent > b.accuracy_percent ? a : b).accuracy_percent.toFixed(1)
                }%
              </li>
              <li>
                <span className="font-medium">Suggested Focus:</span>{" "}
                {weakestTopic ? (
                  <span className="text-orange-700 font-semibold capitalize">{weakestTopic.topic}</span>
                ) : (
                  <span className="text-green-700 font-semibold">Keep up the great work!</span>
                )}
              </li>
            </ul>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-800 text-sm">
              {
                weakestTopic
                  ? <>Tip: Practice more <span className="font-semibold capitalize">{weakestTopic.topic}</span> questions for a well-rounded performance.</>
                  : <>You have no weak spots! Try a simulated exam for a new challenge.</>
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best and Weak areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Award className="h-5 w-5" /> Your Best Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mostImprovedTopic ? (
              <BestTopicCard
                topic={mostImprovedTopic.topic}
                accuracy={mostImprovedTopic.accuracy_percent}
                answered={mostImprovedTopic.total_answered}
              />
            ) : (
              <p className="text-gray-500 text-center py-4">
                More data needed to highlight your best performing topic.
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Target className="h-5 w-5" />
              Needs Practice
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weakestTopic ? (
              <WeakTopicCard
                topic={weakestTopic.topic}
                accuracy={weakestTopic.accuracy_percent}
                answered={weakestTopic.total_answered}
              />
            ) : (
              <p className="text-gray-500 text-center py-4">
                No weak topics detected yet—keep going!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed analytics */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="topics" className="text-xs sm:text-sm">By Topics</TabsTrigger>
          <TabsTrigger value="insights" className="text-xs sm:text-sm">Insights</TabsTrigger>
          <TabsTrigger value="progress" className="text-xs sm:text-sm">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance by Topic Bar Chart */}
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
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Topic Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <TopicPerformanceList
                topics={performance.performance_by_topic}
                getPerformanceLevel={getPerformanceLevel}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
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
          {/* Progress Over Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progress Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Area
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm text-gray-600 text-center">
                Your accuracy improvement over the last 6 weeks
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  <Award className="h-5 w-5" />
                  Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {milestone.completed ? (
                          <CheckCircle className="h-5 w-5 text-white" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{milestone.title}</p>
                        <p className="text-sm text-gray-600">{milestone.date}</p>
                      </div>
                      {milestone.completed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Target className="h-5 w-5" />
                  Current Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{goal.title}</span>
                        <span className="text-sm text-gray-600">{goal.progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <p className="text-xs text-gray-500">Target: {goal.target}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 font-medium">
                    🎯 Keep practicing to reach your goals!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Streak Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Flame className="h-5 w-5" />
                Study Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flame className="h-10 w-10 text-white" />
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-2">{streak} Days</div>
                <p className="text-gray-600 mb-4">Current streak</p>
                <div className="grid grid-cols-7 gap-2 max-w-xs mx-auto">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        i < 5 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {i < 5 ? '✓' : '○'}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Last 7 days</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceAnalytics;
