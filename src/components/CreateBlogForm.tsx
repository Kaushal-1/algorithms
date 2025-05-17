
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose 
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NewBlog } from '@/types/Blog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Paperclip, AtSign, Image } from 'lucide-react';

interface CreateBlogFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (blog: NewBlog) => Promise<void>;
}

const CreateBlogForm: React.FC<CreateBlogFormProps> = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit 
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to create a blog",
      });
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Title and content are required",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({ title, content });
      toast({
        title: "Success!",
        description: "Your post has been published",
      });
      setTitle('');
      setContent('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating blog:', error);
      toast({
        variant: "destructive",
        title: "Failed to create post",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[675px] bg-algos-darker border-border/40">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg text-foreground">New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="p-2 border border-border/30 rounded-md w-36">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs flex items-center gap-2 text-muted-foreground h-8"
              >
                <Image size={16} />
                <span>Thumbnail</span>
              </Button>
            </div>
            
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post Title"
              disabled={isSubmitting}
              className="bg-algos-darker border-border/30 text-foreground"
              maxLength={250}
            />
            <div className="mt-2">
              <div className="border-b border-border/30">
                <Tabs defaultValue="write">
                  <TabsList className="bg-transparent border-none h-9">
                    <TabsTrigger 
                      value="write"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    >
                      Write
                    </TabsTrigger>
                    <TabsTrigger 
                      value="preview"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    >
                      Preview
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="mt-2">
                <TabsContent value="write" className="mt-0 p-0">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your thoughts"
                    className="min-h-[200px] resize-none bg-algos-darker border-none shadow-none focus-visible:ring-0 text-foreground"
                    disabled={isSubmitting}
                  />
                </TabsContent>
                <TabsContent value="preview" className="mt-0 p-0">
                  <div className="min-h-[200px] text-foreground whitespace-pre-wrap">
                    {content || <span className="text-muted-foreground">Nothing to preview yet...</span>}
                  </div>
                </TabsContent>
              </div>
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/30">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Paperclip size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <AtSign size={16} />
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground">
                  {content.length} / 10000
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="notification-toggle" 
                className="rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="notification-toggle" className="text-xs text-muted-foreground">
                Receive updates when others engage with your post
              </label>
            </div>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "Publishing..." : "Post"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBlogForm;
