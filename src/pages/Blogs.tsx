
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBlogs, searchBlogs } from '@/services/blogService';
import { Button } from '@/components/ui/button';
import { PenSquare, Plus } from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import BlogSearch from '@/components/BlogSearch';
import TrendingBlogs from '@/components/TrendingBlogs';

const Blogs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Get search query from URL if present
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);
  
  // Fetch all blogs or search results
  const { 
    data: blogs, 
    isLoading: blogsLoading,
    error: blogsError 
  } = useQuery({
    queryKey: ['blogs', searchQuery],
    queryFn: () => searchQuery ? searchBlogs(searchQuery) : getBlogs(),
  });

  const handleCreateBlog = () => {
    navigate('/blogs/create');
  };

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blogs</h1>
          <p className="text-muted-foreground mb-6">
            Discover articles about coding, technology, and more
          </p>
        </div>
        
        {user && (
          <Button onClick={handleCreateBlog} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Blog
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2">
          <BlogSearch />
          
          {searchQuery && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Search results for: "{searchQuery}"
              </h2>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSearchQuery('');
                  navigate('/blogs');
                }}
              >
                Clear search
              </Button>
            </div>
          )}
          
          {blogsLoading ? (
            <div className="grid gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-border rounded-lg p-4">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : blogsError || !blogs || blogs.length === 0 ? (
            <div className="text-center py-12 border border-border rounded-lg">
              <PenSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No blogs found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? `No results found for "${searchQuery}"`
                  : "There are no blogs to display yet."}
              </p>
              {user && !searchQuery && (
                <Button onClick={handleCreateBlog}>
                  Create the first blog
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </div>
        
        <div className="col-span-1 space-y-6">
          <div className="sticky top-6">
            <BlogSearch variant="modal" />
            <div className="mt-6">
              <TrendingBlogs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
