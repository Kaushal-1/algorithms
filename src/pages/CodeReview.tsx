
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import CodeEditor from '@/components/CodeEditor';
import ProblemDescription from '@/components/ProblemDescription';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, LineChart, AlertTriangle } from 'lucide-react';
import DsaReviewPanel from '@/components/DsaReviewPanel';
import { cn } from '@/lib/utils';

// Sample problem for demonstration
const sampleProblem = {
  title: 'Two Sum',
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]

Constraints:
- 2 <= nums.length <= 104
- -109 <= nums[i] <= 109
- -109 <= target <= 109
- Only one valid answer exists.
`,
  difficulty: 'Easy' as const,
  tags: ['Array', 'Hash Table']
};

// Sample feedback for demonstration
const sampleFeedback = {
  codeDiff: [
    {
      type: 'unchanged' as const,
      code: 'function twoSum(nums, target) {',
    },
    {
      type: 'removed' as const,
      code: '  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] + nums[j] === target) {\n        return [i, j];\n      }\n    }\n  }',
    },
    {
      type: 'added' as const,
      code: '  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }',
    },
    {
      type: 'unchanged' as const,
      code: '  return [];\n}',
    },
  ],
  optimizations: [
    {
      title: 'Time Complexity Improvement',
      description: 'Original solution has O(n²) time complexity. The optimized version uses a hash map to achieve O(n) time complexity.',
      code: 'const map = new Map();\nfor (let i = 0; i < nums.length; i++) {\n  const complement = target - nums[i];\n  if (map.has(complement)) {\n    return [map.get(complement), i];\n  }\n  map.set(nums[i], i);\n}',
    },
    {
      title: 'Space Complexity',
      description: 'The optimized solution uses additional O(n) space for the hash map, which is a reasonable trade-off for the time complexity improvement.',
    }
  ],
  errors: [
    {
      title: 'Potential Edge Cases',
      description: 'The solution should verify that nums is not empty before processing.',
      code: 'if (!nums || nums.length < 2) {\n  return [];\n}',
    },
    {
      title: 'Missing Type Annotations',
      description: 'Consider adding TypeScript type annotations for better code quality and IDE support.',
      code: 'function twoSum(nums: number[], target: number): number[] {',
    }
  ]
};

const CodeReview: React.FC = () => {
  const [code, setCode] = useState<string>('// Write your solution here\n\nfunction twoSum(nums, target) {\n  // Implement the Two Sum solution\n}\n');
  const [language, setLanguage] = useState<string>('javascript');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('diff');

  const handleRunCode = (submittedCode: string, lang: string) => {
    setCode(submittedCode);
    setLanguage(lang);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setFeedback(sampleFeedback);
      setReviewOpen(true);
      setIsSubmitting(false);
      toast.success('Solution submitted for review!');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-algos-dark">
      <Navbar />
      
      <main className="flex-grow pt-20 px-4 pb-8 max-w-[1800px] mx-auto w-full">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">DSA Trainer</h1>
          <Button 
            onClick={handleSubmit} 
            className="bg-algos-green hover:bg-algos-green/90 text-black font-medium" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Solution'}
          </Button>
        </div>
        
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[calc(100vh-220px)]"
        >
          <ResizablePanel defaultSize={40} minSize={30}>
            <ProblemDescription 
              title={sampleProblem.title}
              description={sampleProblem.description}
              difficulty={sampleProblem.difficulty}
              tags={sampleProblem.tags}
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
                  <TabsTrigger value="diff" className={cn("flex items-center gap-1", activeTab === "diff" && "text-primary")}>
                    <Code size={16} /> Code Diff
                  </TabsTrigger>
                  <TabsTrigger value="optimization" className={cn("flex items-center gap-1", activeTab === "optimization" && "text-primary")}>
                    <LineChart size={16} /> Optimization
                  </TabsTrigger>
                  <TabsTrigger value="errors" className={cn("flex items-center gap-1", activeTab === "errors" && "text-primary")}>
                    <AlertTriangle size={16} /> Errors
                  </TabsTrigger>
                </TabsList>
              
                {feedback && (
                  <div className="animate-fade-in">
                    <TabsContent value="diff">
                      <DsaReviewPanel type="diff" data={feedback.codeDiff} />
                    </TabsContent>
                    <TabsContent value="optimization">
                      <DsaReviewPanel type="optimization" data={feedback.optimizations} />
                    </TabsContent>
                    <TabsContent value="errors">
                      <DsaReviewPanel type="errors" data={feedback.errors} />
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

export default CodeReview;
