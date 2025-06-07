
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bookmark, RotateCcw, Eye, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PracticeCard, RevealedCard, SubmitResponse, flashcardApi } from '@/services/flashcardApi';
import PracticeAdaptiveSuggestion from './PracticeAdaptiveSuggestion';

interface FlashcardPracticeProps {
  deckId: string;
  onComplete?: () => void;
}

const FlashcardPractice: React.FC<FlashcardPracticeProps> = ({ deckId, onComplete }) => {
  const { toast } = useToast();
  const [currentCard, setCurrentCard] = useState<PracticeCard | null>(null);
  const [revealedCard, setRevealedCard] = useState<RevealedCard | null>(null);
  const [cardStats, setCardStats] = useState<SubmitResponse | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);

  const loadNextCard = async () => {
    try {
      setIsLoading(true);
      setShowAnswer(false);
      setRevealedCard(null);
      setCardStats(null);
      setIsFlipping(false);
      setIsBookmarked(false);
      
      const card = await flashcardApi.getPracticeCard(deckId);
      setCurrentCard(card);
    } catch (error) {
      console.error('Error loading card:', error);
      if (error instanceof Error && error.message.includes('No more cards')) {
        setCurrentCard(null);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to load practice card",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevealAnswer = async () => {
    if (!currentCard) return;
    
    try {
      setIsFlipping(true);
      const revealed = await flashcardApi.revealCard(currentCard.card_id);
      setRevealedCard(revealed);
      
      setTimeout(() => {
        setShowAnswer(true);
        setIsFlipping(false);
      }, 400);
    } catch (error) {
      console.error('Error revealing card:', error);
      toast({
        title: "Error",
        description: "Failed to reveal answer",
        variant: "destructive"
      });
      setIsFlipping(false);
    }
  };

  const handleResponse = async (isCorrect: boolean) => {
    if (!currentCard) return;
    
    try {
      const response = await flashcardApi.submitResponse(currentCard.card_id, isCorrect);
      setCardStats(response);
      
      // Track consecutive wrong answers
      if (isCorrect) {
        setConsecutiveWrong(0);
      } else {
        setConsecutiveWrong(prev => prev + 1);
      }
      
      toast({
        title: isCorrect ? "Correct! 🎉" : "Keep practicing! 💪",
        description: isCorrect ? "Great job!" : "You'll get it next time"
      });
      
      setTimeout(() => {
        loadNextCard();
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
      loadNextCard();
    } catch (error) {
      console.error('Error resetting card:', error);
      toast({
        title: "Error",
        description: "Failed to reset card",
        variant: "destructive"
      });
    }
  };

  const handleDrillsGenerated = () => {
    setConsecutiveWrong(0); // Reset counter after generating drills
    toast({
      title: "Practice cards added! 📚",
      description: "New cards have been added to help you practice this topic."
    });
  };

  React.useEffect(() => {
    loadNextCard();
  }, [deckId]);

  if (isLoading && !currentCard) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 border-2 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <Card className="animate-fade-in max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold mb-2">Congratulations!</h3>
          <p className="text-muted-foreground mb-4">You've completed all available cards!</p>
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
      {/* Adaptive drill suggestion */}
      <PracticeAdaptiveSuggestion
        deckId={deckId}
        consecutiveWrong={consecutiveWrong}
        currentCardId={currentCard?.card_id}
        onDrillsGenerated={handleDrillsGenerated}
      />

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
                {currentCard.question}
              </div>
            </ScrollArea>
          </div>
          
          {showAnswer && revealedCard ? (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-l-4 border-primary">
                <h3 className="font-semibold mb-4 text-primary text-lg">Answer:</h3>
                <ScrollArea className="h-[200px] w-full">
                  <div className="text-base leading-relaxed break-words whitespace-pre-wrap">
                    {revealedCard.answer}
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
    </div>
  );
};

export default FlashcardPractice;
