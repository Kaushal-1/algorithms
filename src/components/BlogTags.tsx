
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface BlogTagsProps {
  content: string;
  limit?: number;
}

const BlogTags: React.FC<BlogTagsProps> = ({ content, limit = 3 }) => {
  // Extract hashtags from content
  const extractTags = (text: string): string[] => {
    // Match hashtags using regex
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    
    if (!matches) return [];
    
    // Remove # symbol and convert to lowercase
    return matches.map(tag => tag.substring(1).toLowerCase());
  };
  
  const tags = extractTags(content);
  const displayTags = limit ? tags.slice(0, limit) : tags;
  
  if (tags.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {displayTags.map((tag, index) => (
        <Link key={index} to={`/blogs?search=%23${tag}`}>
          <Badge variant="secondary" className="hover:bg-secondary/80">
            #{tag}
          </Badge>
        </Link>
      ))}
      {tags.length > limit && (
        <Badge variant="outline" className="text-muted-foreground">
          +{tags.length - limit} more
        </Badge>
      )}
    </div>
  );
};

export default BlogTags;
