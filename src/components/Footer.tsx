
import React from 'react';
import { Github, Linkedin, MessageSquare } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-algos-darker py-12 px-4 md:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white font-heading mb-4">
              ALGORITHMS<span className="text-primary">.</span>
            </h3>
            <p className="text-foreground/70 mb-4 max-w-md">
              Your code. Our AI. Let's build better, together.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground/70 hover:text-primary transition-colors"
              >
                <Github size={20} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground/70 hover:text-primary transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground/70 hover:text-primary transition-colors"
              >
                <MessageSquare size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-foreground/60 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ALGORITHMS. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
