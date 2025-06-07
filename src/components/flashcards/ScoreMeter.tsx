
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Zap } from 'lucide-react';

interface ScoreMeterProps {
  streak: number;
  rank: string;
  multiplier: number;
  totalQuestions: number;
}

const ScoreMeter: React.FC<ScoreMeterProps> = ({ streak, rank, multiplier, totalQuestions }) => {
  // Calculate questions needed for next rank based on deck size
  const getQuestionsForNextRank = (currentRank: string): number => {
    const rankThresholds = {
      'E': Math.max(2, Math.floor(totalQuestions * 0.15)),
      'D': Math.max(3, Math.floor(totalQuestions * 0.25)),
      'C': Math.max(4, Math.floor(totalQuestions * 0.35)),
      'B': Math.max(5, Math.floor(totalQuestions * 0.45)),
      'A': Math.max(6, Math.floor(totalQuestions * 0.60)),
      'S': Math.max(7, Math.floor(totalQuestions * 0.75)),
      'S+': Math.max(8, Math.floor(totalQuestions * 0.90))
    };

    const ranks = ['E', 'D', 'C', 'B', 'A', 'S', 'S+'];
    const currentIndex = ranks.indexOf(currentRank);
    
    if (currentIndex === -1 || currentIndex === ranks.length - 1) return 0;
    
    const nextRank = ranks[currentIndex + 1];
    return rankThresholds[nextRank as keyof typeof rankThresholds];
  };

  const getRankColor = (rank: string): string => {
    const colors = {
      'E': 'text-gray-500',
      'D': 'text-orange-500',
      'C': 'text-yellow-500',
      'B': 'text-blue-500',
      'A': 'text-green-500',
      'S': 'text-purple-500',
      'S+': 'text-pink-500'
    };
    return colors[rank as keyof typeof colors] || 'text-gray-500';
  };

  const getMultiplierColor = (multiplier: number): string => {
    if (multiplier >= 5) return 'text-pink-500';
    if (multiplier >= 4) return 'text-purple-500';
    if (multiplier >= 3) return 'text-blue-500';
    if (multiplier >= 2) return 'text-green-500';
    return 'text-gray-500';
  };

  const questionsForNext = getQuestionsForNextRank(rank);
  const isMaxRank = rank === 'S+';

  return (
    <Card className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Trophy className={`h-6 w-6 ${getRankColor(rank)}`} />
              <div>
                <div className={`text-2xl font-bold ${getRankColor(rank)} transition-colors duration-300`}>
                  {rank}
                </div>
                <div className="text-xs text-gray-600">
                  {isMaxRank ? 'MAX RANK!' : `${questionsForNext - streak} more for next rank`}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Zap className={`h-5 w-5 ${getMultiplierColor(multiplier)}`} />
              <div>
                <div className={`text-lg font-bold ${getMultiplierColor(multiplier)} transition-colors duration-300`}>
                  {multiplier}x
                </div>
                <div className="text-xs text-gray-600">Multiplier</div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-semibold text-blue-600">
              {streak}
            </div>
            <div className="text-xs text-gray-600">Streak</div>
          </div>
        </div>
        
        {!isMaxRank && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min((streak / questionsForNext) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScoreMeter;
