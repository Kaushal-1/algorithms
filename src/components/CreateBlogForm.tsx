
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
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Image, Link, Check, FileText, Heading2 } from 'lucide-react';

interface CreateBlogFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (blog: NewBlog) => Promise<void>;
}

// Blog post validation schema
const blogFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  coverImage: z.string().optional()
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

const CreateBlogForm: React.FC<CreateBlogFormProps> = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  
  // Form with validation
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: '',
      content: '',
      coverImage: ''
    }
  });

  const handleSubmitForm = async (values: BlogFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to create a blog",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({ 
        title: values.title, 
        content: values.content 
      });
      toast({
        title: "Success!",
        description: "Your blog has been published",
      });
      form.reset();
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

  // Format markdown to HTML for preview
  const renderPreview = (content: string) => {
    // This is a simple implementation - a real markdown parser would be used in production
    return content
      .split('\n')
      .map((line, i) => <p key={i} className="mb-4">{line}</p>);
  };

  // Simple toolbar button component
  const ToolbarButton = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
    <Button 
      variant="outline" 
      size="sm" 
      className="h-8 px-2 mr-1" 
      onClick={onClick} 
      type="button"
      title={label}
    >
      {icon}
    </Button>
  );

  // Insert markdown at cursor position
  const insertMarkdown = (markdown: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = form.getValues('content');
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const newText = before + markdown + after;
    
    form.setValue('content', newText, { shouldValidate: true });
    
    // Set the cursor position after the inserted markdown
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + markdown.length, start + markdown.length);
    }, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading">Create New Blog</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitForm)}>
            <div className="grid gap-4 py-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a compelling title for your blog"
                        {...field}
                        className="text-lg"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between border-b mb-2 pb-1">
                <div className="flex items-center space-x-1">
                  <ToolbarButton 
                    icon={<Heading2 className="h-4 w-4" />} 
                    label="Add Heading" 
                    onClick={() => insertMarkdown('\n## Heading\n')} 
                  />
                  <ToolbarButton 
                    icon={<FileText className="h-4 w-4" />} 
                    label="Add Code Block" 
                    onClick={() => insertMarkdown('\n```\ncode block\n```\n')} 
                  />
                  <ToolbarButton 
                    icon={<Image className="h-4 w-4" />} 
                    label="Add Image Markdown" 
                    onClick={() => insertMarkdown('![alt text](image-url)')} 
                  />
                  <ToolbarButton 
                    icon={<Link className="h-4 w-4" />} 
                    label="Add Link" 
                    onClick={() => insertMarkdown('[link text](url)')} 
                  />
                </div>
                <div className="flex items-center">
                  <Button
                    type="button" 
                    variant={activeTab === 'write' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveTab('write')}
                    className="mr-1"
                  >
                    Write
                  </Button>
                  <Button
                    type="button" 
                    variant={activeTab === 'preview' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveTab('preview')}
                  >
                    Preview
                  </Button>
                </div>
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Content</FormLabel>
                    <FormControl>
                      {activeTab === 'write' ? (
                        <Textarea
                          id="content"
                          placeholder="Write your blog content here. Supports Markdown formatting!"
                          className="min-h-[300px] font-mono text-sm"
                          disabled={isSubmitting}
                          {...field}
                        />
                      ) : (
                        <div className="min-h-[300px] p-3 border rounded-md overflow-y-auto bg-card">
                          <div className="markdown-content prose prose-invert max-w-none">
                            {renderPreview(form.getValues('content'))}
                          </div>
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Cover Image URL (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a URL for your cover image"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-4 gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center">
                    <span className="animate-spin mr-2">⟳</span> Publishing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4" /> Publish Blog
                  </div>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBlogForm;
