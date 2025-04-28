
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SessionControlsProps {
  onSave: () => void;
  onNextStep: () => void;
  isLastStep: boolean;
  title: string;
  topic: string;
  experience: string;
  currentStep: number;
  totalSteps: number;
}

export const SessionControls: React.FC<SessionControlsProps> = ({
  onSave,
  onNextStep,
  isLastStep,
  title,
  topic,
  experience,
  currentStep,
  totalSteps
}) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="font-medium text-lg flex items-center">
          <span className="text-xl mr-2" role="img" aria-label="Current step icon">
            {title ? "🧠" : "Learning Guide"}
          </span>
          {title}
        </h2>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          className="bg-card/40 border-border/50 hover:bg-card/60"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Session
        </Button>
      </div>
      
      <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-xl h-[350px] flex flex-col">
        <div className="p-4 border-b border-border/50 bg-muted/30">
          <p className="text-sm text-muted-foreground">
            {topic} • {experience} level • Step {currentStep} of {totalSteps}
          </p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={onNextStep}
          disabled={isLastStep}
          className={cn(
            "gap-2",
            isLastStep ? "bg-green-500 hover:bg-green-600" : ""
          )}
        >
          {isLastStep ? "Complete Roadmap" : "Move to Next Step"}
        </Button>
      </div>
    </>
  );
};
