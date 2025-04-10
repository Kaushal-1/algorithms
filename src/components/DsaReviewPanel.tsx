
import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CodeDiffItem {
  type: 'added' | 'removed' | 'unchanged';
  code: string;
}

interface OptimizationItem {
  title: string;
  description: string;
  code?: string;
}

interface ErrorItem {
  title: string;
  description: string;
  code?: string;
}

interface DsaReviewPanelProps {
  type: 'diff' | 'optimization' | 'errors';
  data: CodeDiffItem[] | OptimizationItem[] | ErrorItem[];
}

const DsaReviewPanel: React.FC<DsaReviewPanelProps> = ({ type, data }) => {
  const renderDiffContent = (items: CodeDiffItem[]) => {
    return (
      <pre className="bg-algos-darker rounded-lg p-4 overflow-auto text-sm font-mono">
        {items.map((item, idx) => {
          if (item.type === 'added') {
            return (
              <div key={idx} className="text-accent bg-accent/10 px-2 -mx-2">
                + {item.code}
              </div>
            );
          } else if (item.type === 'removed') {
            return (
              <div key={idx} className="text-red-400 bg-red-400/10 px-2 -mx-2">
                - {item.code}
              </div>
            );
          } else {
            return <div key={idx}>{item.code}</div>;
          }
        })}
      </pre>
    );
  };

  const renderOptimizationContent = (items: OptimizationItem[]) => {
    return (
      <div className="space-y-4">
        {items.map((item, idx) => (
          <Card key={idx} className="p-4 bg-muted/50 border-border">
            <h3 className="text-lg font-medium text-foreground mb-2">{item.title}</h3>
            <p className="text-muted-foreground mb-3">{item.description}</p>
            {item.code && (
              <pre className="bg-algos-darker rounded-lg p-3 text-sm font-mono overflow-auto">
                {item.code}
              </pre>
            )}
          </Card>
        ))}
      </div>
    );
  };

  const renderErrorContent = (items: ErrorItem[]) => {
    return (
      <div className="space-y-4">
        {items.map((item, idx) => (
          <Card key={idx} className="p-4 bg-muted/50 border-border">
            <h3 className="text-lg font-medium text-destructive mb-2">{item.title}</h3>
            <p className="text-muted-foreground mb-3">{item.description}</p>
            {item.code && (
              <pre className="bg-algos-darker rounded-lg p-3 text-sm font-mono overflow-auto">
                {item.code}
              </pre>
            )}
          </Card>
        ))}
      </div>
    );
  };

  return (
    <ScrollArea className="h-[50vh]">
      <div className="p-1 pr-4">
        {type === 'diff' && renderDiffContent(data as CodeDiffItem[])}
        {type === 'optimization' && renderOptimizationContent(data as OptimizationItem[])}
        {type === 'errors' && renderErrorContent(data as ErrorItem[])}
      </div>
    </ScrollArea>
  );
};

export default DsaReviewPanel;
