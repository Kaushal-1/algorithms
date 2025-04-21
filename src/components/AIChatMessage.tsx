
import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isCode?: boolean;
}

interface AIChatMessageProps {
  message: ChatMessage;
}

const AIChatMessage: React.FC<AIChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  
  // Function to render content with code blocks if present
  const renderMessageContent = () => {
    if (!message.isCode) {
      return (
        <div className="whitespace-pre-wrap markdown-content">
          {message.content}
        </div>
      );
    }
    
    // Handle code blocks in messages
    let parts = message.content.split(/```(\w+)?\n([\s\S]*?)```/g);
    if (parts.length === 1) {
      return <div className="whitespace-pre-wrap">{message.content}</div>;
    }
    
    return (
      <div className="whitespace-pre-wrap">
        {parts.map((part, i) => {
          if (i % 4 === 0) {
            // Text before code block
            return part ? <div key={i}>{part}</div> : null;
          } else if (i % 4 === 1) {
            // Language identifier, skip in rendering
            return null;
          } else if (i % 4 === 2) {
            // Code content
            return (
              <pre key={i} className="p-3 bg-algos-darker rounded-md my-2 overflow-x-auto">
                <code className="text-sm text-accent font-mono">{part}</code>
              </pre>
            );
          }
          return null;
        })}
      </div>
    );
  };
  
  return (
    <div 
      className={cn(
        "flex items-start space-x-3 p-3 rounded-lg max-w-[85%]",
        isAssistant ? "bg-muted/30 mr-auto" : "bg-primary/10 ml-auto"
      )}
    >
      {isAssistant && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center mb-1">
          <span className="font-medium text-sm">
            {isAssistant ? "AI Tutor" : "You"}
          </span>
          <span className="text-xs text-muted-foreground ml-2">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className="text-sm">
          {renderMessageContent()}
        </div>
      </div>
      
      {!isAssistant && (
        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-secondary" />
        </div>
      )}
    </div>
  );
};

export default AIChatMessage;
