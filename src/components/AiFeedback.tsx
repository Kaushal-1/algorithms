
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Lightbulb, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FeedbackItem {
  type: 'error' | 'suggestion' | 'optimization' | 'style';
  message: string;
  line?: number;
  code?: string;
}

interface AiFeedbackProps {
  feedback: FeedbackItem[];
  isLoading: boolean;
}

const AiFeedback: React.FC<AiFeedbackProps> = ({ feedback, isLoading }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'suggestion':
        return <Lightbulb className="h-5 w-5 text-secondary" />;
      case 'optimization':
        return <Clock className="h-5 w-5 text-accent" />;
      case 'style':
        return <CheckCircle className="h-5 w-5 text-primary" />;
      default:
        return <Lightbulb className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card className="flex flex-col h-full border-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-foreground">AI Review & Suggestions</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <ScrollArea className="h-full max-h-[calc(100vh-220px)] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
                <div className="h-4 w-48 bg-muted rounded"></div>
                <div className="h-3 w-32 bg-muted rounded mt-2"></div>
              </div>
            </div>
          ) : feedback.length > 0 ? (
            <div className="space-y-4">
              {feedback.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-muted border border-border transition-all hover:border-primary/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getIcon(item.type)}</div>
                    <div className="flex-1">
                      <div className="font-medium mb-1 text-foreground">
                        {item.type === 'error' && 'Error'}
                        {item.type === 'suggestion' && 'Suggestion'}
                        {item.type === 'optimization' && 'Optimization'}
                        {item.type === 'style' && 'Style Tip'}
                        {item.line && <span className="text-muted-foreground text-sm ml-2">Line {item.line}</span>}
                      </div>
                      <p className="text-sm text-foreground/90">{item.message}</p>
                      {item.code && (
                        <pre className="mt-2 p-2 rounded bg-algos-darker text-xs font-mono border border-border">
                          {item.code}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <Lightbulb className="h-10 w-10 mb-2 text-muted-foreground/40" />
              <p>Run your code to get AI feedback</p>
              <p className="text-sm mt-1">We'll analyze your code and provide suggestions</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AiFeedback;
