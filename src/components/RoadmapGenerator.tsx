
import React, { useState, useRef, useEffect } from 'react';
import { Roadmap, RoadmapStep } from './RoadmapDisplay';
import RoadmapDisplay from './RoadmapDisplay';
import ExperienceSelector from './ExperienceSelector';
import TopicInput from './TopicInput';
import StepwiseAIGuide from './StepwiseAIGuide';
import { Button } from '@/components/ui/button';
import { ChevronLeft, RotateCcw } from 'lucide-react';

type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
type Step = 'experience' | 'topic' | 'roadmap';

const RoadmapGenerator: React.FC = () => {
  // Flow state
  const [currentStep, setCurrentStep] = useState<Step>('experience');
  const [selectedExperience, setSelectedExperience] = useState<ExperienceLevel | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Roadmap state
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [currentRoadmapStep, setCurrentRoadmapStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Groq API key
  const GROQ_API_KEY = "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";
  
  const handleExperienceSelect = (level: ExperienceLevel) => {
    setSelectedExperience(level);
    setCurrentStep('topic');
  };
  
  const handleTopicSubmit = async (topic: string) => {
    setSelectedTopic(topic);
    setIsGenerating(true);
    
    try {
      const generatedRoadmap = await generateRoadmap(selectedExperience as ExperienceLevel, topic);
      setRoadmap(generatedRoadmap);
      setCurrentRoadmapStep(1);
      setCompletedSteps([]);
      setCurrentStep('roadmap');
    } catch (error) {
      console.error('Error generating roadmap:', error);
      // Handle error state
    } finally {
      setIsGenerating(false);
    }
  };
  
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
      
      // Extract JSON from the response
      let jsonMatch = roadmapString.match(/```json\n([\s\S]*?)\n```/);
      let roadmapJson: Roadmap;
      
      if (jsonMatch && jsonMatch[1]) {
        // If JSON is in code block format
        roadmapJson = JSON.parse(jsonMatch[1]);
      } else {
        // If JSON is returned directly
        roadmapJson = JSON.parse(roadmapString);
      }
      
      return roadmapJson;
      
    } catch (error) {
      console.error('Error generating roadmap:', error);
      // Fallback to a simple roadmap if API fails
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
  
  const handleStepComplete = (step: number) => {
    setCompletedSteps(prev => [...prev, step]);
  };
  
  const handleNextStep = () => {
    if (roadmap && currentRoadmapStep < roadmap.steps.length) {
      setCurrentRoadmapStep(prev => prev + 1);
    }
  };
  
  const handleReset = () => {
    setCurrentStep('experience');
    setSelectedExperience(null);
    setSelectedTopic('');
    setRoadmap(null);
    setCompletedSteps([]);
  };
  
  const handleBack = () => {
    if (currentStep === 'topic') {
      setCurrentStep('experience');
    } else if (currentStep === 'roadmap') {
      setCurrentStep('topic');
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Header with navigation */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white font-heading">
          AI Learning Roadmap <span className="text-primary">.</span>
        </h1>
        
        <div className="flex gap-2">
          {currentStep !== 'experience' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="bg-card/40 border-border/50 hover:bg-card/60"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="bg-card/40 border-border/50 hover:bg-card/60"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Start Over
          </Button>
        </div>
      </div>
      
      {/* Step 1: Experience Selection */}
      {currentStep === 'experience' && (
        <ExperienceSelector
          selectedLevel={selectedExperience}
          onSelect={handleExperienceSelect}
        />
      )}
      
      {/* Step 2: Topic Input */}
      {currentStep === 'topic' && (
        <TopicInput
          onSubmit={handleTopicSubmit}
          isLoading={isGenerating}
        />
      )}
      
      {/* Step 3 & 4: Roadmap Display and Interactive Guide */}
      {currentStep === 'roadmap' && roadmap && (
        <div className="space-y-8">
          <RoadmapDisplay
            roadmap={roadmap}
            currentStep={currentRoadmapStep}
            onStepComplete={handleStepComplete}
            completedSteps={completedSteps}
          />
          
          <StepwiseAIGuide
            roadmap={roadmap}
            currentStep={currentRoadmapStep}
            onNextStep={handleNextStep}
            isLastStep={currentRoadmapStep === roadmap.steps.length}
          />
        </div>
      )}
    </div>
  );
};

export default RoadmapGenerator;
