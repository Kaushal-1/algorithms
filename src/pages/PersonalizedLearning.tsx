
import React from 'react';
import Navbar from '@/components/Navbar';
import LearningFlowContainer from '@/components/learning-flow/LearningFlowContainer';

const PersonalizedLearning: React.FC = () => {
  return (
    <div className="min-h-screen bg-algos-dark">
      <Navbar />
      
      <div className="pt-20 px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary/20 to-transparent rounded-full blur-[120px] opacity-30 z-0"></div>
            
            <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-xl p-6 relative z-10">
              <LearningFlowContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedLearning;
