
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Check, Eye } from 'lucide-react';
import { MathTopic } from '@/services/quizApi';

interface TopicSelectorProps {
  topics: MathTopic[];
  selectedTopics: string[];
  onTopicToggle: (topicId: string) => void;
  multiSelect?: boolean;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ 
  topics, 
  selectedTopics, 
  onTopicToggle, 
  multiSelect = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedTopics = showAll ? filteredTopics : filteredTopics.slice(0, 8);

  const colors = [
    'from-red-400 to-red-600',
    'from-blue-400 to-blue-600', 
    'from-green-400 to-green-600',
    'from-purple-400 to-purple-600',
    'from-yellow-400 to-yellow-600',
    'from-pink-400 to-pink-600',
    'from-indigo-400 to-indigo-600',
    'from-teal-400 to-teal-600',
    'from-orange-400 to-orange-600',
    'from-cyan-400 to-cyan-600'
  ];

  return (
    <div className="space-y-4 w-full">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
        />
      </div>

      {/* Topics Grid */}
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedTopics.map((topic, index) => {
            const isSelected = selectedTopics.includes(topic.topic_id);
            const colorClass = colors[index % colors.length];
            
            return (
              <Card 
                key={topic.topic_id}
                className={`w-full bg-gradient-to-br ${colorClass} text-white border-0 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl relative ${
                  isSelected ? 'ring-4 ring-white/50' : ''
                }`}
                onClick={() => onTopicToggle(topic.topic_id)}
              >
                <CardContent className="p-6 text-center">
                  {isSelected && multiSelect && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                    <span className="text-2xl font-bold">{topic.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{topic.name}</h3>
                  <p className="text-sm opacity-90">Practice & improve</p>
                  {isSelected && (
                    <div className="mt-3 w-full h-1 bg-white/30 rounded">
                      <div className="h-full bg-white rounded animate-pulse"></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View More Button */}
        {filteredTopics.length > 8 && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {showAll ? 'Show Less' : `View More (${filteredTopics.length - 8} more topics)`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicSelector;
