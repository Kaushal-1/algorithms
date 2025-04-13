
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
          
          <div className="flex justify-center mb-8">
            <Card className="p-6 max-w-md w-full bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all cursor-pointer">
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
