
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, Target, Award } from 'lucide-react';

interface PerformanceTrackingCardProps {
  onViewAnalytics: () => void;
}

const PerformanceTrackingCard: React.FC<PerformanceTrackingCardProps> = ({ onViewAnalytics }) => {
  return (
    <Card className="bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 max-w-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Trophy className="h-6 w-6" />
          </div>
          Performance Hub
        </CardTitle>
        <p className="text-emerald-100 text-lg">Track your quiz journey & achievements</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-200" />
                <span className="font-medium">Progress Tracking</span>
              </div>
            </div>
            <p className="text-sm text-emerald-100">Monitor improvement over time</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-200" />
                <span className="font-medium">Detailed Analytics</span>
              </div>
            </div>
            <p className="text-sm text-blue-100">Performance insights by topic</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-200" />
                <span className="font-medium">Quiz History</span>
              </div>
            </div>
            <p className="text-sm text-purple-100">Review past results & growth</p>
          </div>
        </div>
        
        <Button 
          variant="outline"
          className="w-full border-2 border-white/30 text-white hover:bg-white hover:text-emerald-600 font-semibold text-lg py-3 backdrop-blur-sm bg-white/10 transition-all duration-300"
          onClick={onViewAnalytics}
        >
          Explore Analytics
        </Button>
      </CardContent>
    </Card>
  );
};

export default PerformanceTrackingCard;
