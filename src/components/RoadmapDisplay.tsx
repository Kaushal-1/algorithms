
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  icon: string;
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

  const toggleStep = (step: number) => {
    setExpandedStep(expandedStep === step ? null : step);
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapDisplay;
