
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Loader2, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { flashcardApi } from '@/services/flashcardApi';

interface PracticeAdaptiveSuggestionProps {
  deckId: string;
  consecutiveWrong: number;
  currentCardId?: string;
  onDrillsGenerated?: () => void;
}

const PracticeAdaptiveSuggestion: React.FC<PracticeAdaptiveSuggestionProps> = ({
  deckId,
  consecutiveWrong,
  currentCardId,
  onDrillsGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateAdaptiveDrills = async () => {
    setIsGenerating(true);
    try {
      const result = await flashcardApi.generateAdaptiveDrills(deckId, 'wrong', 5);
      
      toast({
        title: "Practice drills generated! 🎯",
        description: `Generated ${result.cards?.length || 0} new cards to help you master this topic.`
      });
      
      if (onDrillsGenerated) {
        onDrillsGenerated();
      }
    } catch (error) {
      console.error('Error generating practice drills:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate practice drills",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Only show if user has 3+ consecutive wrong answers
  if (consecutiveWrong < 3) {
    return null;
  }

  return (
    <Card className="mt-4 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <TrendingDown className="h-5 w-5" />
          Struggling with this topic?
        </CardTitle>
        <CardDescription>
          You've gotten {consecutiveWrong} questions wrong in a row. Let's generate some targeted practice cards to help you master this concept.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleGenerateAdaptiveDrills}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
          Generate Practice Cards for This Topic
        </Button>
      </CardContent>
    </Card>
  );
};

export default PracticeAdaptiveSuggestion;
