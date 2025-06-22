
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Bookmark, 
  RotateCcw, 
  Eye, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  SkipForward,
  SkipBack
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PracticeCard, flashcardApi } from '@/services/flashcardApi';

interface EnhancedFlashcardPracticeProps {
  deckId: string;
  onComplete?: () => void;
}

const EnhancedFlashcardPractice: React.FC<EnhancedFlashcardPracticeProps> = ({ deckId, onComplete }) => {
  const { toast } = useToast();
  const [cards, setCards] = useState<PracticeCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [cardStats, setCardStats] = useState<any>(null);
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0, total: 0 });

  const currentCard = cards[currentIndex];

  const loadPracticeCards = async () => {
    try {
      setIsLoading(true);
      const practiceCards = await flashcardApi.getSmartPracticeCards(deckId, 20);
      if (practiceCards.length === 0) {
        // Fallback to regular practice if no smart cards
        const singleCard = await flashcardApi.getPracticeCard(deckId);
        setCards([singleCard]);
      } else {
        setCards(practiceCards);
      }
      setCurrentIndex(0);
      setShowAnswer(false);
      setCardStats(null);
    } catch (error) {
      console.error('Error loading practice cards:', error);
      toast({
        title: "Error",
        description: "Failed to load practice cards",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevealAnswer = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setShowAnswer(true);
      setIsFlipping(false);
    }, 400);
  };

  const handleResponse = async (isCorrect: boolean) => {
    if (!currentCard) return;
    
    try {
      const response = await flashcardApi.submitResponse(currentCard.card_id, isCorrect);
      setCardStats(response);
      
      // Update session stats
      setSessionStats(prev => ({
        ...prev,
        correct: prev.correct + (isCorrect ? 1 : 0),
        wrong: prev.wrong + (isCorrect ? 0 : 1),
        total: prev.total + 1
      }));
      
      toast({
        title: isCorrect ? "Correct! 🎉" : "Keep practicing! 💪",
        description: isCorrect ? "Great job!" : "You'll get it next time"
      });
      
      // Auto-advance after a brief delay
      setTimeout(() => {
        handleNext();
      }, 1500);
    } catch (error) {
      console.error('Error submitting response:', error);
      toast({
        title: "Error",
        description: "Failed to submit response",
        variant: "destructive"
      });
    }
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % cards.length;
    setCurrentIndex(nextIndex);
    setShowAnswer(false);
    setCardStats(null);
    setIsFlipping(false);
  };

  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setShowAnswer(false);
    setCardStats(null);
    setIsFlipping(false);
  };

  const handleBookmark = async () => {
    if (!currentCard) return;
    
    try {
      if (isBookmarked) {
        await flashcardApi.unbookmarkCard(currentCard.card_id);
        toast({ title: "Bookmark removed" });
      } else {
        await flashcardApi.bookmarkCard(currentCard.card_id);
        toast({ title: "Card bookmarked ⭐" });
      }
      
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive"
      });
    }
  };

  const handleReset = async () => {
    if (!currentCard) return;
    
    try {
      await flashcardApi.resetCard(currentCard.card_id);
      toast({ title: "Card progress reset 🔄" });
    } catch (error) {
      console.error('Error resetting card:', error);
      toast({
        title: "Error",
        description: "Failed to reset card",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadPracticeCards();
  }, [deckId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 border-2 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <Card className="animate-fade-in max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No cards available</h3>
          <p className="text-muted-foreground mb-4">Add some cards to start practicing!</p>
          <Button onClick={onComplete} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Deck
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
      {/* Session Stats */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm">
            Card {currentIndex + 1} of {cards.length}
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Session: {sessionStats.correct}✅ {sessionStats.wrong}❌
          </Badge>
        </div>
        <Button 
          onClick={loadPracticeCards} 
          variant="outline" 
          size="sm"
          className="text-sm"
        >
          🔄 Refresh Cards
        </Button>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Card className={`transition-all duration-500 ${isFlipping ? 'animate-card-flip' : ''} hover:shadow-lg`}>
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Practice Card
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              className={`transition-colors ${isBookmarked ? "text-yellow-500" : ""} hover:scale-110`}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleReset}
              className="hover:scale-110 transition-transform"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="min-h-[200px]">
            <h3 className="font-semibold mb-4 text-primary text-lg">Question:</h3>
            <ScrollArea className="h-[160px] w-full border rounded-lg p-4 bg-gray-50">
              <div className="text-base leading-relaxed break-words whitespace-pre-wrap">
                {currentCard?.question}
              </div>
            </ScrollArea>
          </div>
          
          {showAnswer ? (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-l-4 border-primary">
                <h3 className="font-semibold mb-4 text-primary text-lg">Answer:</h3>
                <ScrollArea className="h-[200px] w-full">
                  <div className="text-base leading-relaxed break-words whitespace-pre-wrap">
                    {currentCard?.answer}
                  </div>
                </ScrollArea>
              </div>
              
              <div className="flex gap-4 justify-center pt-4">
                <Button
                  onClick={() => handleResponse(false)}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2 hover:scale-105 transition-transform hover:border-red-300 min-w-[140px]"
                >
                  <XCircle className="h-5 w-5 text-red-500" />
                  I got it wrong
                </Button>
                <Button
                  onClick={() => handleResponse(true)}
                  size="lg"
                  className="flex items-center gap-2 hover:scale-105 transition-transform bg-green-500 hover:bg-green-600 min-w-[140px]"
                >
                  <CheckCircle className="h-5 w-5" />
                  I got it right
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Button 
                onClick={handleRevealAnswer} 
                size="lg"
                className="flex items-center gap-2 hover:scale-105 transition-transform min-w-[140px]"
                disabled={isFlipping}
              >
                <Eye className="h-5 w-5" />
                {isFlipping ? "Revealing..." : "Reveal Answer"}
              </Button>
            </div>
          )}
          
          {cardStats && (
            <div className="text-sm text-muted-foreground text-center bg-gray-50 p-4 rounded-lg animate-fade-in border-t">
              <div className="flex justify-center gap-6 flex-wrap">
                <span className="flex items-center gap-1">
                  📊 <strong>{cardStats.times_reviewed}</strong> reviews
                </span>
                <span className="text-green-600 flex items-center gap-1">
                  ✅ <strong>{cardStats.correct_count}</strong> correct
                </span>
                <span className="text-red-600 flex items-center gap-1">
                  ❌ <strong>{cardStats.wrong_count}</strong> wrong
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exit Button */}
      <div className="text-center">
        <Button onClick={onComplete} variant="outline" className="hover:scale-105 transition-transform">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Deck
        </Button>
      </div>
    </div>
  );
};

export default EnhancedFlashcardPractice;
