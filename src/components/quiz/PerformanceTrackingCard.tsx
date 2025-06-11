
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, Target, Award, BarChart3 } from 'lucide-react';

interface PerformanceTrackingCardProps {
  onViewAnalytics: () => void;
}

const PerformanceTrackingCard: React.FC<PerformanceTrackingCardProps> = ({ onViewAnalytics }) => {
  return (
    <Card className="bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl lg:text-2xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <BarChart3 className="h-5 w-5 lg:h-6 lg:w-6" />
          </div>
          <span className="hidden sm:inline">Performance Hub</span>
          <span className="sm:hidden">Analytics</span>
        </CardTitle>
        <p className="text-emerald-100 text-sm lg:text-lg">Track your quiz journey & achievements</p>
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6">
        <div className="grid grid-cols-1 gap-3 lg:gap-4">
          <div className="bg-white/10 rounded-lg p-3 lg:p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-emerald-200" />
                <span className="font-medium text-sm lg:text-base">Progress Tracking</span>
              </div>
            </div>
            <p className="text-xs lg:text-sm text-emerald-100">Monitor improvement over time</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3 lg:p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 lg:h-5 lg:w-5 text-blue-200" />
                <span className="font-medium text-sm lg:text-base">Detailed Analytics</span>
              </div>
            </div>
            <p className="text-xs lg:text-sm text-blue-100">Performance insights by topic</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3 lg:p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 lg:h-5 lg:w-5 text-purple-200" />
                <span className="font-medium text-sm lg:text-base">Quiz History</span>
              </div>
            </div>
            <p className="text-xs lg:text-sm text-purple-100">Review past results & growth</p>
          </div>
        </div>
        
        <Button 
          variant="outline"
          className="w-full border-2 border-white/30 text-white hover:bg-white hover:text-emerald-600 font-semibold text-sm lg:text-lg py-2 lg:py-3 backdrop-blur-sm bg-white/10 transition-all duration-300"
          onClick={onViewAnalytics}
        >
          <Trophy className="h-4 w-4 mr-2" />
          Explore Analytics
        </Button>
      </CardContent>
    </Card>
  );
};

export default PerformanceTrackingCard;
