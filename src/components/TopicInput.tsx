
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Loader } from 'lucide-react';

interface TopicInputProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

const TopicInput: React.FC<TopicInputProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic.trim());
    }
  };

  const examples = [
    "Python for Data Science",
    "Full Stack Web Development",
    "Machine Learning Fundamentals",
    "DSA with JavaScript",
    "Cloud Computing Architecture"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">What do you want to learn?</h2>
        <p className="text-muted-foreground text-sm">
          Enter the subject, skill, or domain you want to create a learning roadmap for
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Full Stack Web Development"
          className="bg-card/70 border-border h-12"
          disabled={isLoading}
        />
        
        <Button 
          type="submit" 
          className="w-full h-12 gap-2"
          disabled={!topic.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Generating Roadmap...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Learning Roadmap
            </>
          )}
        </Button>
      </form>
      
      <div className="pt-2">
        <p className="text-sm text-muted-foreground mb-2">Example topics:</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example}
              className="px-3 py-1 bg-muted/30 hover:bg-muted/50 rounded-md text-sm cursor-pointer transition-colors"
              onClick={() => setTopic(example)}
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicInput;
