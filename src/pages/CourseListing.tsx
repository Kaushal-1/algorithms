
import React from 'react';
import Navbar from '@/components/Navbar';
import RoadmapGenerator from '@/components/RoadmapGenerator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

const CourseListing: React.FC = () => {
  return (
    <div className="min-h-screen bg-algos-dark">
      <Navbar />
      
      <div className="pt-20 px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Learning Paths</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all cursor-pointer">
              <div className="flex flex-col h-full">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
                <p className="text-muted-foreground mb-4 flex-grow">
                  Get a custom learning roadmap tailored to your experience level and specific learning goals.
                </p>
                <Link to="/personalized-learning" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    Start Your Journey <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
            
            <Card className="p-6 bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all cursor-pointer">
              <div className="flex flex-col h-full">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20.9 18.55c.06-.43.1-.86.1-1.3 0-3.2-2.65-5.7-5.9-5.7-1.3 0-2.5.44-3.6 1.2"></path><path d="M12 6a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"></path><path d="M3 18.59A6.74 6.74 0 0 1 12.63 13"></path><path d="M19.34 14.12a3.43 3.43 0 0 0-1.95-.45c-1.8 0-3.4 1.03-3.95 2.58"></path><path d="M17.5 22a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path><path d="m19.12 15.88-3.24 3.24-1.06-1.06"></path></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">General Courses</h3>
                <p className="text-muted-foreground mb-4 flex-grow">
                  Browse our collection of general learning paths and roadmaps for various technologies.
                </p>
                <Button variant="outline" className="w-full">
                  Explore Courses <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </Card>
            
            <Card className="p-6 bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all cursor-pointer">
              <div className="flex flex-col h-full">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path><path d="M10 10.3c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2"></path><path d="M12 17h.01"></path></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Custom Assistance</h3>
                <p className="text-muted-foreground mb-4 flex-grow">
                  Get personalized help with specific coding problems or concepts through our AI tutor.
                </p>
                <Link to="/dsa-chat-prompt" className="w-full">
                  <Button variant="outline" className="w-full">
                    Talk to AI Tutor <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary/20 to-transparent rounded-full blur-[120px] opacity-30 z-0"></div>
            
            <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-xl p-6 relative z-10">
              <RoadmapGenerator />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseListing;
