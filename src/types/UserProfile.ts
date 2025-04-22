export type UserType = 'school_student' | 'college_student' | 'working_professional' | 'other';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'expert';

export interface KnownTopic {
  id: string;
  name: string;
  selected: boolean;
}

export interface CollegeStudentDetails {
  collegeName: string;
  course: string;
  year: string;
  phoneNumber: string;
  dob: string;
}

export interface WorkingProfessionalDetails {
  company: string;
  designation: string;
  experience: string;
  qualification: string;
  phoneNumber: string;
  dob: string;
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
  collegeDetails?: CollegeStudentDetails;
  professionalDetails?: WorkingProfessionalDetails;
  createdAt?: Date;
  updatedAt?: Date;
}
