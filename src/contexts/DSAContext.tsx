
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DSAProblem {
  id: string;
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}

export interface DSASubmission {
  code: string;
  language: string;
  timestamp: number;
}

interface DSAContextType {
  currentProblem: DSAProblem | null;
  userSubmission: DSASubmission | null;
  aiReview: any | null;
  solution: string | null;
  setCurrentProblem: (problem: DSAProblem) => void;
  setUserSubmission: (submission: DSASubmission) => void;
  setAIReview: (review: any) => void;
  setSolution: (solution: string) => void;
  resetDSAState: () => void;
  generateProblem: (topic: string, difficulty: string) => Promise<DSAProblem>;
  reviewCode: (code: string, language: string) => Promise<any>;
  getAnswer: () => Promise<string>;
}

const DSAContext = createContext<DSAContextType | undefined>(undefined);

export const DSAProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentProblem, setCurrentProblem] = useState<DSAProblem | null>(null);
  const [userSubmission, setUserSubmission] = useState<DSASubmission | null>(null);
  const [aiReview, setAIReview] = useState<any | null>(null);
  const [solution, setSolution] = useState<string | null>(null);

  const resetDSAState = () => {
    setCurrentProblem(null);
    setUserSubmission(null);
    setAIReview(null);
    setSolution(null);
  };

  // API endpoint for generating a problem
  const generateProblem = async (topic: string, difficulty: string): Promise<DSAProblem> => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: "You are an expert DSA (Data Structures and Algorithms) teacher who creates programming challenges."
            },
            {
              role: "user",
              content: `Create a ${difficulty} difficulty ${topic} programming problem with:
              1. A clear title
              2. Detailed problem description
              3. Input format
              4. Output format
              5. 2-3 example test cases with input, output, and explanations
              6. Constraints
              7. Tags
              
              Structure it as JSON following this exact format:
              {
                "id": "unique-id",
                "title": "Problem Title",
                "description": "Full description...",
                "inputFormat": "Description of input format",
                "outputFormat": "Description of output format",
                "constraints": ["constraint 1", "constraint 2"],
                "examples": [
                  {
                    "input": "Example input 1",
                    "output": "Example output 1",
                    "explanation": "Explanation for example 1"
                  }
                ],
                "difficulty": "${difficulty}",
                "tags": ["tag1", "tag2"]
              }`
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      const data = await response.json();
      let problemData = data.choices[0].message.content;
      
      // Handle if it's wrapped in markdown code blocks
      if (problemData.includes("```json")) {
        problemData = problemData.split("```json")[1].split("```")[0].trim();
      } else if (problemData.includes("```")) {
        problemData = problemData.split("```")[1].split("```")[0].trim();
      }
      
      // Parse the JSON
      const problem = JSON.parse(problemData);
      return problem;
    } catch (error) {
      console.error("Error generating problem:", error);
      throw new Error("Failed to generate problem. Please try again.");
    }
  };

  // API endpoint for reviewing code
  const reviewCode = async (code: string, language: string) => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: "You are an expert code reviewer for Data Structures and Algorithms. Provide detailed analysis including time complexity, space complexity, bugs, edge cases, and optimization suggestions."
            },
            {
              role: "user",
              content: `Review this ${language} solution for the following problem:\n\n${currentProblem?.title}\n${currentProblem?.description}\n\nCode to review:\n\`\`\`${language}\n${code}\n\`\`\`\n\nFormat your review as JSON with the following structure:
              {
                "correctness": true/false,
                "timeComplexity": "O(n)",
                "spaceComplexity": "O(n)",
                "bugs": ["bug description 1", "bug description 2"],
                "edgeCases": ["edge case 1", "edge case 2"],
                "optimizations": ["optimization 1", "optimization 2"],
                "feedback": "Overall detailed feedback"
              }`
            }
          ],
          temperature: 0.5,
          max_tokens: 1500
        })
      });

      const data = await response.json();
      let reviewData = data.choices[0].message.content;
      
      // Handle if it's wrapped in markdown code blocks
      if (reviewData.includes("```json")) {
        reviewData = reviewData.split("```json")[1].split("```")[0].trim();
      } else if (reviewData.includes("```")) {
        reviewData = reviewData.split("```")[1].split("```")[0].trim();
      }
      
      // Parse the JSON
      return JSON.parse(reviewData);
    } catch (error) {
      console.error("Error reviewing code:", error);
      return {
        correctness: false,
        timeComplexity: "Unknown",
        spaceComplexity: "Unknown",
        bugs: ["Error processing code review."],
        edgeCases: [],
        optimizations: [],
        feedback: "There was an error analyzing your code. Please try again."
      };
    }
  };

  // API endpoint for getting the solution
  const getAnswer = async () => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: "You are an expert programmer specializing in optimal solutions to DSA problems. Provide clear, optimized code with explanation."
            },
            {
              role: "user",
              content: `Provide an optimal solution for this problem:\n\n${currentProblem?.title}\n${currentProblem?.description}\n\nInput Format: ${currentProblem?.inputFormat}\nOutput Format: ${currentProblem?.outputFormat}\n\nPlease provide the solution code in JavaScript/TypeScript with detailed comments explaining the approach, time complexity, and space complexity.`
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error getting solution:", error);
      return "Error retrieving solution. Please try again.";
    }
  };

  return (
    <DSAContext.Provider
      value={{
        currentProblem,
        userSubmission,
        aiReview,
        solution,
        setCurrentProblem,
        setUserSubmission,
        setAIReview,
        setSolution,
        resetDSAState,
        generateProblem,
        reviewCode,
        getAnswer
      }}
    >
      {children}
    </DSAContext.Provider>
  );
};

export const useDSA = () => {
  const context = useContext(DSAContext);
  if (context === undefined) {
    throw new Error('useDSA must be used within a DSAProvider');
  }
  return context;
};
