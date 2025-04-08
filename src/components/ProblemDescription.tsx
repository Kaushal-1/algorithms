
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ProblemDescriptionProps {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  title,
  description,
  difficulty,
  tags,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30';
      case 'Hard':
        return 'bg-rose-500/20 text-rose-500 hover:bg-rose-500/30';
      default:
        return 'bg-primary/20 text-primary hover:bg-primary/30';
    }
  };

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium text-foreground">{title}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className={getDifficultyColor(difficulty)}>{difficulty}</Badge>
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-muted border-border">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <ScrollArea className="max-h-[250px] pr-4">
              <div className="text-sm text-foreground/90 whitespace-pre-line">{description}</div>
            </ScrollArea>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ProblemDescription;
