
import React from 'react';
import { Card } from '@/components/ui/card';
import { Book, BookOpen, BookText } from 'lucide-react';
import { cn } from '@/lib/utils';

type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

interface ExperienceSelectorProps {
  selectedLevel: ExperienceLevel | null;
  onSelect: (level: ExperienceLevel) => void;
}

const ExperienceSelector: React.FC<ExperienceSelectorProps> = ({
  selectedLevel,
  onSelect,
}) => {
  const experienceOptions = [
    {
      level: 'beginner',
      title: 'Beginner',
      description: 'New to this subject with little to no prior knowledge',
      icon: Book,
    },
    {
      level: 'intermediate',
      title: 'Intermediate',
      description: 'Have some basic understanding and experience',
      icon: BookOpen,
    },
    {
      level: 'advanced',
      title: 'Advanced',
      description: 'Experienced and looking to deepen knowledge',
      icon: BookText,
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">What is your current experience level?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {experienceOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedLevel === option.level;
          
          return (
            <Card
              key={option.level}
              className={cn(
                "p-6 cursor-pointer transition-all hover:bg-primary/10 border-2",
                isSelected 
                  ? "border-primary bg-primary/10" 
                  : "border-border hover:border-primary/30"
              )}
              onClick={() => onSelect(option.level as ExperienceLevel)}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={cn(
                  "p-3 rounded-full transition-colors",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-lg">{option.title}</h3>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ExperienceSelector;
