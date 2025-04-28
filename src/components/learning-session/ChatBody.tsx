
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import AIChatMessage from '@/components/AIChatMessage';
import { Loader } from 'lucide-react';
import { ChatMessage } from '@/types/ChatSession';

interface ChatBodyProps {
  messages: ChatMessage[];
  isProcessing: boolean;
}

const ChatBody: React.FC<ChatBodyProps> = ({ messages, isProcessing }) => {
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
    <ScrollArea ref={scrollAreaRef} className="flex-grow p-4">
      <div className="max-w-3xl mx-auto space-y-4 pb-4">
        {messages.map((message) => (
          <AIChatMessage key={message.id} message={message} />
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

export default ChatBody;
