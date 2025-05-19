
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { 
  FileCode, 
  Home, 
  MessageSquare, 
  Clock, 
  Users, 
  BookOpen,
  ChevronRight,
  FileText,
  User
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent,
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

// Define the type for our navigation items
type NavItem = {
  title: string;
  icon: React.ElementType;
  path: string;
};

const AppSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const mainNavItems: NavItem[] = [
    {
      title: "Home",
      icon: Home,
      path: "/",
    },
    {
      title: "Blogs",
      icon: FileText,
      path: "/blogs",
    },
    {
      title: "AI Guru",
      icon: Avatar,
      path: "/personalized-learning",
    },
    {
      title: "DSA Trainer",
      icon: BookOpen,
      path: "/dsa-chat-prompt",
    },
    {
      title: "AI Review",
      icon: FileCode,
      path: "/ai-code-review",
    },
    {
      title: "History",
      icon: Clock,
      path: "/code-history",
    },
    {
      title: "Community",
      icon: Users,
      path: "/community",
    },
    {
      title: "Profile",
      icon: User,
      path: "/profile",
    },
  ];
  
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link to={item.path}>
                        {item.title === "AI Guru" ? (
                          <Avatar className="h-5 w-5">
                            <AvatarImage src="/ai-guru-avatar.png" alt="AI Guru" />
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Discover</SidebarGroupLabel>
          <SidebarGroupContent>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Start learning</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-2">
          {user ? (
            <Link to="/profile" className="rounded-md bg-muted/30 p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatar_url || undefined} alt={user.email || "User"} />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground">View profile</p>
              </div>
            </Link>
          ) : (
            <div className="rounded-md bg-muted/30 p-3">
              <h4 className="font-medium text-sm mb-1">Upgrade to Pro</h4>
              <p className="text-xs text-muted-foreground mb-2">Get unlimited access to all features</p>
              <Button size="sm" className="w-full">Upgrade now</Button>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
