
export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
  verified: boolean;
  expertise: string[];
  social_links?: Record<string, string>;
  stats?: {
    posts: number;
    followers: number;
    following: number;
  };
}

export interface UpdateProfileRequest {
  username?: string;
  bio?: string;
  avatar_url?: string;
  expertise?: string[];
  social_links?: Record<string, string>;
}

// Learning profile types
export type UserType = 'school_student' | 'college_student' | 'working_professional' | 'other';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'expert';

export interface KnownTopic {
  id: string;
  name: string;
  selected: boolean;
}

export interface UserLearningProfile {
  userType: UserType;
  customUserType?: string;
  topic: string;
  experienceLevel: ExperienceLevel;
  knownTopics: KnownTopic[];
  createdAt: Date;
  updatedAt: Date;
}
