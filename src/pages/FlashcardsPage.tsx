import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '@/hooks/use-toast';
import { flashcardApi, FlashcardDeck } from '@/services/flashcardApi';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle, Book, Bookmark, GraduationCap } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';
import MultipleChoiceQuiz from '@/components/flashcards/MultipleChoiceQuiz';
import PracticeMode from '@/components/flashcards/PracticeMode';
import DeckAnalytics from '@/components/flashcards/DeckAnalytics';
import DeckRankBadge from '@/components/flashcards/DeckRankBadge';
import { useDeckRank } from '@/hooks/useDeckRank';

const FlashcardsPage = () => {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [currentView, setCurrentView] = useState<'decks' | 'deck' | 'quiz' | 'practice' | 'analytics'>('decks');
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filteredView, setFilteredView] = useState<'all' | 'bookmarked' | 'unstudied' | 'hard'>('all');

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

  const handleFilterChange = (view: 'all' | 'bookmarked' | 'unstudied' | 'hard') => {
    setFilteredView(view);
    setIsFilterVisible(false);
  };

  const renderFilteredView = () => {
    let apiUrl = '';
    switch (filteredView) {
      case 'bookmarked':
        apiUrl = '/flashcard/cards/bookmarked';
        break;
      case 'unstudied':
        apiUrl = '/flashcard/cards/unstudied';
        break;
      case 'hard':
        apiUrl = '/flashcard/cards/hard';
        break;
      default:
        apiUrl = `/flashcard/decks/${selectedDeck?.deck_id}/get-cards`;
        break;
    }

    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2">Filtered View</h3>
        <p className="text-gray-600 mb-4">Displaying {filteredView} cards.</p>
        <Button onClick={handleBackToDecks}>Back to Decks</Button>
      </div>
    );
  };

  const handleQuizComplete = async () => {
    setCurrentView('decks');
    await loadDecks();
    // Refresh ranks after quiz completion
    if (selectedDeck) {
      await refreshDeckRank(selectedDeck.deck_id);
    }
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
              <Button variant="default">
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
            return (
              <Card 
                key={deck.deck_id} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group relative overflow-hidden"
                onClick={() => handleDeckSelect(deck)}
              >
                {/* Rank Badge Overlay */}
                {deckRank && deckRank.bestRank !== 'UNRANKED' && (
                  <div className="absolute top-3 right-3 z-10">
                    <DeckRankBadge 
                      rank={deckRank.bestRank} 
                      size="sm"
                      className="shadow-lg"
                    />
                  </div>
                )}
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-serif group-hover:text-primary transition-colors pr-12">
                    {deck.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cards:</span>
                      <span className="font-medium">{deck.card_count || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">
                        {new Date(deck.date_created).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* Rank Information */}
                    {deckRank && deckRank.bestRank !== 'UNRANKED' && (
                      <div className="mt-3 p-2 bg-primary/5 rounded-lg">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Best Score:</span>
                          <span className="font-semibold text-primary">{deckRank.bestScore}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Card className="border-dashed border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-center h-full p-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-gray-500 hover:text-primary">
                    + Create New Deck
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
        </div>

        <div className="md:flex md:items-center md:justify-between py-4">
          <div className="text-sm text-gray-500">
            Total Decks: {decks.length}
          </div>
          <div className="mt-2 md:mt-0">
            <Button variant="outline" size="sm" onClick={() => setIsFilterVisible(!isFilterVisible)}>
              {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container max-w-5xl mx-auto py-12">
      {currentView === 'decks' && renderDecksView()}
      {currentView === 'deck' && renderDeckView()}
      {currentView === 'quiz' && selectedDeck && (
        <MultipleChoiceQuiz deckId={selectedDeck.deck_id} onComplete={handleQuizComplete} />
      )}
      {currentView === 'practice' && selectedDeck && (
        <PracticeMode deckId={selectedDeck.deck_id} onComplete={handleBackToDecks} />
      )}
      {currentView === 'analytics' && selectedDeck && (
        <DeckAnalytics deckId={selectedDeck.deck_id} deckTitle={selectedDeck.title} onClose={handleBackToDecks} />
      )}
      {isFilterVisible && renderFilteredView()}
    </div>
  );
};

export default FlashcardsPage;
