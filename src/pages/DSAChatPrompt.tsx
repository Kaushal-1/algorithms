
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useDSA } from '@/contexts/DSAContext';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Loader2 } from 'lucide-react';

const DSAChatPrompt: React.FC = () => {
  const navigate = useNavigate();
  const { generateProblem, setCurrentProblem } = useDSA();
  
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('Medium');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ role: 'system' | 'user'; content: string }[]>([
    { role: 'system', content: 'Hi! I can help you practice Data Structures & Algorithms. What would you like to practice today?' }
  ]);

  const handleGenerateProblem = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a DSA topic');
      return;
    }

    setIsGenerating(true);
    setMessages(prev => [...prev, 
      { role: 'user', content: `Generate a ${difficulty} problem about ${topic}` },
      { role: 'system', content: 'Generating your problem...' }
    ]);

    try {
      const problem = await generateProblem(topic, difficulty);
      setCurrentProblem(problem);
      
      setMessages(prev => {
        // Replace the 'Generating...' message with success
        const messages = [...prev];
        messages[messages.length - 1] = { 
          role: 'system', 
          content: `I've created a ${difficulty} difficulty problem for you: "${problem.title}". Let's solve it!` 
        };
        return messages;
      });
      
      // Navigate to problem display page
      setTimeout(() => {
        navigate('/dsa-problem');
      }, 1500);
      
    } catch (error) {
      console.error('Error generating problem:', error);
      toast.error('Failed to generate problem. Please try again.');
      
      setMessages(prev => {
        // Replace the 'Generating...' message with error
        const messages = [...prev];
        messages[messages.length - 1] = { 
          role: 'system', 
          content: 'Sorry, I encountered an error generating your problem. Please try again.' 
        };
        return messages;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-algos-dark">
      <Navbar />
      
      <main className="flex-grow pt-20 px-4 pb-8 max-w-[1200px] mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">DSA Trainer</h1>
          <p className="text-muted-foreground">Generate a personalized DSA problem and practice your skills</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)]">
          <div className="lg:col-span-8 lg:order-2">
            <Card className="h-full border-border bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
              <CardHeader className="border-b border-border pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
                  <MessageSquare size={18} />
                  DSA Chat
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-grow p-0">
                <div className="h-[calc(100vh-350px)] overflow-y-auto p-6">
                  {messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`mb-4 max-w-[80%] ${message.role === 'system' ? 'ml-0' : 'ml-auto'}`}
                    >
                      <div className={`p-3 rounded-lg ${
                        message.role === 'system' 
                          ? 'bg-muted text-foreground' 
                          : 'bg-primary text-primary-foreground'
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="border-t border-border p-4">
                <div className="flex gap-3 w-full">
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter DSA topic (e.g., binary search, linked lists, dynamic programming)"
                    className="flex-grow"
                    disabled={isGenerating}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isGenerating) {
                        handleGenerateProblem();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleGenerateProblem} 
                    className="bg-algos-green hover:bg-algos-green/90 text-black font-medium"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Problem'
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="lg:col-span-4 lg:order-1">
            <Card className="h-full border-border bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-foreground">Configure Your Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">DSA Topic</Label>
                    <Input
                      id="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., binary search, graphs, dynamic programming"
                      disabled={isGenerating}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select value={difficulty} onValueChange={setDifficulty} disabled={isGenerating}>
                      <SelectTrigger id="difficulty" className="bg-muted border-border">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Tips for good problems:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
                      <li>Be specific about the algorithm type</li>
                      <li>Mention data structures you want to practice</li>
                      <li>Try different difficulties to test your skills</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DSAChatPrompt;
