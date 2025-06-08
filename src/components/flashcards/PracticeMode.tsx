
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { flashcardApi, FlashcardCard } from '@/services/flashcardApi';
import { ChevronLeft, ChevronRight, Bookmark, Eye, EyeOff } from 'lucide-react';

interface PracticeModeProps {
  deckId: string;
  onComplete?: () => void;
}

const PracticeMode: React.FC<PracticeModeProps> = ({ deckId, onComplete }) => {
  const [cards, setCards] = useState<FlashcardCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadCards = async () => {
      try {
        setIsLoading(true);
        const deckCards = await flashcardApi.getDeckCards(deckId);
        setCards(deckCards);
      } catch (error) {
        console.error('Failed to load cards:', error);
        toast({
          title: "Error",
          description: "Failed to load cards for practice",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCards();
  }, [deckId, toast]);

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  const toggleBookmark = async () => {
    const currentCard = cards[currentCardIndex];
    try {
      await flashcardApi.toggleBookmark(currentCard.card_id);
      setCards(prev => prev.map(card => 
        card.card_id === currentCard.card_id 
          ? { ...card, is_bookmarked: !card.is_bookmarked }
          : card
      ));
      toast({
        title: currentCard.is_bookmarked ? "Bookmark removed" : "Bookmark added",
        description: "Card bookmark status updated"
      });
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading practice cards...</div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2">No Cards Available</h3>
        <p className="text-gray-600 mb-4">This deck doesn't have any cards to practice with.</p>
        <Button onClick={onComplete}>Back to Deck</Button>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Practice Mode</h2>
        <Button onClick={onComplete} variant="outline">
          Exit Practice
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Card {currentCardIndex + 1} of {cards.length}
      </div>

      <Card className="min-h-[400px]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Question</CardTitle>
            <Button
              onClick={toggleBookmark}
              variant="ghost"
              size="sm"
              className={currentCard.is_bookmarked ? "text-yellow-500" : ""}
            >
              <Bookmark className={`h-4 w-4 ${currentCard.is_bookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg leading-relaxed">
            {currentCard.question}
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Answer</h3>
              <Button
                onClick={() => setShowAnswer(!showAnswer)}
                variant="outline"
                size="sm"
              >
                {showAnswer ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showAnswer ? 'Hide' : 'Show'} Answer
              </Button>
            </div>
            
            {showAnswer && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="leading-relaxed">{currentCard.answer}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrevious}
          disabled={currentCardIndex === 0}
          variant="outline"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          Progress: {Math.round(((currentCardIndex + 1) / cards.length) * 100)}%
        </div>

        <Button
          onClick={handleNext}
          disabled={currentCardIndex === cards.length - 1}
          variant="outline"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default PracticeMode;
