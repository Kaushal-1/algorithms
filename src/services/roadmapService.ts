
import { Roadmap, RoadmapStep } from '@/components/RoadmapDisplay';
import { ExperienceLevel } from '@/types/StepTypes';
import { callGroqApi } from './groqApi';
import { createFallbackDetailedContent, createDefaultRoadmap } from '@/utils/roadmapUtils';

const ROADMAP_SYSTEM_PROMPT = `You are an AI roadmap assistant that provides structured learning paths based on user input.

The user will provide:
- Their experience level (beginner/intermediate/advanced)
- A learning goal or topic (e.g., "Learn Full Stack Web Development", "DSA with Java", "Python for AI")

Your task is to return a clear, multi-step roadmap that can be visually represented like a journey path.

Output Format:
Return the roadmap in a structured JSON format with these fields:
- experience: The experience level provided
- topic: The topic/goal provided
- steps: An array of steps, each with:
  - step: Number (starting from 1)
  - title: Short, clear title (1 line)
  - description: Brief description (1-2 sentences)
  - icon: An emoji representing the step

DO NOT include any explanations outside of the JSON structure.
Use 1-line titles and 1-2 line descriptions.
Keep the number of steps between 6 to 10.
Assign a relevant emoji icon for each step (used in UI rendering).`;

const DETAIL_SYSTEM_PROMPT = `You are an AI educational content creator that provides detailed syllabus information.

For the given roadmap step, create a detailed chapter-by-chapter breakdown with specific topics to learn.

Output Format:
Return the detailed content in this JSON structure:
{
  "detailedContent": [
    {
      "title": "Chapter 1: Introduction to [Topic]",
      "sections": [
        {
          "title": "What is [Topic]?",
          "items": ["Concept 1", "Concept 2", "Concept 3"]
        },
        {
          "title": "History & Fundamentals",
          "items": ["Item 1", "Item 2", "Item 3"]
        }
      ]
    }
  ]
}

Create 2-4 chapters per step, with 2-3 sections per chapter, and 3-5 items per section.
Focus on specific, actionable learning items.
Return only JSON without explanations or markdown.`;

export const generateBasicRoadmap = async (experience: ExperienceLevel, topic: string): Promise<Roadmap> => {
  try {
    const userPrompt = `Create a learning roadmap for a ${experience} level learner who wants to learn: ${topic}`;
    const roadmapString = await callGroqApi(ROADMAP_SYSTEM_PROMPT, userPrompt);
    
    try {
      return JSON.parse(roadmapString);
    } catch (parseError) {
      const jsonMatch = roadmapString.match(/```(?:json)?\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      }
      throw new Error('Invalid JSON format in response');
    }
  } catch (error) {
    console.error('Error generating roadmap:', error);
    return createDefaultRoadmap(experience, topic);
  }
};

export const enhanceRoadmapWithDetails = async (basicRoadmap: Roadmap): Promise<Roadmap> => {
  try {
    const enhancedSteps: RoadmapStep[] = [];
    
    for (const step of basicRoadmap.steps) {
      const userPrompt = `Create a detailed syllabus for Step ${step.step}: "${step.title}" in the context of ${basicRoadmap.topic} for ${basicRoadmap.experience} level learners. The step description is: "${step.description}"`;
      
      const detailedContentString = await callGroqApi(DETAIL_SYSTEM_PROMPT, userPrompt);
      let detailedContent = null;
      
      try {
        detailedContent = JSON.parse(detailedContentString);
      } catch (parseError) {
        const jsonMatch = detailedContentString.match(/```(?:json)?\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          try {
            detailedContent = JSON.parse(jsonMatch[1]);
          } catch (nestedError) {
            console.error(`Failed to parse JSON from code block for step ${step.step}:`, nestedError);
            detailedContent = createFallbackDetailedContent(step);
          }
        } else {
          console.error(`Failed to parse detailed content JSON for step ${step.step}:`, parseError);
          detailedContent = createFallbackDetailedContent(step);
        }
      }
      
      enhancedSteps.push({
        ...step,
        detailedContent: detailedContent?.detailedContent || createFallbackDetailedContent(step).detailedContent
      });
    }
    
    return {
      ...basicRoadmap,
      steps: enhancedSteps
    };
  } catch (error) {
    console.error('Error enhancing roadmap with details:', error);
    return basicRoadmap;
  }
};
