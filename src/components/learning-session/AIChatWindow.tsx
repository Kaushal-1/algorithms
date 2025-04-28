
import React from 'react';
import { useAIChat } from '@/hooks/useAIChat';
import { useNavigate } from 'react-router-dom';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatInputBar from './ChatInputBar';
import { RoadmapStep } from '@/components/RoadmapDisplay';

interface AIChatWindowProps {
  topic: RoadmapStep;
  roadmapId: string;
  sessionId: string;
}

const AIChatWindow: React.FC<AIChatWindowProps> = ({ topic, roadmapId, sessionId }) => {
  const navigate = useNavigate();
  
  const {
    input,
    setInput,
    messages,
    isProcessing,
    handleSendMessage,
    handleManualSave
  } = useAIChat({ topic, roadmapId, sessionId });
  
  const handleBackToRoadmap = () => {
    // Use navigate instead of directly changing location to prevent full page reload
    navigate('/personalized-learning');
  };
  
  // Render an empty div if no topic data
  if (!topic) {
    console.log('No topic data provided to AIChatWindow');
    return <div className="flex items-center justify-center h-full p-4">Loading chat...</div>;
  }
  
  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        topic={topic} 
        onBackToRoadmap={handleBackToRoadmap} 
      />
      
      <ChatBody 
        messages={messages} 
        isProcessing={isProcessing} 
      />
      
      <ChatInputBar 
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        handleManualSave={handleManualSave}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default AIChatWindow;
