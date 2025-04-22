
import React from 'react';
import { useLearningProfile } from '@/contexts/LearningProfileContext';
import UserTypeStep from './UserTypeStep';
import UserDetailsStep from './UserDetailsStep';
import TopicSelectionStep from './TopicSelectionStep';
import ExperienceLevelStep from './ExperienceLevelStep';
import RoadmapGenerator from '@/components/RoadmapGenerator';

const LearningFlowContainer: React.FC = () => {
  const { currentStep, userProfile } = useLearningProfile();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <UserTypeStep />;
      case 2:
        // Show UserDetailsStep only for college_student and working_professional
        if (userProfile?.userType === 'college_student' || userProfile?.userType === 'working_professional') {
          return <UserDetailsStep />;
        }
        return <TopicSelectionStep />;
      case 3:
        // For college_student and working_professional, this is TopicSelectionStep
        // For others, this is ExperienceLevelStep
        if (userProfile?.userType === 'college_student' || userProfile?.userType === 'working_professional') {
          return <TopicSelectionStep />;
        }
        return <ExperienceLevelStep />;
      case 4:
        // For college_student and working_professional, this is ExperienceLevelStep
        // For others, this is RoadmapGenerator
        if (userProfile?.userType === 'college_student' || userProfile?.userType === 'working_professional') {
          return <ExperienceLevelStep />;
        }
        return <RoadmapGenerator initialProfile={userProfile} />;
      case 5:
        return <RoadmapGenerator initialProfile={userProfile} />;
      default:
        return <UserTypeStep />;
    }
  };

  // Calculate total steps based on user type
  const getTotalSteps = () => {
    if (userProfile?.userType === 'college_student' || userProfile?.userType === 'working_professional') {
      return 4; // UserType -> UserDetails -> Topic -> Experience -> Roadmap (5 steps but progress shows 4)
    }
    return 3; // UserType -> Topic -> Experience -> Roadmap (4 steps but progress shows 3)
  };

  const totalSteps = getTotalSteps();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {currentStep < 5 && (
            <div className="w-full">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary text-primary-foreground">
                      Step {currentStep > totalSteps ? totalSteps : currentStep} of {totalSteps}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/20">
                  <div
                    style={{ width: `${(Math.min(currentStep, totalSteps) / totalSteps) * 100}%` }}
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
