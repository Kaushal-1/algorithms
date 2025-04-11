
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProblemTag from './ProblemTag';
import { RefreshCcw, ArrowRightCircle, CheckCircle, XCircle } from "lucide-react";

interface DSASubmission {
  id: string;
  title: string;
  tags: string[];
  language: string;
  date: string;
  status: 'passed' | 'failed' | 'in-progress';
  attempts: number;
  feedbackSummary: string;
}

interface DSASubmissionCardProps {
  submission: DSASubmission;
}

const DSASubmissionCard = ({ submission }: DSASubmissionCardProps) => {
  const StatusIcon = submission.status === 'passed' ? CheckCircle : XCircle;
  const statusColor = submission.status === 'passed' ? 'text-green-500' : 'text-red-500';
  const statusText = submission.status === 'passed' ? 'Successfully Solved' : 'Not Solved Yet';
  
  const handleTryAgain = () => {
    // Navigate to the DSA problem with the submission ID
    // This would use React Router in a real implementation
    console.log("Trying again:", submission.id);
  };

  return (
    <Card className="bg-card/70 border-border hover:border-primary/30 transition-all hover:shadow-md hover:shadow-primary/5 group">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {submission.title}
          </h3>
          <div className={`flex items-center gap-1 ${statusColor}`}>
            <StatusIcon size={16} />
            <span className="text-xs font-medium">{statusText}</span>
          </div>
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
        
        <div className="text-sm text-foreground/80 border-l-2 border-primary/50 pl-3 py-1 bg-primary/5 rounded-r-sm">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium">Attempts: {submission.attempts}</span>
          </div>
          <p className="text-sm">{submission.feedbackSummary}</p>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-end gap-2">
        <Button 
          size="sm" 
          variant="outline"
          onClick={handleTryAgain}
          className="h-8 gap-2"
        >
          Try Again
          <RefreshCcw size={16} />
        </Button>
        <Button 
          size="sm"
          onClick={handleTryAgain} 
          className="h-8 bg-primary/20 text-primary hover:bg-primary/30 gap-2"
        >
          Resume
          <ArrowRightCircle size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DSASubmissionCard;
