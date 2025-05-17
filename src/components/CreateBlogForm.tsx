
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
import { NewBlog } from '@/types/Blog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
        description: "Your blog has been published",
      });
      setTitle('');
      setContent('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating blog:', error);
      toast({
        variant: "destructive",
        title: "Failed to create blog",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Blog</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your blog"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="content" className="text-sm font-medium">Content</label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog content here"
                className="min-h-[200px]"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish Blog"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBlogForm;
