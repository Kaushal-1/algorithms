
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, RotateCcw, FileDown } from 'lucide-react';
import { UserLearningProfile } from '@/types/UserProfile';

interface RoadmapHeaderProps {
  initialProfile: UserLearningProfile | null;
  onBack: () => void;
  onReset: () => void;
  onDownloadPdf: () => void;
  hasRoadmap: boolean;
}

const RoadmapHeader: React.FC<RoadmapHeaderProps> = ({
  initialProfile,
  onBack,
  onReset,
  onDownloadPdf,
  hasRoadmap
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white font-heading">
        AI Learning Roadmap <span className="text-primary">.</span>
      </h1>
      
      <div className="flex gap-2">
        {!initialProfile && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="bg-card/40 border-border/50 hover:bg-card/60"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        
        {hasRoadmap && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadPdf}
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
            onClick={onReset}
            className="bg-card/40 border-border/50 hover:bg-card/60"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Start Over
          </Button>
        )}
      </div>
    </div>
  );
};

export default RoadmapHeader;
