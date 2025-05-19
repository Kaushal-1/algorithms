
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBlogs, createBlog } from '@/services/blogService';
import { Plus, Search, Rss } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardFooter, CardContent } from '@/components/ui/card';
import BlogCard from '@/components/BlogCard';
import CreateBlogForm from '@/components/CreateBlogForm';
import { useAuth } from '@/contexts/AuthContext';
import { NewBlog } from '@/types/Blog';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const Blogs: React.FC = () => {
  const [isCreateBlogOpen, setIsCreateBlogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch blogs
  const { 
    data: blogs, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
  });

  // Create new blog mutation
  const createBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      // Invalidate and refetch blogs after creating a new one
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  const handleCreateBlog = async (blog: NewBlog) => {
    await createBlogMutation.mutateAsync(blog);
  };

  // Filter blogs based on search term
  const filteredBlogs = blogs?.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sample blogs for demonstration (when there are no blogs or while loading)
  const demoBlogs = [
    {
      id: "demo1",
      title: "Getting Started with React and TypeScript",
      content: "TypeScript adds static type definitions to JavaScript, providing better tooling and developer experience. In this blog, we'll explore how to set up a React project with TypeScript and the benefits it brings to your development workflow.",
      user_id: "demo-user",
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
      cover_image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      author: {
        username: "React Master",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
      }
    },
    {
      id: "demo2",
      title: "Building Responsive UIs with Tailwind CSS",
      content: "Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML. Learn how to create beautiful, responsive interfaces quickly without writing custom CSS.",
      user_id: "demo-user",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      cover_image: "https://images.unsplash.com/photo-1618788372246-79faff0c3742?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      author: {
        username: "CSS Wizard",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
      }
    },
    {
      id: "demo3",
      title: "Backend Integration with Node.js and Express",
      content: "Learn how to connect your React frontend to a Node.js backend using Express. This tutorial covers RESTful API design, middleware, and error handling strategies for a robust full-stack application.",
      user_id: "demo-user",
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date(Date.now() - 172800000).toISOString(),
      cover_image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      author: {
        username: "Backend Dev",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
      }
    }
  ];

  const displayedBlogs = filteredBlogs && filteredBlogs.length > 0 ? filteredBlogs : demoBlogs;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">Developer Blogs</h1>
          <p className="text-muted-foreground mt-1">
            Explore insights and tutorials from the community
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <Button 
              onClick={() => setIsCreateBlogOpen(true)} 
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Blog</span>
            </Button>
          )}
          <Button variant="outline" size="icon" title="RSS Feed">
            <Rss className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search blogs..."
            className="pl-10 max-w-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video w-full bg-muted"></div>
                <CardHeader className="p-4 pb-2">
                  <div className="h-6 bg-muted rounded-md w-3/4"></div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="h-4 bg-muted rounded-md w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded-md w-5/6"></div>
                </CardContent>
                <CardFooter className="p-4 pt-2 border-t border-border/20 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-muted"></div>
                    <div className="h-3 bg-muted rounded-md w-20"></div>
                  </div>
                  <div className="h-3 bg-muted rounded-md w-24"></div>
                </CardFooter>
              </Card>
            ))}
          </>
        ) : error ? (
          <div className="col-span-full text-center py-8">
            <p className="text-destructive">Error loading blogs. Please try again.</p>
            {!user && (
              <p className="mt-4">
                <Link to="/login" className="text-primary hover:underline">
                  Login
                </Link>{" "}
                or{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign Up
                </Link>{" "}
                to create and share your own blogs!
              </p>
            )}
          </div>
        ) : (
          displayedBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))
        )}
      </div>

      {filteredBlogs && filteredBlogs.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-lg">No blogs matching "{searchTerm}"</p>
          <p className="text-muted-foreground mt-2">Try a different search term or create a new blog.</p>
        </div>
      )}

      <div className="mt-12 text-center">
        <Link 
          to="/dsa-chat-prompt" 
          className="text-primary hover:underline inline-flex items-center gap-2"
        >
          Looking to improve your coding skills? Try our DSA Trainer
        </Link>
      </div>

      <CreateBlogForm
        isOpen={isCreateBlogOpen}
        onOpenChange={setIsCreateBlogOpen}
        onSubmit={handleCreateBlog}
      />
    </div>
  );
};

export default Blogs;
