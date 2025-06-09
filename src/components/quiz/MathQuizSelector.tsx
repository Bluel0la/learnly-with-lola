
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { quizApi, MathTopic, StartQuizRequest } from '@/services/quizApi';
import { Trophy, Target, Clock, Brain } from 'lucide-react';

interface MathQuizSelectorProps {
  onQuizStart: (sessionId: string, topic: string, totalQuestions: number) => void;
}

const MathQuizSelector: React.FC<MathQuizSelectorProps> = ({ onQuizStart }) => {
  const [topics, setTopics] = useState<MathTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const availableTopics = await quizApi.getAvailableTopics();
        setTopics(availableTopics);
      } catch (error) {
        console.error('Failed to fetch topics:', error);
        toast({
          title: "Error",
          description: "Failed to load available topics. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingTopics(false);
      }
    };

    fetchTopics();
  }, [toast]);

  const handleStartQuiz = async () => {
    if (!selectedTopic) {
      toast({
        title: "Topic Required",
        description: "Please select a topic to start the quiz.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const request: StartQuizRequest = {
        topic: selectedTopic,
        num_questions: numQuestions
      };

      const response = await quizApi.startQuizSession(request);
      
      toast({
        title: "Quiz Started!",
        description: `${response.message}. Historical accuracy: ${response.historical_accuracy}%`
      });

      onQuizStart(response.session_id, response.topic, response.total_questions);
    } catch (error) {
      console.error('Failed to start quiz:', error);
      toast({
        title: "Error",
        description: "Failed to start quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingTopics) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading topics...</div>
      </div>
    );
  }

  const selectedTopicData = topics.find(t => t.topic_id === selectedTopic);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Main Quiz Card */}
      <Card className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white border-0 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Math Quiz Challenge</CardTitle>
          <p className="text-blue-100 text-lg">Test your skills and level up!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-100">Choose Your Topic</label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white placeholder:text-blue-200">
                    <SelectValue placeholder="Select a math topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic.topic_id} value={topic.topic_id}>
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-100">Number of Questions</label>
                <Select value={numQuestions.toString()} onValueChange={(value) => setNumQuestions(Number(value))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Questions (Quick)</SelectItem>
                    <SelectItem value="10">10 Questions (Standard)</SelectItem>
                    <SelectItem value="15">15 Questions (Extended)</SelectItem>
                    <SelectItem value="20">20 Questions (Challenge)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {selectedTopicData && (
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <h3 className="font-semibold text-lg mb-2">{selectedTopicData.name}</h3>
                  <div className="space-y-2 text-sm text-blue-100">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span>Adaptive difficulty</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>~{Math.ceil(numQuestions * 1.5)} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      <span>Earn points & badges</span>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                className="w-full h-12 bg-white text-purple-600 hover:bg-blue-50 font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105" 
                onClick={handleStartQuiz}
                disabled={!selectedTopic || isLoading}
              >
                {isLoading ? 'Starting Quiz...' : 'Start Quiz Challenge'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topic Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topics.slice(0, 6).map((topic, index) => {
          const colors = [
            'from-red-400 to-red-600',
            'from-blue-400 to-blue-600', 
            'from-green-400 to-green-600',
            'from-purple-400 to-purple-600',
            'from-yellow-400 to-yellow-600',
            'from-pink-400 to-pink-600'
          ];
          
          return (
            <Card 
              key={topic.topic_id}
              className={`bg-gradient-to-br ${colors[index]} text-white border-0 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              onClick={() => setSelectedTopic(topic.topic_id)}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                  <span className="text-2xl font-bold">{topic.name.charAt(0)}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{topic.name}</h3>
                <p className="text-sm opacity-90">Practice & improve</p>
                {selectedTopic === topic.topic_id && (
                  <div className="mt-3 w-full h-1 bg-white/30 rounded">
                    <div className="h-full bg-white rounded animate-pulse"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MathQuizSelector;
