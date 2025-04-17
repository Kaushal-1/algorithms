
import React from 'react';
import { useLearningProfile } from '@/contexts/LearningProfileContext';
import UserTypeStep from './UserTypeStep';
import SchoolStudentForm from './SchoolStudentForm';
import CollegeStudentForm from './CollegeStudentForm';
import WorkingProfessionalForm from './WorkingProfessionalForm';
import ExperienceLevelStep from './ExperienceLevelStep';
import TopicSelectionStep from './TopicSelectionStep';

const LearningFlowContainer: React.FC = () => {
  const { currentStep, userProfile } = useLearningProfile();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <UserTypeStep />;
      case 2:
        // Show different form based on user type
        if (userProfile?.userType === 'school_student') {
          return <SchoolStudentForm />;
        } else if (userProfile?.userType === 'college_student') {
          return <CollegeStudentForm />;
        } else if (userProfile?.userType === 'working_professional') {
          return <WorkingProfessionalForm />;
        } else {
          return <ExperienceLevelStep />;
        }
      case 3:
        return <ExperienceLevelStep />;
      case 4:
        return <TopicSelectionStep />;
      default:
        return <UserTypeStep />;
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-12">
      {renderStepContent()}
    </div>
  );
};

export default LearningFlowContainer;
