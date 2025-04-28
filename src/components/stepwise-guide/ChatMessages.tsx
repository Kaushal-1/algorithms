
import React, { useRef, useEffect } from 'react';
import { Loader } from 'lucide-react';
import AIChatMessage from '@/components/AIChatMessage';
import { ChatMessage } from '@/types/ChatSession';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isProcessing: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isProcessing
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <AIChatMessage 
          key={message.id}
          message={message}
        />
      ))}
      
      {isProcessing && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground p-3 rounded-lg bg-muted/30 max-w-[80%] ml-auto">
          <Loader className="h-4 w-4 animate-spin" />
          <span>AI tutor is thinking...</span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
