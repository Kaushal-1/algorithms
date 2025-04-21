
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import StepwiseAIGuide from '@/components/StepwiseAIGuide';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const PersonalizedAITutor: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Roadmap and profile are passed via navigation state
  const roadmap = location.state?.roadmap;
  const profile = location.state?.profile;

  if (!roadmap) {
    // If roadmap not available, redirect to personalized-learning
    navigate("/personalized-learning");
    return null;
  }

  // Always start at first step
  const [currentStep, setCurrentStep] = React.useState(1);

  return (
    <div className="min-h-screen bg-algos-dark flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-0 pt-16">
        {/* Page header and back */}
        <div className="w-full max-w-3xl flex items-center px-4 py-2 border-b border-border/60 bg-card/40">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            onClick={() => navigate('/personalized-learning')}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Roadmap
          </Button>
          <h1 className="text-lg md:text-2xl font-bold text-foreground ml-2">
            AI Guru Chat
          </h1>
        </div>
        {/* Chat area */}
        <div className="flex-1 flex flex-col w-full max-w-3xl bg-card/40 backdrop-blur-md mt-0 md:mt-2 rounded-xl border border-border/60 shadow-lg overflow-hidden">
          <StepwiseAIGuide
            roadmap={roadmap}
            currentStep={currentStep}
            onNextStep={() => setCurrentStep(curr => Math.min(curr + 1, roadmap.steps.length))}
            isLastStep={currentStep === roadmap.steps.length}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalizedAITutor;
