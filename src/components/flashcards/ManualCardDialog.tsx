
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { flashcardApi } from '@/services/flashcardApi';

interface ManualCardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  deckId: string;
  onCardsAdded: () => void;
}

interface CardInput {
  question: string;
  answer: string;
}

const ManualCardDialog: React.FC<ManualCardDialogProps> = ({
  isOpen,
  onOpenChange,
  deckId,
  onCardsAdded
}) => {
  const { toast } = useToast();
  const [cards, setCards] = useState<CardInput[]>([{ question: '', answer: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addCard = () => {
    setCards([...cards, { question: '', answer: '' }]);
  };

  const removeCard = (index: number) => {
    if (cards.length > 1) {
      setCards(cards.filter((_, i) => i !== index));
    }
  };

  const updateCard = (index: number, field: keyof CardInput, value: string) => {
    const updatedCards = cards.map((card, i) => 
      i === index ? { ...card, [field]: value } : card
    );
    setCards(updatedCards);
  };

  const handleSubmit = async () => {
    const validCards = cards.filter(card => card.question.trim() && card.answer.trim());
    
    if (validCards.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one card with both question and answer",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await flashcardApi.addCards(deckId, validCards);
      
      toast({
        title: "Success! 🎉",
        description: `${validCards.length} card${validCards.length > 1 ? 's' : ''} added successfully`
      });
      
      setCards([{ question: '', answer: '' }]);
      onOpenChange(false);
      onCardsAdded();
    } catch (error) {
      console.error('Error adding cards:', error);
      toast({
        title: "Error",
        description: "Failed to add cards",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">✏️</span>
            Add Cards Manually
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {cards.map((card, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Card {index + 1}</h4>
                {cards.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCard(index)}
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Question:</label>
                <Textarea
                  placeholder="Enter your question..."
                  value={card.question}
                  onChange={(e) => updateCard(index, 'question', e.target.value)}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Answer:</label>
                <Textarea
                  placeholder="Enter the answer..."
                  value={card.answer}
                  onChange={(e) => updateCard(index, 'answer', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          ))}
          
          <Button
            variant="outline"
            onClick={addCard}
            className="w-full flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Another Card
          </Button>
          
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="hover:scale-105 transition-transform"
            >
              {isSubmitting ? "Adding..." : `Add ${cards.filter(c => c.question.trim() && c.answer.trim()).length} Card${cards.filter(c => c.question.trim() && c.answer.trim()).length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManualCardDialog;
