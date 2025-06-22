
import React from "react";
import { Award, TrendingUp } from "lucide-react";

interface BestTopicCardProps {
  topic: string;
  accuracy: number;
  answered: number;
}

const BestTopicCard: React.FC<BestTopicCardProps> = ({ topic, accuracy, answered }) => (
  <div className="flex flex-col items-start gap-3">
    <span className="text-lg font-bold capitalize">{topic}</span>
    <span className="text-green-600 text-base flex items-center gap-2">
      <TrendingUp className="h-4 w-4" />
      {accuracy.toFixed(1)}% accuracy
    </span>
    <span className="text-xs text-muted-foreground">{answered} questions answered</span>
    <div className="mt-2 p-2 rounded bg-green-50 text-sm text-green-800 font-medium flex items-center gap-2">
      <Award className="w-4 h-4" /> Keep it up!
    </div>
  </div>
);

export default BestTopicCard;
