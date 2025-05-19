
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markNotificationAsRead, Notification } from '@/services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { Bell, BellOff, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadNotifications();
  }, [user, navigate]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      toast({
        title: 'Error loading notifications',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notification: Notification) => {
    if (notification.is_read) return;
    
    try {
      await markNotificationAsRead(notification.id);
      setNotifications(notifications.map(n => 
        n.id === notification.id ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      toast({
        title: 'Error marking notification as read',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification);
    
    switch (notification.type) {
      case 'new_follower':
        navigate(`/profile/${notification.content.follower_id}`);
        break;
      case 'new_comment':
        navigate(`/blogs/${notification.content.blog_id}`);
        break;
      default:
        // Do nothing for unknown notification types
        break;
    }
  };

  const getNotificationContent = (notification: Notification) => {
    switch (notification.type) {
      case 'new_follower':
        return 'Someone started following you';
      case 'new_comment':
        return 'New comment on your blog post';
      default:
        return 'You have a new notification';
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.is_read);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-heading font-bold">Notifications</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>
      
      <Tabs value={filter} onValueChange={(value) => setFilter(value as 'all' | 'unread')} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {loading ? (
        <div className="py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading notifications...</p>
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`hover:bg-muted/50 transition-colors cursor-pointer ${!notification.is_read ? 'border-primary/50 bg-muted/30' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-4 flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  {notification.is_read ? (
                    <BellOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Bell className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`${!notification.is_read ? 'font-medium' : ''}`}>
                    {getNotificationContent(notification)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
                {!notification.is_read && (
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              {filter === 'unread' ? 'You have no unread notifications' : 'You have no notifications yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationsPage;
