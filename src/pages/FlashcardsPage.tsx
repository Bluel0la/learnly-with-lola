
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '@/hooks/use-toast';
import { flashcardApi, FlashcardDeck, FlashcardCard } from '@/services/flashcardApi';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle, Book, Bookmark, GraduationCap, ArrowLeft } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';
import MultipleChoiceQuiz from '@/components/flashcards/MultipleChoiceQuiz';
import PracticeMode from '@/components/flashcards/PracticeMode';
import DeckAnalytics from '@/components/flashcards/DeckAnalytics';
import DeckRankBadge from '@/components/flashcards/DeckRankBadge';
import TiltedCard from '@/components/ui/TiltedCard';
import { useDeckRank } from '@/hooks/useDeckRank';

const FlashcardsPage = () => {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [currentView, setCurrentView] = useState<'decks' | 'deck' | 'quiz' | 'practice' | 'analytics' | 'filtered'>('decks');
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filteredCards, setFilteredCards] = useState<FlashcardCard[]>([]);
  const [filteredView, setFilteredView] = useState<'all' | 'bookmarked' | 'unstudied' | 'hard'>('all');
  const [isLoadingFiltered, setIsLoadingFiltered] = useState(false);

  const { toast } = useToast();
  const { deckRanks, isLoading: ranksLoading, refreshDeckRank } = useDeckRank();

  const loadDecks = async () => {
    try {
      setIsLoading(true);
      const fetchedDecks = await flashcardApi.getDecks();
      setDecks(fetchedDecks);
    } catch (error) {
      console.error('Failed to load decks:', error);
      toast({
        title: "Error",
        description: "Failed to load decks. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDecks();
  }, []);

  const handleCreateDeck = async () => {
    if (!newDeckTitle.trim()) {
      toast({
        title: "Error",
        description: "Deck title cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const newDeck = await flashcardApi.createDeck(newDeckTitle);
      setDecks(prevDecks => [...prevDecks, newDeck]);
      setNewDeckTitle('');
      toast({
        title: "Success",
        description: "Deck created successfully.",
      });
    } catch (error) {
      console.error('Failed to create deck:', error);
      toast({
        title: "Error",
        description: "Failed to create deck. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeckSelect = (deck: FlashcardDeck) => {
    setSelectedDeck(deck);
    setCurrentView('deck');
  };

  const handleBackToDecks = () => {
    setSelectedDeck(null);
    setCurrentView('decks');
    loadDecks(); // Refresh decks when returning to the decks view
  };

  const handleStartQuiz = () => {
    if (selectedDeck) {
      setCurrentView('quiz');
    }
  };

  const handleStartPractice = () => {
    if (selectedDeck) {
      setCurrentView('practice');
    }
  };

  const handleShowAnalytics = () => {
    if (selectedDeck) {
      setCurrentView('analytics');
    }
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file || !selectedDeck) {
      toast({
        title: "Error",
        description: "No file selected.",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setIsGenerating(true);

    try {
      await flashcardApi.generateFlashcards(selectedDeck.deck_id, file);
      toast({
        title: "Success",
        description: "Flashcards generated successfully.",
      });
      loadDecks(); // Refresh decks after generating flashcards
    } catch (error) {
      console.error('Failed to generate flashcards:', error);
      toast({
        title: "Error",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFilterChange = async (view: 'bookmarked' | 'unstudied' | 'hard') => {
    setIsLoadingFiltered(true);
    setFilteredView(view);
    
    try {
      let cards: FlashcardCard[] = [];
      
      switch (view) {
        case 'bookmarked':
          cards = await flashcardApi.getBookmarkedCards();
          break;
        case 'unstudied':
          cards = await flashcardApi.getUnstudiedCards();
          break;
        case 'hard':
          cards = await flashcardApi.getHardCards();
          break;
      }
      
      setFilteredCards(cards);
      setCurrentView('filtered');
    } catch (error) {
      console.error(`Failed to load ${view} cards:`, error);
      toast({
        title: "Error",
        description: `Failed to load ${view} cards. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsLoadingFiltered(false);
    }
  };

  const handleQuizComplete = async () => {
    setCurrentView('decks');
    await loadDecks();
    // Refresh ranks after quiz completion
    if (selectedDeck) {
      await refreshDeckRank(selectedDeck.deck_id);
    }
  };

  const renderFilteredView = () => {
    if (isLoadingFiltered) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 border-2 border-t-transparent border-primary rounded-full animate-spin"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={handleBackToDecks} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Decks
          </Button>
          <h2 className="text-2xl font-bold capitalize">{filteredView} Cards</h2>
        </div>
        
        {filteredCards.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No {filteredView} cards found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map((card) => (
              <Card key={card.card_id} className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium line-clamp-2">
                    {card.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                    {card.answer}
                  </p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Reviewed: {card.times_reviewed || 0}</span>
                    {card.is_bookmarked && <Bookmark className="h-3 w-3 fill-current" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderDeckView = () => {
    if (!selectedDeck) {
      return <div className="text-center">No deck selected.</div>;
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{selectedDeck.title}</h2>
            <p className="text-muted-foreground">Manage and study your flashcards</p>
          </div>
          <div className="space-x-2">
            <Button onClick={handleStartPractice}><Book className="mr-2 h-4 w-4" /> Practice</Button>
            <Button onClick={handleStartQuiz}><GraduationCap className="mr-2 h-4 w-4" /> Start Quiz</Button>
            <Button onClick={handleShowAnalytics} variant="secondary">Analytics</Button>
            <Button onClick={handleBackToDecks} variant="outline">Back to Decks</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add Flashcards</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload onFileSelected={handleFileUpload} isLoading={isGenerating} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button onClick={() => handleFilterChange('bookmarked')} variant="outline">
              <Bookmark className="mr-2 h-4 w-4" /> Bookmarked
            </Button>
            <Button onClick={() => handleFilterChange('unstudied')} variant="outline">
              <Book className="mr-2 h-4 w-4" /> Unstudied
            </Button>
            <Button onClick={() => handleFilterChange('hard')} variant="outline">
              <GraduationCap className="mr-2 h-4 w-4" /> Hard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDecksView = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 border-2 border-t-transparent border-primary rounded-full animate-spin"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Flashcard Decks</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Deck
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Deck</DialogTitle>
                <DialogDescription>
                  Enter a title for your new flashcard deck.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newDeckTitle}
                    onChange={(e) => setNewDeckTitle(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleCreateDeck} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Deck"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => {
            const deckRank = deckRanks[deck.deck_id];
            const hasRank = deckRank && deckRank.bestRank !== 'UNRANKED';
            
            return (
              <TiltedCard 
                key={deck.deck_id}
                containerHeight="280px"
                scaleOnHover={1.05}
                rotateAmplitude={5}
              >
                <Card 
                  className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden bg-gradient-to-br from-card to-card/90 border-2"
                  onClick={() => handleDeckSelect(deck)}
                >
                  {/* Rank Badge Overlay */}
                  {hasRank && (
                    <div className="absolute top-4 right-4 z-10">
                      <DeckRankBadge 
                        rank={deckRank.bestRank} 
                        size="md"
                        className="shadow-lg animate-pulse"
                      />
                    </div>
                  )}
                  
                  {/* Gaming-style background effect */}
                  {hasRank && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
                  )}
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors pr-16 line-clamp-2">
                      {deck.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cards:</span>
                          <span className="font-semibold">{deck.card_count || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Created:</span>
                          <span className="font-medium text-xs">
                            {new Date(deck.date_created).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Rank Information */}
                      {hasRank && (
                        <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary">{deckRank.bestScore}</div>
                            <div className="text-xs text-muted-foreground">Best Score</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{hasRank ? `${Math.round((deckRank.bestScore / ((deck.card_count || 1) * 100)) * 100)}%` : '0%'}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: hasRank ? `${Math.round((deckRank.bestScore / ((deck.card_count || 1) * 100)) * 100)}%` : '0%' 
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TiltedCard>
            );
          })}

          <TiltedCard containerHeight="280px" scaleOnHover={1.02}>
            <Card className="h-full border-dashed border-2 border-muted bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
              <CardContent className="flex items-center justify-center h-full p-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="text-muted-foreground hover:text-primary h-full w-full flex flex-col gap-2">
                      <PlusCircle className="h-8 w-8" />
                      <span>Create New Deck</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Deck</DialogTitle>
                      <DialogDescription>
                        Enter a title for your new flashcard deck.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title
                        </Label>
                        <Input
                          id="title"
                          value={newDeckTitle}
                          onChange={(e) => setNewDeckTitle(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <Button onClick={handleCreateDeck} disabled={isCreating}>
                      {isCreating ? "Creating..." : "Create Deck"}
                    </Button>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TiltedCard>
        </div>

        <div className="flex items-center justify-between py-4 text-sm text-muted-foreground">
          <span>Total Decks: {decks.length}</span>
          <span>🎯 Study smart, achieve more!</span>
        </div>
      </div>
    );
  };

  return (
    <div className="container max-w-6xl mx-auto py-12">
      {currentView === 'decks' && renderDecksView()}
      {currentView === 'deck' && renderDeckView()}
      {currentView === 'filtered' && renderFilteredView()}
      {currentView === 'quiz' && selectedDeck && (
        <MultipleChoiceQuiz deckId={selectedDeck.deck_id} onComplete={handleQuizComplete} />
      )}
      {currentView === 'practice' && selectedDeck && (
        <PracticeMode deckId={selectedDeck.deck_id} onComplete={handleBackToDecks} />
      )}
      {currentView === 'analytics' && selectedDeck && (
        <DeckAnalytics deckId={selectedDeck.deck_id} deckTitle={selectedDeck.title} onClose={handleBackToDecks} />
      )}
    </div>
  );
};

export default FlashcardsPage;
