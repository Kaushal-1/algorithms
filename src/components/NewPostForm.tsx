
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Code, Image, Link2, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NewPostFormProps {
  onSubmit: (content: string) => void;
  channelId: string;
}

const NewPostForm: React.FC<NewPostFormProps> = ({ onSubmit, channelId }) => {
  const [content, setContent] = useState('');
  const { user, profile } = useAuth();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-border/50 bg-card/40 backdrop-blur-sm">
      <div className="flex space-x-3">
        <Avatar className="h-9 w-9 border border-primary/20">
          <AvatarImage src={profile?.avatar_url || undefined} />
          <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || <User size={18} />}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder={`Share your thoughts in ${channelId}...`}
            className="min-h-[100px] bg-background/50 border-border/50 focus:border-primary/50 placeholder:text-muted-foreground/60"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-primary/80"
                onClick={() => {
                  setContent(content + "\n```\n// Your code here\n```");
                }}
              >
                <Code size={16} />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-primary/80"
              >
                <Image size={16} />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-primary/80"
              >
                <Link2 size={16} />
              </Button>
            </div>
            
            <Button 
              type="submit" 
              disabled={!content.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default NewPostForm;
