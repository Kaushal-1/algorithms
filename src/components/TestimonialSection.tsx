
import React from 'react';
import { Button } from "@/components/ui/button";
import { Star, Users, Code } from "lucide-react";

const testimonials = [
  {
    quote: "It's like having a senior dev reviewing my code 24/7.",
    author: "Alex J.",
    role: "Frontend Developer"
  },
  {
    quote: "ALGORITHMS helped me pass coding interviews that I was struggling with for months.",
    author: "Priya S.",
    role: "Computer Science Student"
  },
  {
    quote: "The real-time feedback changed how I approach problem-solving completely.",
    author: "Marco L.",
    role: "Full Stack Developer"
  }
];

const stats = [
  {
    icon: <Users size={24} className="text-primary" />,
    value: "5,000+",
    label: "Active Learners"
  },
  {
    icon: <Code size={24} className="text-primary" />,
    value: "50,000+",
    label: "Code Reviews Delivered"
  },
  {
    icon: <Star size={24} className="text-primary" />,
    value: "4.8/5",
    label: "Average Rating"
  }
];

const TestimonialSection = () => {
  return (
    <section className="py-20 px-4 md:px-8 relative" id="community">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Join Our Growing <span className="text-secondary">Community</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            See what developers are saying about how ALGORITHMS is changing the way they code and learn.
          </p>
        </div>
        
        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-algos-darker border border-border p-6 rounded-lg shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <blockquote className="text-lg mb-4 text-foreground/90 italic">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <p className="font-medium">{testimonial.author}</p>
                <p className="text-sm text-foreground/60">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-muted rounded-lg animate-fade-in"
              style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
            >
              <div className="bg-algos-darker w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold mb-1 text-foreground">{stat.value}</div>
              <div className="text-foreground/70">{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* CTA */}
        <div className="text-center">
          <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-6 text-lg">
            Join Our Community
          </Button>
        </div>
      </div>
      
      {/* Background gradient */}
      <div className="absolute bottom-0 -left-40 w-80 h-80 bg-secondary/10 rounded-full filter blur-3xl"></div>
    </section>
  );
};

export default TestimonialSection;
