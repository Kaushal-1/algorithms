
import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Save } from 'lucide-react';

interface ChatInputBarProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
  handleManualSave: () => void;
  isProcessing: boolean;
}

const ChatInputBar: React.FC<ChatInputBarProps> = ({
  input,
  setInput,
  handleSendMessage,
  handleManualSave,
  isProcessing
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="p-4 border-t border-border bg-card/30">
      <div className="max-w-3xl mx-auto flex items-center gap-2">
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this topic..."
          className="flex-grow bg-background/50"
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
        />
        
        <Button
          onClick={handleSendMessage}
          disabled={isProcessing || !input.trim()}
          size="icon"
          className="bg-primary hover:bg-primary/90"
        >
          <Send className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={handleManualSave}
          variant="outline"
          size="icon"
          className="bg-card/50"
        >
          <Save className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInputBar;
