
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import CodePreviewSection from '@/components/CodePreviewSection';
import TestimonialSection from '@/components/TestimonialSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-algos-dark text-foreground overflow-x-hidden">
      <Navbar />
      <main>
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
