
import React, { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage, chatApi } from '@/services/api';
import MessageActions from './MessageActions';
import LaTeXRenderer from './LaTeXRenderer';
import RotatingText from '@/components/ui/rotating-text';
import { useTimeBasedGreeting } from '@/hooks/useTimeBasedGreeting';
import { useUserProfile } from '@/hooks/useUserProfile';

type MessageType = 'user' | 'ai';

type UIMessage = {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  originalPrompt?: string; // For redo functionality
};

interface ChatMessagesProps {
  sessionId?: string;
}

const ChatMessages = ({ sessionId: propSessionId }: ChatMessagesProps) => {
  const params = useParams();
  const sessionId = propSessionId || params.sessionId;
  const { toast } = useToast();
  const { greetings } = useTimeBasedGreeting();
  const { profile } = useUserProfile();
  
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  console.log('ChatMessages: sessionId =', sessionId);
  console.log('ChatMessages: messages =', messages);
  
  // Load messages based on sessionId
  useEffect(() => {
    if (sessionId) {
      console.log('Loading messages for session:', sessionId);
      setIsLoading(true);
      
      chatApi.getSessionMessages(sessionId)
        .then((chatMessages) => {
          console.log('Received chat messages:', chatMessages);
          const formattedMessages = chatMessages.flatMap((message, index) => {
            const userMessage: UIMessage = {
              id: `${sessionId}-${index}a`,
              type: 'user',
              content: message.query,
              timestamp: new Date(message.timestamp)
            };
            
            const aiMessage: UIMessage = {
              id: `${sessionId}-${index}b`,
              type: 'ai',
              content: message.response,
              timestamp: new Date(message.timestamp),
              originalPrompt: message.query // Store original prompt for redo
            };
            
            return [userMessage, aiMessage];
          });
          
          console.log('Formatted messages:', formattedMessages);
          setMessages(formattedMessages);
        })
        .catch((error) => {
          console.error('Error fetching chat messages:', error);
          toast({
            title: "Error",
            description: "Failed to load chat messages",
            variant: "destructive"
          });
          setMessages([]); // Clear messages on error
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // If no sessionId, start with empty chat
      console.log('No sessionId, clearing messages');
      setMessages([]);
      setIsLoading(false);
    }
  }, [sessionId, toast]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const getMessageClassName = (message: UIMessage) => {
    return message.type === 'user' ? 'chat-message-user' : 'chat-message-ai';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "The message has been copied to your clipboard"
    });
  };

  const handleRedo = async (originalPrompt: string) => {
    if (!sessionId || !originalPrompt) return;
    
    try {
      await chatApi.sendMessage({
        prompt: originalPrompt,
        chat_id: sessionId
      });
      
      window.location.reload();
      
      toast({
        title: "Message resent",
        description: "Your prompt has been resent to get a new response"
      });
    } catch (error) {
      console.error('Error resending message:', error);
      toast({
        title: "Error",
        description: "Failed to resend message",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (messageId: string, originalPrompt: string) => {
    const editEvent = new CustomEvent('editMessage', {
      detail: { messageId, originalPrompt }
    });
    window.dispatchEvent(editEvent);
  };

  const hasLaTeX = (content: string) => {
    return /\$\$[\s\S]*?\$\$|\$[^$\n]+?\$/.test(content);
  };

  const userName = profile?.first_name || 'there';

  return (
    <div className="flex flex-col h-full max-w-full">
      <ScrollArea className="flex-1 h-full">
        <div className="p-4 max-w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse text-gray-500">Loading conversation...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-center text-gray-500">
                <div className="text-4xl font-serif font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                  <RotatingText
                    texts={greetings}
                    rotationInterval={2500}
                    staggerDuration={0.05}
                    mainClassName="text-4xl font-serif font-bold"
                    transition={{ type: "spring", damping: 20, stiffness: 200 }}
                    splitBy="words"
                  />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                    {userName}
                  </span>
                </div>
                <p className="text-lg text-gray-600 mb-4">
                  Ready to study something new today?
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex flex-col max-w-full">
                  <div className={`${getMessageClassName(message)} max-w-full word-wrap break-words`}>
                    <div className="mb-1 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {message.type === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <div className="text-left max-w-full overflow-hidden">
                      {hasLaTeX(message.content) ? (
                        <LaTeXRenderer content={message.content} />
                      ) : (
                        <div className="whitespace-pre-line break-words max-w-full">
                          {message.content}
                        </div>
                      )}
                    </div>
                    {message.type === 'ai' && (
                      <MessageActions
                        content={message.content}
                        originalPrompt={message.originalPrompt || ''}
                        messageId={message.id}
                        onCopy={handleCopy}
                        onRedo={handleRedo}
                        onEdit={handleEdit}
                      />
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatMessages;
