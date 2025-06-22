
import React from "react";
import { AlertCircle } from "lucide-react";

interface WeakTopicCardProps {
  topic: string;
  accuracy: number;
  answered: number;
}

const WeakTopicCard: React.FC<WeakTopicCardProps> = ({ topic, accuracy, answered }) => (
  <div className="flex flex-col items-start gap-3">
    <span className="text-lg font-bold capitalize">{topic}</span>
    <span className="text-red-600 text-base flex items-center gap-2">
      <AlertCircle className="h-4 w-4" />
      {accuracy.toFixed(1)}% accuracy
    </span>
    <span className="text-xs text-muted-foreground">{answered} questions answered</span>
    <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700 font-medium">
      💡 Tip: Practice this topic to boost your scores!
    </div>
  </div>
);

export default WeakTopicCard;
