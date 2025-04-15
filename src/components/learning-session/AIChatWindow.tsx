
import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RoadmapStep } from '@/components/RoadmapDisplay';
import { Send, Save, Loader } from 'lucide-react';
import AIChatMessage from '@/components/AIChatMessage';
import { toast } from 'sonner';
import { ChatMessage, ChatSession } from '@/types/ChatSession';

interface AIChatWindowProps {
  topic: RoadmapStep;
  roadmapId: string;
  sessionId: string;
}

const AIChatWindow: React.FC<AIChatWindowProps> = ({ topic, roadmapId, sessionId }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Groq API key
  const GROQ_API_KEY = "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";
  
  // Load saved messages for this session
  useEffect(() => {
    const loadSavedMessages = () => {
      try {
        // Try to load existing session from localStorage
        const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
        const existingSession = savedSessions.find((s: ChatSession) => s.id === sessionId);
        
        if (existingSession) {
          setMessages(existingSession.messages);
        } else {
          // Generate initial welcome message
          const initialMessage: ChatMessage = {
            id: `welcome-${Date.now()}`,
            role: 'assistant',
            content: `# ${topic.title}\n\n${topic.description}\n\nI'm your AI tutor for this topic. Let's start learning about it together. What would you like to know first?`,
            timestamp: new Date(),
          };
          setMessages([initialMessage]);
          
          // If the topic has detailed content, show it
          if (topic.detailedContent && topic.detailedContent.length > 0) {
            setTimeout(() => {
              const detailedContentMessage: ChatMessage = {
                id: `syllabus-${Date.now()}`,
                role: 'assistant',
                content: formatDetailedContent(topic),
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, detailedContentMessage]);
            }, 500);
          }
          
          // Save this initial session
          saveSession([initialMessage]);
        }
      } catch (error) {
        console.error('Error loading saved messages:', error);
        toast.error('Failed to load previous chat messages');
      }
    };
    
    loadSavedMessages();
  }, [sessionId, topic]);
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);
  
  // Format detailed content for display
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
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      const response = await callGroqApi(input);
      setMessages(prev => [...prev, response]);
      
      // Save the updated chat session
      saveSession([...messages, userMessage, response]);
    } catch (error) {
      console.error('Error calling Groq API:', error);
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Save including the error message
      saveSession([...messages, userMessage, errorMessage]);
    } finally {
      setIsProcessing(false);
      
      // Focus back on input
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };
  
  const callGroqApi = async (prompt: string): Promise<ChatMessage> => {
    const previousMessages = messages
      .slice(-6) // Only include the last 6 messages for context
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
    const systemPrompt = `You are an expert AI tutor specializing in "${topic.title}" as part of a learning roadmap. 
    
Your task is to teach this specific topic in a clear, engaging way. Focus your explanations on this topic only: ${topic.title}
Topic description: ${topic.description}

When answering:
1. Be educational but conversational
2. Use markdown formatting for clear structure
3. Include code examples with proper \`\`\`language code blocks when appropriate
4. Break complex concepts into simple explanations
5. If you're teaching programming, explain both concepts and practical applications

Keep your responses focused on helping the learner master this specific topic.`;
      
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
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    return {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
      isCode: aiResponse.includes('```')
    };
  };
  
  const saveSession = (updatedMessages: ChatMessage[]) => {
    try {
      // Create a session object
      const session: ChatSession = {
        id: sessionId,
        title: `${topic.title} - Learning Session`,
        roadmapId: roadmapId,
        messages: updatedMessages,
        createdAt: new Date(),
      };
      
      // Get existing sessions from localStorage
      const existingSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
      
      // Remove the current session if it exists
      const filteredSessions = existingSessions.filter((s: ChatSession) => s.id !== sessionId);
      
      // Add updated session
      const updatedSessions = [session, ...filteredSessions];
      
      // Save to localStorage
      localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Error saving chat session:', error);
    }
  };
  
  const handleManualSave = () => {
    saveSession(messages);
    toast.success('Chat session saved successfully!');
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat messages area */}
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
        </div>
      </ScrollArea>
      
      {/* Input area */}
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
