
export type Step = 'experience' | 'topic' | 'roadmap';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

// Named string literals for comparison safety
export const EXPERIENCE_STEP = 'experience' as const;
export const TOPIC_STEP = 'topic' as const;
export const ROADMAP_STEP = 'roadmap' as const;
