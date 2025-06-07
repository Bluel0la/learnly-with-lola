
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const QuizzesPage = () => {
  const { toast } = useToast();

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-serif font-bold mb-6">Quizzes</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-serif font-semibold mb-4">Available Quizzes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuizCard 
            title="Calculus Fundamentals" 
            questions={10} 
            difficulty="Medium"
            source="Generated from chat"
            status="ready"
          />
          <QuizCard 
            title="Physics Laws" 
            questions={15} 
            difficulty="Hard"
            source="Generated from uploads"
            status="ready"
          />
          <QuizCard 
            title="Chemistry Elements" 
            questions={8} 
            difficulty="Easy"
            source="Generated from flashcards"
            status="ready"
          />
          
          <Card className="border-dashed border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-center h-full p-6">
              <Button 
                variant="ghost" 
                className="text-gray-500 hover:text-primary"
                onClick={() => toast({ title: "Create new quiz" })}
              >
                + Generate New Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-serif font-semibold mb-4">Recent Results</h2>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              No quiz results yet. Take a quiz to see your performance!
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-xl font-serif font-semibold mb-4">Performance Insights</h2>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              Complete more quizzes to generate personalized insights and climb the ranks!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const QuizCard = ({ 
  title, 
  questions, 
  difficulty,
  source,
  status
}: { 
  title: string; 
  questions: number; 
  difficulty: string;
  source: string;
  status: 'ready' | 'generating'
}) => {
  const { toast } = useToast();
  
  const handleStart = () => {
    toast({
      title: `Starting quiz: ${title}`,
      description: "Ranking system active - climb from E to S+!"
    });
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-serif">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Questions:</span>
            <span className="font-medium">{questions}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Difficulty:</span>
            <span className="font-medium">{difficulty}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Source:</span>
            <span className="font-medium">{source}</span>
          </div>
        </div>
        
        <Button 
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleStart}
          disabled={status !== 'ready'}
        >
          {status === 'ready' ? 'Start Quiz' : 'Generating...'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuizzesPage;
