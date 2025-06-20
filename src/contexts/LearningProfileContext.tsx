
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserLearningProfile, UserType, ExperienceLevel, KnownTopic } from '../types/UserProfile';

interface LearningProfileContextType {
  userProfile: UserLearningProfile | null;
  setUserType: (type: UserType, customType?: string) => void;
  setTopic: (topic: string) => void;
  setExperienceLevel: (level: ExperienceLevel) => void;
  setKnownTopics: (topics: KnownTopic[]) => void;
  resetProfile: () => void;
  saveProfile: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const LearningProfileContext = createContext<LearningProfileContextType | undefined>(undefined);

const defaultProfile: UserLearningProfile = {
  userType: 'other',
  topic: '',
  experienceLevel: 'beginner',
  knownTopics: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const LearningProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserLearningProfile | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userLearningProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    } else {
      setUserProfile({ ...defaultProfile });
    }
  }, []);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('userLearningProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const setUserType = (type: UserType, customType?: string) => {
    setUserProfile(prev => {
      if (!prev) return { ...defaultProfile, userType: type, customUserType: customType };
      return { ...prev, userType: type, customUserType: customType, updatedAt: new Date() };
    });
    // Move directly to topic selection
    setCurrentStep(2);
  };

  const setTopic = (topic: string) => {
    setUserProfile(prev => {
      if (!prev) return { ...defaultProfile, topic };
      return { ...prev, topic, updatedAt: new Date() };
    });
  };

  const setExperienceLevel = (level: ExperienceLevel) => {
    setUserProfile(prev => {
      if (!prev) return { ...defaultProfile, experienceLevel: level };
      return { ...prev, experienceLevel: level, updatedAt: new Date() };
    });
  };

  const setKnownTopics = (topics: KnownTopic[]) => {
    setUserProfile(prev => {
      if (!prev) return { ...defaultProfile, knownTopics: topics };
      return { ...prev, knownTopics: topics, updatedAt: new Date() };
    });
  };

  const resetProfile = () => {
    setUserProfile({ ...defaultProfile });
    setCurrentStep(1);
  };

  const saveProfile = () => {
    if (userProfile) {
      localStorage.setItem('userLearningProfile', JSON.stringify(userProfile));
    }
  };

  return (
    <LearningProfileContext.Provider
      value={{
        userProfile,
        setUserType,
        setTopic,
        setExperienceLevel,
        setKnownTopics,
        resetProfile,
        saveProfile,
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </LearningProfileContext.Provider>
  );
};

export const useLearningProfile = () => {
  const context = useContext(LearningProfileContext);
  if (context === undefined) {
    throw new Error('useLearningProfile must be used within a LearningProfileProvider');
  }
  return context;
};
