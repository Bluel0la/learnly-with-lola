
import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Copy, RotateCcw, Edit, User, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { chatApi } from '@/services/chatApi';
import ChatHero from './ChatHero';
import MessageActions from './MessageActions';
import MathRenderer from './MathRenderer';

interface ChatMessagesProps {
  sessionId?: string;
}

const ChatMessages = ({ sessionId }: ChatMessagesProps) => {
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['chat-messages', sessionId],
    queryFn: () => sessionId ? chatApi.getMessages(sessionId) : Promise.resolve([]),
    enabled: !!sessionId,
    refetchInterval: 2000, // Poll every 2 seconds for new messages
    refetchIntervalInBackground: true
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "Message content has been copied"
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleRedo = async (originalPrompt: string) => {
    if (!sessionId) return;
    
    try {
      // Send the original prompt again
      await chatApi.sendMessage(sessionId, originalPrompt);
      
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['chat-messages', sessionId] });
      
      toast({
        title: "Message resent",
        description: "Your question has been sent again"
      });
    } catch (error) {
      toast({
        title: "Failed to resend",
        description: "Could not resend the message",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (messageId: string, originalPrompt: string) => {
    setEditingMessageId(messageId);
    setEditingContent(originalPrompt);
  };

  const handleSaveEdit = async () => {
    if (!sessionId || !editingMessageId) return;
    
    try {
      // Send the edited message
      await chatApi.sendMessage(sessionId, editingContent);
      
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['chat-messages', sessionId] });
      
      setEditingMessageId(null);
      setEditingContent('');
      
      toast({
        title: "Message edited",
        description: "Your edited message has been sent"
      });
    } catch (error) {
      toast({
        title: "Failed to edit",
        description: "Could not send edited message",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load messages</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['chat-messages', sessionId] })}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full" ref={scrollAreaRef}>
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        {!sessionId || messages.length === 0 ? (
          <ChatHero />
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="group">
                <div className={`flex gap-3 md:gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10">
                    <AvatarFallback className={message.role === 'user' ? 'bg-blue-100' : 'bg-green-100'}>
                      {message.role === 'user' ? <User className="h-4 w-4 md:h-5 md:w-5" /> : <Bot className="h-4 w-4 md:h-5 md:w-5" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex-1 min-w-0 ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white ml-auto' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {editingMessageId === message.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="w-full p-2 border rounded resize-none text-gray-900"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm md:text-base">
                          {message.role === 'assistant' ? (
                            <MathRenderer content={message.content} />
                          ) : (
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {message.role === 'assistant' && editingMessageId !== message.id && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MessageActions
                          content={message.content}
                          originalPrompt={message.original_prompt || ''}
                          messageId={message.id}
                          onCopy={handleCopy}
                          onRedo={handleRedo}
                          onEdit={handleEdit}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
