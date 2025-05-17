
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import CodePreviewSection from '@/components/CodePreviewSection';
import TestimonialSection from '@/components/TestimonialSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-algos-dark text-foreground overflow-x-hidden">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="my-8 text-center">
          <Link to="/blogs">
            <Button variant="outline" className="mx-auto flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Check out our Developer Blogs</span>
            </Button>
          </Link>
        </div>
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
