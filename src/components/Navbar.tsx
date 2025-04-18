
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Home, LogOut, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const { user, profile, signOut } = useAuth();
  
  return (
    <nav className="py-4 px-4 md:px-8 w-full fixed top-0 bg-algos-dark/90 backdrop-blur-sm z-50 border-b border-border">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white font-heading">
            ALGORITHMS<span className="text-primary">.</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`text-sm transition-colors flex items-center gap-2 ${location.pathname === '/' ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`}>
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link to="/personalized-learning" className={`text-sm transition-colors flex items-center gap-2 ${location.pathname === '/personalized-learning' ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`}>
            <Avatar className="h-5 w-5">
              <AvatarImage src="/ai-guru-avatar.png" alt="AI Guru" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            AI Guru
          </Link>
          <Link to="/dsa-chat-prompt" className={`text-sm transition-colors ${location.pathname === '/dsa-chat-prompt' ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`}>
            DSA Trainer
          </Link>
          <Link to="/code-history" className={`text-sm transition-colors ${location.pathname === '/code-history' ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`}>
            History
          </Link>
          <Link to="/community" className={`text-sm transition-colors ${location.pathname === '/community' ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`}>
            Community
          </Link>
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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 border border-primary/30 hover:border-primary transition-colors">
                    <AvatarImage src={profile?.avatar_url || "https://source.unsplash.com/random/400x400/?portrait"} />
                    <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || <User size={16} />}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.username || user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/user-profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !isAuthPage && (
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
