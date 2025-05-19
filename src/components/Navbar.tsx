import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, FileCode, Github, Menu, Search, User } from "lucide-react";
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
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const { user, profile, signOut } = useAuth();
  
  return (
    <nav className="py-2 px-3 md:px-5 w-full fixed top-0 bg-algos-dark/95 backdrop-blur-sm z-50 border-b border-border">
      <div className="flex justify-between items-center h-12">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-9 w-9 text-foreground/70 hover:text-primary">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
          
          <Link to="/" className="flex items-center space-x-1">
            <span className="text-xl font-bold text-white font-heading hidden md:block">
              ALGORITHMS<span className="text-primary">.</span>
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..."
            className="pl-9 bg-muted/40 border-muted h-9 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-1 md:gap-3">
          {!isAuthPage && (
            <>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-foreground/70 hover:text-primary">
                <Bell className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-foreground/70 hover:text-primary">
                <Link to="/ai-code-review">
                  <FileCode className="h-5 w-5" />
                </Link>
              </Button>
              
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="rounded-full h-9 w-9 inline-flex items-center justify-center text-foreground/70 hover:text-primary"
              >
                <Github size={20} />
              </a>
              
              {user && (
                <div className="flex items-center gap-2">
                  <NotificationDropdown />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="rounded-full h-9 w-9 p-0">
                        <Avatar className="h-9 w-9 border border-primary/30 hover:border-primary transition-colors">
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
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
