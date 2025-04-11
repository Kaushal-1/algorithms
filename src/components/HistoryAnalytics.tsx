
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProblemTag from './ProblemTag';
import { BarChart2, Clock, Code, BookOpen, CheckCircle } from 'lucide-react';

interface AnalyticsProps {
  // Common properties
  recentTopics?: string[];
  recentTags?: string[];
  
  // AI Tutor specific properties
  totalSessions?: number;
  totalHours?: number;
  mostFrequentTopic?: string;
  averageSessionDuration?: string;
  
  // DSA Trainer specific properties
  totalProblems?: number;
  successRate?: number;
  mostUsedLanguage?: string;
  averageAttempts?: number;
  averageTime?: string;
}

const HistoryAnalytics = (props: AnalyticsProps) => {
  const isDSAAnalytics = props.totalProblems !== undefined;
  
  return (
    <div className="space-y-4">
      <Card className="bg-card/70 border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            {isDSAAnalytics ? (
              <>
                <Code className="h-4 w-4" />
                <span>DSA Progress</span>
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4" />
                <span>Tutor Stats</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isDSAAnalytics ? (
              // DSA Trainer Analytics
              <>
                <div className="flex justify-between items-center py-1 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Total problems</span>
                  <span className="font-medium">{props.totalProblems}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Success rate</span>
                  <span className="font-medium text-green-500">{props.successRate}%</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Most used</span>
                  <span className="font-medium">{props.mostUsedLanguage}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-muted-foreground">Avg. attempts</span>
                  <span className="font-medium">{props.averageAttempts}</span>
                </div>
              </>
            ) : (
              // AI Tutor Analytics
              <>
                <div className="flex justify-between items-center py-1 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Total sessions</span>
                  <span className="font-medium">{props.totalSessions}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Total hours</span>
                  <span className="font-medium">{props.totalHours}h</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Most frequent</span>
                  <span className="font-medium">{props.mostFrequentTopic}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-muted-foreground">Avg. duration</span>
                  <span className="font-medium">{props.averageSessionDuration}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/70 border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>{isDSAAnalytics ? 'Recent Tags' : 'Recent Topics'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {isDSAAnalytics && props.recentTags ? (
              props.recentTags.map(tag => (
                <ProblemTag key={tag} tag={tag} />
              ))
            ) : props.recentTopics ? (
              props.recentTopics.map(topic => (
                <ProblemTag key={topic} tag={topic} />
              ))
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryAnalytics;
