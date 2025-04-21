
import React from 'react';
import { useLearningProfile } from '@/contexts/LearningProfileContext';
import UserTypeStep from './UserTypeStep';
import TopicSelectionStep from './TopicSelectionStep';
import ExperienceLevelStep from './ExperienceLevelStep';
import RoadmapGenerator from '@/components/RoadmapGenerator';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LearningFlowContainer: React.FC = () => {
  const { currentStep, userProfile, setCurrentStep } = useLearningProfile();
  const [roadmapData, setRoadmapData] = React.useState(null);
  const navigate = useNavigate();

  // This function will be called when the roadmap is generated in step 4
  // We replace RoadmapGenerator's "onFinish" prop to set roadmapData here
  const handleRoadmapReady = (data: any) => {
    setRoadmapData(data);
  };

  // Render the appropriate component based on the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <UserTypeStep />;
      case 2:
        return <TopicSelectionStep />;
      case 3:
        return <ExperienceLevelStep />;
      case 4:
        // Show only the roadmap and a button to continue
        return (
          <div className="flex flex-col gap-6 items-center">
            <RoadmapGenerator
              initialProfile={userProfile}
              onlyShowRoadmap
              onRoadmapReady={handleRoadmapReady}
            />
            <Button
              className="mt-4 w-full max-w-xs"
              size="lg"
              onClick={() => {
                navigate("/personalized-ai-tutor", {
                  state: {
                    roadmap: roadmapData,
                    profile: userProfile,
                  }
                });
              }}
              disabled={!roadmapData}
            >
              Move to Next Step
            </Button>
          </div>
        );
      default:
        return <UserTypeStep />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {currentStep < 4 && (
            <div className="w-full">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary text-primary-foreground">
                      Step {currentStep} of 3
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/20">
                  <div
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {renderStep()}
    </div>
  );
};

export default LearningFlowContainer;
