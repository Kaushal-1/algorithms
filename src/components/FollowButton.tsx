
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { followUser, unfollowUser, isFollowing } from '@/services/followService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface FollowButtonProps {
  userId: string;
  className?: string;
  onFollowChange?: (isFollowing: boolean) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, className, onFollowChange }) => {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const status = await isFollowing(userId);
        setFollowing(status);
      } catch (error) {
        console.error("Error checking follow status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkFollowStatus();
  }, [user, userId]);

  const handleFollowAction = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to follow this user',
        variant: 'destructive',
      });
      return;
    }

    if (user.id === userId) {
      toast({
        title: 'Cannot follow yourself',
        variant: 'destructive',
      });
      return;
    }

    setActionLoading(true);
    try {
      if (following) {
        await unfollowUser(userId);
        toast({
          title: 'Unfollowed successfully',
        });
      } else {
        await followUser(userId);
        toast({
          title: 'Followed successfully',
        });
      }
      setFollowing(!following);
      if (onFollowChange) {
        onFollowChange(!following);
      }
    } catch (error) {
      console.error("Error following/unfollowing:", error);
      toast({
        title: 'Action failed',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Don't show follow button for your own profile
  if (user && user.id === userId) {
    return null;
  }

  if (loading) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={className}
        disabled
      >
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading
      </Button>
    );
  }

  return (
    <Button
      variant={following ? "outline" : "default"}
      size="sm"
      className={className}
      onClick={handleFollowAction}
      disabled={actionLoading}
    >
      {actionLoading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : following ? (
        <UserMinus className="h-4 w-4 mr-2" />
      ) : (
        <UserPlus className="h-4 w-4 mr-2" />
      )}
      {following ? 'Following' : 'Follow'}
    </Button>
  );
};

export default FollowButton;
