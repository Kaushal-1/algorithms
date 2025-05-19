
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTrendingBlogs } from '@/services/blogService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, TrendingUp, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const TrendingBlogs: React.FC = () => {
  const { data: trendingBlogs, isLoading, error } = useQuery({
    queryKey: ['trendingBlogs'],
    queryFn: getTrendingBlogs,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending Posts
        </h2>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden border border-border">
            <CardHeader className="p-4 pb-2">
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !trendingBlogs || trendingBlogs.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending Posts
        </h2>
        <Card className="border border-border p-4 text-center">
          <p className="text-muted-foreground">No trending posts yet</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        Trending Posts
      </h2>
      <div className="grid gap-4">
        {trendingBlogs.map((blog) => (
          <Card key={blog.id} className="overflow-hidden border border-border">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base line-clamp-2">
                <Link 
                  to={`/blogs/${blog.id}`} 
                  className="hover:text-primary transition-colors"
                >
                  {blog.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={blog.author.avatar_url || undefined} />
                    <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
                  </Avatar>
                  <span>{blog.author.username}</span>
                </div>
                <div className="flex items-center gap-1" title="Views">
                  <Eye className="h-3 w-3" />
                  <span>{blog.view_count || 0}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {blog.created_at && formatDistanceToNow(new Date(blog.created_at), { addSuffix: true })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrendingBlogs;
