
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart3, 
  Bell,
  BookOpen,
  Bookmark,
  CalendarDays, 
  CheckCircle, 
  Code, 
  Edit, 
  ExternalLink, 
  Key, 
  Medal, 
  PieChart, 
  Settings, 
  Trophy, 
  User
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock activity data for chart
const activityData = [
  { name: 'Mon', problems: 5 },
  { name: 'Tue', problems: 8 },
  { name: 'Wed', problems: 3 },
  { name: 'Thu', problems: 7 },
  { name: 'Fri', problems: 4 },
  { name: 'Sat', problems: 10 },
  { name: 'Sun', problems: 6 },
];

// Mock data for courses and achievements (this could be fetched from an API in a real app)
const coursesData = [
  { id: 1, name: "Advanced Data Structures", progress: 78, lastOpened: "2 days ago", image: "https://source.unsplash.com/random/800x600/?coding" },
  { id: 2, name: "Machine Learning Fundamentals", progress: 45, lastOpened: "yesterday", image: "https://source.unsplash.com/random/800x600/?ai" },
  { id: 3, name: "Full-Stack Web Development", progress: 92, lastOpened: "1 week ago", image: "https://source.unsplash.com/random/800x600/?webdev" }
];

const bookmarkedData = [
  { id: 1, title: "Binary Tree Traversal", difficulty: "Medium", type: "Problem" },
  { id: 2, title: "Database Design & SQL", difficulty: "Intermediate", type: "Course" },
  { id: 3, title: "Implement Quick Sort", difficulty: "Medium", type: "Problem" }
];

const achievementsData = [
  { id: 1, name: "10-Day Streak", icon: "🔥", description: "Solved problems for 10 consecutive days", date: "2023-12-15" },
  { id: 2, name: "Algorithm Master", icon: "🏆", description: "Solved 100+ algorithm problems", date: "2023-11-05" },
  { id: 3, name: "Course Completer", icon: "🎓", description: "Completed 5 courses successfully", date: "2024-01-20" }
];

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated and finished loading
    if (user === null && !isLoading) {
      navigate('/login');
    }
  }, [user, navigate, isLoading]);

  // If still loading or no user, show loading state
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-algos-dark text-foreground">
        <Navbar />
        <div className="pt-24 px-4 md:px-8 pb-16 flex justify-center">
          <div className="animate-spin text-2xl">⟳</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-algos-dark text-foreground">
      <Navbar />
      
      <div className="pt-24 px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="relative rounded-xl overflow-hidden mb-8">
            {/* Background Banner with Gradient Overlay */}
            <div className="h-48 bg-gradient-to-r from-primary/30 to-secondary/30 relative">
              <div className="absolute inset-0 bg-[url('https://source.unsplash.com/random/1600x400/?abstract')] opacity-20 bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-algos-dark/90"></div>
            </div>
            
            {/* User Info */}
            <div className="relative px-6 pb-6 -mt-12 flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-8">
              <Avatar className="w-24 h-24 border-4 border-algos-dark ring-2 ring-primary">
                <AvatarImage src={profile?.avatar_url || "https://source.unsplash.com/random/400x400/?portrait"} alt={profile?.username || "User"} />
                <AvatarFallback>{profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col md:flex-row flex-1 gap-4 items-start md:items-end justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold font-heading">
                      {user.user_metadata?.displayName || profile?.username || "User"}
                    </h1>
                    <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">
                      Student
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-1">@{profile?.username || "username"}</p>
                  <p className="text-sm max-w-md">{profile?.bio || "No bio yet. Add one in settings!"}</p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="bg-card/40 border-border/50"
                  onClick={() => navigate('/settings')}
                >
                  <Edit size={16} className="mr-2" /> Edit Profile
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="space-y-6">
              {/* Profile Overview Card */}
              <Card className="bg-card/40 border-border/50 overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <User size={18} className="mr-2 text-primary" /> Profile Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-medium flex items-center">
                      <CalendarDays size={14} className="mr-1 text-accent" /> {new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium flex items-center">
                      <Trophy size={14} className="mr-1 text-amber-500" /> Advanced
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Enrolled Courses</span>
                    <span className="font-medium">{coursesData.length}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Problems Attempted</span>
                    <span className="font-medium">248</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <Card className="bg-card/40 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Settings size={18} className="mr-2 text-primary" /> Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left" 
                    onClick={() => navigate('/settings')}
                  >
                    <Edit size={16} className="mr-2" /> Edit Profile Info
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left" 
                    onClick={() => navigate('/settings?section=security')}
                  >
                    <Key size={16} className="mr-2" /> Change Password
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left" 
                    onClick={() => navigate('/settings?section=notifications')}
                  >
                    <Bell size={16} className="mr-2" /> Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Coding Stats Dashboard */}
              <Card className="bg-card/40 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <BarChart3 size={18} className="mr-2 text-primary" /> Coding Stats Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-muted-foreground text-sm mb-1">Problems Solved</p>
                      <div className="flex justify-between items-end">
                        <span className="text-2xl font-bold font-mono">187</span>
                        <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                          5 day streak
                        </span>
                      </div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-muted-foreground text-sm mb-1">Success Rate</p>
                      <div className="flex justify-between items-end">
                        <span className="text-2xl font-bold font-mono">75%</span>
                        <PieChart size={20} className="text-accent" />
                      </div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-muted-foreground text-sm mb-1">Favorite Language</p>
                      <div className="flex justify-between items-end">
                        <span className="text-2xl font-bold font-mono">TypeScript</span>
                        <Code size={20} className="text-secondary" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Activity Chart */}
                  <div className="h-64 bg-muted/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">Weekly Activity</p>
                    <ResponsiveContainer width="100%" height="90%">
                      <BarChart data={activityData}>
                        <XAxis 
                          dataKey="name" 
                          stroke="#64748b" 
                          fontSize={12} 
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#64748b" 
                          fontSize={12} 
                          tickLine={false}
                          axisLine={false}
                          width={25}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(30, 30, 46, 0.9)', 
                            border: 'none', 
                            borderRadius: '8px',
                            color: '#e2e8f0' 
                          }}
                        />
                        <Bar 
                          dataKey="problems" 
                          fill="rgba(52, 211, 153, 0.8)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Enrolled Courses */}
              <Card className="bg-card/40 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <BookOpen size={18} className="mr-2 text-primary" /> Enrolled Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {coursesData.map(course => (
                      <div key={course.id} className="flex gap-4 items-center bg-muted/30 p-3 rounded-lg hover:bg-muted/40 transition-colors">
                        <img 
                          src={course.image} 
                          alt={course.name} 
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{course.name}</h4>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary" 
                                    style={{ width: `${course.progress}%` }}
                                  ></div>
                                </div>
                                <span className="ml-2">{course.progress}%</span>
                              </div>
                              <p>Last opened: {course.lastOpened}</p>
                            </div>
                            <Button size="sm" className="shrink-0 h-8 gap-1">
                              Continue <ExternalLink size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={() => navigate('/courses')}
                    >
                      View All Courses
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Bookmarked Content & Achievements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bookmarked Content */}
                <Card className="bg-card/40 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Bookmark size={18} className="mr-2 text-primary" /> Bookmarked
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {bookmarkedData.map(item => (
                        <div key={item.id} className="flex justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer">
                          <div>
                            <h4 className="font-medium text-sm">{item.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-muted/40">
                                {item.difficulty}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {item.type}
                              </span>
                            </div>
                          </div>
                          <ExternalLink size={16} className="text-muted-foreground self-center" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Achievements */}
                <Card className="bg-card/40 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Medal size={18} className="mr-2 text-primary" /> Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {achievementsData.map(achievement => (
                        <div key={achievement.id} className="p-3 bg-muted/30 rounded-lg">
                          <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 flex items-center justify-center bg-primary/20 rounded-full text-xl">
                              {achievement.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">{achievement.name}</h4>
                              <p className="text-xs text-muted-foreground">{achievement.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
