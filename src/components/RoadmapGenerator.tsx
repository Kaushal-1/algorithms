
import React, { useState, useEffect } from 'react';
import { UserLearningProfile } from '@/types/UserProfile';
import RoadmapDisplay from './RoadmapDisplay';
import ExperienceSelector from './ExperienceSelector';
import TopicInput from './TopicInput';
import StepwiseAIGuide from './StepwiseAIGuide';
import { Button } from '@/components/ui/button';
import RoadmapHeader from './roadmap/RoadmapHeader';
import { useRoadmapGeneration } from '@/hooks/useRoadmapGeneration';
import { generateRoadmapPdf } from '@/utils/roadmapPdfGenerator';
import { EXPERIENCE_STEP, TOPIC_STEP, ROADMAP_STEP } from '@/types/StepTypes';
import type { ExperienceLevel, Step } from '@/types/StepTypes';

interface RoadmapGeneratorProps {
  initialProfile?: UserLearningProfile | null;
}

const RoadmapGenerator: React.FC<RoadmapGeneratorProps> = ({ initialProfile }) => {
  const [currentStep, setCurrentStep] = useState<Step>(initialProfile ? ROADMAP_STEP : EXPERIENCE_STEP);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceLevel | null>(
    initialProfile ? (initialProfile.experienceLevel === 'expert' ? 'advanced' : initialProfile.experienceLevel) as ExperienceLevel : null
  );
  const [selectedTopic, setSelectedTopic] = useState<string>(initialProfile?.topic || '');
  const [currentRoadmapStep, setCurrentRoadmapStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const {
    isGenerating,
    roadmap,
    generateRoadmap,
    setRoadmap
  } = useRoadmapGeneration();
  
  useEffect(() => {
    if (initialProfile && !roadmap) {
      const experienceLevel = initialProfile.experienceLevel === 'expert' ? 'advanced' : initialProfile.experienceLevel;
      handleTopicSubmit(initialProfile.topic);
    }
  }, [initialProfile]);
  
  const handleExperienceSelect = (level: ExperienceLevel) => {
    setSelectedExperience(level);
    setCurrentStep(TOPIC_STEP);
  };
  
  const handleTopicSubmit = async (topic: string) => {
    setSelectedTopic(topic);
    const newRoadmap = await generateRoadmap(selectedExperience as ExperienceLevel, topic);
    if (newRoadmap) {
      setCurrentRoadmapStep(1);
      setCompletedSteps([]);
      setCurrentStep(ROADMAP_STEP);
    }
  };
  
  const handleStepComplete = (step: number) => {
    setCompletedSteps(prev => [...prev, step]);
  };
  
  const handleNextStep = () => {
    if (roadmap && currentRoadmapStep < roadmap.steps.length) {
      setCurrentRoadmapStep(prev => prev + 1);
    }
  };
  
  const handleReset = () => {
    setCurrentStep(EXPERIENCE_STEP);
    setSelectedExperience(null);
    setSelectedTopic('');
    setRoadmap(null);
    setCompletedSteps([]);
  };
  
  const handleBack = () => {
    if (currentStep === TOPIC_STEP) {
      setCurrentStep(EXPERIENCE_STEP);
    } else if (currentStep === ROADMAP_STEP) {
      setCurrentStep(TOPIC_STEP);
    }
  };
  
  const startLearningSession = () => {
    window.location.href = '/learning-session/1';
  };
  
  if (currentStep === ROADMAP_STEP && roadmap) {
    return (
      <div className="space-y-8">
        <RoadmapHeader
          initialProfile={initialProfile}
          onBack={handleBack}
          onReset={handleReset}
          onDownloadPdf={() => generateRoadmapPdf(roadmap)}
          hasRoadmap={!!roadmap}
        />
        
        <div className="space-y-8">
          <RoadmapDisplay
            roadmap={roadmap}
            currentStep={currentRoadmapStep}
            onStepComplete={handleStepComplete}
            completedSteps={completedSteps}
          />
          
          <div className="flex justify-center mt-8">
            <Button
              size="lg"
              onClick={startLearningSession}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8"
            >
              Start Learning with AI Guru
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <RoadmapHeader
        initialProfile={initialProfile}
        onBack={handleBack}
        onReset={handleReset}
        onDownloadPdf={() => roadmap && generateRoadmapPdf(roadmap)}
        hasRoadmap={!!roadmap}
      />
      
      {currentStep === EXPERIENCE_STEP && (
        <ExperienceSelector
          selectedLevel={selectedExperience}
          onSelect={handleExperienceSelect}
        />
      )}
      
      {currentStep === TOPIC_STEP && (
        <TopicInput
          onSubmit={handleTopicSubmit}
          isLoading={isGenerating}
        />
      )}
      
      {currentStep === ROADMAP_STEP && roadmap && (
        <div className="space-y-8">
          <RoadmapDisplay
            roadmap={roadmap}
            currentStep={currentRoadmapStep}
            onStepComplete={handleStepComplete}
            completedSteps={completedSteps}
          />
          
          <StepwiseAIGuide
            roadmap={roadmap}
            currentStep={currentRoadmapStep}
            onNextStep={handleNextStep}
            isLastStep={currentRoadmapStep === roadmap.steps.length}
          />
        </div>
      )}
    </div>
  );
};

export default RoadmapGenerator;
