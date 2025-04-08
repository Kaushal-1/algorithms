
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import CodeEditor from '@/components/CodeEditor';
import AiFeedback from '@/components/AiFeedback';
import ProblemDescription from '@/components/ProblemDescription';
import { toast } from 'sonner';

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

// Sample AI feedback for demonstration
const sampleFeedback = [
  {
    type: 'suggestion' as const,
    message: 'Consider using a hash map to reduce time complexity from O(n²) to O(n).',
    line: 5
  },
  {
    type: 'error' as const,
    message: 'This loop may cause an index out of bounds error for empty arrays.',
    line: 3,
    code: 'for (let i = 0; i < nums.length; i++) {\n  // Add a check for array length'
  },
  {
    type: 'optimization' as const,
    message: 'The current solution has a time complexity of O(n²). You can improve this.',
    code: 'const twoSum = (nums, target) => {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n};'
  },
  {
    type: 'style' as const,
    message: 'Use descriptive variable names to improve code readability.',
    line: 2
  }
];

const CodeReview: React.FC = () => {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunCode = (code: string, language: string) => {
    setIsLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      setFeedback(sampleFeedback);
      setIsLoading(false);
      toast.success('Code analysis complete!');
    }, 1500);
    
    console.log(`Running ${language} code:`, code);
  };

  return (
    <div className="flex flex-col min-h-screen bg-algos-dark">
      <Navbar />
      
      <main className="flex-grow pt-20 px-4 pb-8 max-w-[1800px] mx-auto w-full">
        <div className="mb-4">
          <ProblemDescription 
            title={sampleProblem.title}
            description={sampleProblem.description}
            difficulty={sampleProblem.difficulty}
            tags={sampleProblem.tags}
          />
        </div>
        
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[calc(100vh-220px)]"
        >
          <ResizablePanel defaultSize={50} minSize={30}>
            <CodeEditor onRunCode={handleRunCode} />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={50} minSize={30}>
            <AiFeedback feedback={feedback} isLoading={isLoading} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
};

export default CodeReview;
