
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, Target, Loader2, TrendingUp, Award, Star, Clock } from 'lucide-react';
import { quizApi, HistoryResponse } from '@/services/quizApi';
import { useToast } from '@/hooks/use-toast';

const RecentActivities: React.FC = () => {
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await quizApi.getQuizHistory();
        setHistory(data);
      } catch (error) {
        console.error('Failed to fetch quiz history:', error);
        toast({
          title: "Error",
          description: "Failed to load quiz history. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [toast]);

  if (isLoading) {
    return (
      <Card className="bg-white shadow-lg border-0 w-full">
        <CardContent className="p-6 lg:p-8">
          <div className="text-center text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-lg font-medium">Loading recent activities...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!history || history.sessions.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg w-full">
        <CardContent className="p-6 lg:p-8">
          <div className="text-center">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
              <Trophy className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold mb-3 text-gray-800">Start Your Quiz Journey!</h3>
            <p className="text-gray-600 text-base lg:text-lg mb-4 lg:mb-6">Complete your first math quiz to see your progress here</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 lg:gap-4 text-sm text-gray-500">
              <div className="flex items-center justify-center gap-1">
                <Star className="h-4 w-4" />
                <span>Track Progress</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Award className="h-4 w-4" />
                <span>Earn Achievements</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>Improve Skills</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'bg-green-500';
    if (accuracy >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAccuracyBadgeVariant = (accuracy: number): "default" | "secondary" | "destructive" | "outline" => {
    if (accuracy >= 80) return 'default';
    if (accuracy >= 60) return 'secondary';
    return 'destructive';
  };

  const getPerformanceIcon = (accuracy: number) => {
    if (accuracy >= 80) return <Trophy className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-500" />;
    if (accuracy >= 60) return <Award className="h-4 w-4 lg:h-5 lg:w-5 text-blue-500" />;
    return <Target className="h-4 w-4 lg:h-5 lg:w-5 text-gray-500" />;
  };

  const displayedSessions = showAll ? history.sessions : history.sessions.slice(0, 5);

  return (
    <Card className="bg-white shadow-lg border-0 w-full">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Clock className="h-4 w-4 lg:h-6 lg:w-6" />
          </div>
          Recent Quiz Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 lg:p-6">
        <div className="space-y-3 lg:space-y-4">
          {displayedSessions.map((session, index) => (
            <div key={session.session_id} className="group hover:bg-gray-50 p-3 lg:p-4 rounded-lg transition-all duration-200 border border-gray-100 hover:border-blue-200 hover:shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="relative w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    {getPerformanceIcon(session.accuracy)}
                    <div className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-700">#{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-base lg:text-lg capitalize text-gray-800 truncate">{session.topic}</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs lg:text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 lg:h-4 lg:w-4" />
                        <span>{new Date(session.date).toLocaleDateString()}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3 lg:h-4 lg:w-4" />
                        <span>{session.total_questions} questions</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                  <Badge variant={getAccuracyBadgeVariant(session.accuracy)} className="text-xs font-semibold px-2 py-1">
                    {session.accuracy.toFixed(1)}%
                  </Badge>
                  <div className="w-16 lg:w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getAccuracyColor(session.accuracy)} transition-all duration-500`}
                      style={{ width: `${session.accuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {history.sessions.length > 5 && (
          <div className="mt-4 lg:mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="hover:bg-blue-50 hover:border-blue-300"
              size="sm"
            >
              {showAll ? 'Show Less' : `View All ${history.sessions.length} Activities`}
            </Button>
          </div>
        )}
        
        {displayedSessions.length === 0 && (
          <div className="text-center text-gray-500 py-6 lg:py-8">
            <Target className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-3 text-gray-300" />
            <p>No recent activities found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
