
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  Mail, 
  Link as LinkIcon, 
  Github, 
  Twitter, 
  Linkedin,
  Users,
  Edit,
  Grid,
  ListFilter,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { getBlogsByUser } from '@/services/blogService';
import { getFollowers, getFollowing } from '@/services/followService';
import BlogCard from '@/components/BlogCard';
import FollowButton from '@/components/FollowButton';
import { Follower } from '@/services/followService';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState('blogs');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwnProfile = user?.id === userId;

  // Query user profile
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      try {
        const response = await fetch(`https://gwgnnfbtvndiaaprbuvd.supabase.co/rest/v1/profiles?id=eq.${userId}`, {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3Z25uZmJ0dm5kaWFhcHJidXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxODA2MjksImV4cCI6MjA1OTc1NjYyOX0.F36UShWvwxPBZNPlw9qI9IjQ93ju_rRneSm64MgKGls',
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        return data[0];
      } catch (error) {
        throw new Error('Failed to fetch profile');
      }
    },
    enabled: !!userId,
  });

  // Query user blogs
  const {
    data: blogs,
    isLoading: isBlogsLoading,
  } = useQuery({
    queryKey: ['userBlogs', userId],
    queryFn: () => getBlogsByUser(userId!),
    enabled: !!userId,
  });

  // Query followers
  const {
    data: followers,
    isLoading: isFollowersLoading,
  } = useQuery({
    queryKey: ['followers', userId],
    queryFn: () => getFollowers(userId!),
    enabled: !!userId,
  });

  // Query following
  const {
    data: following,
    isLoading: isFollowingLoading,
  } = useQuery({
    queryKey: ['following', userId],
    queryFn: () => getFollowing(userId!),
    enabled: !!userId,
  });

  if (isProfileLoading) {
    return (
      <div className="container py-12 px-4 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-muted h-20 w-20"></div>
            <div className="space-y-3 flex-1">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-3 bg-muted rounded w-2/4"></div>
            </div>
          </div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="col-span-1 h-60 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="container py-12 px-4 text-center">
        <User className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold mt-4">User Not Found</h1>
        <p className="text-muted-foreground mb-6">The user profile you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/blogs')}>Back to Blogs</Button>
      </div>
    );
  }

  // Render follower card for followers/following lists
  const renderFollowerCard = (follower: Follower) => (
    <Card key={follower.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <Link to={`/profile/${follower.profile?.username === profile.username ? follower.following_id : follower.follower_id}`} className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={follower.profile?.avatar_url} />
            <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{follower.profile?.username}</p>
          </div>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <div className="container py-10 px-4 max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 justify-between mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-2xl">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-heading font-bold">
                {profile.username || 'Anonymous'}
                {profile.verified && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
                    Verified
                  </span>
                )}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 mt-3">
                <Link to={`/profile/${userId}/followers`} className="flex items-center gap-1 hover:text-primary transition-colors">
                  <span className="font-medium">{followers?.length || 0}</span>
                  <span className="text-muted-foreground">Followers</span>
                </Link>
                <Link to={`/profile/${userId}/following`} className="flex items-center gap-1 hover:text-primary transition-colors">
                  <span className="font-medium">{following?.length || 0}</span>
                  <span className="text-muted-foreground">Following</span>
                </Link>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{blogs?.length || 0}</span>
                  <span className="text-muted-foreground">Posts</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isOwnProfile ? (
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            ) : (
              <FollowButton userId={userId!} className="w-32" />
            )}
          </div>
        </div>
        
        {profile.bio && (
          <div className="bg-muted/30 rounded-md p-4 mt-4 mb-6">
            <p className="whitespace-pre-line">{profile.bio}</p>
          </div>
        )}
        
        {profile.expertise && profile.expertise.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.expertise.map((skill: string) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        )}
        
        {profile.social_links && (
          <div className="flex flex-wrap gap-4 mt-6">
            {profile.social_links.website && (
              <a href={profile.social_links.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <LinkIcon className="h-5 w-5" />
              </a>
            )}
            {profile.social_links.github && (
              <a href={profile.social_links.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
            )}
            {profile.social_links.twitter && (
              <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {profile.social_links.linkedin && (
              <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
            )}
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="blogs">
              <span className="flex items-center gap-2">
                Blogs
              </span>
            </TabsTrigger>
            <TabsTrigger value="followers">
              <span className="flex items-center gap-2">
                Followers
              </span>
            </TabsTrigger>
            <TabsTrigger value="following">
              <span className="flex items-center gap-2">
                Following
              </span>
            </TabsTrigger>
          </TabsList>
          
          {activeTab === 'blogs' && (
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'ghost' : 'ghost'}
                size="sm"
                className={`rounded-none ${viewMode === 'grid' ? 'bg-muted' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'ghost' : 'ghost'}
                size="sm"
                className={`rounded-none ${viewMode === 'list' ? 'bg-muted' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <ListFilter className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="blogs" className="mt-6">
          {isBlogsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video w-full bg-muted"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded-md w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded-md w-full mb-1"></div>
                    <div className="h-3 bg-muted rounded-md w-5/6"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : blogs && blogs.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-6"
            }>
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-4 rounded-full bg-muted mb-4">
                <Users className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No blogs yet</h3>
              <p className="text-muted-foreground">
                {isOwnProfile 
                  ? "You haven't published any blogs yet. Create your first blog post!"
                  : `${profile.username || 'This user'} hasn't published any blogs yet.`}
              </p>
              {isOwnProfile && (
                <Button className="mt-4" onClick={() => navigate('/blogs')}>
                  Create A Blog
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="followers" className="mt-6">
          {isFollowersLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="rounded-full bg-muted h-10 w-10"></div>
                    <div className="h-4 bg-muted rounded-md w-24"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : followers && followers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {followers.map((follower) => renderFollowerCard(follower))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-4 rounded-full bg-muted mb-4">
                <Users className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No followers yet</h3>
              <p className="text-muted-foreground">
                {isOwnProfile 
                  ? "You don't have any followers yet. Share your profile to get discovered!"
                  : `${profile.username || 'This user'} doesn't have any followers yet.`}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="following" className="mt-6">
          {isFollowingLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="rounded-full bg-muted h-10 w-10"></div>
                    <div className="h-4 bg-muted rounded-md w-24"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : following && following.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {following.map((follow) => renderFollowerCard(follow))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-4 rounded-full bg-muted mb-4">
                <Users className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">Not following anyone yet</h3>
              <p className="text-muted-foreground">
                {isOwnProfile 
                  ? "You aren't following anyone yet. Find interesting writers to follow!"
                  : `${profile.username || 'This user'} isn't following anyone yet.`}
              </p>
              {isOwnProfile && (
                <Button className="mt-4" onClick={() => navigate('/blogs')}>
                  Discover Writers
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
