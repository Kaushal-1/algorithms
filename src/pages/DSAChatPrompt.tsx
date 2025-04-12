
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import RoadmapGenerator from '@/components/RoadmapGenerator';
import ChatSidebar from '@/components/ChatSidebar';
import { useToast } from '@/components/ui/use-toast';

const DSAChatPrompt: React.FC = () => {
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  
  const handleSessionSelect = (sessionId: string) => {
    setActiveSessionId(sessionId);
    // Here we would load the selected session from the backend
  };
  
  const handleNewSession = () => {
    setActiveSessionId(undefined);
    // Here we would reset the chat UI to a new session
  };
  
  const handleSaveSession = () => {
    // Here we would save the current session to the backend
    toast({
      title: "Session saved",
      description: "Your chat session has been saved successfully.",
    });
  };
  
  return (
    <div className="min-h-screen bg-algos-dark">
      <Navbar />
      
      <div className="pt-20 h-[calc(100vh-theme(spacing.20))] flex">
        <ChatSidebar 
          activeSessionId={activeSessionId}
          onSessionSelect={handleSessionSelect}
          onNewSession={handleNewSession}
        />
        
        <div className="flex-1 relative">
          <div className="absolute top-4 right-4 z-10">
            <Button 
              onClick={handleSaveSession}
              className="bg-algos-highlight text-black hover:bg-algos-highlight/90 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Session
            </Button>
          </div>
          
          <div className="h-full p-4 md:p-8 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary/20 to-transparent rounded-full blur-[120px] opacity-30 z-0"></div>
                
                <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-xl p-6 relative z-10">
                  <RoadmapGenerator />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSAChatPrompt;
