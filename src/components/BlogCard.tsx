
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { User } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { BlogWithAuthor } from '@/types/Blog';

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

  return (
    <Card className="overflow-hidden border border-border/40 bg-card hover:border-primary/30 transition-colors">
      <CardHeader className="p-4 pb-2">
        <h3 className="text-lg font-heading font-semibold">{blog.title}</h3>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground text-sm">{contentPreview}</p>
      </CardContent>
      <CardFooter className="p-4 pt-2 border-t border-border/20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={blog.author.avatar_url} />
            <AvatarFallback><User size={16} /></AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{blog.author.username}</span>
        </div>
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
