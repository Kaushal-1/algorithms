export type UserType = 'school_student' | 'college_student' | 'working_professional' | 'other';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'expert';

export interface KnownTopic {
  id: string;
  name: string;
  selected: boolean;
}

export interface SchoolStudentDetails {
  schoolName: string;
  standard: string;
  board: string;
  phoneNumber: string;
  dob: string;
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
  schoolDetails?: SchoolStudentDetails;
  collegeDetails?: CollegeStudentDetails;
  professionalDetails?: WorkingProfessionalDetails;
  roadmapId?: string;
  syllabusId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
