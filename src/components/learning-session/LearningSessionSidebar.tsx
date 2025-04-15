
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Roadmap } from '@/components/RoadmapDisplay';
import { Menu, X } from 'lucide-react';
import LearningSessionSidebarTopic from './LearningSessionSidebarTopic';

interface LearningSessionSidebarProps {
  roadmap: Roadmap;
  selectedTopic: string | null;
  onSelectTopic: (topicId: string, subtopic?: string) => void;
}

const LearningSessionSidebar: React.FC<LearningSessionSidebarProps> = ({
  roadmap,
  selectedTopic,
  onSelectTopic
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  if (isCollapsed) {
    return (
      <div className="w-12 h-full bg-muted/30 border-r border-border flex flex-col items-center py-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="mb-4"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex-grow flex flex-col items-center space-y-2 overflow-y-auto">
          {roadmap.steps.map((step) => (
            <Button
              key={step.step}
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full w-8 h-8 text-xs",
                selectedTopic === step.step.toString() && "bg-primary text-primary-foreground"
              )}
              onClick={() => onSelectTopic(step.step.toString())}
            >
              {step.step}
            </Button>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-64 h-full bg-muted/30 border-r border-border flex flex-col">
      <div className="p-3 border-b border-border flex justify-between items-center">
        <h2 className="font-medium truncate">Learning Topics</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-grow">
        <div className="p-2">
          {roadmap.steps.map((step) => (
            <LearningSessionSidebarTopic
              key={step.step}
              step={step}
              isSelected={selectedTopic === step.step.toString()}
              onSelect={onSelectTopic}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LearningSessionSidebar;
