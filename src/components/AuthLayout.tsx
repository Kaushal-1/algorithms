
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  redirectText: string;
  redirectLinkText: string;
  redirectTo: string;
}

const AuthLayout = ({
  children,
  title,
  subtitle,
  redirectText,
  redirectLinkText,
  redirectTo
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-algos-dark relative overflow-hidden py-6 px-4 sm:px-6 lg:px-8">
      {/* Animated code blocks in background */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="animate-float-slow absolute -top-10 -left-10 w-72 h-72 bg-algos-purple/20 rounded-full blur-3xl"></div>
        <div className="animate-float absolute top-60 -right-10 w-72 h-72 bg-algos-highlight/20 rounded-full blur-3xl"></div>
        <div className="animate-float-fast absolute bottom-10 left-20 w-72 h-72 bg-algos-green/20 rounded-full blur-3xl"></div>
        
        <div className="hidden lg:block absolute top-1/4 left-10 transform rotate-6 opacity-30">
          <pre className="text-xs text-primary">
{`function checkAlgorithm(code) {
  const analysis = AI.analyze(code);
  return {
    suggestions: analysis.improve(),
    bestPractices: analysis.getBestPractices(),
    timeComplexity: analysis.getTimeComplexity()
  };
}`}
          </pre>
        </div>
        
        <div className="hidden lg:block absolute bottom-1/4 right-10 transform -rotate-3 opacity-30">
          <pre className="text-xs text-primary">
{`const optimizeFunction = (fn) => {
  return (...args) => {
    console.time('execution');
    const result = fn(...args);
    console.timeEnd('execution');
    return result;
  };
};`}
          </pre>
        </div>
      </div>
      
      {/* Auth card */}
      <div className="relative w-full max-w-md mx-auto">
        <div className="bg-card/80 backdrop-blur-lg border border-border/50 shadow-xl rounded-xl p-8">
          <div className="mb-8">
            <Link to="/" className="block text-center">
              <span className="text-2xl font-bold text-white font-heading">
                ALGORITHMS<span className="text-primary">.</span>
              </span>
            </Link>
            <h2 className="mt-6 text-2xl font-bold text-foreground font-heading">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          
          {children}
          
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              {redirectText}{' '}
              <Link to={redirectTo} className="text-primary hover:text-primary/90 transition-colors font-medium">
                {redirectLinkText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
