
export type UserType = 'school_student' | 'college_student' | 'working_professional' | 'other';

export interface SchoolStudentDetails {
  standard: string;
  schoolName: string;
  board: string;
}

export interface CollegeStudentDetails {
  degree: string;
  domain: string;
  collegeName: string;
  year: string;
}

export interface WorkingProfessionalDetails {
  companyName: string;
  role: string;
  experience: string;
  domain: string;
}

export type UserTypeDetails = SchoolStudentDetails | CollegeStudentDetails | WorkingProfessionalDetails | { [key: string]: string };

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface KnownTopic {
  id: string;
  name: string;
  selected: boolean;
}

export interface UserLearningProfile {
  userType: UserType;
  customUserType?: string;
  userTypeDetails?: UserTypeDetails;
  experienceLevel: ExperienceLevel;
  topic: string;
  knownTopics?: KnownTopic[];
  createdAt?: Date;
  updatedAt?: Date;
  savedRoadmaps?: Array<{
    id: string;
    title: string;
    createdAt: string;
  }>;
}

export interface UserProfileContextType {
  userProfile: UserLearningProfile | null;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setUserType: (type: UserType, customType?: string) => void;
  setUserTypeDetails: (details: UserTypeDetails) => void;
  setExperienceLevel: (level: ExperienceLevel) => void;
  setTopic: (topic: string) => void;
  setKnownTopics: (topics: KnownTopic[]) => void;
  resetProfile: () => void;
  saveProfile: () => void;
}
