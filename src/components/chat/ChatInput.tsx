
import React, { useState, useEffect } from 'react';
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
    <div className="sticky bottom-0 border-t bg-white p-3 md:p-4 safe-area-inset-bottom">
      <div className="max-w-4xl mx-auto">
        {/* Extracted Text Display */}
        {extractedText && (
          <div className="mb-3 md:mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg relative">
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
          <div className="flex items-center gap-2 p-2 md:p-3 rounded-2xl md:rounded-full border shadow-sm bg-white">
            {/* Left Icons */}
            <div className="flex items-center gap-1 md:gap-2 pl-1 md:pl-2 pr-1">
              <button
                type="button"
                onClick={() => setShowImageUpload(true)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer p-1"
              >
                <Plus size={18} className="md:w-5 md:h-5" />
              </button>
            </div>

            {/* Input */}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={extractedText ? "Add your follow-up question..." : "Ask anything"}
              className="flex-1 px-2 md:px-3 py-2 text-sm focus:outline-none bg-transparent min-w-0"
              disabled={isSubmitting}
            />

            {/* Microphone - Hidden on very small screens */}
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 cursor-pointer mr-1 md:mr-2 hidden sm:block"
            >
              <Mic size={18} className="md:w-5 md:h-5" />
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={(!message.trim() && !extractedText) || isSubmitting}
              className={`p-2 rounded-full transition shrink-0 ${
                (message.trim() || extractedText) && !isSubmitting
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <div className="h-4 w-4 md:h-5 md:w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                <ArrowUp size={14} className="md:w-4 md:h-4" />
              )}
            </button>
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
