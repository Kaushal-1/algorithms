
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getBlogs, incrementBlogViews } from '@/services/blogService';
import { BlogWithAuthor } from '@/types/Blog';
import { useToast } from '@/hooks/use-toast';
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import CommentSection from '@/components/CommentSection';
import { 
  CalendarIcon, 
  Clock, 
  Share2, 
  Heart, 
  Eye, 
  ArrowLeft, 
  User 
} from 'lucide-react';
import { useMemo } from 'react';
import FollowButton from '@/components/FollowButton';

const BlogDetail: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [views, setViews] = useState(0);

  // Fetch the blog data
  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
  });

  const blog = useMemo(() => {
    return blogs?.find(b => b.id === blogId);
  }, [blogs, blogId]);

  // Increment view count when the page loads
  useEffect(() => {
    if (blog && blogId) {
      // Increment view in the database
      incrementBlogViews(blogId);
      
      // Set local view count (either from the database or a fallback)
      setViews(blog.view_count || Math.floor(Math.random() * 100) + 20);
      
      // Set initial random likes if not already in the blog data
      if (!hasLiked) {
        const randomLikes = Math.floor(Math.random() * 50);
        setLikes(randomLikes);
      }
    }
  }, [blog, blogId]);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setHasLiked(!hasLiked);
    
    // In a real app, we would send this to the database
    toast({
      title: hasLiked ? 'Like removed' : 'Blog liked',
      description: hasLiked 
        ? 'You have removed your like from this blog' 
        : 'You have liked this blog',
    });
  };

  const handleShare = () => {
    // Copy the current URL to clipboard
    navigator.clipboard.writeText(window.location.href);
    
    toast({
      title: 'Link copied',
      description: 'Blog link has been copied to clipboard',
    });
  };

  // Calculate estimated read time (using a simple method)
  const readTime = useMemo(() => {
    if (!blog) return '0 min';
    const words = blog.content.split(' ').length;
    const minutes = Math.ceil(words / 200); // Average reading speed: 200 words per minute
    return `${minutes} min read`;
  }, [blog]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-muted rounded w-3/4"></div>
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="aspect-video bg-muted rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-4/5"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
        <p className="text-muted-foreground mb-6">
          The blog you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/blogs')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/blogs')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
        </Button>
        
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
          {blog.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Link to={`/profile/${blog.user_id}`} className="flex items-center gap-2 group">
            <Avatar className="h-10 w-10">
              <AvatarImage src={blog.author.avatar_url} />
              <AvatarFallback><User /></AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium group-hover:text-primary transition-colors">
                {blog.author.username}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarIcon className="h-3 w-3 mr-1" />
                <span>
                  {formatDistanceToNow(new Date(blog.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </Link>
          
          {/* Add follow button */}
          <FollowButton userId={blog.user_id} />
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <div title="Estimated read time" className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">{readTime}</span>
            </div>
            <div className="text-muted-foreground">•</div>
            <div title="View count" className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span className="text-sm">{views} views</span>
            </div>
          </div>
        </div>
        
        {blog.cover_image && (
          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <img 
              src={blog.cover_image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      
      <div className="prose max-w-none dark:prose-invert mb-10 whitespace-pre-line">
        {blog.content}
      </div>
      
      <div className="flex items-center justify-between border-t border-b border-border py-4 my-6">
        <Button 
          variant={hasLiked ? "default" : "outline"}
          className={hasLiked ? "gap-2" : "gap-2"}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
          <span>{likes}</span>
        </Button>
        
        <Button variant="outline" onClick={handleShare} className="gap-2">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </div>
      
      <CommentSection blogId={blog.id} />
    </div>
  );
};

export default BlogDetail;
