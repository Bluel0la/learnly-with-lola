import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Plus, BookOpen, Play, Upload, Sparkles, Edit, Clock, BarChart3, Brain, MoreVertical } from 'lucide-react';
import { FlashcardDeck, flashcardApi } from '@/services/flashcardApi';
import EnhancedFlashcardPractice from '@/components/flashcards/EnhancedFlashcardPractice';
import FlashcardQuiz from '@/components/flashcards/FlashcardQuiz';
import ManualCardDialog from '@/components/flashcards/ManualCardDialog';
import DeckAnalytics from '@/components/flashcards/DeckAnalytics';
import TiltedCard from '@/components/ui/TiltedCard';
import useOnlineStatus from '@/hooks/useOnlineStatus';

const FlashcardsPage = () => {
  const { toast } = useToast();
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'decks' | 'practice' | 'quiz' | 'analytics'>('decks');
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [selectedDeckTitle, setSelectedDeckTitle] = useState<string>('');
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const online = useOnlineStatus();

  const loadDecks = async () => {
    try {
      setIsLoading(true);
      const userDecks = await flashcardApi.getDecks();
      setDecks(userDecks);
    } catch (error) {
      console.error('Error loading decks:', error);
      toast({
        title: "Error",
        description: "Failed to load flashcard decks",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDeck = async () => {
    if (!newDeckTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a deck title",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Creating deck with title:', newDeckTitle);
      const newDeck = await flashcardApi.createDeck(newDeckTitle);
      console.log('Deck created successfully:', newDeck);
      toast({
        title: "Success! 🎉",
        description: `Deck "${newDeck.title}" created successfully`
      });
      setNewDeckTitle('');
      setIsCreateDialogOpen(false);
      loadDecks();
    } catch (error) {
      console.error('Error creating deck:', error);
      toast({
        title: "Error",
        description: "Failed to create deck",
        variant: "destructive"
      });
    }
  };

  const handleStartPractice = (deckId: string) => {
    setSelectedDeckId(deckId);
    setCurrentView('practice');
  };

  const handleStartQuiz = (deckId: string) => {
    setSelectedDeckId(deckId);
    setCurrentView('quiz');
  };

  const handleViewAnalytics = (deckId: string, deckTitle: string) => {
    setSelectedDeckId(deckId);
    setSelectedDeckTitle(deckTitle);
    setCurrentView('analytics');
  };

  const handleBackToDecks = () => {
    setCurrentView('decks');
    setSelectedDeckId(null);
    setSelectedDeckTitle('');
    loadDecks(); // Refresh decks to get updated card counts
  };

  useEffect(() => {
    loadDecks();
  }, []);

  if (currentView === 'practice' && selectedDeckId) {
    return (
      <div className="container px-3 md:px-4 py-4 md:py-6 lg:py-8 h-full">
        <div className="mb-3 md:mb-4">
          <Button onClick={handleBackToDecks} variant="outline" className="hover:scale-105 transition-transform text-sm">
            ← Back to Decks
          </Button>
        </div>
        <EnhancedFlashcardPractice
          deckId={selectedDeckId}
          onComplete={handleBackToDecks}
        />
      </div>
    );
  }

  if (currentView === 'quiz' && selectedDeckId) {
    return (
      <div className="container px-3 md:px-4 py-4 md:py-6 lg:py-8 h-full">
        <div className="mb-3 md:mb-4">
          <Button onClick={handleBackToDecks} variant="outline" className="hover:scale-105 transition-transform text-sm">
            ← Back to Decks
          </Button>
        </div>
        <FlashcardQuiz
          deckId={selectedDeckId}
          onComplete={handleBackToDecks}
        />
      </div>
    );
  }

  if (currentView === 'analytics' && selectedDeckId) {
    return (
      <div className="container px-3 md:px-4 py-4 md:py-6 lg:py-8 h-full">
        <DeckAnalytics
          deckId={selectedDeckId}
          deckTitle={selectedDeckTitle}
          onClose={handleBackToDecks}
          onDrillsGenerated={handleBackToDecks}
        />
      </div>
    );
  }

  return (
    <div className="container px-3 md:px-4 py-4 md:py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-2xl md:text-3xl">🎓</span>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold">Flashcards</h1>
          {/* Online status indicator */}
          <span className={`ml-2 flex items-center px-2 py-1 rounded-full text-xs ${online ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
            <span className={`h-2 w-2 rounded-full mr-1 ${online ? "bg-green-400" : "bg-gray-400"}`}></span>
            {online ? "Online" : "Offline"}
          </span>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 hover:scale-105 transition-transform text-sm w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              New Deck
            </Button>
          </DialogTrigger>
          <DialogContent className="animate-scale-in w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                Create New Deck
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter deck title..."
                value={newDeckTitle}
                onChange={(e) => setNewDeckTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateDeck()}
                className="focus:ring-2 focus:ring-primary transition-all"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="text-sm">
                  Cancel
                </Button>
                <Button onClick={handleCreateDeck} className="hover:scale-105 transition-transform text-sm">
                  Create Deck
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 md:h-8 md:w-8 border-2 border-t-transparent border-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {decks.map((deck, index) => (
            <div 
              key={deck.deck_id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TiltedCard
                containerHeight="auto"
                containerWidth="100%"
                scaleOnHover={1.02}
                rotateAmplitude={6}
                showMobileWarning={false}
              >
                <FlashcardDeckCard
                  deck={deck}
                  onStartPractice={() => handleStartPractice(deck.deck_id)}
                  onStartQuiz={() => handleStartQuiz(deck.deck_id)}
                  onViewAnalytics={() => handleViewAnalytics(deck.deck_id, deck.title)}
                  onCardsAdded={loadDecks}
                />
              </TiltedCard>
            </div>
          ))}
          
          {decks.length === 0 && (
            <Card className="col-span-full animate-fade-in">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="text-4xl md:text-6xl mb-4">📚</div>
                <h3 className="text-base md:text-lg font-medium mb-2">No flashcard decks yet</h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4">
                  Create your first deck to start studying with flashcards
                </p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="hover:scale-105 transition-transform text-sm"
                >
                  Create Your First Deck
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

const FlashcardDeckCard = ({ 
  deck, 
  onStartPractice,
  onStartQuiz,
  onViewAnalytics,
  onCardsAdded
}: { 
  deck: FlashcardDeck; 
  onStartPractice: () => void;
  onStartQuiz: () => void;
  onViewAnalytics: () => void;
  onCardsAdded: () => void;
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false);
  const [isGeneratingDrills, setIsGeneratingDrills] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      setUploadProgress('Preparing upload...');
      
      const maxSizeInMB = 10;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        throw new Error(`File size must be less than ${maxSizeInMB}MB`);
      }
      const supportedExtensions = ['.pdf', '.pptx', '.docx', '.txt'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!supportedExtensions.includes(fileExtension)) {
        throw new Error(`Unsupported file type. Please upload: ${supportedExtensions.join(', ')}`);
      }

      setUploadProgress('Uploading and processing file...');
      setUploadProgress('This may take a few minutes for large files...');

      // No timeout - let it run as long as needed
      const result = await flashcardApi.generateFlashcards(deck.deck_id, file, undefined, 25);

      setUploadProgress('Finalizing flashcards...');

      toast({
        title: "Success! ✨",
        description: `Generated ${result.flashcards?.length || result.num_flashcards || 'multiple'} flashcards from "${file.name}"`
      });
      onCardsAdded();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate flashcards from file';
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress('');
      event.target.value = '';
    }
  };

  const handleUploadClick = () => {
    const fileInput = document.getElementById(`upload-${deck.deck_id}`) as HTMLInputElement;
    if (fileInput) {
      console.log('Triggering file input click for deck:', deck.deck_id);
      fileInput.click();
    }
  };

  const handleGenerateSmartDrills = async () => {
    setIsGeneratingDrills(true);
    try {
      const result = await flashcardApi.generateAdaptiveDrills(deck.deck_id, 'wrong', 5);
      
      toast({
        title: "Smart drills generated! 🧠",
        description: `Added ${result.cards?.length || 0} practice cards to help improve your performance.`
      });
      onCardsAdded();
      
    } catch (error) {
      console.error('Error generating smart drills:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate smart drills",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingDrills(false);
    }
  };

  // Determine if deck needs improvement (placeholder logic - would need actual performance data)
  const needsImprovement = (deck.card_count || 0) > 5; // Simple heuristic for demo
  
  return (
    <>
      <Card className="h-full hover:shadow-lg transition-all duration-300 group">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-base md:text-lg font-serif flex items-center gap-2">
            <span className="text-lg md:text-xl">🃏</span>
            <span className="truncate">{deck.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4 px-4 pb-4">
          <div className="text-xs md:text-sm text-muted-foreground">
            {deck.card_count || 0} cards • Created {new Date(deck.date_created).toLocaleDateString()}
          </div>
          
          <div className="flex flex-col gap-2">
            {/* Primary actions - always visible */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={onStartPractice} 
                className="group-hover:scale-105 transition-transform text-xs md:text-sm py-2 h-auto"
                disabled={!deck.card_count || deck.card_count === 0}
              >
                <Play className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                Practice
              </Button>
              
              <Button 
                onClick={onStartQuiz} 
                variant="outline"
                className="group-hover:scale-105 transition-transform bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 text-xs md:text-sm py-2 h-auto"
                disabled={!deck.card_count || deck.card_count < 5}
              >
                <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                Quiz
              </Button>
            </div>

            {/* Secondary actions in dropdown menu */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsManualDialogOpen(true)}
                className="flex-1 group-hover:scale-105 transition-transform text-xs md:text-sm py-2 h-auto"
              >
                <Edit className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                Add Cards
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="group-hover:scale-105 transition-transform px-2 py-2 h-auto">
                    <MoreVertical className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 md:w-48">
                  <DropdownMenuItem onClick={onViewAnalytics} disabled={!deck.card_count || deck.card_count === 0} className="text-xs md:text-sm">
                    <BarChart3 className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                    Analytics
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleUploadClick} disabled={isUploading} className="text-xs md:text-sm">
                    <Upload className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                    {isUploading ? "Uploading..." : "Upload File"}
                  </DropdownMenuItem>
                  
                  {needsImprovement && (
                    <DropdownMenuItem onClick={handleGenerateSmartDrills} disabled={isGeneratingDrills} className="text-xs md:text-sm">
                      <Brain className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                      {isGeneratingDrills ? "Generating..." : "Smart Drills"}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Hidden file input */}
              <input
                type="file"
                id={`upload-${deck.deck_id}`}
                accept=".pdf,.pptx,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
            </div>
          </div>
          
          {isUploading && (
            <div className="text-xs text-center text-muted-foreground animate-pulse bg-blue-50 p-2 rounded">
              📤 {uploadProgress}
            </div>
          )}
        </CardContent>
      </Card>
      
      <ManualCardDialog
        isOpen={isManualDialogOpen}
        onOpenChange={setIsManualDialogOpen}
        deckId={deck.deck_id}
        onCardsAdded={onCardsAdded}
      />
    </>
  );
};

export default FlashcardsPage;
