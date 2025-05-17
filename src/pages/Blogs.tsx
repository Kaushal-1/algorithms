
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBlogs, createBlog } from '@/services/blogService';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogCard from '@/components/BlogCard';
import CreateBlogForm from '@/components/CreateBlogForm';
import { useAuth } from '@/contexts/AuthContext';
import { NewBlog } from '@/types/Blog';
import { Link } from 'react-router-dom';

const Blogs: React.FC = () => {
  const [isCreateBlogOpen, setIsCreateBlogOpen] = useState(false);
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

  // Sample blogs for demonstration (when there are no blogs or while loading)
  const demoBlogs = [
    {
      id: "demo1",
      title: "Getting Started with React and TypeScript",
      content: "TypeScript adds static type definitions to JavaScript, providing better tooling and developer experience. In this blog, we'll explore how to set up a React project with TypeScript and the benefits it brings to your development workflow.",
      user_id: "demo-user",
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
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
      author: {
        username: "Backend Dev",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
      }
    }
  ];

  const displayedBlogs = blogs && blogs.length > 0 ? blogs : demoBlogs;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">Developer Blogs</h1>
          <p className="text-muted-foreground mt-1">
            Explore insights and tutorials from the community
          </p>
        </div>
        {user && (
          <Button 
            onClick={() => setIsCreateBlogOpen(true)} 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Blog</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">Loading blogs...</p>
          </div>
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

      <div className="mt-6 text-center">
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
