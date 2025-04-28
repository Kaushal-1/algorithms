
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { RoadmapStep } from '@/components/RoadmapDisplay';

interface ChatHeaderProps {
  topic: RoadmapStep;
  onBackToRoadmap: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ topic, onBackToRoadmap }) => {
  return (
    <div className="p-4 border-b border-border flex justify-between items-center bg-card/30">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToRoadmap}
          className="mb-2"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Roadmap
        </Button>
        
        <h1 className="text-xl font-bold">
          {topic ? topic.title : 'Learning Session'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {topic.description && topic.description.substring(0, 100)}
          {topic.description && topic.description.length > 100 ? '...' : ''}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
