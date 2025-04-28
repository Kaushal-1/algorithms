
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { ChatMessage, ChatSession } from '@/types/ChatSession';
import { RoadmapStep } from '@/components/RoadmapDisplay';
import { callGroqApi } from '@/services/groqApi';

interface UseAIChatProps {
  topic: RoadmapStep;
  roadmapId: string;
  sessionId: string;
}

export const useAIChat = ({ topic, roadmapId, sessionId }: UseAIChatProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Format detailed content for initial AI message
  const formatDetailedContent = (topic: RoadmapStep): string => {
    if (!topic.detailedContent || topic.detailedContent.length === 0) {
      return "No detailed syllabus is available for this topic yet.";
    }
    
    let content = "## Detailed Syllabus\n\n";
    
    topic.detailedContent.forEach((chapter) => {
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

  // Save session to localStorage
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
    if (!isInitialized && topic) {
      loadSavedMessages();
    }
  }, [sessionId, topic, isInitialized, roadmapId]);

  // Send message handler
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

  // Manual save handler
  const handleManualSave = () => {
    saveSession(messages);
    toast.success('Chat session saved successfully!');
  };
  
  return {
    input,
    setInput,
    messages,
    isProcessing,
    handleSendMessage,
    handleManualSave,
    inputRef
  };
};
