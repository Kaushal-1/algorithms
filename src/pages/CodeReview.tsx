
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

const CodeReview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-algos-dark">
      <Navbar />
      
      <main className="flex-grow pt-20 px-4 pb-8 max-w-[1200px] mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">DSA Trainer</h1>
          <p className="text-muted-foreground">Improve your coding skills with our AI-powered DSA training platform</p>
        </div>
        
        <div className="grid place-items-center">
          <Card className="border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Practice with AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">Generate personalized DSA problems with our AI assistant and practice your coding skills.</p>
              <Button 
                className="w-full bg-algos-green hover:bg-algos-green/90 text-black font-medium"
                onClick={() => navigate('/dsa-chat-prompt')}
              >
                Start Practicing
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CodeReview;
