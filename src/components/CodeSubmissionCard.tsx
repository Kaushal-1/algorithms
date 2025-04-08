
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CodeSubmissionBadge from './CodeSubmissionBadge';
import ProblemTag from './ProblemTag';
import { Eye, PlayCircle, MessageSquare } from "lucide-react";

interface CodeSubmission {
  id: string;
  title: string;
  tags: string[];
  language: string;
  date: string;
  status: 'passed' | 'failed' | 'in-progress';
  feedbackSummary: string;
}

interface CodeSubmissionCardProps {
  submission: CodeSubmission;
}

const CodeSubmissionCard = ({ submission }: CodeSubmissionCardProps) => {
  return (
    <Card className="bg-card/70 border-border hover:border-primary/30 transition-all hover:shadow-md hover:shadow-primary/5 group">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {submission.title}
          </h3>
          <CodeSubmissionBadge status={submission.status} />
        </div>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {submission.tags.map(tag => (
              <ProblemTag key={tag} tag={tag} />
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground flex justify-between">
            <span>{submission.language}</span>
            <span>{submission.date}</span>
          </div>
        </div>
        
        <p className="text-sm text-foreground/80 border-l-2 border-primary/50 pl-3 py-1 bg-primary/5 rounded-r-sm">
          {submission.feedbackSummary}
        </p>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex gap-2 justify-end">
        <Button size="sm" variant="ghost" className="h-8">
          <Eye size={16} className="mr-1" />
          View
        </Button>
        <Button size="sm" variant="ghost" className="h-8">
          <PlayCircle size={16} className="mr-1" />
          Re-attempt
        </Button>
        <Button size="sm" variant="ghost" className="h-8">
          <MessageSquare size={16} className="mr-1" />
          Feedback
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CodeSubmissionCard;
