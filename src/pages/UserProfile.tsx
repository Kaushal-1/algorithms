
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfileById, updateProfile } from '@/services/profileService';
import { getBlogs, deleteBlog } from '@/services/blogService';
import { UserProfile, UpdateProfileRequest } from '@/types/UserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Edit, Github, Globe, Linkedin, Twitter, User, X, Trash2 } from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UpdateProfileRequest>({});
  const [activeTab, setActiveTab] = useState('blogs');
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch the user profile
  const { data: profile, isLoading: isLoadingProfile, refetch } = useQuery({
    queryKey: ['profile', userId || user?.id],
    queryFn: () => getProfileById(userId || user?.id || ''),
    enabled: !!userId || !!user?.id
  });

  // Fetch the user's blogs
  const { data: blogs, isLoading: isLoadingBlogs, refetch: refetchBlogs } = useQuery({
    queryKey: ['user-blogs', userId || user?.id],
    queryFn: async () => {
      const allBlogs = await getBlogs();
      return allBlogs.filter(blog => blog.user_id === (userId || user?.id));
    },
    enabled: !!userId || !!user?.id
  });

  // Delete blog mutation
  const deleteBlogMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      toast({
        title: "Blog deleted",
        description: "The blog has been successfully deleted",
      });
      queryClient.invalidateQueries({ queryKey: ['user-blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setBlogToDelete(null);
      setDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete the blog",
      });
    }
  });

  const handleDeleteBlog = (blogId: string) => {
    setBlogToDelete(blogId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteBlog = () => {
    if (blogToDelete) {
      deleteBlogMutation.mutate(blogToDelete);
    }
  };

  useEffect(() => {
    if (profile) {
      setEditedProfile({
        username: profile.username || '',
        bio: profile.bio || '',
        expertise: profile.expertise || [],
        social_links: profile.social_links || {}
      });
    }
  }, [profile]);

  const isOwnProfile = !userId || userId === user?.id;

  const handleSaveProfile = async () => {
    if (!editedProfile) return;
    
    await updateProfile(editedProfile);
    setIsEditing(false);
    refetch();
  };

  const addExpertise = (expertise: string) => {
    if (!editedProfile.expertise?.includes(expertise)) {
      setEditedProfile({
        ...editedProfile,
        expertise: [...(editedProfile.expertise || []), expertise]
      });
    }
  };

  const removeExpertise = (expertise: string) => {
    setEditedProfile({
      ...editedProfile,
      expertise: editedProfile.expertise?.filter(e => e !== expertise) || []
    });
  };

  const updateSocialLink = (platform: string, url: string) => {
    setEditedProfile({
      ...editedProfile,
      social_links: {
        ...(editedProfile.social_links || {}),
        [platform]: url
      }
    });
  };

  if (isLoadingProfile) {
    return (
      <div className="container max-w-6xl mx-auto py-10">
        <div className="flex flex-col items-center gap-4">
          <div className="h-24 w-24 rounded-full bg-muted animate-pulse" />
          <div className="h-8 w-48 bg-muted animate-pulse" />
          <div className="h-4 w-72 bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container max-w-6xl mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <p className="text-muted-foreground mt-2">
            The user profile you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-10">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-shrink-0">
          <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
            <AvatarImage src={profile.avatar_url || ''} alt={profile.username || 'User'} />
            <AvatarFallback className="text-4xl">
              <User size={64} />
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-grow space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold font-heading">
              {profile.username || 'Anonymous'}
            </h1>
            {profile.verified && (
              <Badge variant="default" className="bg-blue-600">
                <Check className="h-3 w-3 mr-1" /> Verified
              </Badge>
            )}
          </div>
          
          <p className="text-muted-foreground">{profile.bio || 'No bio yet'}</p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.expertise?.map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
            {(profile.expertise?.length === 0) && (
              <span className="text-sm text-muted-foreground">No expertise areas added</span>
            )}
          </div>

          <div className="flex items-center gap-4 text-muted-foreground">
            {profile.social_links?.twitter && (
              <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {profile.social_links?.github && (
              <a href={profile.social_links.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
            )}
            {profile.social_links?.linkedin && (
              <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {profile.social_links?.website && (
              <a href={profile.social_links.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <Globe className="h-5 w-5" />
              </a>
            )}
          </div>

          <div className="flex gap-6 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.stats?.posts || 0}</div>
              <div className="text-sm text-muted-foreground">Blogs</div>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.stats?.followers || 0}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.stats?.following || 0}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
          </div>

          {isOwnProfile && (
            <div className="mt-4">
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            </div>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-10">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:flex">
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="blogs" className="mt-6">
          {isLoadingBlogs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video w-full bg-muted"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : blogs && blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map(blog => (
                <div key={blog.id} className="relative">
                  <BlogCard blog={blog} />
                  {isOwnProfile && (
                    <Button 
                      variant="destructive" 
                      size="icon"
                      className="absolute top-2 right-2 z-10 rounded-full opacity-80 hover:opacity-100"
                      onClick={() => handleDeleteBlog(blog.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Card className="bg-muted/30">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-lg font-medium">No blogs published yet</p>
                <p className="text-muted-foreground mt-1">
                  {isOwnProfile ? "You haven't published any blogs yet." : "This user hasn't published any blogs yet."}
                </p>
                {isOwnProfile && (
                  <Button className="mt-4" variant="default" onClick={() => navigate('/blogs')}>Create your first blog</Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="about" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Bio</h3>
                  <p className="mt-2 text-muted-foreground">
                    {profile.bio || 'No bio available'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Areas of Expertise</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.expertise?.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                    {(profile.expertise?.length === 0) && (
                      <span className="text-muted-foreground">No expertise areas listed</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Member Since</h3>
                  <p className="mt-2 text-muted-foreground">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                value={editedProfile.username || ''}
                onChange={(e) => setEditedProfile({...editedProfile, username: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <Textarea
                id="bio"
                value={editedProfile.bio || ''}
                onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                className="col-span-3 min-h-[100px]"
              />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Areas of Expertise
              </label>
              <div className="flex flex-wrap gap-2">
                {editedProfile.expertise?.map(item => (
                  <Badge key={item} variant="secondary" className="flex items-center gap-1">
                    {item}
                    <button onClick={() => removeExpertise(item)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2 mt-1">
                <Input 
                  id="new-expertise"
                  placeholder="Add expertise (e.g. React, TypeScript)"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      e.preventDefault();
                      addExpertise(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    const input = document.getElementById('new-expertise') as HTMLInputElement;
                    if (input.value) {
                      addExpertise(input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Social Links
              </label>
              <div className="grid gap-3">
                <div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  <Input
                    placeholder="Twitter URL"
                    value={editedProfile.social_links?.twitter || ''}
                    onChange={(e) => updateSocialLink('twitter', e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  <Input
                    placeholder="GitHub URL"
                    value={editedProfile.social_links?.github || ''}
                    onChange={(e) => updateSocialLink('github', e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  <Input
                    placeholder="LinkedIn URL"
                    value={editedProfile.social_links?.linkedin || ''}
                    onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <Input
                    placeholder="Website URL"
                    value={editedProfile.social_links?.website || ''}
                    onChange={(e) => updateSocialLink('website', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Blog Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your blog post and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteBlog}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteBlogMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserProfilePage;
