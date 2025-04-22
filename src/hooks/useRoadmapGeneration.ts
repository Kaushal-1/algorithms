
import { useState } from 'react';
import { Roadmap, RoadmapStep } from '@/components/RoadmapDisplay';
import { ExperienceLevel } from '@/types/StepTypes';
import { toast } from 'sonner';

const GROQ_API_KEY = "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";

export const useRoadmapGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  const generateRoadmap = async (experience: ExperienceLevel, topic: string): Promise<Roadmap> => {
    const systemPrompt = `You are an AI roadmap assistant that provides structured learning paths based on user input.

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

    const userPrompt = `Create a learning roadmap for a ${experience} level learner who wants to learn: ${topic}`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const roadmapString = data.choices[0].message.content;
      let roadmapJson: Roadmap;
      
      try {
        roadmapJson = JSON.parse(roadmapString);
      } catch (parseError) {
        const jsonMatch = roadmapString.match(/```(?:json)?\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          try {
            roadmapJson = JSON.parse(jsonMatch[1]);
          } catch (nestedError) {
            console.error('Failed to parse JSON from code block:', nestedError);
            throw new Error('Invalid JSON format in response');
          }
        } else {
          console.error('Failed to parse roadmap JSON:', parseError);
          throw new Error('Invalid JSON format in response');
        }
      }
      
      return roadmapJson;
      
    } catch (error) {
      console.error('Error generating roadmap:', error);
      return {
        experience: experience,
        topic: topic,
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
      };
    }
  };

  const enhanceRoadmapWithDetails = async (basicRoadmap: Roadmap): Promise<Roadmap> => {
    try {
      const systemPrompt = `You are an AI educational content creator that provides detailed syllabus information.

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

      const enhancedSteps: RoadmapStep[] = [];
      
      for (const step of basicRoadmap.steps) {
        const userPrompt = `Create a detailed syllabus for Step ${step.step}: "${step.title}" in the context of ${basicRoadmap.topic} for ${basicRoadmap.experience} level learners. The step description is: "${step.description}"`;
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 1500
          })
        });

        if (!response.ok) {
          throw new Error(`Groq API error: ${response.status}`);
        }

        const data = await response.json();
        const detailedContentString = data.choices[0].message.content;
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

  const createFallbackDetailedContent = (step: RoadmapStep) => ({
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

  const handleTopicSubmit = async (experience: ExperienceLevel, topic: string) => {
    setIsGenerating(true);
    
    try {
      const generatedRoadmap = await generateRoadmap(experience, topic);
      const enhancedRoadmap = await enhanceRoadmapWithDetails(generatedRoadmap);
      
      enhancedRoadmap.id = `roadmap-${Date.now()}`;
      localStorage.setItem('currentRoadmap', JSON.stringify(enhancedRoadmap));
      
      setRoadmap(enhancedRoadmap);
      return enhancedRoadmap;
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast.error('Error generating roadmap. Please try again.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    roadmap,
    generateRoadmap: handleTopicSubmit,
    setRoadmap
  };
};
