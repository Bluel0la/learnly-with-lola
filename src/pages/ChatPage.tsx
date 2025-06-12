
import React from 'react';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';

type ChatPageProps = {
  sessionId?: string;
}

const ChatPage = ({ sessionId }: ChatPageProps) => {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <ChatMessages sessionId={sessionId} />
      </div>
      <div className="flex-shrink-0 border-t border-border bg-background">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatPage;
