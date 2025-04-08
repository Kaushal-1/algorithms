
import React from 'react';
import { 
  Search, 
  History, 
  Users, 
  GraduationCap, 
  BarChart2, 
  UserPlus 
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <Search size={24} className="text-primary" />,
    title: "AI Code Review",
    description: "Instantly analyze your code and get actionable feedback on style, performance, and potential bugs.",
    delay: "0s"
  },
  {
    icon: <History size={24} className="text-primary" />,
    title: "Coding History",
    description: "Track your progress, past attempts, and improvements over time to see your growth.",
    delay: "0.1s"
  },
  {
    icon: <Users size={24} className="text-primary" />,
    title: "Community Support",
    description: "Connect, collaborate, and grow with other developers in a supportive environment.",
    delay: "0.2s"
  },
  {
    icon: <GraduationCap size={24} className="text-primary" />,
    title: "Learning Hub",
    description: "Explore curated coding courses when you need structured learning for any concept.",
    delay: "0.3s"
  },
  {
    icon: <BarChart2 size={24} className="text-primary" />,
    title: "Performance Analytics",
    description: "Understand your strengths and what needs work with detailed performance insights.",
    delay: "0.4s"
  },
  {
    icon: <UserPlus size={24} className="text-primary" />,
    title: "Mentorship Channels",
    description: "Get guidance from real developers and experts to accelerate your growth.",
    delay: "0.5s"
  }
];

const FeatureSection = () => {
  return (
    <section className="py-20 px-4 md:px-8 relative" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Everything You Need to <span className="text-primary">Level Up</span> Your Coding
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            ALGORITHMS isn't just a tool—it's your complete coding companion with features designed to make you a better developer.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card animate-fade-in"
              style={{ animationDelay: feature.delay }}
            >
              <div className="bg-algos-darker w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-1/3 -right-40 w-80 h-80 bg-accent/10 rounded-full filter blur-3xl"></div>
    </section>
  );
};

export default FeatureSection;
