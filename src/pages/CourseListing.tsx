
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
  CheckCircle,
  KeyRound
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import AIChatMessage from '@/components/AIChatMessage';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

// Types for chat messages
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isCode?: boolean;
}

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
  const [groqApiKey, setGroqApiKey] = useState<string>(() => {
    const savedKey = localStorage.getItem('groqApiKey');
    return savedKey || '';
  });
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
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

  useEffect(() => {
    // Check if API key is missing and show dialog if needed
    if (!groqApiKey) {
      setApiKeyDialogOpen(true);
    }
  }, [groqApiKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const saveApiKey = (key: string) => {
    setGroqApiKey(key);
    localStorage.setItem('groqApiKey', key);
    setApiKeyDialogOpen(false);
    toast({
      title: "API Key Saved",
      description: "Your Groq API key has been saved securely.",
    });
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
      if (!groqApiKey) {
        setApiKeyDialogOpen(true);
        setIsProcessing(false);
        return;
      }
      
      const assistantMessage = await callGroqApi(input);
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling Groq API:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again or check your API key.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        title: "Error",
        description: "Failed to get a response from the AI service.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const callGroqApi = async (prompt: string): Promise<ChatMessage> => {
    const previousMessages = messages
      .slice(-6) // Only include the last 6 messages for context
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // Using Llama 3 8B model
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI tutor specializing in personalized education. You help students by creating customized learning paths, explaining complex concepts, and providing code examples when relevant. When showing code, make sure to use proper markdown formatting with ```language code blocks. Keep your responses helpful, clear, and educational.'
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
      isCode: aiResponse.includes('```') // Automatically detect code blocks
    };
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

  const handleGenerateCourse = async () => {
    if (!groqApiKey) {
      setApiKeyDialogOpen(true);
      return;
    }
    
    setIsProcessing(true);
    
    let fileContent = '';
    if (fileUploaded) {
      try {
        fileContent = await readFileAsText(fileUploaded);
      } catch (error) {
        console.error('Error reading file:', error);
        toast({
          title: "Error Reading File",
          description: "There was an error reading your syllabus file.",
          variant: "destructive"
        });
      }
    }
    
    const coursePrompt = `Please generate a comprehensive learning path based on these details:
      
Goals: ${goals || 'No specific goals provided'}
      
Topics of interest: ${selectedTopics.length > 0 ? selectedTopics.join(', ') : 'No specific topics selected'}
      
${fileContent ? `Syllabus information: ${fileContent}` : 'No syllabus provided'}
      
Please structure the learning path with clear sections, including recommended resources, time estimates, and milestones. Include a mix of theoretical concepts and practical exercises.`;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: coursePrompt,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const assistantMessage = await callGroqApi(coursePrompt);
      setMessages(prev => [...prev, assistantMessage]);
      setActiveTab('chat');
    } catch (error) {
      console.error('Error generating course:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error generating your course. Please try again or check your API key.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        title: "Error",
        description: "Failed to generate the learning path.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          // Limit text to prevent exceeding token limits
          const text = event.target.result.toString();
          resolve(text.length > 2000 ? text.substring(0, 2000) + '... (content truncated)' : text);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
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
    // Create a downloadable JSON of the conversation
    const conversation = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp
    }));
    
    const blob = new Blob([JSON.stringify(conversation, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-tutor-session-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Session Saved",
      description: "Your tutoring session has been saved to your downloads.",
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
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setApiKeyDialogOpen(true)}
                className="bg-card/40 border-border/50 hover:bg-card/60"
              >
                <KeyRound className="h-4 w-4 mr-2" />
                API Key
              </Button>
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
          </div>
          
          {!groqApiKey && (
            <Alert className="mb-4 bg-card/40 border-primary/30">
              <AlertDescription className="flex items-center">
                <KeyRound className="h-4 w-4 mr-2 text-primary" />
                <span>Please set your Groq API key to enable AI functionality.</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-2 border-primary text-primary" 
                  onClick={() => setApiKeyDialogOpen(true)}
                >
                  Set API Key
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
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

      {/* API Key Dialog */}
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Groq API Key</DialogTitle>
            <DialogDescription>
              Enter your Groq API key to enable the AI tutor. Your key will be stored in your browser's local storage.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 my-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="apiKey" className="sr-only">
                API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={groqApiKey}
                onChange={(e) => setGroqApiKey(e.target.value)}
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="button" 
              disabled={!groqApiKey.trim().startsWith('sk-')} 
              onClick={() => saveApiKey(groqApiKey)}
            >
              Save API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseListing;
