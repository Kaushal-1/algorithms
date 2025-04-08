
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CodeSubmissionCard from '@/components/CodeSubmissionCard';
import HistoryAnalytics from '@/components/HistoryAnalytics';
import { Search, Filter } from "lucide-react";

// Mock data for demonstration
const MOCK_SUBMISSIONS = [
  {
    id: '1',
    title: 'Two Sum',
    tags: ['arrays', 'hash-map', 'easy'],
    language: 'JavaScript',
    date: 'Today, 2:30 PM',
    status: 'passed' as const,
    feedbackSummary: 'Well-optimized solution using a hash map, O(n) time complexity.'
  },
  {
    id: '2',
    title: 'Valid Parentheses',
    tags: ['stack', 'strings', 'medium'],
    language: 'Python',
    date: 'Yesterday, 4:15 PM',
    status: 'passed' as const,
    feedbackSummary: 'Good use of stack data structure, but could improve variable naming.'
  },
  {
    id: '3',
    title: 'Merge Sort Implementation',
    tags: ['sorting', 'recursion', 'medium'],
    language: 'C++',
    date: '2 days ago',
    status: 'failed' as const,
    feedbackSummary: 'Edge case not handled for empty arrays, causing runtime error.'
  },
  {
    id: '4',
    title: 'Linked List Cycle',
    tags: ['linked-list', 'two-pointers', 'medium'],
    language: 'Java',
    date: '3 days ago',
    status: 'passed' as const,
    feedbackSummary: "Excellent solution using Floyd's cycle-finding algorithm."
  },
  {
    id: '5',
    title: 'Binary Tree Level Order Traversal',
    tags: ['trees', 'bfs', 'medium'],
    language: 'JavaScript',
    date: '4 days ago',
    status: 'in-progress' as const,
    feedbackSummary: 'Implementation in progress, consider using a queue for BFS.'
  },
  {
    id: '6',
    title: 'Maximum Subarray',
    tags: ['arrays', 'dynamic-programming', 'easy'],
    language: 'Python',
    date: 'Last week',
    status: 'passed' as const,
    feedbackSummary: "Good implementation of Kadane's algorithm, optimal solution."
  }
];

// Analytics mock data
const ANALYTICS = {
  totalProblems: 24,
  successRate: 75,
  mostUsedLanguage: 'JavaScript',
  averageTime: '42 mins',
  recentTags: ['arrays', 'strings', 'dynamic-programming', 'trees', 'recursion', 'hash-map']
};

const CodeHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Filter submissions based on search and filters
  const filteredSubmissions = MOCK_SUBMISSIONS.filter(submission => {
    const matchesSearch = searchTerm === '' || 
      submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLanguage = language === 'all' || submission.language.toLowerCase() === language.toLowerCase();
    
    // For simplicity, not implementing actual date filtering
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="min-h-screen bg-algos-dark">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white font-heading">Your Code History</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content area - submissions */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters section */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search by problem name or tag..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 bg-card/50 border-border"
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[140px] bg-card/50 border-border">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="c++">C++</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[140px] bg-card/50 border-border">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Past Week</SelectItem>
                    <SelectItem value="month">Past Month</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px] bg-card/50 border-border">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="difficulty">Difficulty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Submissions grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map(submission => (
                  <CodeSubmissionCard key={submission.id} submission={submission} />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <p className="text-lg">No submissions found matching your filters.</p>
                  <p className="text-sm mt-2">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar - analytics */}
          <div className="order-first lg:order-last">
            <HistoryAnalytics {...ANALYTICS} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CodeHistory;
