
import React from 'react';
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
  return (
    <div className="p-4 border-t border-border/50 bg-muted/30">
      <div className="flex items-center space-x-2">
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Ask about this topic..."
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          className="flex-1 bg-card/70 border-border"
        />
        <Button 
          onClick={onSend} 
          disabled={isProcessing || !input.trim()}
          size="icon"
          className="bg-primary hover:bg-primary/90"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
