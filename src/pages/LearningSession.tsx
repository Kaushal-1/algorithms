
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import LearningSessionSidebar from '@/components/learning-session/LearningSessionSidebar';
import AIChatWindow from '@/components/learning-session/AIChatWindow';
import { useLearningProfile } from '@/contexts/LearningProfileContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Roadmap, RoadmapStep } from '@/components/RoadmapDisplay';

const LearningSession: React.FC = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [currentRoadmap, setCurrentRoadmap] = useState<Roadmap | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  // Load the user's saved roadmap
  useEffect(() => {
    const loadSavedRoadmap = () => {
      try {
        const savedRoadmapString = localStorage.getItem('currentRoadmap');
        if (savedRoadmapString) {
          const roadmap = JSON.parse(savedRoadmapString);
          setCurrentRoadmap(roadmap);
          
          // If a topic ID is provided in the URL, select that topic
          if (topicId) {
            const stepIndex = parseInt(topicId);
            if (!isNaN(stepIndex) && roadmap.steps[stepIndex - 1]) {
              setSelectedTopic(topicId);
            } else {
              // If invalid topic ID, select the first one
              setSelectedTopic('1');
            }
          } else {
            // If no topic ID provided, select the first one
            setSelectedTopic('1');
          }
        } else {
          toast.error('No learning roadmap found. Please generate one first.');
          navigate('/personalized-learning');
        }
      } catch (error) {
        console.error('Error loading roadmap:', error);
        toast.error('Failed to load your learning roadmap');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedRoadmap();
  }, [topicId, navigate]);
  
  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    navigate(`/learning-session/${topicId}`);
  };
  
  const handleBackToRoadmap = () => {
    navigate('/personalized-learning');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-algos-dark flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading your learning session...</div>
      </div>
    );
  }
  
  if (!currentRoadmap) {
    return (
      <div className="min-h-screen bg-algos-dark flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold mb-4">No Learning Roadmap Found</h1>
        <p className="text-muted-foreground mb-6">You need to generate a learning roadmap first</p>
        <Button onClick={() => navigate('/personalized-learning')}>
          Create Your Learning Roadmap
        </Button>
      </div>
    );
  }
  
  const currentTopicData = selectedTopic 
    ? currentRoadmap.steps[parseInt(selectedTopic) - 1] 
    : null;
  
  return (
    <div className="flex flex-col h-screen bg-algos-dark">
      <Navbar />
      
      <div className="pt-16 flex flex-grow overflow-hidden">
        {/* Sidebar with roadmap topics */}
        <LearningSessionSidebar 
          roadmap={currentRoadmap}
          selectedTopic={selectedTopic}
          onSelectTopic={handleTopicSelect}
        />
        
        {/* Main content area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Topic header */}
          <div className="p-4 border-b border-border flex justify-between items-center bg-card/30">
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToRoadmap}
                className="mb-2"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Roadmap
              </Button>
              
              <h1 className="text-xl font-bold">
                {currentTopicData ? currentTopicData.title : 'Learning Session'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentRoadmap.topic} • {currentRoadmap.experience} level
              </p>
            </div>
          </div>
          
          {/* Chat window */}
          {currentTopicData && (
            <AIChatWindow 
              topic={currentTopicData}
              roadmapId={currentRoadmap.id || 'default-roadmap'}
              sessionId={`session-${currentRoadmap.id}-topic-${selectedTopic}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningSession;
