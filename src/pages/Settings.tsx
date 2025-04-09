
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  ArrowLeft, 
  Bell, 
  Brush, 
  Check, 
  Download, 
  Eye, 
  EyeOff, 
  FileDown, 
  Key, 
  Lock, 
  LogOut, 
  Mail, 
  Moon, 
  Shield, 
  Sun, 
  Trash2, 
  Upload, 
  User
} from 'lucide-react';

// Sidebar navigation items
const navItems = [
  { id: 'profile', label: 'Profile Settings', icon: User },
  { id: 'security', label: 'Security & Password', icon: Key },
  { id: 'notifications', label: 'Notification Preferences', icon: Bell },
  { id: 'theme', label: 'Theme & Accessibility', icon: Brush },
  { id: 'privacy', label: 'Privacy Settings', icon: Shield },
  { id: 'delete', label: 'Delete Account', icon: Trash2 },
];

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get section from URL query params or default to profile
  const queryParams = new URLSearchParams(location.search);
  const defaultSection = queryParams.get('section') || 'profile';
  
  const [activeSection, setActiveSection] = useState(defaultSection);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    username: 'alexcoder',
    displayName: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    bio: 'Software engineer passionate about algorithms and distributed systems'
  });
  
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    inAppNotifications: true,
    weeklyActivitySummary: false
  });
  
  const [themeSettings, setThemeSettings] = useState({
    theme: 'dark',
    fontSize: 'medium',
    highContrast: false,
    codeFont: 'monospace'
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showCodingActivity: true
  });
  
  // Update URL when active section changes
  useEffect(() => {
    const newUrl = `${location.pathname}?section=${activeSection}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeSection]);
  
  // Handle form submissions
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
    }, 800);
  };
  
  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your new password and confirmation match.",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });
    }, 800);
  };
  
  const handleSettingToggle = (setting: string, section: string, value: boolean) => {
    // Update the appropriate settings state based on section
    if (section === 'notifications') {
      setNotificationSettings(prev => ({ ...prev, [setting]: value }));
    } else if (section === 'privacy') {
      setPrivacySettings(prev => ({ ...prev, [setting]: value }));
    } else if (section === 'theme') {
      setThemeSettings(prev => ({ ...prev, [setting]: value }));
    }
    
    // Show success toast
    toast({
      title: "Setting Updated",
      description: `${setting.charAt(0).toUpperCase() + setting.slice(1).replace(/([A-Z])/g, ' $1')} has been ${value ? 'enabled' : 'disabled'}.`,
    });
  };
  
  const handleThemeChange = (value: string) => {
    setThemeSettings(prev => ({ ...prev, theme: value }));
    toast({
      title: "Theme Updated",
      description: `Theme has been changed to ${value}.`,
    });
  };
  
  const handleFontSizeChange = (value: string) => {
    setThemeSettings(prev => ({ ...prev, fontSize: value }));
    toast({
      title: "Font Size Updated",
      description: `Font size has been changed to ${value}.`,
    });
  };
  
  const handleDeleteAccount = () => {
    // Simulate API call
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted. Redirecting to homepage...",
      });
      
      // Redirect to home page after a delay
      setTimeout(() => navigate('/'), 1500);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-algos-dark text-foreground">
      <Navbar />
      
      <div className="pt-24 px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/user-profile')}
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Profile
          </Button>
          
          <h1 className="text-3xl font-bold mb-8 font-heading">Settings</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar Menu */}
            <div className="lg:col-span-1">
              <Card className="bg-card/40 border-border/50 sticky top-24">
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    {navItems.map(item => (
                      <Button
                        key={item.id}
                        variant={activeSection === item.id ? "default" : "ghost"}
                        className={`w-full justify-start text-left mb-1 ${
                          item.id === 'delete' ? 'text-destructive hover:text-destructive mt-4' : ''
                        } ${
                          activeSection === item.id && item.id !== 'delete' 
                            ? 'bg-primary text-primary-foreground' 
                            : ''
                        } ${
                          activeSection === item.id && item.id === 'delete' 
                            ? 'bg-destructive/30 text-destructive' 
                            : ''
                        }`}
                        onClick={() => setActiveSection(item.id)}
                      >
                        <item.icon size={16} className="mr-2" /> {item.label}
                      </Button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Content Area */}
            <div className="lg:col-span-3 space-y-6 animate-fade-in">
              {/* Profile Settings */}
              {activeSection === 'profile' && (
                <Card className="bg-card/40 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <User size={18} className="mr-2 text-primary" /> Profile Settings
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and profile details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              value={profileForm.username}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                              className="bg-muted/30"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                              id="displayName"
                              value={profileForm.displayName}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, displayName: e.target.value }))}
                              className="bg-muted/30"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileForm.email}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                              className="bg-muted/30"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio / Tagline</Label>
                            <Textarea
                              id="bio"
                              value={profileForm.bio}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                              className="bg-muted/30 min-h-24"
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center space-y-4">
                          <div className="text-center">
                            <Avatar className="w-32 h-32 mb-4 mx-auto">
                              <AvatarImage src="https://source.unsplash.com/random/400x400/?portrait" />
                              <AvatarFallback>AJ</AvatarFallback>
                            </Avatar>
                            <Button variant="outline" size="sm" className="mb-2">
                              <Upload size={14} className="mr-2" /> Upload Image
                            </Button>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG or GIF, max 2MB
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Button type="submit" disabled={isLoading} className="mt-6">
                        {isLoading && <div className="mr-2 animate-spin">⟳</div>}
                        Save Profile Changes
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
              
              {/* Security & Password */}
              {activeSection === 'security' && (
                <Card className="bg-card/40 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Key size={18} className="mr-2 text-primary" /> Security & Password
                    </CardTitle>
                    <CardDescription>
                      Update your password and security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSecuritySubmit} className="space-y-6 max-w-md">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={securityForm.currentPassword}
                          onChange={(e) => setSecurityForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="bg-muted/30"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={securityForm.newPassword}
                          onChange={(e) => setSecurityForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="bg-muted/30"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={securityForm.confirmPassword}
                          onChange={(e) => setSecurityForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="bg-muted/30"
                          required
                        />
                      </div>
                      
                      <div className="pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="twoFactor">Enable 2FA</Label>
                          <Switch id="twoFactor" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Requires app like Google Authenticator
                        </p>
                      </div>
                      
                      <Button type="submit" disabled={isLoading}>
                        {isLoading && <div className="mr-2 animate-spin">⟳</div>}
                        Update Password
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
              
              {/* Notification Preferences */}
              {activeSection === 'notifications' && (
                <Card className="bg-card/40 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Bell size={18} className="mr-2 text-primary" /> Notification Preferences
                    </CardTitle>
                    <CardDescription>
                      Control how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-border/50">
                        <div className="space-y-0.5">
                          <Label className="text-base">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive email alerts about course updates and system notifications
                          </p>
                        </div>
                        <Switch 
                          checked={notificationSettings.emailNotifications} 
                          onCheckedChange={(checked) => handleSettingToggle('emailNotifications', 'notifications', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-border/50">
                        <div className="space-y-0.5">
                          <Label className="text-base">In-app Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive real-time notifications within the platform
                          </p>
                        </div>
                        <Switch 
                          checked={notificationSettings.inAppNotifications} 
                          onCheckedChange={(checked) => handleSettingToggle('inAppNotifications', 'notifications', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-3">
                        <div className="space-y-0.5">
                          <Label className="text-base">Weekly Activity Summary</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive a weekly recap of your learning progress
                          </p>
                        </div>
                        <Switch 
                          checked={notificationSettings.weeklyActivitySummary} 
                          onCheckedChange={(checked) => handleSettingToggle('weeklyActivitySummary', 'notifications', checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Theme & Accessibility */}
              {activeSection === 'theme' && (
                <Card className="bg-card/40 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Brush size={18} className="mr-2 text-primary" /> Theme & Accessibility
                    </CardTitle>
                    <CardDescription>
                      Customize the appearance and accessibility settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="py-3 border-b border-border/50">
                        <Label className="text-base mb-3 block">Theme</Label>
                        <ToggleGroup type="single" value={themeSettings.theme} onValueChange={handleThemeChange} className="justify-start">
                          <ToggleGroupItem value="dark" className="flex items-center gap-2">
                            <Moon size={16} /> Dark
                          </ToggleGroupItem>
                          <ToggleGroupItem value="light" className="flex items-center gap-2">
                            <Sun size={16} /> Light
                          </ToggleGroupItem>
                          <ToggleGroupItem value="system" className="flex items-center gap-2">
                            <div className="flex">
                              <Moon size={16} className="-mr-1" />
                              <Sun size={16} />
                            </div>
                            System
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                      
                      <div className="py-3 border-b border-border/50">
                        <Label className="text-base mb-3 block">Font Size</Label>
                        <ToggleGroup type="single" value={themeSettings.fontSize} onValueChange={handleFontSizeChange} className="justify-start">
                          <ToggleGroupItem value="small" className="text-sm">Small</ToggleGroupItem>
                          <ToggleGroupItem value="medium" className="text-base">Medium</ToggleGroupItem>
                          <ToggleGroupItem value="large" className="text-lg">Large</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-border/50">
                        <div className="space-y-0.5">
                          <Label className="text-base">High Contrast Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Increase contrast for better visibility
                          </p>
                        </div>
                        <Switch 
                          checked={themeSettings.highContrast} 
                          onCheckedChange={(checked) => handleSettingToggle('highContrast', 'theme', checked)}
                        />
                      </div>
                      
                      <div className="py-3">
                        <Label className="text-base mb-3 block">Code Font Preview</Label>
                        <div className="p-4 bg-algos-darker rounded-lg overflow-auto">
                          <pre className="text-sm font-mono">
                            <code>{`function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  
  const pivot = arr[0];
  const left = [];
  const right = [];
  
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  
  return [...quickSort(left), pivot, ...quickSort(right)];
}`}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Privacy Settings */}
              {activeSection === 'privacy' && (
                <Card className="bg-card/40 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Shield size={18} className="mr-2 text-primary" /> Privacy Settings
                    </CardTitle>
                    <CardDescription>
                      Control your privacy and data sharing preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-border/50">
                        <div className="space-y-0.5">
                          <Label className="text-base flex items-center gap-2">
                            Public Profile
                            {privacySettings.publicProfile ? (
                              <Eye size={16} className="text-primary" />
                            ) : (
                              <EyeOff size={16} className="text-muted-foreground" />
                            )}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Allow other users to view your profile and achievements
                          </p>
                        </div>
                        <Switch 
                          checked={privacySettings.publicProfile} 
                          onCheckedChange={(checked) => handleSettingToggle('publicProfile', 'privacy', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-border/50">
                        <div className="space-y-0.5">
                          <Label className="text-base">Show Coding Activity</Label>
                          <p className="text-sm text-muted-foreground">
                            Display your problem-solving activity on your public profile
                          </p>
                        </div>
                        <Switch 
                          checked={privacySettings.showCodingActivity} 
                          onCheckedChange={(checked) => handleSettingToggle('showCodingActivity', 'privacy', checked)}
                        />
                      </div>
                      
                      <div className="py-3">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Download size={16} /> Request Data Export
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          Download a copy of all your personal data. This may take up to 24 hours to process.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Delete Account */}
              {activeSection === 'delete' && (
                <Card className="bg-card/40 border-destructive/10">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl text-destructive">
                      <AlertTriangle size={18} className="mr-2" /> Delete Account
                    </CardTitle>
                    <CardDescription>
                      Permanently delete your account and all associated data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                      <h3 className="text-destructive font-medium mb-2">Warning: This action cannot be undone</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        When you delete your account, all of your data will be permanently removed. This includes:
                      </p>
                      <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                        <li>Profile information and settings</li>
                        <li>Course progress and completion history</li>
                        <li>Problem submissions and solutions</li>
                        <li>Achievements and badges</li>
                      </ul>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="mt-4">
                          <Trash2 size={16} className="mr-2" /> Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Your account and all associated data will be permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Yes, delete my account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
