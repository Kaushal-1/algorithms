
import React, { useRef, useEffect } from 'react';
import { Loader } from 'lucide-react';
import AIChatMessage from '@/components/AIChatMessage';
import { ChatMessage } from '@/types/ChatSession';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isProcessing: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isProcessing
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1">
      <div className="p-4 space-y-4">
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
        
        {messages.length === 0 && !isProcessing && (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Loading conversation...</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
