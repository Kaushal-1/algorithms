
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Filter, Clock, BookOpen, Code, CheckCircle, XCircle } from "lucide-react";
import TutorSessionCard from '@/components/TutorSessionCard';
import DSASubmissionCard from '@/components/DSASubmissionCard';
import HistoryAnalytics from '@/components/HistoryAnalytics';

// Mock data for AI Tutor sessions
const MOCK_TUTOR_SESSIONS = [
  {
    id: '1',
    title: 'Learned React Basics',
    date: 'Today, 2:30 PM',
    topics: ['react', 'javascript', 'hooks'],
    duration: '45 mins'
  },
  {
    id: '2',
    title: 'Advanced CSS Animations',
    date: 'Yesterday, 4:15 PM',
    topics: ['css', 'animations', 'keyframes'],
    duration: '32 mins'
  },
  {
    id: '3',
    title: 'TypeScript Generics Deep Dive',
    date: '2 days ago',
    topics: ['typescript', 'generics', 'advanced'],
    duration: '58 mins'
  },
  {
    id: '4',
    title: 'Building Custom React Hooks',
    date: '3 days ago',
    topics: ['react', 'hooks', 'custom-hooks'],
    duration: '41 mins'
  }
];

// Mock data for DSA submissions
const MOCK_DSA_SUBMISSIONS = [
  {
    id: '1',
    title: 'Two Sum',
    tags: ['arrays', 'hash-map', 'easy'],
    language: 'JavaScript',
    date: 'Today, 2:30 PM',
    status: 'passed' as const,
    attempts: 1,
    feedbackSummary: 'Well-optimized solution using a hash map, O(n) time complexity.'
  },
  {
    id: '2',
    title: 'Valid Parentheses',
    tags: ['stack', 'strings', 'medium'],
    language: 'Python',
    date: 'Yesterday, 4:15 PM',
    status: 'passed' as const,
    attempts: 2,
    feedbackSummary: 'Good use of stack data structure, but could improve variable naming.'
  },
  {
    id: '3',
    title: 'Merge Sort Implementation',
    tags: ['sorting', 'recursion', 'medium'],
    language: 'C++',
    date: '2 days ago',
    status: 'failed' as const,
    attempts: 3,
    feedbackSummary: 'Edge case not handled for empty arrays, causing runtime error.'
  },
  {
    id: '4',
    title: 'Linked List Cycle',
    tags: ['linked-list', 'two-pointers', 'medium'],
    language: 'Java',
    date: '3 days ago',
    status: 'passed' as const,
    attempts: 1,
    feedbackSummary: "Excellent solution using Floyd's cycle-finding algorithm."
  }
];

// Analytics mock data
const TUTOR_ANALYTICS = {
  totalSessions: 12,
  totalHours: 8.5,
  mostFrequentTopic: 'React',
  averageSessionDuration: '42 mins',
  recentTopics: ['react', 'typescript', 'algorithms', 'css', 'node']
};

const DSA_ANALYTICS = {
  totalProblems: 24,
  successRate: 75,
  mostUsedLanguage: 'JavaScript',
  averageAttempts: 1.8,
  recentTags: ['arrays', 'strings', 'dynamic-programming', 'trees', 'recursion']
};

const CodeHistory = () => {
  const [activeTab, setActiveTab] = useState("ai-tutor");
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [language, setLanguage] = useState('all');
  const [status, setStatus] = useState('all');

  // Filter tutor sessions based on search and filters
  const filteredTutorSessions = MOCK_TUTOR_SESSIONS.filter(session => {
    const matchesSearch = searchTerm === '' || 
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // For simplicity, not implementing actual date filtering
    return matchesSearch;
  });

  // Filter DSA submissions based on search and filters
  const filteredDSASubmissions = MOCK_DSA_SUBMISSIONS.filter(submission => {
    const matchesSearch = searchTerm === '' || 
      submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLanguage = language === 'all' || submission.language.toLowerCase() === language.toLowerCase();
    const matchesStatus = status === 'all' || 
      (status === 'passed' && submission.status === 'passed') ||
      (status === 'failed' && submission.status === 'failed');
    
    // For simplicity, not implementing actual date filtering
    return matchesSearch && matchesLanguage && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-algos-dark">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white font-heading">Your Learning History</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content area - submissions */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6 bg-card/20">
                <TabsTrigger value="ai-tutor" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>AI Tutor Sessions</span>
                </TabsTrigger>
                <TabsTrigger value="dsa-trainer" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <span>DSA Trainer Progress</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Filters section */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    placeholder={activeTab === "ai-tutor" ? "Search by session title or topic..." : "Search by problem name or tag..."}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 bg-card/50 border-border"
                  />
                </div>
                
                <div className="flex gap-3">
                  {activeTab === "dsa-trainer" && (
                    <>
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
                      
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-[140px] bg-card/50 border-border">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="passed">Passed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                  
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[140px] bg-card/50 border-border">
                      <Clock className="mr-2 h-4 w-4" />
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
                      {activeTab === "dsa-trainer" && (
                        <SelectItem value="difficulty">Difficulty</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            
              <TabsContent value="ai-tutor" className="mt-0">
                {/* AI Tutor Sessions grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {filteredTutorSessions.length > 0 ? (
                    filteredTutorSessions.map(session => (
                      <TutorSessionCard key={session.id} session={session} />
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <p className="text-lg">No AI tutor sessions found matching your filters.</p>
                      <p className="text-sm mt-2">Try adjusting your search or filter criteria.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="dsa-trainer" className="mt-0">
                {/* DSA Submissions grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {filteredDSASubmissions.length > 0 ? (
                    filteredDSASubmissions.map(submission => (
                      <DSASubmissionCard key={submission.id} submission={submission} />
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <p className="text-lg">No DSA submissions found matching your filters.</p>
                      <p className="text-sm mt-2">Try adjusting your search or filter criteria.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar - analytics */}
          <div className="order-first lg:order-last">
            {activeTab === "ai-tutor" ? (
              <HistoryAnalytics {...TUTOR_ANALYTICS} />
            ) : (
              <HistoryAnalytics {...DSA_ANALYTICS} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CodeHistory;
