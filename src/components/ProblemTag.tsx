
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ProblemTagProps {
  tag: string;
}

const ProblemTag = ({ tag }: ProblemTagProps) => {
  return (
    <Badge 
      variant="outline" 
      className="bg-muted/30 text-foreground/70 border-muted/50 text-xs py-0 px-2"
    >
      {tag}
    </Badge>
  );
};

export default ProblemTag;
