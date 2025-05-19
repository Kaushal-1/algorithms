
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { User, Calendar, MessageSquare, Heart } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { BlogWithAuthor } from '@/types/Blog';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  blog: BlogWithAuthor;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  // Format the content preview - limit to 150 characters
  const contentPreview = blog.content.length > 150 
    ? `${blog.content.substring(0, 150)}...` 
    : blog.content;

  // Format the date
  const formattedDate = formatDistanceToNow(new Date(blog.created_at), { addSuffix: true });

  // Generate a random cover image if none exists
  // In a real app, this would come from the blog data
  const coverImage = blog.cover_image || `https://source.unsplash.com/random/800x600?programming&${blog.id}`;
  
  // Generate placeholder engagement metrics (for UI purposes)
  const likes = Math.floor(Math.random() * 50);
  const comments = Math.floor(Math.random() * 10);

  return (
    <Card className="overflow-hidden border border-border/40 bg-card hover:border-primary/30 transition-colors hover:shadow-md hover:-translate-y-1 duration-300">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={coverImage} 
          alt={blog.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
        />
      </div>
      
      <CardHeader className="p-4 pb-2">
        <Link to={`/blogs/${blog.id}`} className="hover:text-primary transition-colors">
          <h3 className="text-lg font-heading font-semibold">{blog.title}</h3>
        </Link>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground text-sm line-clamp-3">{contentPreview}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 border-t border-border/20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={blog.author.avatar_url} />
            <AvatarFallback><User size={16} /></AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{blog.author.username}</span>
        </div>
        
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <Heart className="h-3 w-3 mr-1" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-3 w-3 mr-1" />
            <span>{comments}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
