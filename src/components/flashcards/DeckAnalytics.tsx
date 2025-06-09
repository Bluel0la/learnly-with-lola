
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BarChart3, Brain, TrendingUp, TrendingDown, Target, Loader2, Eye, Bookmark, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FlashcardCard, flashcardApi } from '@/services/flashcardApi';

interface DeckAnalyticsProps {
  deckId: string;
  deckTitle: string;
  onClose: () => void;
  onDrillsGenerated?: () => void;
}

interface DeckStats {
  totalCards: number;
  studiedCards: number;
  averageAccuracy: number;
  hardCards: number;
  bookmarkedCards: number;
  unstudiedCards: number;
}

const DeckAnalytics: React.FC<DeckAnalyticsProps> = ({
  deckId,
  deckTitle,
  onClose,
  onDrillsGenerated
}) => {
  const { toast } = useToast();
  const [cards, setCards] = useState<FlashcardCard[]>([]);
  const [stats, setStats] = useState<DeckStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingDrills, setIsGeneratingDrills] = useState(false);
  const [showCardsDialog, setShowCardsDialog] = useState(false);
  const [selectedCards, setSelectedCards] = useState<FlashcardCard[]>([]);
  const [dialogTitle, setDialogTitle] = useState('');

  const loadDeckAnalytics = async () => {
    try {
      setIsLoading(true);
      const deckCards = await flashcardApi.getDeckCards(deckId);
      setCards(deckCards);

      // Calculate statistics
      const totalCards = deckCards.length;
      const studiedCards = deckCards.filter(card => card.is_studied).length;
      const cardsWithReviews = deckCards.filter(card => 
        card.times_reviewed && card.times_reviewed > 0
      );
      
      const averageAccuracy = cardsWithReviews.length > 0 
        ? Math.round(
            cardsWithReviews.reduce((acc, card) => {
              const total = (card.correct_count || 0) + (card.wrong_count || 0);
              return acc + (total > 0 ? (card.correct_count || 0) / total : 0);
            }, 0) / cardsWithReviews.length * 100
          )
        : 0;

      const hardCards = deckCards.filter(card => {
        const total = (card.correct_count || 0) + (card.wrong_count || 0);
        return total > 2 && (card.correct_count || 0) / total < 0.6;
      }).length;

      const bookmarkedCards = deckCards.filter(card => card.is_bookmarked).length;
      const unstudiedCards = deckCards.filter(card => !card.is_studied).length;

      setStats({
        totalCards,
        studiedCards,
        averageAccuracy,
        hardCards,
        bookmarkedCards,
        unstudiedCards
      });
    } catch (error) {
      console.error('Error loading deck analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load deck analytics",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAdaptiveDrills = async (mode: 'wrong' | 'bookmark') => {
    setIsGeneratingDrills(true);
    try {
      const result = await flashcardApi.generateAdaptiveDrills(deckId, mode, 10);
      
      toast({
        title: "Adaptive drills generated! 🎯",
        description: `Generated ${result.cards?.length || 0} new cards to improve your performance.`
      });
      
      if (onDrillsGenerated) {
        onDrillsGenerated();
      }
      
      // Refresh analytics
      loadDeckAnalytics();
    } catch (error) {
      console.error('Error generating adaptive drills:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate adaptive drills",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingDrills(false);
    }
  };

  const handleViewCards = (type: 'difficult' | 'bookmarked' | 'unstudied') => {
    let filteredCards: FlashcardCard[] = [];
    let title = '';

    switch (type) {
      case 'difficult':
        filteredCards = cards.filter(card => {
          const total = (card.correct_count || 0) + (card.wrong_count || 0);
          return total > 2 && (card.correct_count || 0) / total < 0.6;
        });
        title = 'Difficult Cards (< 60% accuracy)';
        break;
      case 'bookmarked':
        filteredCards = cards.filter(card => card.is_bookmarked);
        title = 'Bookmarked Cards';
        break;
      case 'unstudied':
        filteredCards = cards.filter(card => !card.is_studied);
        title = 'Unstudied Cards';
        break;
    }

    setSelectedCards(filteredCards);
    setDialogTitle(title);
    setShowCardsDialog(true);
  };

  useEffect(() => {
    loadDeckAnalytics();
  }, [deckId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 border-2 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No analytics data available</p>
          <Button onClick={onClose} variant="outline" className="mt-4">
            Back to Deck
          </Button>
        </CardContent>
      </Card>
    );
  }

  const completionRate = Math.round((stats.studiedCards / stats.totalCards) * 100);
  const needsImprovement = stats.averageAccuracy < 70 || stats.hardCards > stats.totalCards * 0.3;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            {deckTitle} Analytics
          </h2>
          <p className="text-muted-foreground">Performance insights and improvement suggestions</p>
        </div>
        <Button onClick={onClose} variant="outline">
          Back to Deck
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.studiedCards} of {stats.totalCards} cards studied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stats.averageAccuracy}%</div>
              {stats.averageAccuracy >= 80 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <Badge 
              variant={stats.averageAccuracy >= 80 ? "default" : "destructive"}
              className="mt-2"
            >
              {stats.averageAccuracy >= 80 ? "Good" : "Needs Improvement"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Difficult Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hardCards}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cards with &lt;60% accuracy
            </p>
            {stats.hardCards > 0 && (
              <Badge variant="outline" className="mt-2">
                <Target className="h-3 w-3 mr-1" />
                Focus Area
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Adaptive Drill Suggestions */}
      {needsImprovement && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-700 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Suggested Improvements
            </CardTitle>
            <CardDescription>
              Based on your performance, here are some ways to improve your mastery of this deck.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.hardCards > 0 && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div>
                  <p className="font-medium">Generate drills for difficult topics</p>
                  <p className="text-sm text-muted-foreground">
                    You have {stats.hardCards} cards with low accuracy
                  </p>
                </div>
                <Button
                  onClick={() => handleGenerateAdaptiveDrills('wrong')}
                  disabled={isGeneratingDrills}
                  size="sm"
                >
                  {isGeneratingDrills ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
                </Button>
              </div>
            )}
            
            {stats.bookmarkedCards > 0 && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div>
                  <p className="font-medium">Practice bookmarked topics</p>
                  <p className="text-sm text-muted-foreground">
                    You have {stats.bookmarkedCards} bookmarked cards
                  </p>
                </div>
                <Button
                  onClick={() => handleGenerateAdaptiveDrills('bookmark')}
                  disabled={isGeneratingDrills}
                  size="sm"
                  variant="outline"
                >
                  {isGeneratingDrills ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Interactive Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Study Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Studied Cards</span>
              <span className="font-medium">{stats.studiedCards}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Unstudied Cards</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{stats.unstudiedCards}</span>
                {stats.unstudiedCards > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewCards('unstudied')}
                    className="h-6 px-2"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Bookmarked</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{stats.bookmarkedCards}</span>
                {stats.bookmarkedCards > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewCards('bookmarked')}
                    className="h-6 px-2"
                  >
                    <Bookmark className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Total Cards</span>
              <span className="font-medium">{stats.totalCards}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Difficult Cards</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-red-600">{stats.hardCards}</span>
                {stats.hardCards > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewCards('difficult')}
                    className="h-6 px-2"
                  >
                    <AlertCircle className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span>Success Rate</span>
              <span className={`font-medium ${stats.averageAccuracy >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.averageAccuracy}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards Review Dialog */}
      <Dialog open={showCardsDialog} onOpenChange={setShowCardsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selectedCards.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No cards found in this category.</p>
            ) : (
              selectedCards.map((card) => (
                <Card key={card.card_id} className="p-4">
                  <div className="space-y-2">
                    <p className="font-medium text-sm">{card.question}</p>
                    <p className="text-muted-foreground text-sm">{card.answer}</p>
                    <div className="flex gap-2 text-xs">
                      {card.is_bookmarked && (
                        <Badge variant="outline" className="text-xs">
                          <Bookmark className="h-3 w-3 mr-1" />
                          Bookmarked
                        </Badge>
                      )}
                      {card.times_reviewed && card.times_reviewed > 0 && (
                        <Badge variant="outline" className="text-xs">
                          Reviewed {card.times_reviewed} times
                        </Badge>
                      )}
                      {card.correct_count !== undefined && card.wrong_count !== undefined && (
                        <Badge variant="outline" className="text-xs">
                          {card.correct_count}✓ {card.wrong_count}✗
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeckAnalytics;
