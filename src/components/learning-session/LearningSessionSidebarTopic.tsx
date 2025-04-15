
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TopicProps {
  step: {
    step: number;
    title: string;
    detailedContent?: Array<{
      title: string;
      sections: Array<{
        title: string;
        items: string[];
      }>;
    }>;
  };
  isSelected: boolean;
  onSelect: (topicId: string, subtopic?: string) => void;
}

const LearningSessionSidebarTopic: React.FC<TopicProps> = ({
  step,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={cn(
        "mb-1 rounded-md",
        isSelected ? "bg-primary/20" : "hover:bg-muted"
      )}
    >
      <Accordion type="single" collapsible>
        <AccordionItem value={`step-${step.step}`} className="border-0">
          <AccordionTrigger
            className={cn(
              "px-2 py-2 w-full hover:no-underline",
              isSelected && "text-primary font-medium"
            )}
            onClick={() => onSelect(step.step.toString())}
          >
            <div className="flex items-center w-full">
              <div className="mr-2 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-muted">
                {step.step}
              </div>
              <span className="truncate">{step.title}</span>
            </div>
          </AccordionTrigger>
          
          <AccordionContent className="pb-0">
            <div className="pl-8 space-y-1">
              {step.detailedContent?.map((chapter, chapterIndex) => (
                <Button
                  key={chapterIndex}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm font-normal h-8"
                  onClick={() => onSelect(step.step.toString(), chapter.title)}
                >
                  {chapter.title.replace(/Chapter \d+: /, '')}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LearningSessionSidebarTopic;
