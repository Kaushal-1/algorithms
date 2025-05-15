
import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isProcessing: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  onInputChange,
  onSend,
  isProcessing
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="p-4 border-t border-border/50 bg-muted/20">
      <div className="flex items-center gap-2 bg-muted/30 rounded-xl border border-border/50 p-1 pl-4">
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Ask about this topic..."
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
          className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
        />
        <Button 
          onClick={onSend} 
          disabled={isProcessing || !input.trim()}
          size="icon"
          className="bg-primary hover:bg-primary/90 rounded-lg"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
