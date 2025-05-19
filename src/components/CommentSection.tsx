
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getComments, createComment, deleteComment } from '@/services/blogService';
import { Comment, NewComment } from '@/types/Blog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Send, Trash2, User, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CommentSectionProps {
  blogId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ blogId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadComments();
  }, [blogId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const fetchedComments = await getComments(blogId);
      setComments(fetchedComments);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to load comments',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setIsSubmitting(true);
      const commentData: NewComment = {
        blog_id: blogId,
        content: newComment.trim(),
      };
      
      const createdComment = await createComment(commentData);
      setComments([...comments, createdComment]);
      setNewComment('');
      
      toast({
        title: 'Comment posted',
        description: 'Your comment has been successfully posted.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to post comment',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
      setCommentToDelete(null);
      
      toast({
        title: 'Comment deleted',
        description: 'Your comment has been successfully deleted.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to delete comment',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  return (
    <div className="mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span>Comments ({comments.length})</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-pulse space-y-3">
                <div className="h-10 w-full bg-muted rounded-md"></div>
                <div className="h-24 w-full bg-muted rounded-md"></div>
              </div>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author?.avatar_url} alt={comment.author?.username} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <Link
                            to={`/profile/${comment.user_id}`}
                            className="font-medium text-sm hover:underline"
                          >
                            {comment.author?.username || 'Anonymous'}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        
                        {user && user.id === comment.user_id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => setCommentToDelete(comment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <p className="mt-1 text-sm whitespace-pre-line">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No comments yet</p>
              <p className="text-sm text-muted-foreground">Be the first to share your thoughts</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          {user ? (
            <div className="w-full space-y-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-24 resize-none"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Posting...' : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Post Comment
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full text-center py-4">
              <p className="text-muted-foreground mb-2">
                Please sign in to leave a comment
              </p>
              <Button asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <AlertDialog open={!!commentToDelete} onOpenChange={() => setCommentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => commentToDelete && handleDeleteComment(commentToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CommentSection;
