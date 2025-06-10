
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MathTopic, SimulatedExamRequest, quizApi } from '@/services/quizApi';
import { Trophy, Users, Clock, Zap } from 'lucide-react';
import TopicSelector from './TopicSelector';

interface SimulatedExamSelectorProps {
  topics: MathTopic[];
  onExamStart: (sessionId: string, topics: string[], totalQuestions: number) => void;
}

const SimulatedExamSelector: React.FC<SimulatedExamSelectorProps> = ({ onExamStart }) => {
  const [topics, setTopics] = useState<MathTopic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [numQuestions, setNumQuestions] = useState<number>(10);
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
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleStartExam = async () => {
    if (selectedTopics.length === 0) {
      toast({
        title: "Topics Required",
        description: "Please select at least one topic for the exam.",
        variant: "destructive"
      });
      return;
    }

    if (numQuestions < selectedTopics.length * 2) {
      toast({
        title: "Insufficient Questions",
        description: `For ${selectedTopics.length} topics, you need at least ${selectedTopics.length * 2} questions.`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const request: SimulatedExamRequest = {
        topics: selectedTopics,
        num_questions: numQuestions
      };

      const response = await quizApi.startSimulatedExam(request);
      
      toast({
        title: "Simulated Exam Started!",
        description: `Mixed quiz with ${selectedTopics.length} topics and ${response.total_questions} questions.`
      });

      onExamStart(response.session_id, selectedTopics, response.total_questions);
    } catch (error) {
      console.error('Failed to start simulated exam:', error);
      toast({
        title: "Error",
        description: "Failed to start simulated exam. Please try again.",
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

  const selectedTopicNames = selectedTopics.map(id => 
    topics.find(t => t.topic_id === id)?.name
  ).filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white border-0 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Trophy className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Simulated Exam Mode</CardTitle>
          <p className="text-purple-100 text-lg">Challenge yourself across multiple topics!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <Users className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm">Multi-Topic</p>
              <p className="text-xs opacity-75">Mixed challenges</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <Clock className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm">Timed Mode</p>
              <p className="text-xs opacity-75">Beat the clock</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <Zap className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm">Adaptive</p>
              <p className="text-xs opacity-75">Adjusts to you</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topic Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Select Topics for Your Exam</CardTitle>
          <p className="text-gray-600">Choose multiple topics to create a comprehensive exam experience</p>
        </CardHeader>
        <CardContent>
          <TopicSelector
            topics={topics}
            selectedTopics={selectedTopics}
            onTopicToggle={handleTopicToggle}
            multiSelect={true}
          />
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Exam Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Questions</label>
                <Select value={numQuestions.toString()} onValueChange={(value) => setNumQuestions(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                    <SelectItem value="25">25 Questions</SelectItem>
                    <SelectItem value="30">30 Questions</SelectItem>
                  </SelectContent>
                </Select>
                {selectedTopics.length > 0 && (
                  <p className="text-xs text-gray-500">
                    Minimum required: {selectedTopics.length * 2} questions for {selectedTopics.length} topics
                  </p>
                )}
              </div>

              {selectedTopics.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Selected Topics ({selectedTopics.length})</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopicNames.map((name, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border">
                <h3 className="font-semibold mb-2 text-blue-800">Exam Preview</h3>
                <div className="space-y-2 text-sm text-blue-600">
                  <div className="flex justify-between">
                    <span>Topics:</span>
                    <span className="font-medium">{selectedTopics.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span className="font-medium">{numQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Time:</span>
                    <span className="font-medium">~{Math.ceil(numQuestions * 1.5)} min</span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold text-lg shadow-lg" 
                onClick={handleStartExam}
                disabled={selectedTopics.length === 0 || isLoading}
              >
                {isLoading ? 'Starting Exam...' : 'Start Simulated Exam'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulatedExamSelector;
