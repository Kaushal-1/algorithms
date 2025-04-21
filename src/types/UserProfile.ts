
export type UserType = 'school_student' | 'college_student' | 'working_professional' | 'other';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'expert';

export interface KnownTopic {
  id: string;
  name: string;
  selected: boolean;
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
}
