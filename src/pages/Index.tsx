import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import CodePreviewSection from '@/components/CodePreviewSection';
import TestimonialSection from '@/components/TestimonialSection';
import Footer from '@/components/Footer';

const Index = () => {
  // For authenticated users, we could show a feed-like interface with cards
  // But we'll keep the landing page for now with daily.dev-inspired spacing and layout
  return (
    <div className="min-h-screen bg-algos-dark text-foreground overflow-x-hidden">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        <HeroSection />
        <FeatureSection />
        <CodePreviewSection />
        <TestimonialSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
