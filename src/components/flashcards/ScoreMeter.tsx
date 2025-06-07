
import React from 'react';
import { Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScoreMeterProps {
  currentStreak: number;
  currentRank: string;
  multiplier: number;
  totalScore: number;
  showRankUp?: boolean;
}

const ScoreMeter: React.FC<ScoreMeterProps> = ({ 
  currentStreak, 
  currentRank, 
  multiplier, 
  totalScore,
  showRankUp = false 
}) => {
  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'E': return 'text-gray-500 bg-gray-100';
      case 'D': return 'text-orange-600 bg-orange-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'A': return 'text-green-600 bg-green-100';
      case 'S': return 'text-purple-600 bg-purple-100';
      case 'S+': return 'text-pink-600 bg-gradient-to-r from-pink-100 to-purple-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getStreakForNextRank = (rank: string) => {
    const streakRequirements = { E: 0, D: 2, C: 4, B: 6, A: 8, S: 10, 'S+': 12 };
    const ranks = ['E', 'D', 'C', 'B', 'A', 'S', 'S+'];
    const currentIndex = ranks.indexOf(rank);
    return currentIndex < ranks.length - 1 ? streakRequirements[ranks[currentIndex + 1]] : 12;
  };

  const nextRankStreak = getStreakForNextRank(currentRank);
  const progress = Math.min((currentStreak / nextRankStreak) * 100, 100);

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border">
      {showRankUp && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg shadow-lg border-2 border-white"
        >
          <div className="flex items-center gap-2 text-lg font-bold">
            <Star className="h-6 w-6" />
            Rank Up! {currentRank}
          </div>
        </motion.div>
      )}
      
      <div className="flex justify-between items-center mb-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">{totalScore.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Total Score</div>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${getRankColor(currentRank)}`}>
            {currentRank}
          </div>
          <div className="text-xs text-muted-foreground">Rank</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 flex items-center gap-1">
            <Star className="h-5 w-5" />
            {currentStreak}
          </div>
          <div className="text-xs text-muted-foreground">Streak</div>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold flex items-center gap-1 ${multiplier > 1 ? 'text-purple-600' : 'text-gray-500'}`}>
            <Zap className="h-5 w-5" />
            {multiplier}x
          </div>
          <div className="text-xs text-muted-foreground">Multiplier</div>
        </div>
      </div>
      
      {currentRank !== 'S+' && (
        <div className="w-full">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress to next rank</span>
            <span>{currentStreak}/{nextRankStreak}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreMeter;
