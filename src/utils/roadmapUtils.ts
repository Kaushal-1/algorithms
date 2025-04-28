
import { Roadmap, RoadmapStep } from '@/components/RoadmapDisplay';
import { ExperienceLevel } from '@/types/StepTypes';

export const createFallbackDetailedContent = (step: RoadmapStep) => ({
  detailedContent: [
    {
      title: `Chapter 1: ${step.title} Fundamentals`,
      sections: [
        {
          title: "Key Concepts",
          items: ["Basic principles", "Core terminology", "Foundational elements"]
        },
        {
          title: "Learning Resources",
          items: ["Recommended books", "Online tutorials", "Practice exercises"]
        }
      ]
    },
    {
      title: `Chapter 2: Applying ${step.title}`,
      sections: [
        {
          title: "Practical Applications",
          items: ["Real-world examples", "Common use cases", "Implementation strategies"]
        },
        {
          title: "Advanced Topics",
          items: ["Specialized techniques", "Optimization methods", "Best practices"]
        }
      ]
    }
  ]
});

export const createDefaultRoadmap = (experience: ExperienceLevel, topic: string): Roadmap => ({
  experience,
  topic,
  steps: [
    {
      step: 1,
      title: "Getting Started",
      description: "Introduction to the basics of this topic.",
      icon: "🚀"
    },
    {
      step: 2,
      title: "Core Concepts",
      description: "Understanding the fundamental concepts.",
      icon: "📘"
    },
    {
      step: 3,
      title: "Practical Application",
      description: "Applying what you've learned in projects.",
      icon: "🛠️"
    },
    {
      step: 4,
      title: "Advanced Topics",
      description: "Exploring more complex areas of the subject.",
      icon: "🔍"
    },
    {
      step: 5,
      title: "Mastery",
      description: "Becoming proficient through practice and application.",
      icon: "🏆"
    }
  ]
});
