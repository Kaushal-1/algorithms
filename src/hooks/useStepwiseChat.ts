
import { useState, useEffect } from 'react';
import { ChatMessage } from '@/types/ChatSession';
import { callGroqApi } from '@/services/groqApi';
import { toast } from 'sonner';
import { RoadmapStep } from '@/components/RoadmapDisplay';

interface UseStepwiseChatProps {
  currentStep: number;
  currentStepData: RoadmapStep | undefined;
}

export const useStepwiseChat = ({ currentStep, currentStepData }: UseStepwiseChatProps) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  useEffect(() => {
    if (currentStepData) {
      const initialMessage: ChatMessage = {
        id: `step-${currentStep}-intro`,
        role: 'assistant',
        content: `Let's focus on Step ${currentStep}: **${currentStepData.title}**\n\n${currentStepData.description}\n\nAsk me any questions about this topic, and I'll guide you through it. When you're ready to move on, you can mark this step as completed.`,
        timestamp: new Date(),
      };
      
      setMessages([initialMessage]);
    }
  }, [currentStep, currentStepData]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      const systemPrompt = `You are an expert AI Guru specializing in personalized education. You are currently guiding the student through Step ${currentStep}: ${currentStepData?.title}. Focus your explanations on this specific topic. When showing code, make sure to use proper markdown formatting with \`\`\`language code blocks. Keep your responses clear, educational, and specific to the current learning step.`;
      
      const previousMessages = messages
        .slice(-6)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      const aiContent = await callGroqApi(systemPrompt, input, previousMessages);
      
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
        isCode: aiContent.includes('```')
      };
      
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error calling Groq API:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    input,
    setInput,
    isProcessing,
    messages,
    handleSendMessage
  };
};
