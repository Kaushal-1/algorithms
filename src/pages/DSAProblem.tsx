
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import CodeEditor from '@/components/CodeEditor';
import ProblemDescription from '@/components/ProblemDescription';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, LineChart, AlertTriangle, Flag } from 'lucide-react';
import DsaReviewPanel from '@/components/DsaReviewPanel';
import { cn } from '@/lib/utils';
import { useDSA } from '@/contexts/DSAContext';

const DSAProblem: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentProblem, 
    setUserSubmission, 
    setAIReview, 
    setSolution, 
    aiReview, 
    reviewCode 
  } = useDSA();
  
  const [code, setCode] = useState<string>('// Write your solution here\n\nfunction solve(input) {\n  // Implement your solution\n  \n  return output;\n}\n');
  const [language, setLanguage] = useState<string>('javascript');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('feedback');

  const handleRunCode = (submittedCode: string, lang: string) => {
    setCode(submittedCode);
    setLanguage(lang);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Save user submission
    setUserSubmission({
      code,
      language,
      timestamp: Date.now()
    });
    
    try {
      // Get AI review of code
      const reviewResult = await reviewCode(code, language);
      setAIReview(reviewResult);
      setReviewOpen(true);
      toast.success('Solution submitted for review!');
    } catch (error) {
      console.error('Error reviewing code:', error);
      toast.error('Failed to review code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGiveUp = () => {
    navigate('/dsa-reveal-answer');
  };

  // If there's no problem in context, redirect back to prompt page
  if (!currentProblem) {
    navigate('/dsa-chat-prompt');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-algos-dark">
      <Navbar />
      
      <main className="flex-grow pt-20 px-4 pb-8 max-w-[1800px] mx-auto w-full">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">DSA Trainer</h1>
          <div className="flex gap-3">
            <Button 
              onClick={handleGiveUp} 
              variant="outline"
              className="border-border hover:bg-muted font-medium"
            >
              <Flag className="mr-2 h-4 w-4" />
              Reveal Answer
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-algos-green hover:bg-algos-green/90 text-black font-medium" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Solution'}
            </Button>
          </div>
        </div>
        
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[calc(100vh-220px)]"
        >
          <ResizablePanel defaultSize={40} minSize={30}>
            <ProblemDescription 
              title={currentProblem.title}
              description={currentProblem.description + 
                `\n\n**Input Format:**\n${currentProblem.inputFormat}` +
                `\n\n**Output Format:**\n${currentProblem.outputFormat}` +
                `\n\n**Examples:**\n${currentProblem.examples.map((ex, i) => 
                  `Example ${i+1}:\nInput: ${ex.input}\nOutput: ${ex.output}` + 
                  (ex.explanation ? `\nExplanation: ${ex.explanation}` : '')
                ).join('\n\n')}` +
                `\n\n**Constraints:**\n${currentProblem.constraints.map(c => `- ${c}`).join('\n')}`
              }
              difficulty={currentProblem.difficulty as any}
              tags={currentProblem.tags}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={60} minSize={40}>
            <CodeEditor onRunCode={handleRunCode} initialCode={code} initialLanguage={language} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      <Drawer open={reviewOpen} onOpenChange={setReviewOpen}>
        <DrawerContent className="max-h-[80vh]">
          <div className="px-4 py-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">AI Code Review</h2>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="bg-muted">
                  <TabsTrigger value="feedback" className={cn("flex items-center gap-1", activeTab === "feedback" && "text-primary")}>
                    <Code size={16} /> Overall Feedback
                  </TabsTrigger>
                  <TabsTrigger value="optimization" className={cn("flex items-center gap-1", activeTab === "optimization" && "text-primary")}>
                    <LineChart size={16} /> Optimization
                  </TabsTrigger>
                  <TabsTrigger value="errors" className={cn("flex items-center gap-1", activeTab === "errors" && "text-primary")}>
                    <AlertTriangle size={16} /> Errors & Edge Cases
                  </TabsTrigger>
                </TabsList>
              
                {aiReview && (
                  <div className="animate-fade-in">
                    <TabsContent value="feedback">
                      {aiReview && (
                        <div className="p-6 bg-muted rounded-lg border border-border mt-4">
                          <div className="mb-4">
                            <span className={cn(
                              "px-2 py-1 rounded text-xs font-medium",
                              aiReview.correctness 
                                ? "bg-green-500/20 text-green-500" 
                                : "bg-red-500/20 text-red-500"
                            )}>
                              {aiReview.correctness ? "Correct" : "Needs Improvement"}
                            </span>
                            <div className="mt-4 text-sm">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="p-3 bg-card rounded-lg border border-border">
                                  <p className="text-xs text-muted-foreground mb-1">Time Complexity</p>
                                  <p className="font-medium">{aiReview.timeComplexity}</p>
                                </div>
                                <div className="p-3 bg-card rounded-lg border border-border">
                                  <p className="text-xs text-muted-foreground mb-1">Space Complexity</p>
                                  <p className="font-medium">{aiReview.spaceComplexity}</p>
                                </div>
                              </div>
                              <h3 className="font-medium mb-2">Feedback:</h3>
                              <p className="whitespace-pre-line">{aiReview.feedback}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="optimization">
                      <DsaReviewPanel 
                        type="optimization" 
                        data={aiReview?.optimizations?.map(opt => ({
                          title: "Optimization Suggestion",
                          description: opt
                        })) || []} 
                      />
                    </TabsContent>
                    <TabsContent value="errors">
                      <DsaReviewPanel 
                        type="errors" 
                        data={[
                          ...(aiReview?.bugs?.map(bug => ({
                            title: "Bug",
                            description: bug
                          })) || []),
                          ...(aiReview?.edgeCases?.map(edge => ({
                            title: "Edge Case",
                            description: edge
                          })) || [])
                        ]} 
                      />
                    </TabsContent>
                  </div>
                )}
              </Tabs>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default DSAProblem;
