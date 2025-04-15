
import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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
        
        <div className="text-sm prose prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-2" {...props} />,
              h4: ({node, ...props}) => <h4 className="text-sm font-semibold mb-1" {...props} />,
              p: ({node, ...props}) => <p className="mb-2" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
              li: ({node, ...props}) => <li className="mb-1" {...props} />,
              code: ({node, inline, ...props}) => 
                inline ? (
                  <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props} />
                ) : (
                  <pre className="p-3 bg-muted rounded-md my-2 overflow-x-auto">
                    <code className="text-sm font-mono" {...props} />
                  </pre>
                ),
            }}
          >
            {message.content}
          </ReactMarkdown>
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
