
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { quizApi, MathTopic, StartQuizRequest } from '@/services/quizApi';

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
      <Card>
        <CardContent className="flex justify-center items-center h-64">
          <div className="text-lg">Loading topics...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Start Math Quiz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Topic</label>
          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a math topic" />
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
          <label className="text-sm font-medium">Number of Questions</label>
          <Select value={numQuestions.toString()} onValueChange={(value) => setNumQuestions(Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 Questions</SelectItem>
              <SelectItem value="10">10 Questions</SelectItem>
              <SelectItem value="15">15 Questions</SelectItem>
              <SelectItem value="20">20 Questions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="w-full" 
          onClick={handleStartQuiz}
          disabled={!selectedTopic || isLoading}
        >
          {isLoading ? 'Starting Quiz...' : 'Start Quiz'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MathQuizSelector;
