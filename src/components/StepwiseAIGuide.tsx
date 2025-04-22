import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader, Save } from 'lucide-react';
import AIChatMessage from '@/components/AIChatMessage';
import { cn } from '@/lib/utils';
import { Roadmap, RoadmapStep } from './RoadmapDisplay';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isCode?: boolean;
}

interface StepwiseAIGuideProps {
  roadmap: Roadmap;
  currentStep: number;
  onNextStep: () => void;
  isLastStep: boolean;
}

const StepwiseAIGuide: React.FC<StepwiseAIGuideProps> = ({ 
  roadmap, 
  currentStep,
  onNextStep,
  isLastStep
}) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const currentStepData = roadmap.steps.find(step => step.step === currentStep);
  
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
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
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
      const response = await callGroqApi(input, currentStepData);
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
  
  const callGroqApi = async (prompt: string, stepData?: RoadmapStep): Promise<ChatMessage> => {
    const GROQ_API_KEY = "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";
    
    const previousMessages = messages
      .slice(-6)
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
    let systemPrompt = `You are an expert AI Guru specializing in personalized education. You are currently guiding the student through Step ${currentStep}: ${stepData?.title}. Focus your explanations on this specific topic. When showing code, make sure to use proper markdown formatting with \`\`\`language code blocks. Keep your responses clear, educational, and specific to the current learning step.`;
      
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          ...previousMessages,
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    return {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
      isCode: aiResponse.includes('```')
    };
  };

  const saveSession = () => {
    try {
      const session = {
        id: `session-${Date.now()}`,
        title: `${roadmap.topic} - Step ${currentStep}: ${currentStepData?.title || 'Learning'}`,
        roadmapId: roadmap.id,
        experience: roadmap.experience,
        topic: roadmap.topic,
        messages: messages,
        createdAt: new Date(),
      };
      
      const existingSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
      
      const updatedSessions = [session, ...existingSessions];
      
      localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
      
      toast.success('Chat session saved successfully!');
    } catch (error) {
      console.error('Error saving chat session:', error);
      toast.error('Failed to save chat session');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-medium text-lg flex items-center">
          <span className="text-xl mr-2" role="img" aria-label="Current step icon">
            {currentStepData?.icon || "🧠"}
          </span>
          {currentStepData?.title || "Learning Guide"}
        </h2>
        
        <Button
          variant="outline"
          size="sm"
          onClick={saveSession}
          className="bg-card/40 border-border/50 hover:bg-card/60"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Session
        </Button>
      </div>
      
      <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-xl h-[350px] flex flex-col">
        <div className="p-4 border-b border-border/50 bg-muted/30">
          <p className="text-sm text-muted-foreground">
            {roadmap.topic} • {roadmap.experience} level • Step {currentStep} of {roadmap.steps.length}
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <AIChatMessage 
              key={message.id}
              message={message}
            />
          ))}
          
          {isProcessing && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground p-3 rounded-lg bg-muted/30 max-w-[80%] ml-auto">
              <Loader className="h-4 w-4 animate-spin" />
              <span>AI tutor is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t border-border/50 bg-muted/30">
          <div className="flex items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this topic..."
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-card/70 border-border"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isProcessing || !input.trim()}
              size="icon"
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={onNextStep}
          disabled={isLastStep}
          className={cn(
            "gap-2",
            isLastStep ? "bg-green-500 hover:bg-green-600" : ""
          )}
        >
          {isLastStep ? "Complete Roadmap" : "Move to Next Step"}
        </Button>
      </div>
    </div>
  );
};

export default StepwiseAIGuide;
