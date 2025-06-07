
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, BookMarked, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { flashcardApi } from '@/services/api';

interface AdaptiveDrillSuggestionProps {
  deckId: string;
  wrongAnswers: number;
  totalQuestions: number;
  onDrillsGenerated?: () => void;
}

const AdaptiveDrillSuggestion: React.FC<AdaptiveDrillSuggestionProps> = ({
  deckId,
  wrongAnswers,
  totalQuestions,
  onDrillsGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateAdaptiveDrills = async (mode: 'wrong' | 'bookmark') => {
    setIsGenerating(true);
    try {
      const result = await flashcardApi.generateAdaptiveDrills(deckId, mode);
      
      toast({
        title: "Adaptive drills generated!",
        description: `Generated ${result.cards?.length || 0} new cards to help you improve.`
      });
      
      if (onDrillsGenerated) {
        onDrillsGenerated();
      }
    } catch (error) {
      console.error('Error generating adaptive drills:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate adaptive drills",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const accuracy = Math.round(((totalQuestions - wrongAnswers) / totalQuestions) * 100);
  const shouldShowWrongDrills = wrongAnswers > 0;

  if (!shouldShowWrongDrills) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Improve Your Learning
        </CardTitle>
        <CardDescription>
          You got {wrongAnswers} questions wrong. Generate additional practice cards to master these concepts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Button
            onClick={() => handleGenerateAdaptiveDrills('wrong')}
            disabled={isGenerating}
            className="flex items-center gap-2"
            variant="default"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
            Generate Practice Cards for Missed Questions
          </Button>
          
          <Button
            onClick={() => handleGenerateAdaptiveDrills('bookmark')}
            disabled={isGenerating}
            className="flex items-center gap-2"
            variant="outline"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookMarked className="h-4 w-4" />}
            Generate Cards for Bookmarked Topics
          </Button>
        </div>
        
        <p className="text-sm text-gray-600">
          Current accuracy: {accuracy}% • Focus on areas where you struggled to improve faster
        </p>
      </CardContent>
    </Card>
  );
};

export default AdaptiveDrillSuggestion;
