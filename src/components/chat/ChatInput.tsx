
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Mic, ArrowUp, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { chatApi } from '@/services/api';
import ImageUpload from './ImageUpload';

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const { toast } = useToast();
  const params = useParams();
  const navigate = useNavigate();
  const sessionId = params.sessionId;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  // Listen for edit events from MessageActions
  useEffect(() => {
    const handleEditMessage = (event: CustomEvent) => {
      const { messageId, originalPrompt } = event.detail;
      setMessage(originalPrompt);
    };

    window.addEventListener('editMessage', handleEditMessage as EventListener);
    
    return () => {
      window.removeEventListener('editMessage', handleEditMessage as EventListener);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine extracted text with user message if both exist
    const finalMessage = extractedText 
      ? (message.trim() ? `${extractedText}\n\n${message}` : extractedText)
      : message;
    
    if (finalMessage.trim() && !isSubmitting) {
      setIsSubmitting(true);
      
      try {
        if (!sessionId) {
          // Start a new chat session
          const newSession = await chatApi.startSession({
            chat_title: finalMessage.length > 20 ? `${finalMessage.substring(0, 20)}...` : finalMessage
          });
          
          // Add user message immediately
          if ((window as any).addChatMessage) {
            (window as any).addChatMessage({
              id: `temp-user-${Date.now()}`,
              type: 'user',
              content: finalMessage,
              timestamp: new Date()
            });
          }
          
          // Send the message and get response
          const response = await chatApi.sendMessage({
            prompt: finalMessage,
            chat_id: newSession.chat_id
          });
          
          // Add AI response immediately
          if ((window as any).addChatMessage) {
            (window as any).addChatMessage({
              id: `temp-ai-${Date.now()}`,
              type: 'ai',
              content: response.response,
              timestamp: new Date(),
              originalPrompt: finalMessage
            });
          }
          
          // Navigate to the new chat session
          navigate(`/chat/${newSession.chat_id}`);
          toast({
            title: "New chat started",
            description: "Your message has been sent"
          });
        } else {
          // Add user message immediately to existing chat
          if ((window as any).addChatMessage) {
            (window as any).addChatMessage({
              id: `temp-user-${Date.now()}`,
              type: 'user',
              content: finalMessage,
              timestamp: new Date()
            });
          }
          
          // Send message and get response
          const response = await chatApi.sendMessage({
            prompt: finalMessage,
            chat_id: sessionId
          });
          
          // Add AI response immediately
          if ((window as any).addChatMessage) {
            (window as any).addChatMessage({
              id: `temp-ai-${Date.now()}`,
              type: 'ai',
              content: response.response,
              timestamp: new Date(),
              originalPrompt: finalMessage
            });
          }
        }
        
        setMessage('');
        setExtractedText('');
      } catch (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleTextExtracted = (extractedTextResult: string) => {
    setExtractedText(extractedTextResult);
    toast({
      title: "Text extracted successfully",
      description: "Add your follow-up question in the input box below."
    });
  };

  const clearExtractedText = () => {
    setExtractedText('');
  };

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Extracted Text Display */}
        {extractedText && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg relative">
            <button
              onClick={clearExtractedText}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
            <p className="text-sm text-blue-800 font-medium mb-1">Extracted Text:</p>
            <p className="text-sm text-gray-700 pr-6">{extractedText}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Left Icon */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <button
                type="button"
                onClick={() => setShowImageUpload(true)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={extractedText ? "Add your follow-up question..." : "Message Learnly..."}
              disabled={isSubmitting}
              className="w-full pl-12 pr-20 py-4 text-gray-900 placeholder-gray-500 bg-transparent border-0 resize-none focus:outline-none focus:ring-0"
              style={{
                minHeight: '56px',
                maxHeight: '200px',
                overflowY: 'auto'
              }}
              rows={1}
            />

            {/* Right Icons */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {/* Microphone - Hidden on mobile */}
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 hidden sm:block"
                tabIndex={-1}
              >
                <Mic size={20} />
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={(!message.trim() && !extractedText) || isSubmitting}
                className={`p-2 rounded-full transition-all duration-200 ${
                  (message.trim() || extractedText) && !isSubmitting
                    ? 'bg-black text-white hover:bg-gray-800 shadow-sm'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  <ArrowUp size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Helper Text */}
          <div className="mt-2 text-xs text-gray-500 text-center">
            Press Enter to send, Shift + Enter for new line
          </div>
        </form>

        {/* Image Upload Modal */}
        {showImageUpload && (
          <ImageUpload 
            onTextExtracted={handleTextExtracted}
            onClose={() => setShowImageUpload(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ChatInput;
