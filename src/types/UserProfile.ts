
export type UserType = 'school_student' | 'college_student' | 'working_professional' | 'other';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'expert';

export interface KnownTopic {
  id: string;
  name: string;
  selected: boolean;
}

export interface SchoolStudentDetails {
  standard?: string;
  schoolName?: string;
  board?: string;
}

export interface CollegeStudentDetails {
  degree?: string;
  domain?: string;
  collegeName?: string;
}

export interface WorkingProfessionalDetails {
  companyName?: string;
  currentRole?: string;
  experienceYears?: string;
  domain?: string;
}

export interface UserLearningProfile {
  id?: string;
  userType: UserType;
  customUserType?: string;
  topic: string;
  experienceLevel: ExperienceLevel;
  knownTopics?: KnownTopic[];
  roadmapId?: string;
  syllabusId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Dynamic details based on user type
  schoolDetails?: SchoolStudentDetails;
  collegeDetails?: CollegeStudentDetails;
  professionalDetails?: WorkingProfessionalDetails;
}
