
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [typingComplete, setTypingComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    // Simulate the typing effect completion
    const timer = setTimeout(() => {
      setTypingComplete(true);
    }, 3500);

    // Cycle through the AI feedback steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % 3);
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(stepInterval);
    };
  }, []);
  
  const codeExample = `function reverseString(str) {
  // Convert string to array
  let arr = str.split('');
  
  // Reverse the array
  arr.reverse();
  
  // Join array back to string
  return arr.join('');
}`;
  
  const aiFeedback = [{
    id: 0,
    text: "Your function works, but could be more concise. Consider chaining methods:",
    code: "return str.split('').reverse().join('');"
  }, {
    id: 1,
    text: "For better performance with longer strings, use a loop instead:",
    code: "let result = '';\nfor (let i = str.length - 1; i >= 0; i--) {\n  result += str[i];\n}\nreturn result;"
  }, {
    id: 2,
    text: "For Unicode characters, consider using spread operator:",
    code: "return [...str].reverse().join('');"
  }];
  
  return <section className="pt-32 pb-20 px-4 md:px-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="w-full lg:w-1/2 animate-fade-in" style={{
          animationDelay: '0.2s'
        }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight">
              Code with Confidence.
              <span className="text-primary block">PERSONALISED AI GURUKUL</span>
            </h1>
            <p className="text-xl text-foreground/80 mb-8 max-w-xl">
              ALGORITHMS helps you write better code, spot errors faster, and improve over time — all with the power of AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/code-review">
                <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-6 text-lg">
                  Start Reviewing Your Code
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/personalized-learning">
                <Button variant="outline" className="flex items-center gap-2 border-primary text-primary hover:text-primary-foreground hover:bg-primary/20 px-6 py-6 text-lg">
                  Try Personalized Learning
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 animate-fade-in" style={{
          animationDelay: '0.4s'
        }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-algos-darker p-4 rounded-lg shadow-xl border border-border">
              {/* Code Editor Panel */}
              <div className="code-block">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-xs text-foreground/60">reverseString.js</span>
                </div>
                <pre className="text-sm text-foreground/90 overflow-x-auto">
                  <code>{codeExample}</code>
                </pre>
              </div>
              
              {/* AI Feedback Panel */}
              <div className="bg-muted p-4 rounded-lg relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-secondary w-8 h-8 rounded-full flex items-center justify-center">
                    <MessageSquare size={16} className="text-white" />
                  </div>
                  <h3 className="text-foreground font-medium">AI Feedback</h3>
                </div>
                
                {/* AI Comment */}
                <div className={cn("transition-opacity duration-500", typingComplete ? "opacity-100" : "opacity-0")}>
                  <div className="mb-3 p-3 bg-muted border border-border rounded-lg">
                    <p className="text-sm text-foreground/90 mb-2">
                      {aiFeedback[currentStep].text}
                    </p>
                    <pre className="text-xs bg-algos-darker p-2 rounded text-accent overflow-x-auto">
                      <code>{aiFeedback[currentStep].code}</code>
                    </pre>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground/70">
                    <CheckCircle2 size={14} className="text-accent" />
                    <span>Updated algorithm is 40% more efficient</span>
                  </div>
                </div>
                
                {/* Typing effect before feedback appears */}
                <div className={cn("absolute inset-0 flex items-center justify-center bg-muted rounded-lg transition-opacity duration-300", typingComplete ? "opacity-0 pointer-events-none" : "opacity-100")}>
                  <div className="typing-container px-6">
                    <p className="typing-text text-sm text-foreground/90">
                      Analyzing your code...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background gradients */}
      <div className="absolute top-1/4 -left-96 w-[500px] h-[500px] bg-primary/20 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 -right-96 w-[500px] h-[500px] bg-secondary/20 rounded-full filter blur-3xl opacity-20"></div>
    </section>;
};

export default HeroSection;
