import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  Code2,
  BookOpen,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const AppSidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { pathname } = useLocation();
  const { signOut } = useAuth();

  const iconSize = collapsed ? 22 : 20;
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div
      className={cn(
        "group/sidebar h-screen bg-card border-r border-border/40 relative flex flex-col",
        collapsed ? "w-16" : "w-56"
      )}
    >
      <div className="h-16 flex items-center justify-center border-b border-border/40">
        <Link to="/" className="flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            A
          </div>
          {!collapsed && (
            <span className="ml-2 font-heading font-semibold text-lg">AlgoAcademy</span>
          )}
        </Link>
      </div>

      <ScrollArea className="flex-1 py-4">
        <div className="px-2 space-y-1">
          <SidebarItem
            to="/dashboard"
            icon={<Home size={iconSize} />}
            label="Dashboard"
            active={isActive('/dashboard')}
            collapsed={collapsed}
          />
          <SidebarItem
            to="/problems"
            icon={<Code2 size={iconSize} />}
            label="Problems"
            active={isActive('/problems')}
            collapsed={collapsed}
          />
          <SidebarItem
            to="/learn"
            icon={<BookOpen size={iconSize} />}
            label="Learn"
            active={isActive('/learn')}
            collapsed={collapsed}
          />
          <SidebarItem
            to="/community"
            icon={<Users size={iconSize} />}
            label="Community"
            active={isActive('/community')}
            collapsed={collapsed}
          />
          <SidebarItem
            to="/blogs"
            icon={<FileText size={iconSize} />}
            label="Blogs"
            active={isActive('/blogs')}
            collapsed={collapsed}
          />
          <SidebarItem
            to="/discussions"
            icon={<MessageSquare size={iconSize} />}
            label="Discussions"
            active={isActive('/discussions')}
            collapsed={collapsed}
          />
        </div>
      </ScrollArea>

      <div className="p-2 border-t border-border/40 space-y-1">
        <SidebarItem
          to="/settings"
          icon={<Settings size={iconSize} />}
          label="Settings"
          active={isActive('/settings')}
          collapsed={collapsed}
        />
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent/50",
            collapsed ? "px-2" : "px-3"
          )}
          onClick={signOut}
        >
          <LogOut size={iconSize} />
          {!collapsed && <span className="ml-2">Sign out</span>}
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border/40 bg-background hidden group-hover/sidebar:flex"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </Button>
    </div>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  label,
  active,
  collapsed,
}) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start",
          collapsed ? "px-2" : "px-3",
          active
            ? "bg-accent/50 text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
        )}
      >
        {icon}
        {!collapsed && <span className="ml-2">{label}</span>}
      </Button>
    </Link>
  );
};

export default AppSidebar;
