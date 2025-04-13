
import React, { useState, useRef, useEffect } from 'react';
import { Roadmap, RoadmapStep, ChapterContent, DetailedContent } from './RoadmapDisplay';
import RoadmapDisplay from './RoadmapDisplay';
import ExperienceSelector from './ExperienceSelector';
import TopicInput from './TopicInput';
import StepwiseAIGuide from './StepwiseAIGuide';
import { Button } from '@/components/ui/button';
import { ChevronLeft, RotateCcw, Save, FileDown } from 'lucide-react';
import { UserLearningProfile } from '@/types/UserProfile';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
type Step = 'experience' | 'topic' | 'roadmap';

interface RoadmapGeneratorProps {
  initialProfile?: UserLearningProfile | null;
}

const RoadmapGenerator: React.FC<RoadmapGeneratorProps> = ({ initialProfile }) => {
  // Flow state
  const [currentStep, setCurrentStep] = useState<Step>(initialProfile ? 'roadmap' : 'experience');
  const [selectedExperience, setSelectedExperience] = useState<ExperienceLevel | null>(
    initialProfile ? (initialProfile.experienceLevel === 'expert' ? 'advanced' : initialProfile.experienceLevel) as ExperienceLevel : null
  );
  const [selectedTopic, setSelectedTopic] = useState<string>(initialProfile?.topic || '');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Roadmap state
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [currentRoadmapStep, setCurrentRoadmapStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Groq API key
  const GROQ_API_KEY = "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";
  
  // Generate the roadmap automatically if an initial profile is provided
  useEffect(() => {
    if (initialProfile && !roadmap) {
      const experienceLevel = initialProfile.experienceLevel === 'expert' ? 'advanced' : initialProfile.experienceLevel;
      handleTopicSubmit(initialProfile.topic);
    }
  }, [initialProfile]);
  
  const handleExperienceSelect = (level: ExperienceLevel) => {
    setSelectedExperience(level);
    setCurrentStep('topic');
  };
  
  const handleTopicSubmit = async (topic: string) => {
    setSelectedTopic(topic);
    setIsGenerating(true);
    
    try {
      const generatedRoadmap = await generateRoadmap(selectedExperience as ExperienceLevel, topic);
      
      // After generating the basic roadmap, enhance it with detailed content
      const enhancedRoadmap = await enhanceRoadmapWithDetails(generatedRoadmap);
      
      // Add an ID to the roadmap for reference
      enhancedRoadmap.id = `roadmap-${Date.now()}`;
      
      setRoadmap(enhancedRoadmap);
      setCurrentRoadmapStep(1);
      setCompletedSteps([]);
      setCurrentStep('roadmap');
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast.error('Error generating roadmap. Please try again.');
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
    },
    {
      "title": "Chapter 2: [Another Topic]",
      "sections": [
        {
          "title": "Core Principles",
          "items": ["Principle 1", "Principle 2", "Principle 3"]
        }
      ]
    }
  ]
}

Create 2-4 chapters per step, with 2-3 sections per chapter, and 3-5 items per section.
Focus on specific, actionable learning items.
Return only JSON without explanations or markdown.`;

      // Create enhanced steps with detailed content
      const enhancedSteps: RoadmapStep[] = [];
      
      for (const step of basicRoadmap.steps) {
        try {
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
          
          // Extract JSON from the response
          let jsonMatch = detailedContentString.match(/```json\n([\s\S]*?)\n```/);
          let detailedContent: { detailedContent: ChapterContent[] };
          
          if (jsonMatch && jsonMatch[1]) {
            // If JSON is in code block format
            detailedContent = JSON.parse(jsonMatch[1]);
          } else {
            // If JSON is returned directly
            detailedContent = JSON.parse(detailedContentString);
          }
          
          // Create enhanced step with detailed content
          const enhancedStep: RoadmapStep = {
            ...step,
            detailedContent: detailedContent.detailedContent
          };
          
          enhancedSteps.push(enhancedStep);
          
        } catch (error) {
          console.error(`Error generating detailed content for step ${step.step}:`, error);
          // If there's an error, just add the original step without detailed content
          enhancedSteps.push(step);
        }
      }
      
      return {
        ...basicRoadmap,
        steps: enhancedSteps
      };
      
    } catch (error) {
      console.error('Error enhancing roadmap with details:', error);
      // Return the original roadmap if enhancement fails
      return basicRoadmap;
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

  const generatePdf = () => {
    if (!roadmap) return;
    
    const doc = new jsPDF();
    let yPosition = 20;
    
    // Title
    doc.setFontSize(20);
    doc.text(`Learning Roadmap: ${roadmap.topic}`, 20, yPosition);
    yPosition += 10;
    
    // Experience Level
    doc.setFontSize(12);
    doc.text(`Experience Level: ${roadmap.experience}`, 20, yPosition);
    yPosition += 15;
    
    // Roadmap Steps
    doc.setFontSize(16);
    doc.text('Roadmap Steps:', 20, yPosition);
    yPosition += 10;
    
    // Add each step
    roadmap.steps.forEach((step, index) => {
      doc.setFontSize(14);
      doc.text(`Step ${step.step}: ${step.title}`, 20, yPosition);
      yPosition += 7;
      
      doc.setFontSize(10);
      
      // Split description into lines to avoid overflow
      const descriptionLines = doc.splitTextToSize(step.description, 170);
      doc.text(descriptionLines, 25, yPosition);
      yPosition += 10 + (descriptionLines.length - 1) * 5;
      
      // Add detailed content for each step if available
      if (step.detailedContent && step.detailedContent.length > 0) {
        doc.setFontSize(12);
        doc.text('Detailed Content:', 25, yPosition);
        yPosition += 7;
        
        step.detailedContent.forEach((chapter) => {
          doc.setFontSize(11);
          
          // Check if we need a new page
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.text(chapter.title, 30, yPosition);
          yPosition += 7;
          
          chapter.sections.forEach((section) => {
            doc.setFontSize(10);
            
            // Check if we need a new page
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
            
            doc.text(section.title, 35, yPosition);
            yPosition += 5;
            
            section.items.forEach((item) => {
              // Check if we need a new page
              if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
              }
              
              doc.text(`• ${item}`, 40, yPosition);
              yPosition += 5;
            });
            
            yPosition += 2;
          });
          
          yPosition += 5;
        });
      }
      
      // Add some space between steps
      yPosition += 5;
      
      // Check if we need a new page for the next step
      if (yPosition > 250 && index < roadmap.steps.length - 1) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    // Save the PDF
    doc.save(`${roadmap.topic.replace(/\s+/g, '_')}_roadmap.pdf`);
    toast.success('PDF successfully downloaded!');
  };
  
  return (
    <div className="space-y-8">
      {/* Header with navigation */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white font-heading">
          AI Learning Roadmap <span className="text-primary">.</span>
        </h1>
        
        <div className="flex gap-2">
          {currentStep !== 'experience' && !initialProfile && (
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
          
          {roadmap && (
            <Button
              variant="outline"
              size="sm"
              onClick={generatePdf}
              className="bg-card/40 border-border/50 hover:bg-card/60"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          )}
          
          {!initialProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="bg-card/40 border-border/50 hover:bg-card/60"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Start Over
            </Button>
          )}
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
