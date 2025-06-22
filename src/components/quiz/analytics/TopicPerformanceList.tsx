
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, AlertCircle, Target } from "lucide-react";

export interface TopicPerformanceListProps {
  topics: {
    topic: string;
    total_answered: number;
    correct: number;
    wrong: number;
    accuracy_percent: number;
  }[];
  getPerformanceLevel: (accuracy: number) => { label: string; color: string; icon: any };
}

const TopicPerformanceList: React.FC<TopicPerformanceListProps> = ({
  topics,
  getPerformanceLevel,
}) => (
  <div className="space-y-4">
    {topics
      .sort((a, b) => b.accuracy_percent - a.accuracy_percent)
      .map((topic) => {
        const level = getPerformanceLevel(topic.accuracy_percent);
        const LevelIcon = level.icon;
        return (
          <div
            key={topic.topic}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 ${level.color} rounded-full flex items-center justify-center text-white`}
                >
                  <LevelIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold capitalize text-lg">{topic.topic}</h4>
                  <p className="text-sm text-gray-600">
                    {topic.total_answered} questions • {topic.correct} correct • {topic.wrong} wrong
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={topic.accuracy_percent >= 70 ? "default" : "destructive"}>
                  {topic.accuracy_percent.toFixed(1)}%
                </Badge>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${level.color} transition-all duration-500`}
                    style={{ width: `${topic.accuracy_percent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
  </div>
);

export default TopicPerformanceList;
