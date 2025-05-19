
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Notification, getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      toast({
        title: 'Error marking notification as read',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      toast({
        title: 'All notifications marked as read',
      });
    } catch (error) {
      toast({
        title: 'Error marking all notifications as read',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const getNotificationContent = (notification: Notification) => {
    switch (notification.type) {
      case 'new_follower':
        return (
          <Link 
            to={`/profile/${notification.content.follower_id}`}
            className="hover:underline"
            onClick={() => handleMarkAsRead(notification.id)}
          >
            Someone started following you
          </Link>
        );
      case 'new_comment':
        return (
          <Link 
            to={`/blogs/${notification.content.blog_id}`}
            className="hover:underline"
            onClick={() => handleMarkAsRead(notification.id)}
          >
            New comment on your blog post
          </Link>
        );
      default:
        return 'You have a new notification';
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 text-xs min-w-[18px] h-[18px] px-1 flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          Notifications
          {notifications.some(n => !n.is_read) && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-auto py-1"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="p-4 text-center">Loading notifications...</div>
        ) : notifications.length > 0 ? (
          <>
            {notifications.slice(0, 5).map((notification) => (
              <DropdownMenuItem 
                key={notification.id} 
                className={`cursor-pointer flex-col items-start py-3 ${!notification.is_read ? 'bg-muted/50' : ''}`}
              >
                <div className="w-full">
                  <p className="text-sm">{getNotificationContent(notification)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
            {notifications.length > 5 && (
              <DropdownMenuItem className="justify-center">
                <Link to="/notifications" className="text-primary hover:underline text-sm">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            )}
          </>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No notifications yet
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
