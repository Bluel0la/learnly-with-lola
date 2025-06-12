
import React from 'react';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';

type ChatPageProps = {
  sessionId?: string;
}

const ChatPage = ({ sessionId }: ChatPageProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <ChatMessages sessionId={sessionId} />
      </div>
      <div className="flex-shrink-0">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatPage;
