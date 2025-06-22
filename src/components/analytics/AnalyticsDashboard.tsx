
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, TrendingUp, Book, Award } from "lucide-react";
// For future chart use
// import { ChartContainer } from "@/components/ui/chart";

const mockStats = {
  weekly: {
    correct: [5, 8, 7, 10, 6, 12, 9],
    wrong: [2, 1, 1, 1, 3, 2, 1],
    dates: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  completion: 74,
  avgAccuracy: 83,
  mostImproved: "Statistics",
  bestStreak: 15,
  decks: 5,
  quizzes: 7,
};

const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-blue-600" /> Analytics Dashboard
      </h1>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Trends</TabsTrigger>
          <TabsTrigger value="decks">Decks Progress</TabsTrigger>
          <TabsTrigger value="quizzes">Quiz History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Completion Rate</CardTitle>
                <CardDescription>How much you've studied so far.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockStats.completion}%</div>
                <div className="text-muted-foreground text-sm mt-2">All decks</div>
              </CardContent>
            </Card>
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Avg. Accuracy</CardTitle>
                <CardDescription>Correct answers %</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{mockStats.avgAccuracy}%</span>
                  <TrendingUp className="h-5 w-5 text-green-500"/>
                </div>
                <div className="text-muted-foreground text-sm mt-2">All quizzes</div>
              </CardContent>
            </Card>
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Most Improved Topic</CardTitle>
                <CardDescription>Biggest gain last week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Book className="h-6 w-6 text-purple-500"/>
                  <span className="text-xl font-semibold">{mockStats.mostImproved}</span>
                </div>
                <div className="text-muted-foreground text-xs mt-2">+12% improvement</div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Best Streak</CardTitle>
                <CardDescription>Your best run</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.bestStreak}</div>
                <span className="text-xs text-muted-foreground">consecutive correct answers</span>
              </CardContent>
            </Card>
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Total Decks</CardTitle>
                <CardDescription>Study collections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-blue-500"/>
                  <span className="text-2xl font-bold">{mockStats.decks}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Weekly Trends Tab */}
        <TabsContent value="weekly">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Weekly Practice</CardTitle>
              <CardDescription>Correct vs. Wrong answers per day (mock data)</CardDescription>
            </CardHeader>
            <CardContent>
              {/* ToDo: Add recharts here */}
              <div className="h-[200px] w-full flex items-center justify-center text-muted-foreground">
                <span>Chart coming soon...</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Decks Tab */}
        <TabsContent value="decks">
          <Card>
            <CardHeader>
              <CardTitle>Decks Progress</CardTitle>
              <CardDescription>See breakdown by deck (coming soon)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground py-8 text-center">Feature planned!</div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes">
          <Card>
            <CardHeader>
              <CardTitle>Quiz History</CardTitle>
              <CardDescription>Review your past quizzes (coming soon)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground py-8 text-center">Feature planned!</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
