
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLearningProfile } from '@/contexts/LearningProfileContext';
import { KnownTopic, ExperienceLevel } from '@/types/UserProfile';

// Function to generate subtopics based on main topic
const generateSubtopics = (topic: string): KnownTopic[] => {
  // This would ideally come from an API or database
  const subtopicsByTopic: Record<string, string[]> = {
    "Python Programming": [
      "Basic Syntax", "Data Types", "Functions", "OOP", "File Handling",
      "Exception Handling", "Modules", "List Comprehension", "Decorators", "Generators"
    ],
    "Web Development": [
      "HTML", "CSS", "JavaScript", "Responsive Design", "DOM Manipulation",
      "API Integration", "Frontend Frameworks", "Backend Development", "Databases", "Authentication"
    ],
    "Data Structures & Algorithms": [
      "Arrays", "Linked Lists", "Stacks", "Queues", "Trees",
      "Graphs", "Sorting Algorithms", "Searching Algorithms", "Dynamic Programming", "Big O Notation"
    ],
    "Machine Learning": [
      "Linear Regression", "Logistic Regression", "Decision Trees", "Random Forests", "Neural Networks",
      "Deep Learning", "Natural Language Processing", "Computer Vision", "Reinforcement Learning", "Feature Engineering"
    ],
  };
  
  // Default subtopics if the topic isn't in our predefined list
  const defaultSubtopics = [
    "Fundamentals", "Intermediate Concepts", "Advanced Topics", "Best Practices", "Tools & Frameworks"
  ];
  
  // Get the appropriate subtopics or use defaults
  const subtopics = subtopicsByTopic[topic] || defaultSubtopics;
  
  // Convert to KnownTopic objects
  return subtopics.map((name, index) => ({
    id: `${index + 1}`,
    name,
    selected: false
  }));
};

const ExperienceLevelStep: React.FC = () => {
  const { userProfile, setExperienceLevel, setKnownTopics, setCurrentStep } = useLearningProfile();
  
  // Generate subtopics based on selected topic
  const [subtopics, setSubtopics] = useState<KnownTopic[]>(() => {
    if (userProfile?.knownTopics && userProfile.knownTopics.length > 0) {
      return userProfile.knownTopics;
    }
    return generateSubtopics(userProfile?.topic || '');
  });

  const handleLevelSelection = (level: ExperienceLevel) => {
    setExperienceLevel(level);
    
    // If expert, don't proceed automatically so they can select known topics
    if (level !== 'expert') {
      setCurrentStep(4);
    }
  };

  const toggleSubtopic = (id: string) => {
    setSubtopics(prev => 
      prev.map(topic => 
        topic.id === id ? { ...topic, selected: !topic.selected } : topic
      )
    );
  };

  const handleContinue = () => {
    setKnownTopics(subtopics);
    setCurrentStep(4);
  };

  const handleBack = () => {
    setCurrentStep(2);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">What's your experience level?</h2>
        <p className="text-muted-foreground">
          This helps us tailor the content to your current knowledge
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={`cursor-pointer border-2 hover:border-primary hover:bg-primary/5 transition-all ${
            userProfile?.experienceLevel === 'beginner' ? 'border-primary bg-primary/10' : ''
          }`}
          onClick={() => handleLevelSelection('beginner')}
        >
          <CardContent className="p-6 text-center">
            <h3 className="font-medium text-lg mb-2">Beginner</h3>
            <p className="text-sm text-muted-foreground">
              I'm new to this topic and need to start with the basics
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer border-2 hover:border-primary hover:bg-primary/5 transition-all ${
            userProfile?.experienceLevel === 'intermediate' ? 'border-primary bg-primary/10' : ''
          }`}
          onClick={() => handleLevelSelection('intermediate')}
        >
          <CardContent className="p-6 text-center">
            <h3 className="font-medium text-lg mb-2">Intermediate</h3>
            <p className="text-sm text-muted-foreground">
              I understand the basics and want to build on my knowledge
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer border-2 hover:border-primary hover:bg-primary/5 transition-all ${
            userProfile?.experienceLevel === 'expert' ? 'border-primary bg-primary/10' : ''
          }`}
          onClick={() => handleLevelSelection('expert')}
        >
          <CardContent className="p-6 text-center">
            <h3 className="font-medium text-lg mb-2">Expert</h3>
            <p className="text-sm text-muted-foreground">
              I'm experienced and looking for advanced content
            </p>
          </CardContent>
        </Card>
      </div>

      {userProfile?.experienceLevel === 'expert' && (
        <div className="border rounded-lg p-6 mt-6">
          <h3 className="font-medium text-lg mb-4">Select topics you already know</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {subtopics.map((topic) => (
              <div key={topic.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={`topic-${topic.id}`} 
                  checked={topic.selected}
                  onCheckedChange={() => toggleSubtopic(topic.id)}
                />
                <Label htmlFor={`topic-${topic.id}`} className="text-sm font-normal">
                  {topic.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        
        {userProfile?.experienceLevel === 'expert' && (
          <Button onClick={handleContinue}>
            Continue <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExperienceLevelStep;
