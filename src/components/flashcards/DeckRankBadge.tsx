
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Award, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeckRankBadgeProps {
  rank: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const DeckRankBadge: React.FC<DeckRankBadgeProps> = ({ 
  rank, 
  size = 'md', 
  showIcon = true, 
  className 
}) => {
  const getRankConfig = (rank: string) => {
    const configs = {
      'S+': {
        color: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-400',
        icon: Trophy,
        label: 'S+ Rank',
        glow: 'shadow-lg shadow-pink-500/25'
      },
      'S': {
        color: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-purple-400',
        icon: Award,
        label: 'S Rank',
        glow: 'shadow-lg shadow-purple-500/25'
      },
      'A': {
        color: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400',
        icon: Medal,
        label: 'A Rank',
        glow: 'shadow-lg shadow-green-500/25'
      },
      'B': {
        color: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-blue-400',
        icon: Star,
        label: 'B Rank',
        glow: 'shadow-md shadow-blue-500/20'
      },
      'C': {
        color: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-400',
        icon: Star,
        label: 'C Rank',
        glow: 'shadow-md shadow-yellow-500/20'
      },
      'D': {
        color: 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-400',
        icon: Star,
        label: 'D Rank',
        glow: 'shadow-sm shadow-orange-500/15'
      },
      'E': {
        color: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-gray-400',
        icon: Star,
        label: 'E Rank',
        glow: 'shadow-sm shadow-gray-500/15'
      }
    };
    
    return configs[rank as keyof typeof configs] || configs['E'];
  };

  const getSizeClasses = (size: string) => {
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm font-semibold',
      lg: 'px-4 py-2 text-base font-bold'
    };
    return sizes[size as keyof typeof sizes] || sizes.md;
  };

  const config = getRankConfig(rank);
  const IconComponent = config.icon;
  const sizeClasses = getSizeClasses(size);

  if (!rank || rank === 'UNRANKED') {
    return null;
  }

  return (
    <Badge
      className={cn(
        'inline-flex items-center gap-1.5 border-2 transition-all duration-300 hover:scale-105',
        config.color,
        config.glow,
        sizeClasses,
        className
      )}
      title={`${config.label} - Excellent performance!`}
    >
      {showIcon && <IconComponent className={cn(
        size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
      )} />}
      <span className="font-bold tracking-wide">{rank}</span>
      {(rank === 'S+' || rank === 'S') && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
      )}
    </Badge>
  );
};

export default DeckRankBadge;
