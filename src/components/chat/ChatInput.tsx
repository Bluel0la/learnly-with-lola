
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Paperclip } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { chatApi } from '@/services/chatApi';
import ImageUpload from './ImageUpload';

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && uploadedImages.length === 0) return;

    setIsLoading(true);
    
    try {
      let currentSessionId = sessionId;
      
      // If no session, create a new one and navigate to it
      if (!currentSessionId) {
        const newSession = await chatApi.startSession({ chat_title: message.slice(0, 50) || 'New Chat' });
        currentSessionId = newSession.chat_id;
        navigate(`/chat/${currentSessionId}`, { replace: true });
      }

      // Send the message
      await chatApi.sendMessage({
        prompt: message,
        chat_id: currentSessionId
      });

      // Clear the input and images
      setMessage('');
      setUploadedImages([]);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      // Immediately invalidate and refetch messages to show real-time updates
      queryClient.invalidateQueries({ queryKey: ['chat-messages', currentSessionId] });
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  };

  const handleTextExtracted = (extractedText: string) => {
    setMessage(prev => prev + (prev ? '\n\n' : '') + extractedText);
    setShowImageUpload(false);
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="border-t bg-white">
      <div className="max-w-4xl mx-auto p-4">
        {uploadedImages.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {uploadedImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Upload ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3 items-end">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything about your studies..."
              className="min-h-[50px] max-h-[200px] resize-none pr-12 text-sm md:text-base"
              disabled={isLoading}
            />
            <div className="absolute right-2 bottom-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowImageUpload(true)}
                className="h-8 w-8"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={(!message.trim() && uploadedImages.length === 0) || isLoading}
            className="h-[50px] w-[50px] flex-shrink-0"
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
            ) : (
              <Send className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </Button>
        </form>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          Press Enter to send, Shift + Enter for new line
        </div>
      </div>

      {showImageUpload && (
        <ImageUpload 
          onTextExtracted={handleTextExtracted}
          onClose={() => setShowImageUpload(false)}
        />
      )}
    </div>
  );
};

export default ChatInput;
