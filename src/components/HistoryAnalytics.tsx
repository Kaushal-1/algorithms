
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProblemTag from './ProblemTag';

interface AnalyticsProps {
  totalProblems: number;
  successRate: number;
  mostUsedLanguage: string;
  averageTime: string;
  recentTags: string[];
}

const HistoryAnalytics = ({
  totalProblems,
  successRate,
  mostUsedLanguage,
  averageTime,
  recentTags
}: AnalyticsProps) => {
  return (
    <div className="space-y-4">
      <Card className="bg-card/70 border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Your Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-1 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Total problems</span>
              <span className="font-medium">{totalProblems}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Success rate</span>
              <span className="font-medium text-green-500">{successRate}%</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Most used</span>
              <span className="font-medium">{mostUsedLanguage}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-muted-foreground">Avg. time</span>
              <span className="font-medium">{averageTime}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/70 border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Recent Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {recentTags.map(tag => (
              <ProblemTag key={tag} tag={tag} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryAnalytics;
