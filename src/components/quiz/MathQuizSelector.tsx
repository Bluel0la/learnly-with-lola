
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { quizApi, MathTopic, StartQuizRequest } from '@/services/quizApi';
import { Trophy, Target, Clock, Brain } from 'lucide-react';
import TopicSelector from './TopicSelector';

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

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopic(topicId);
  };

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
    <div className="w-full max-w-full overflow-hidden space-y-8">
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

      {/* Topic Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Choose Your Topic</CardTitle>
          <p className="text-gray-600">Select a topic to focus your practice session</p>
        </CardHeader>
        <CardContent className="max-w-full overflow-hidden">
          <TopicSelector
            topics={topics}
            selectedTopics={selectedTopic ? [selectedTopic] : []}
            onTopicToggle={handleTopicToggle}
            multiSelect={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MathQuizSelector;
