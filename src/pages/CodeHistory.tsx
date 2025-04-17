
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, ChevronRight, Code, FileCode, Graduation, Route } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Roadmap } from '@/components/RoadmapDisplay';

interface SavedRoadmap {
  id: string;
  title: string;
  experience: string;
  createdAt: string;
  steps: any[];
}

interface DSASession {
  id: string;
  problemTitle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  completed: boolean;
}

const CodeHistory: React.FC = () => {
  const navigate = useNavigate();
  const [savedRoadmaps, setSavedRoadmaps] = useState<SavedRoadmap[]>([]);
  const [dsaSessions, setDsaSessions] = useState<DSASession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved roadmaps and DSA sessions
    try {
      const roadmapsFromStorage = localStorage.getItem('savedRoadmaps');
      if (roadmapsFromStorage) {
        setSavedRoadmaps(JSON.parse(roadmapsFromStorage));
      }
      
      // Mock DSA sessions (in a real app, these would come from a database)
      setDsaSessions([
        {
          id: 'dsa-1',
          problemTitle: 'Two Sum',
          difficulty: 'easy',
          createdAt: new Date().toISOString(),
          completed: true
        },
        {
          id: 'dsa-2',
          problemTitle: 'Longest Substring Without Repeating Characters',
          difficulty: 'medium',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          completed: true
        }
      ]);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Failed to load history');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openRoadmap = (roadmapId: string) => {
    // Find the roadmap in the saved roadmaps
    const roadmap = savedRoadmaps.find(r => r.id === roadmapId);
    if (roadmap) {
      // Save it as the current roadmap
      localStorage.setItem('currentRoadmap', JSON.stringify(roadmap));
      // Navigate to the learning session
      navigate('/learning-session/1');
    } else {
      toast.error('Roadmap not found');
    }
  };

  const openDSASession = (sessionId: string) => {
    // In a real app, this would load the specific DSA session
    toast.info('This feature is coming soon!');
  };

  return (
    <div className="min-h-screen bg-algos-dark">
      <Navbar />
      
      <main className="pt-20 px-4 pb-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Learning History</h1>
          <p className="text-muted-foreground">Review your past learning sessions and progress</p>
        </div>
        
        <Tabs defaultValue="ai-guru" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="ai-guru" className="flex items-center gap-2">
              <Graduation className="h-4 w-4" />
              AI Guru History
            </TabsTrigger>
            <TabsTrigger value="dsa-guru" className="flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              DSA Guru History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai-guru">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <p>Loading your roadmaps...</p>
              </div>
            ) : savedRoadmaps.length > 0 ? (
              <ScrollArea className="h-[calc(100vh-240px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedRoadmaps.map((roadmap) => (
                    <Card key={roadmap.id} className="hover:border-primary/50 transition-all cursor-pointer" onClick={() => openRoadmap(roadmap.id)}>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-start">
                          <span className="line-clamp-2">{roadmap.title}</span>
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(roadmap.createdAt), 'PPP')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium bg-primary/20 text-primary px-2 py-1 rounded-full">
                            {roadmap.experience} level
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {roadmap.steps.length} steps
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <Card className="w-full p-6 text-center">
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12">
                    <Route className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Roadmaps Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't created any learning roadmaps with AI Guru yet.
                    </p>
                    <Button onClick={() => navigate('/personalized-learning')}>
                      Create Your First Roadmap
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="dsa-guru">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <p>Loading your DSA sessions...</p>
              </div>
            ) : dsaSessions.length > 0 ? (
              <ScrollArea className="h-[calc(100vh-240px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dsaSessions.map((session) => (
                    <Card key={session.id} className="hover:border-primary/50 transition-all cursor-pointer" onClick={() => openDSASession(session.id)}>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-start">
                          <span className="line-clamp-2">{session.problemTitle}</span>
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(session.createdAt), 'PPP')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                            session.difficulty === 'easy' ? 'bg-green-500/20 text-green-500' :
                            session.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-red-500/20 text-red-500'
                          }`}>
                            {session.difficulty}
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Code className="h-3 w-3" />
                            {session.completed ? 'Completed' : 'In progress'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <Card className="w-full p-6 text-center">
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12">
                    <FileCode className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No DSA Sessions Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't practiced any DSA problems with DSA Guru yet.
                    </p>
                    <Button onClick={() => navigate('/dsa-chat-prompt')}>
                      Try Your First DSA Problem
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CodeHistory;
