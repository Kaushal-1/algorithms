
import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Code } from "lucide-react";

const CodePreviewSection = () => {
  const [activeTab, setActiveTab] = useState('python');
  
  const codeExamples = {
    python: {
      code: `def find_longest_substring(s):
    """Find longest substring without repeating characters."""
    char_dict = {}
    max_length = start = 0
    
    for i, char in enumerate(s):
        # If character is already in current substring
        if char in char_dict and start <= char_dict[char]:
            # Update the start position
            start = char_dict[char] + 1
        else:
            # Update max_length if current substring is longer
            max_length = max(max_length, i - start + 1)
        
        # Update last position of character
        char_dict[char] = i
    
    return max_length`,
      feedback: [
        {
          type: 'success',
          message: 'Good use of dictionary for character tracking',
          line: 2
        },
        {
          type: 'warning',
          message: 'Consider using defaultdict to simplify the code',
          line: 7
        },
        {
          type: 'suggestion',
          message: 'You could optimize space complexity by removing old entries',
          line: 15
        }
      ]
    },
    javascript: {
      code: `function findLongestSubstring(s) {
  // Map to store the position of characters
  const charMap = new Map();
  let maxLength = 0;
  let start = 0;
  
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    
    // If character exists in current window
    if (charMap.has(char) && start <= charMap.get(char)) {
      // Move start pointer to position after the duplicate
      start = charMap.get(char) + 1;
    } else {
      // Update max length if current substring is longer
      maxLength = Math.max(maxLength, i - start + 1);
    }
    
    // Update character position
    charMap.set(char, i);
  }
  
  return maxLength;
}`,
      feedback: [
        {
          type: 'success',
          message: 'Using Map object is efficient for lookups',
          line: 2
        },
        {
          type: 'warning',
          message: 'Consider early returns for empty strings',
          line: 4
        },
        {
          type: 'suggestion',
          message: 'You could add type checking or JSDoc comments',
          line: 1
        }
      ]
    }
  };
  
  const activeCode = codeExamples[activeTab];

  // Prepare code with line numbers and feedback indicators
  const renderCode = () => {
    const lines = activeCode.code.split('\n');
    
    return lines.map((line, index) => {
      const lineNumber = index + 1;
      const feedback = activeCode.feedback.find(f => f.line === lineNumber);
      
      return (
        <div key={lineNumber} className="flex group">
          <div className="text-foreground/40 text-xs w-8 text-right pr-2 select-none">
            {lineNumber}
          </div>
          <div className="flex-1 overflow-x-auto">
            <pre className="text-foreground/90 text-sm">
              <code>{line}</code>
            </pre>
          </div>
          {feedback && (
            <div className="relative flex items-center">
              <div className={`
                ml-2 w-4 h-4 flex items-center justify-center rounded-full
                ${feedback.type === 'success' ? 'bg-green-500/20 text-green-500' : 
                  feedback.type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-blue-500/20 text-blue-500'
                }
              `}>
                {feedback.type === 'success' ? <CheckCircle size={12} /> : 
                  feedback.type === 'warning' ? <AlertTriangle size={12} /> :
                  <Code size={12} />
                }
              </div>
              <div className="absolute right-full top-0 -mt-2 mr-2 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className={`
                  text-xs p-2 rounded shadow-lg
                  ${feedback.type === 'success' ? 'bg-green-500/10 border border-green-500/30' : 
                    feedback.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                    'bg-blue-500/10 border border-blue-500/30'
                  }
                `}>
                  {feedback.message}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-algos-darker" id="code-review">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Live Code <span className="text-accent">Review</span> Preview
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            See how ALGORITHMS provides real-time feedback on your code, highlighting both strengths and areas for improvement.
          </p>
        </div>
        
        <div className="bg-algos-dark border border-border rounded-lg shadow-xl overflow-hidden">
          {/* Tab selector */}
          <div className="flex border-b border-border">
            <button 
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'python' ? 'bg-muted text-primary' : 'text-foreground/60'}`}
              onClick={() => setActiveTab('python')}
            >
              Python
            </button>
            <button 
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'javascript' ? 'bg-muted text-primary' : 'text-foreground/60'}`}
              onClick={() => setActiveTab('javascript')}
            >
              JavaScript
            </button>
          </div>
          
          {/* Code display */}
          <div className="p-4 overflow-x-auto">
            {renderCode()}
          </div>
          
          {/* Code summary */}
          <div className="p-4 border-t border-border bg-muted">
            <h4 className="text-sm font-medium mb-2">AI Summary</h4>
            <p className="text-sm text-foreground/80">
              This {activeTab === 'python' ? 'Python' : 'JavaScript'} solution efficiently finds the longest substring 
              without repeating characters using a sliding window approach. The time complexity is O(n) where n is the string length. 
              {activeTab === 'python' 
                ? " Consider using Python's collections.defaultdict for cleaner code."
                : " Consider adding input validation for better robustness."
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodePreviewSection;
