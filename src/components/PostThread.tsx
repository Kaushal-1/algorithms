
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, ThumbsUp, Heart, MessageCircle, Bookmark, Share, Code, Image, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface PostData {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    isMentor?: boolean;
  };
  content: string;
  timestamp: Date;
  likes: number;
  liked?: boolean;
  comments: {
    id: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
      isMentor?: boolean;
    };
    content: string;
    timestamp: Date;
    likes: number;
  }[];
}

interface PostThreadProps {
  post: PostData;
}

const PostThread: React.FC<PostThreadProps> = ({ post }) => {
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [liked, setLiked] = useState(post.liked || false);
  const [likes, setLikes] = useState(post.likes);
  
  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };
  
  const handleComment = () => {
    setIsCommenting(!isCommenting);
  };
  
  const submitComment = () => {
    if (commentText.trim()) {
      console.log('New comment:', commentText);
      setCommentText('');
      setIsCommenting(false);
    }
  };
  
  return (
    <div className="w-full rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 p-4 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex space-x-3">
        <Avatar className="h-10 w-10 border border-primary/20">
          <AvatarImage src={post.author.avatar} />
          <AvatarFallback><User size={18} /></AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-foreground">
              {post.author.name}
              {post.author.isMentor && (
                <span className="ml-2 inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                  Mentor
                </span>
              )}
            </h3>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(post.timestamp, { addSuffix: true })}
            </span>
          </div>
          
          <div className="mt-2 text-foreground/90 whitespace-pre-line">
            {post.content}
          </div>
          
          <div className="mt-3 flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex items-center space-x-1 text-xs ${liked ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={handleLike}
            >
              <ThumbsUp size={14} className={liked ? 'fill-primary' : ''} />
              <span>{likes}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-1 text-xs text-muted-foreground"
              onClick={handleComment}
            >
              <MessageCircle size={14} />
              <span>{post.comments.length}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-xs text-muted-foreground ml-auto"
            >
              <Bookmark size={14} />
            </Button>
          </div>
          
          {isCommenting && (
            <div className="mt-3">
              <Textarea 
                placeholder="Write a comment..." 
                className="min-h-[80px] bg-background/50 border-border/50"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="mt-2 flex justify-end space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsCommenting(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={submitComment}
                  disabled={!commentText.trim()}
                >
                  Post
                </Button>
              </div>
            </div>
          )}
          
          {post.comments.length > 0 && (
            <div className="mt-4 space-y-3 border-t border-border/50 pt-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="h-7 w-7 border border-primary/20">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback><User size={14} /></AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-foreground">
                        {comment.author.name}
                        {comment.author.isMentor && (
                          <span className="ml-1 inline-flex items-center rounded-full bg-primary/20 px-1.5 py-0.5 text-xs text-primary">M</span>
                        )}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className="mt-1 text-sm text-foreground/90">
                      {comment.content}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center space-x-1 text-xs text-muted-foreground mt-1"
                    >
                      <ThumbsUp size={12} />
                      <span>{comment.likes}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostThread;
