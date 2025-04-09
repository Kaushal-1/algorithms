
import React from 'react';
import { Code, MessageSquare, GraduationCap, Briefcase, Megaphone, Lightbulb, Cpu, FileText, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type Channel = {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  unreadCount?: number;
};

interface ChannelListProps {
  selectedChannel: string;
  onSelectChannel: (channelId: string) => void;
}

const ChannelList: React.FC<ChannelListProps> = ({ selectedChannel, onSelectChannel }) => {
  const channelCategories = [
    {
      category: "Main Discussions",
      channels: [
        { id: "dsa", name: "DSA Discussions", icon: <Code size={18} />, category: "Main Discussions" },
        { id: "interview", name: "Interview Prep", icon: <Briefcase size={18} />, category: "Main Discussions", unreadCount: 3 },
        { id: "career", name: "Career & Mentorship", icon: <GraduationCap size={18} />, category: "Main Discussions" },
      ]
    },
    {
      category: "Resources",
      channels: [
        { id: "announcements", name: "Announcements", icon: <Megaphone size={18} />, category: "Resources" },
        { id: "projects", name: "Project Ideas", icon: <Lightbulb size={18} />, category: "Resources" },
        { id: "ai-ml", name: "AI/ML Talks", icon: <Cpu size={18} />, category: "Resources", unreadCount: 7 },
        { id: "resources", name: "Resources & Docs", icon: <FileText size={18} />, category: "Resources" },
      ]
    }
  ];

  return (
    <div className="h-full w-full flex flex-col space-y-1 overflow-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent p-2">
      <div className="flex items-center justify-between px-2 py-4">
        <h2 className="text-lg font-semibold text-primary-foreground/90">Channels</h2>
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-primary/20 hover:bg-primary/30">
          <Plus size={14} />
        </Button>
      </div>
      
      {channelCategories.map((categoryGroup) => (
        <div key={categoryGroup.category} className="mb-4">
          <h3 className="text-xs uppercase font-semibold text-foreground/50 px-2 py-2">
            {categoryGroup.category}
          </h3>
          <div className="space-y-1">
            {categoryGroup.channels.map((channel) => (
              <Button
                key={channel.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sm font-medium px-2 hover:bg-primary/10",
                  selectedChannel === channel.id 
                    ? "bg-primary/20 text-primary-foreground" 
                    : "text-foreground/70"
                )}
                onClick={() => onSelectChannel(channel.id)}
              >
                <span className="mr-2">{channel.icon}</span>
                <span>{channel.name}</span>
                {channel.unreadCount && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {channel.unreadCount}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChannelList;
