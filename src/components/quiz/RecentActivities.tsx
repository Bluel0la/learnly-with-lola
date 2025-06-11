
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, Target, Loader2 } from 'lucide-react';
import { quizApi, HistoryResponse } from '@/services/quizApi';
import { useToast } from '@/hooks/use-toast';

const RecentActivities: React.FC = () => {
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      <Card className="bg-white shadow-sm">
        <CardContent className="p-8">
          <div className="text-center text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading recent activities...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!history || history.sessions.length === 0) {
    return (
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No quiz results yet</h3>
            <p className="text-sm">Start your first math quiz to see your performance here!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getAccuracyBadgeVariant = (accuracy: number): "default" | "secondary" | "destructive" | "outline" => {
    if (accuracy >= 80) return 'default';
    if (accuracy >= 60) return 'secondary';
    return 'destructive';
  };

  const getAccuracyBadgeColor = (accuracy: number) => {
    if (accuracy >= 80) return 'bg-blue-500';
    if (accuracy >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {history.sessions.slice(0, 5).map((session) => (
          <div key={session.session_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium capitalize text-sm">{session.topic}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(session.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{session.total_questions} questions</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={getAccuracyBadgeVariant(session.accuracy)}
                className={`${getAccuracyBadgeColor(session.accuracy)} text-white text-xs px-2 py-1`}
              >
                {session.accuracy.toFixed(1)}%
              </Badge>
            </div>
          </div>
        ))}
        
        {history.sessions.length > 5 && (
          <div className="text-center text-xs text-gray-500 pt-2">
            Showing 5 most recent activities
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
