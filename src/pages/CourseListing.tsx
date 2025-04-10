
import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Save, 
  Send, 
  Upload, 
  Book, 
  Zap, 
  HelpCircle, 
  Loader, 
  FileText,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import AIChatMessage from '@/components/AIChatMessage';
import { cn } from '@/lib/utils';

// Types for chat messages
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isCode?: boolean;
}

const AI_THINKING_DELAY = 2000;

const CourseListing: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your personalized AI tutor. How can I help you today? You can share your learning goals, upload a syllabus, or ask me to generate a custom learning path for you.',
      timestamp: new Date(),
      isCode: false
    }
  ]);
  const [input, setInput] = useState('');
  const [goals, setGoals] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [fileUploaded, setFileUploaded] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const topics = [
    'Programming Basics', 'Web Development', 'Data Structures', 
    'Algorithms', 'Machine Learning', 'Database Design',
    'Mobile Development', 'Cloud Computing', 'DevOps',
    'System Design', 'Networking', 'Cybersecurity'
  ];

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
    
    // Simulate AI thinking/typing
    setTimeout(() => {
      // Simulate API response
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(input),
        timestamp: new Date(),
        isCode: input.toLowerCase().includes('code') || input.toLowerCase().includes('example')
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, AI_THINKING_DELAY);
  };

  const generateMockResponse = (query: string): string => {
    // This is a mock response generator - in a real app this would be replaced with API call
    if (query.toLowerCase().includes('course') || query.toLowerCase().includes('learn')) {
      return "Based on your interest, I recommend starting with these core concepts:\n\n1. Fundamental principles\n2. Key theories\n3. Practical applications\n\nWould you like me to create a detailed learning path for any of these areas?";
    } else if (query.toLowerCase().includes('code') || query.toLowerCase().includes('example')) {
      return "```javascript\n// Here's a sample code implementation\nfunction calculateComplexity(n) {\n  let result = 0;\n  for (let i = 0; i < n; i++) {\n    result += i;\n  }\n  return result;\n}\n\n// Time complexity: O(n)\n// Space complexity: O(1)\n```";
    } else {
      return "I understand you're interested in this topic. To provide the most helpful guidance, could you share more about your current knowledge level and specific learning goals?";
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileUploaded(file);
      toast({
        title: "Syllabus Uploaded",
        description: `Successfully uploaded ${file.name}`,
      });
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic) 
        : [...prev, topic]
    );
  };

  const handleGenerateCourse = () => {
    setIsProcessing(true);
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: `Please generate a course based on these goals: ${goals} ${selectedTopics.length > 0 ? `\nTopics: ${selectedTopics.join(', ')}` : ''} ${fileUploaded ? `\nI've also uploaded a syllabus: ${fileUploaded.name}` : ''}`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate API response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `# Personalized Learning Path\n\nBased on your goals${selectedTopics.length > 0 ? ` and selected topics (${selectedTopics.join(', ')})` : ''}${fileUploaded ? ` and your syllabus (${fileUploaded.name})` : ''}, I've created this custom learning path for you:\n\n## Week 1-2: Foundations\n- Core concepts overview\n- Basic principles and terminology\n- Fundamental exercises\n\n## Week 3-4: Intermediate Applications\n- Practical problem-solving techniques\n- Real-world case studies\n- Guided projects with increasing complexity\n\n## Week 5-6: Advanced Implementation\n- Specialized techniques\n- Integration with other disciplines\n- Independent project work\n\nWould you like me to elaborate on any section of this learning path?`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
      setActiveTab('chat');
    }, AI_THINKING_DELAY * 1.5);
  };

  const handleAskQuestion = () => {
    if (!input.trim()) {
      toast({
        title: "Please enter a question",
        description: "Type your question in the input field before asking.",
        variant: "destructive"
      });
      return;
    }
    
    handleSendMessage();
  };

  const handleSaveSession = () => {
    // In a real app, this would save to database or export as file
    toast({
      title: "Session Saved",
      description: "Your tutoring session has been saved.",
      action: (
        <Button variant="outline" size="sm">
          <CheckCircle className="h-4 w-4" />
        </Button>
      ),
    });
  };

  return (
    <div className="min-h-screen bg-algos-dark">
      <Navbar />
      
      <div className="pt-20 px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white font-heading">
              AI Course Tutor <span className="text-primary">.</span>
            </h1>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSaveSession}
              className="bg-card/40 border-border/50 hover:bg-card/60"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Session
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary/20 to-transparent rounded-full blur-[120px] opacity-30 z-0"></div>
            
            {/* Left Chat Panel */}
            <div className={cn(
              "flex flex-col bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-xl",
              isMobile ? (activeTab === 'chat' ? 'h-[70vh]' : 'hidden') : 'h-[70vh] lg:col-span-2'
            )}>
              <div className="p-4 border-b border-border/50 bg-muted/30">
                <h2 className="font-medium text-lg flex items-center">
                  <Book className="h-5 w-5 mr-2 text-primary" />
                  AI Tutor Chat
                </h2>
              </div>
              
              {/* Messages Container */}
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
              
              {/* Input Area */}
              <div className="p-4 border-t border-border/50 bg-muted/30">
                <div className="flex items-center space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question or describe what you want to learn..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-card/70 border-border"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={isProcessing || !input.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Right Control Panel */}
            <div className={cn(
              "bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl shadow-xl overflow-hidden",
              isMobile ? (activeTab === 'controls' ? 'h-[70vh]' : 'hidden') : 'h-[70vh]'
            )}>
              <div className="p-4 border-b border-border/50 bg-muted/30">
                <h2 className="font-medium text-lg">Learning Preferences</h2>
              </div>
              
              <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
                <div className="space-y-6">
                  {/* Learning Goals */}
                  <div>
                    <Label className="block mb-2">Your Learning Goals</Label>
                    <Textarea
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      placeholder="Describe what you want to learn and why..."
                      className="h-32 bg-card/70 border-border resize-none"
                    />
                  </div>
                  
                  {/* Upload Syllabus */}
                  <div>
                    <Label className="block mb-2">Upload Syllabus (Optional)</Label>
                    <div 
                      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/20 transition-colors ${fileUploaded ? 'border-primary/50' : 'border-border/70'}`}
                      onClick={triggerFileUpload}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                      />
                      {fileUploaded ? (
                        <div className="flex items-center justify-center space-x-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <span className="text-sm truncate max-w-[150px]">{fileUploaded.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                          <span className="text-xs text-muted-foreground/70 mt-1">PDF, DOC, TXT (max 5MB)</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Topics Selection */}
                  <div>
                    <Label className="block mb-2">Select Topics (Optional)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {topics.map((topic) => (
                        <div
                          key={topic}
                          className={`px-3 py-2 rounded-md text-sm cursor-pointer transition-colors ${
                            selectedTopics.includes(topic) 
                              ? 'bg-primary/20 border border-primary/40' 
                              : 'bg-card/70 border border-border hover:bg-muted/30'
                          }`}
                          onClick={() => handleTopicToggle(topic)}
                        >
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-3 mt-4">
                    <Button 
                      onClick={handleGenerateCourse}
                      disabled={isProcessing || (!goals && selectedTopics.length === 0 && !fileUploaded)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground h-12"
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Generate Learning Path
                    </Button>
                    
                    <Button 
                      onClick={handleAskQuestion}
                      variant="outline"
                      className="border-primary text-primary hover:text-primary-foreground hover:bg-primary/20 h-12"
                    >
                      <HelpCircle className="h-5 w-5 mr-2" />
                      Ask a Question
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Tab Controls */}
          {isMobile && (
            <div className="fixed bottom-0 left-0 right-0 bg-algos-dark p-2 border-t border-border">
              <TabsList className="w-full bg-card/40">
                <TabsTrigger
                  value="chat"
                  className={`flex-1 ${activeTab === 'chat' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setActiveTab('chat')}
                >
                  Chat
                </TabsTrigger>
                <TabsTrigger
                  value="controls"
                  className={`flex-1 ${activeTab === 'controls' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setActiveTab('controls')}
                >
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseListing;
