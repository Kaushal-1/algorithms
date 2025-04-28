
import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RoadmapStep } from '@/components/RoadmapDisplay';
import { Send, Save, Loader } from 'lucide-react';
import AIChatMessage from '@/components/AIChatMessage';
import { toast } from 'sonner';
import { ChatMessage, ChatSession } from '@/types/ChatSession';
import { callGroqApi } from '@/services/groqApi';

interface AIChatWindowProps {
  topic: RoadmapStep;
  roadmapId: string;
  sessionId: string;
}

const AIChatWindow: React.FC<AIChatWindowProps> = ({ topic, roadmapId, sessionId }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Load saved messages or initialize with welcome message
  useEffect(() => {
    const loadSavedMessages = () => {
      try {
        console.log('Loading chat session:', sessionId);
        const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
        const existingSession = savedSessions.find((s: ChatSession) => s.id === sessionId);
        
        if (existingSession && existingSession.messages && existingSession.messages.length > 0) {
          console.log('Found existing session with messages:', existingSession.messages.length);
          setMessages(existingSession.messages);
        } else {
          console.log('Creating new session with initial message');
          const initialMessage: ChatMessage = {
            id: `welcome-${Date.now()}`,
            role: 'assistant',
            content: `# ${topic.title}\n\n${topic.description}\n\nI'm your AI tutor for this topic. Let's start learning about it together. What would you like to know first?`,
            timestamp: new Date(),
          };
          setMessages([initialMessage]);
          
          // If we have detailed content, add it as a second message
          if (topic.detailedContent && topic.detailedContent.length > 0) {
            const detailedContentMessage: ChatMessage = {
              id: `syllabus-${Date.now() + 100}`,
              role: 'assistant',
              content: formatDetailedContent(topic),
              timestamp: new Date(),
            };
            
            // Use a timeout to ensure state updates correctly
            setTimeout(() => {
              setMessages(prev => [...prev, detailedContentMessage]);
              saveSession([initialMessage, detailedContentMessage]);
            }, 200);
          } else {
            saveSession([initialMessage]);
          }
        }
        
        // Mark as initialized to prevent duplicate loading
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading saved messages:', error);
        toast.error('Failed to load previous chat messages');
        
        // Even on error, mark as initialized to prevent infinite loops
        setIsInitialized(true);
      }
    };
    
    // Only load messages if not already initialized
    if (!isInitialized) {
      loadSavedMessages();
    }
  }, [sessionId, topic, isInitialized]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);
  
  const formatDetailedContent = (topic: RoadmapStep): string => {
    if (!topic.detailedContent || topic.detailedContent.length === 0) {
      return "No detailed syllabus is available for this topic yet.";
    }
    
    let content = "## Detailed Syllabus\n\n";
    
    topic.detailedContent.forEach((chapter, index) => {
      content += `### ${chapter.title}\n\n`;
      
      chapter.sections.forEach((section) => {
        content += `#### ${section.title}\n\n`;
        
        section.items.forEach((item) => {
          content += `- ${item}\n`;
        });
        
        content += "\n";
      });
    });
    
    content += "\nLet me know which aspect you'd like to explore first!";
    
    return content;
  };
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    // Update messages state immediately with user message
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      // Create system prompt for the AI
      const systemPrompt = `You are an expert AI Guru specializing in "${topic.title}" as part of a learning roadmap. 
      
      Your task is to teach this specific topic in a clear, engaging way. Focus your explanations on this topic only: ${topic.title}
      Topic description: ${topic.description}
      
      When answering:
      1. Be educational but conversational
      2. Use markdown formatting for clear structure
      3. Include code examples with proper \`\`\`language code blocks when appropriate
      4. Break complex concepts into simple explanations
      5. If you're teaching programming, explain both concepts and practical applications
      
      Keep your responses focused on helping the learner master this specific topic.`;
      
      // Get previous messages for context (limited to last 6 for API efficiency)
      const previousMessages = messages
        .slice(-6)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      // Call the Groq API
      const aiContent = await callGroqApi(systemPrompt, input, previousMessages);
      
      // Create response message
      const aiMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
        isCode: aiContent.includes('```')
      };
      
      // Update messages with AI response
      setMessages(prev => [...prev, aiMessage]);
      
      // Save the updated conversation
      const updatedMessages = [...messages, userMessage, aiMessage];
      saveSession(updatedMessages);
      
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Create an error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      
      // Update messages with error
      setMessages(prev => [...prev, errorMessage]);
      
      // Save the conversation with the error
      saveSession([...messages, userMessage, errorMessage]);
      
      // Show toast notification
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsProcessing(false);
      
      // Focus on the input field
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };
  
  const saveSession = (updatedMessages: ChatMessage[]) => {
    try {
      const session: ChatSession = {
        id: sessionId,
        title: `${topic.title} - Learning Session`,
        roadmapId: roadmapId,
        messages: updatedMessages,
        createdAt: new Date(),
      };
      
      const existingSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
      
      // Filter out the current session if it exists
      const filteredSessions = existingSessions.filter((s: ChatSession) => s.id !== sessionId);
      
      // Add the updated session to the beginning
      const updatedSessions = [session, ...filteredSessions];
      
      // Save to localStorage
      localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
      console.log('Chat session saved successfully:', session.id);
    } catch (error) {
      console.error('Error saving chat session:', error);
      toast.error('Failed to save chat session');
    }
  };
  
  const handleManualSave = () => {
    saveSession(messages);
    toast.success('Chat session saved successfully!');
  };
  
  // Render an empty div if no topic data
  if (!topic) {
    console.log('No topic data provided to AIChatWindow');
    return <div className="flex items-center justify-center h-full p-4">Loading chat...</div>;
  }
  
  return (
    <div className="flex flex-col h-full">
      <ScrollArea ref={scrollAreaRef} className="flex-grow p-4">
        <div className="max-w-3xl mx-auto space-y-4 pb-4">
          {messages.map((message) => (
            <AIChatMessage key={message.id} message={message} />
          ))}
          
          {isProcessing && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground p-3 rounded-lg bg-muted/30 max-w-[80%] ml-auto">
              <Loader className="h-4 w-4 animate-spin" />
              <span>AI tutor is thinking...</span>
            </div>
          )}
          
          {messages.length === 0 && !isProcessing && (
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Loading conversation...</p>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border bg-card/30">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this topic..."
            className="flex-grow bg-background/50"
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          />
          
          <Button
            onClick={handleSendMessage}
            disabled={isProcessing || !input.trim()}
            size="icon"
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={handleManualSave}
            variant="outline"
            size="icon"
            className="bg-card/50"
          >
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChatWindow;
