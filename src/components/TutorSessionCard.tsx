
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProblemTag from './ProblemTag';
import { Clock, ArrowRightCircle } from "lucide-react";

interface TutorSession {
  id: string;
  title: string;
  topics: string[];
  date: string;
  duration: string;
}

interface TutorSessionCardProps {
  session: TutorSession;
}

const TutorSessionCard = ({ session }: TutorSessionCardProps) => {
  const handleResumeSession = () => {
    // Navigate to the AI Tutor session with the session ID
    // This would use React Router in a real implementation
    console.log("Resuming session:", session.id);
  };

  return (
    <Card className="bg-card/70 border-border hover:border-primary/30 transition-all hover:shadow-md hover:shadow-primary/5 group">
      <CardContent className="p-5">
        <div className="mb-3">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {session.title}
          </h3>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Clock className="mr-1 h-3 w-3" />
            <span>{session.duration}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {session.topics.map(topic => (
              <ProblemTag key={topic} tag={topic} />
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground">
            <span>{session.date}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-end">
        <Button 
          size="sm" 
          onClick={handleResumeSession}
          className="bg-primary/20 text-primary hover:bg-primary/30 gap-2"
        >
          Resume Session
          <ArrowRightCircle size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TutorSessionCard;
