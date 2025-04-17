import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import CodeEditor from '@/components/CodeEditor';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useDSA } from '@/contexts/DSAContext';
import { ArrowLeft, RefreshCw, Loader2 } from 'lucide-react';
import ProblemDescription from '@/components/ProblemDescription';

const DSARevealAnswer: React.FC = () => {
  const navigate = useNavigate();
  const { currentProblem, solution, getAnswer, setSolution } = useDSA();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>('// Loading optimal solution...');
  const [language, setLanguage] = useState<string>('javascript');

  useEffect(() => {
    if (currentProblem && !solution) {
      fetchSolution();
    } else if (solution) {
      setCode(solution);
    }
  }, [currentProblem, solution]);

  const fetchSolution = async () => {
    if (!currentProblem) {
      navigate('/dsa-chat-prompt');
      return;
    }

    setIsLoading(true);
    try {
      const solutionCode = await getAnswer();
      setSolution(solutionCode);
      setCode(solutionCode);
    } catch (error) {
      console.error('Error fetching solution:', error);
      toast.error('Failed to fetch solution. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunCode = (submittedCode: string, lang: string) => {
    setCode(submittedCode);
    setLanguage(lang);
  };

  const handleBackToProblem = () => {
    navigate('/dsa-problem');
  };

  const handleNewProblem = () => {
    navigate('/dsa-chat-prompt');
  };

  if (!currentProblem) {
    navigate('/dsa-chat-prompt');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-algos-dark">
      <Navbar />
      
      <main className="flex-grow pt-20 px-4 pb-8 max-w-[1800px] mx-auto w-full">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">DSA Guru</h1>
          <div className="flex gap-3">
            <Button 
              onClick={handleBackToProblem} 
              variant="outline"
              className="border-border hover:bg-muted font-medium"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Problem
            </Button>
            <Button 
              onClick={handleNewProblem} 
              className="bg-algos-green hover:bg-algos-green/90 text-black font-medium"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              New Problem
            </Button>
          </div>
        </div>
        
        <Card className="mb-4 border-accent/50 bg-accent/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-accent">Optimal Solution Revealed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is an expert-provided solution to the problem. Study it carefully to understand the approach and techniques used.
            </p>
          </CardContent>
        </Card>
        
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[calc(100vh-300px)]"
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
            {isLoading ? (
              <div className="flex items-center justify-center h-full bg-card/50 backdrop-blur-sm rounded-lg border border-border">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Generating optimal solution...</p>
                </div>
              </div>
            ) : (
              <CodeEditor 
                onRunCode={handleRunCode} 
                initialCode={code} 
                initialLanguage={language} 
                readOnly={true} 
              />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
};

export default DSARevealAnswer;
