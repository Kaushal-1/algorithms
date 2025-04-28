
import { useState } from 'react';
import { Roadmap } from '@/components/RoadmapDisplay';
import { ExperienceLevel } from '@/types/StepTypes';
import { generateBasicRoadmap, enhanceRoadmapWithDetails } from '@/services/roadmapService';
import { toast } from 'sonner';

export const useRoadmapGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  const handleTopicSubmit = async (experience: ExperienceLevel, topic: string) => {
    setIsGenerating(true);
    
    try {
      const generatedRoadmap = await generateBasicRoadmap(experience, topic);
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
