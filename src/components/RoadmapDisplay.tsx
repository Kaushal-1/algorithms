
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronDown, ChevronUp, Book, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface DetailedContent {
  title: string;
  items: string[];
}

export interface ChapterContent {
  title: string;
  sections: DetailedContent[];
}

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  icon: string;
  detailedContent?: ChapterContent[]; // New field for detailed syllabus
}

export interface Roadmap {
  experience: string;
  topic: string;
  steps: RoadmapStep[];
}

interface RoadmapDisplayProps {
  roadmap: Roadmap;
  currentStep: number;
  onStepComplete: (step: number) => void;
  completedSteps: number[];
}

const RoadmapDisplay: React.FC<RoadmapDisplayProps> = ({
  roadmap,
  currentStep,
  onStepComplete,
  completedSteps
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(currentStep);
  const [showDetailedView, setShowDetailedView] = useState<number | null>(null);

  const toggleStep = (step: number) => {
    setExpandedStep(expandedStep === step ? null : step);
  };

  const toggleDetailedView = (step: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setShowDetailedView(showDetailedView === step ? null : step);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Your Personalized Learning Roadmap
        </h2>
        <p className="text-muted-foreground text-sm">
          {roadmap.experience} level roadmap for {roadmap.topic}
        </p>
      </div>

      <div className="space-y-4">
        {roadmap.steps.map((step) => {
          const isCompleted = completedSteps.includes(step.step);
          const isCurrent = currentStep === step.step;
          const isExpanded = expandedStep === step.step;
          const isDetailedViewOpen = showDetailedView === step.step;
          
          return (
            <div 
              key={step.step}
              className={cn(
                "rounded-lg border overflow-hidden transition-all",
                isCurrent ? "border-primary" : "border-border",
                isCompleted ? "bg-primary/5" : "bg-card/70"
              )}
            >
              <div 
                className={cn(
                  "flex items-center p-4 cursor-pointer",
                  isCurrent && "bg-primary/10"
                )}
                onClick={() => toggleStep(step.step)}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full mr-4 shrink-0">
                  <span className="text-2xl" role="img" aria-label={step.title}>
                    {step.icon}
                  </span>
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center">
                    <span className="text-xs mr-2 bg-primary/20 text-primary px-2 py-0.5 rounded">
                      Step {step.step}
                    </span>
                    <h3 className="font-medium">{step.title}</h3>
                  </div>
                </div>
                
                <div className="ml-4 flex items-center gap-2">
                  {isCompleted && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    onClick={(e) => toggleDetailedView(step.step, e)}
                  >
                    <Book className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
              
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-border/50 bg-background/30">
                  <p className="text-sm mb-4">{step.description}</p>
                  
                  {isCurrent && !isCompleted && (
                    <Button 
                      size="sm"
                      onClick={() => onStepComplete(step.step)}
                      className="bg-primary/20 text-primary hover:bg-primary/30"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </Button>
                  )}
                </div>
              )}
              
              {isDetailedViewOpen && (
                <div className="p-4 pt-0 border-t border-border/50 bg-background/40">
                  <div className="mt-4">
                    <h3 className="font-semibold text-lg mb-4 flex items-center">
                      <List className="mr-2 h-5 w-5" />
                      Detailed Syllabus for {step.title}
                    </h3>
                    
                    {step.detailedContent ? (
                      <Accordion type="single" collapsible className="w-full">
                        {step.detailedContent.map((chapter, chapterIndex) => (
                          <AccordionItem key={chapterIndex} value={`chapter-${chapterIndex}`}>
                            <AccordionTrigger className="text-md font-medium">
                              {chapter.title}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4 pt-2">
                                {chapter.sections.map((section, sectionIndex) => (
                                  <div key={sectionIndex} className="pl-2">
                                    <h5 className="font-medium text-sm mb-1">{section.title}</h5>
                                    <ul className="list-disc pl-5 space-y-1">
                                      {section.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className="text-sm text-muted-foreground">
                                          {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <p className="text-muted-foreground text-sm italic">
                        Detailed content for this step will be available soon.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapDisplay;
