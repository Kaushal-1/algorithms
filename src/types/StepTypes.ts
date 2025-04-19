
export type Step = 'userType' | 'details' | 'topic' | 'experience' | 'roadmap';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Named string literals for comparison safety
export const USER_TYPE_STEP = 'userType' as const;
export const DETAILS_STEP = 'details' as const;
export const TOPIC_STEP = 'topic' as const;
export const EXPERIENCE_STEP = 'experience' as const;
export const ROADMAP_STEP = 'roadmap' as const;
