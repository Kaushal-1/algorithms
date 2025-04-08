
import React from 'react';
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  return (
    <nav className="py-4 px-4 md:px-8 w-full fixed top-0 bg-algos-dark/90 backdrop-blur-sm z-50 border-b border-border">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-white font-heading">
            ALGORITHMS<span className="text-primary">.</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#courses" className="text-sm text-foreground/80 hover:text-primary transition-colors">
            Courses
          </a>
          <Link to="/code-review" className={`text-sm transition-colors ${location.pathname === '/code-review' ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`}>
            Code Review
          </Link>
          <a href="#community" className="text-sm text-foreground/80 hover:text-primary transition-colors">
            Community
          </a>
        </div>
        
        <div className="flex items-center space-x-4">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-foreground/70 hover:text-primary transition-colors"
          >
            <Github size={20} />
          </a>
          {!isAuthPage && (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-foreground/80 hover:text-primary hover:bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
