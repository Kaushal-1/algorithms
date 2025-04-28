
import React from 'react';
import { Roadmap } from './RoadmapDisplay';
import { useStepwiseChat } from '@/hooks/useStepwiseChat';
import { ChatInput } from './stepwise-guide/ChatInput';
import { ChatMessages } from './stepwise-guide/ChatMessages';
import { SessionControls } from './stepwise-guide/SessionControls';
import { toast } from 'sonner';

interface StepwiseAIGuideProps {
  roadmap: Roadmap;
  currentStep: number;
  onNextStep: () => void;
  isLastStep: boolean;
}

const StepwiseAIGuide: React.FC<StepwiseAIGuideProps> = ({ 
  roadmap, 
  currentStep,
  onNextStep,
  isLastStep
}) => {
  const currentStepData = roadmap.steps.find(step => step.step === currentStep);
  
  const {
    input,
    setInput,
    isProcessing,
    messages,
    handleSendMessage
  } = useStepwiseChat({ currentStep, currentStepData });

  const saveSession = () => {
    try {
      const session = {
        id: `session-${Date.now()}`,
        title: `${roadmap.topic} - Step ${currentStep}: ${currentStepData?.title || 'Learning'}`,
        roadmapId: roadmap.id,
        experience: roadmap.experience,
        topic: roadmap.topic,
        messages: messages,
        createdAt: new Date(),
      };
      
      const existingSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
      const updatedSessions = [session, ...existingSessions];
      localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
      
      toast.success('Chat session saved successfully!');
    } catch (error) {
      console.error('Error saving chat session:', error);
      toast.error('Failed to save chat session');
    }
  };
  
  return (
    <div className="space-y-4">
      <SessionControls
        onSave={saveSession}
        onNextStep={onNextStep}
        isLastStep={isLastStep}
        title={currentStepData?.title || "Learning Guide"}
        topic={roadmap.topic}
        experience={roadmap.experience}
        currentStep={currentStep}
        totalSteps={roadmap.steps.length}
      />
      
      <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-xl h-[350px] flex flex-col">
        <ChatMessages 
          messages={messages}
          isProcessing={isProcessing}
        />
        
        <ChatInput
          input={input}
          onInputChange={setInput}
          onSend={handleSendMessage}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};

export default StepwiseAIGuide;
