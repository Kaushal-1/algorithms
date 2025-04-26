
import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import CodeEditor from "@/components/CodeEditor";
import AiFeedback from "@/components/AiFeedback";
import { Loader, Upload, FileCode } from "lucide-react";
import Navbar from '@/components/Navbar';
import { toast } from "sonner";

const AICodeReview = () => {
  const [reviewType, setReviewType] = useState<'dsa' | 'general'>('dsa');
  const [code, setCode] = useState<string>("// Paste your code here or upload a file");
  const [language, setLanguage] = useState<string>("javascript");
  const [problemStatement, setProblemStatement] = useState<string>("");
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Groq API key from context
  const GROQ_API_KEY = "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";

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        
        // Try to detect language from file extension
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension) {
          switch (extension) {
            case 'js':
              setLanguage('javascript');
              break;
            case 'ts':
              setLanguage('typescript');
              break;
            case 'py':
              setLanguage('python');
              break;
            case 'java':
              setLanguage('java');
              break;
            case 'cpp':
            case 'cc':
              setLanguage('cpp');
              break;
            case 'c':
              setLanguage('c');
              break;
          }
        }
        
        toast.success(`File "${file.name}" uploaded successfully!`);
      };
      reader.readAsText(file);
    }
  };

  const handleReviewCode = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to review");
      return;
    }

    if (reviewType === 'dsa' && !problemStatement.trim()) {
      toast.error("Please enter the problem statement for DSA review");
      return;
    }

    setIsReviewing(true);
    setFeedback([]);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: reviewType === 'dsa' 
                ? "You are an expert code reviewer for Data Structures and Algorithms. Provide detailed analysis including time complexity, space complexity, bugs, edge cases, and optimization suggestions."
                : "You are an expert code reviewer. Analyze the given code for code quality, potential bugs, performance issues, and suggest improvements. Focus on best practices, design patterns, and maintainability."
            },
            {
              role: "user",
              content: reviewType === 'dsa'
                ? `Review this ${language} solution for the following problem:\n\n${problemStatement}\n\nCode to review:\n\`\`\`${language}\n${code}\n\`\`\``
                : `Review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``
            }
          ],
          temperature: 0.5,
          max_tokens: 2000
        })
      });

      const data = await response.json();
      const reviewText = data.choices[0].message.content;
      
      // Parse the feedback into a structure that AiFeedback component can use
      const parsedFeedback = parseReviewFeedback(reviewText);
      setFeedback(parsedFeedback);
    } catch (error) {
      console.error("Error reviewing code:", error);
      toast.error("Failed to review code. Please try again.");
      setFeedback([{
        type: 'error',
        message: 'Failed to review code. Please try again later.',
      }]);
    } finally {
      setIsReviewing(false);
    }
  };

  const parseReviewFeedback = (reviewText: string): any[] => {
    // Split the review into sections
    const sections = reviewText.split(/#{2,3} /);
    const feedback = [];

    // Process each section into a feedback item
    for (let section of sections) {
      if (!section.trim()) continue;
      
      // Try to determine the type of feedback
      let type: 'error' | 'suggestion' | 'optimization' | 'style' = 'suggestion';
      
      if (section.toLowerCase().includes('error') || 
          section.toLowerCase().includes('bug') || 
          section.toLowerCase().includes('issue')) {
        type = 'error';
      } else if (section.toLowerCase().includes('optimization') || 
                 section.toLowerCase().includes('performance')) {
        type = 'optimization';
      } else if (section.toLowerCase().includes('style') || 
                 section.toLowerCase().includes('readability')) {
        type = 'style';
      }
      
      // Extract code blocks if present
      const codeBlockMatch = section.match(/```([\s\S]*?)```/);
      const code = codeBlockMatch ? codeBlockMatch[1] : undefined;
      
      // Remove code blocks from the message
      let message = section;
      if (code) {
        message = message.replace(/```([\s\S]*?)```/g, '');
      }
      
      // Clean up the message
      const titleMatch = message.match(/^([^\n]+)/);
      const title = titleMatch ? titleMatch[1].trim() : 'Feedback';
      
      message = message.replace(title, '').trim();
      
      feedback.push({
        type,
        message: `**${title}**\n\n${message}`,
        code
      });
    }
    
    // If no sections were found, create a generic feedback item
    if (feedback.length === 0) {
      feedback.push({
        type: 'suggestion',
        message: reviewText
      });
    }
    
    return feedback;
  };

  return (
    <div className="min-h-screen bg-algos-dark text-foreground">
      <Navbar />
      <div className="container max-w-7xl mx-auto pt-24 px-4 pb-12">
        <h1 className="text-3xl font-bold mb-8">AI Code Review</h1>
        
        <Tabs defaultValue="dsa" onValueChange={(value) => setReviewType(value as 'dsa' | 'general')}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="dsa">DSA Code Review</TabsTrigger>
            <TabsTrigger value="general">General Code Review</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Code Input</CardTitle>
                  <CardDescription>
                    {reviewType === 'dsa' 
                      ? 'Paste your solution code for a DSA problem' 
                      : 'Paste your code for general review'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviewType === 'dsa' && (
                      <div className="space-y-2">
                        <Label htmlFor="problem">Problem Statement</Label>
                        <Textarea 
                          id="problem" 
                          placeholder="Enter the DSA problem statement..."
                          value={problemStatement}
                          onChange={(e) => setProblemStatement(e.target.value)}
                          className="min-h-[120px] font-mono text-sm bg-algos-darker"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="code">Your Code</Label>
                        <div className="flex items-center gap-2">
                          <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="w-[140px] bg-muted border-border">
                              <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="javascript">JavaScript</SelectItem>
                              <SelectItem value="typescript">TypeScript</SelectItem>
                              <SelectItem value="python">Python</SelectItem>
                              <SelectItem value="java">Java</SelectItem>
                              <SelectItem value="cpp">C++</SelectItem>
                              <SelectItem value="c">C</SelectItem>
                            </SelectContent>
                          </Select>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".js,.ts,.py,.java,.cpp,.c,.txt"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                          </Button>
                        </div>
                      </div>
                      <CodeEditor
                        initialCode={code}
                        initialLanguage={language}
                        onRunCode={(newCode) => setCode(newCode)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleReviewCode} 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isReviewing || !code.trim() || (reviewType === 'dsa' && !problemStatement.trim())}
                  >
                    {isReviewing ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Reviewing...
                      </>
                    ) : (
                      <>
                        <FileCode className="mr-2 h-4 w-4" />
                        Review Code
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>AI Review Results</CardTitle>
                  <CardDescription>
                    Expert feedback and suggestions for your code
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-128px)]">
                  <AiFeedback 
                    feedback={feedback} 
                    isLoading={isReviewing} 
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AICodeReview;
