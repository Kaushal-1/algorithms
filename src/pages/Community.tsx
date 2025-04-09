
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, SortDesc, MessageSquare, Users } from 'lucide-react';
import ChannelList from '@/components/ChannelList';
import PostThread, { PostData } from '@/components/PostThread';
import NewPostForm from '@/components/NewPostForm';
import MentorsList from '@/components/MentorsList';
import { useMediaQuery } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

// Mock data for posts
const MOCK_POSTS: Record<string, PostData[]> = {
  'dsa': [
    {
      id: '1',
      author: {
        id: 'user1',
        name: 'Janice Zhang',
        avatar: 'https://source.unsplash.com/random/400x400/?portrait,woman,3',
        isMentor: false
      },
      content: 'I\'m struggling with implementing Dijkstra\'s algorithm efficiently. My solution works but times out on large inputs. Any advice on optimizing it?\n\nHere\'s my current approach:\n1. Using a priority queue\n2. Processing each vertex once\n3. Still getting O(V^2) performance',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      likes: 12,
      comments: [
        {
          id: 'comment1',
          author: {
            id: 'user2',
            name: 'Alex Johnson',
            avatar: 'https://source.unsplash.com/random/400x400/?portrait,man,1',
            isMentor: true
          },
          content: 'Try using a Fibonacci heap for the priority queue instead of a binary heap. It gives better theoretical performance for Dijkstra\'s algorithm.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
          likes: 5
        },
        {
          id: 'comment2',
          author: {
            id: 'user3',
            name: 'Michael Torres',
            avatar: 'https://source.unsplash.com/random/400x400/?portrait,man,4',
            isMentor: false
          },
          content: 'Also make sure you\'re not re-adding vertices to the PQ. Once a vertex is processed, it should never enter the queue again.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          likes: 3
        }
      ]
    },
    {
      id: '2',
      author: {
        id: 'user4',
        name: 'Thomas Chen',
        avatar: 'https://source.unsplash.com/random/400x400/?portrait,man,5',
        isMentor: false
      },
      content: 'What\'s the best way to study dynamic programming? I understand the concept but struggle with applying it to new problems I haven\'t seen before.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      likes: 24,
      comments: [
        {
          id: 'comment3',
          author: {
            id: 'user5',
            name: 'Sophia Williams',
            avatar: 'https://source.unsplash.com/random/400x400/?portrait,woman,2',
            isMentor: true
          },
          content: 'Practice with categorized problems! Start with simple examples (like fibonacci) and work your way up to more complex ones. Draw out the subproblem structure for each problem.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          likes: 15
        }
      ]
    }
  ],
  'interview': [
    {
      id: '3',
      author: {
        id: 'user6',
        name: 'David Wilson',
        avatar: 'https://source.unsplash.com/random/400x400/?portrait,man,6',
        isMentor: false
      },
      content: 'I have a technical interview at Google next week. Any last-minute preparation tips from those who\'ve been through the process?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      likes: 32,
      comments: [
        {
          id: 'comment4',
          author: {
            id: 'user2',
            name: 'Alex Johnson',
            avatar: 'https://source.unsplash.com/random/400x400/?portrait,man,1',
            isMentor: true
          },
          content: 'Focus on communicating your thought process clearly. Practice solving problems by talking through them out loud. Also, make sure you\'re comfortable with system design concepts.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10), // 10 hours ago
          likes: 18
        }
      ]
    }
  ],
  'ai-ml': [
    {
      id: '4',
      author: {
        id: 'user7',
        name: 'Maria Chen',
        avatar: 'https://source.unsplash.com/random/400x400/?portrait,woman,1',
        isMentor: true
      },
      content: 'I just published a tutorial on implementing a basic neural network from scratch with Python. Check it out and let me know what you think!\n\nhttps://example.com/neural-network-tutorial',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      likes: 45,
      comments: [
        {
          id: 'comment5',
          author: {
            id: 'user8',
            name: 'James Peterson',
            avatar: 'https://source.unsplash.com/random/400x400/?portrait,man,7',
            isMentor: false
          },
          content: 'This is amazing! I especially liked the way you explained backpropagation. Much clearer than other tutorials I\'ve seen.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7), // 7 hours ago
          likes: 8
        }
      ]
    }
  ]
};

// Default channels with some content
const CHANNELS_WITH_CONTENT = ['dsa', 'interview', 'ai-ml'];

const Community: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState('dsa');
  const [posts, setPosts] = useState<Record<string, PostData[]>>(MOCK_POSTS);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const handleNewPost = (content: string) => {
    const newPost: PostData = {
      id: `new-${Date.now()}`,
      author: {
        id: 'current-user',
        name: 'You',
        avatar: undefined,
        isMentor: false
      },
      content,
      timestamp: new Date(),
      likes: 0,
      comments: []
    };
    
    setPosts(prev => {
      const channelPosts = prev[selectedChannel] || [];
      return {
        ...prev,
        [selectedChannel]: [newPost, ...channelPosts]
      };
    });
  };
  
  const getCurrentChannelPosts = () => {
    return posts[selectedChannel] || [];
  };
  
  const renderContent = () => {
    const currentPosts = getCurrentChannelPosts();
    
    if (currentPosts.length === 0 && !CHANNELS_WITH_CONTENT.includes(selectedChannel)) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <MessageSquare className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-medium mb-2">No posts yet</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Be the first to start a conversation in this channel!
          </p>
        </div>
      );
    }
    
    return (
      <>
        {currentPosts.map(post => (
          <PostThread key={post.id} post={post} />
        ))}
      </>
    );
  };
  
  const renderChannelList = () => {
    if (isMobile) {
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="md:hidden ml-1">
              <Users size={18} />
              <span className="ml-2">Channels</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]">
            <ChannelList selectedChannel={selectedChannel} onSelectChannel={setSelectedChannel} />
          </SheetContent>
        </Sheet>
      );
    }
    
    return (
      <div className="hidden md:block w-[240px] bg-card/40 backdrop-blur-sm border-r border-border/50 h-full overflow-hidden">
        <ChannelList selectedChannel={selectedChannel} onSelectChannel={setSelectedChannel} />
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-algos-dark">
      <Navbar />
      
      <div className="relative pt-24 px-0 h-[calc(100vh-4rem)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary/20 to-transparent rounded-full blur-[120px] opacity-30 z-0"></div>
        
        <div className="flex h-full relative z-10">
          {renderChannelList()}
          
          <div className="flex-1 overflow-hidden flex flex-col w-full">
            <div className="px-4 py-3 border-b border-border/50 bg-card/40 backdrop-blur-sm flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{selectedChannel.charAt(0).toUpperCase() + selectedChannel.slice(1).replace('-', '/')} Discussions</h2>
                <p className="text-sm text-muted-foreground">
                  {getCurrentChannelPosts().length} {getCurrentChannelPosts().length === 1 ? 'post' : 'posts'}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="relative w-[180px]">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    className="pl-8 h-9 bg-background/50 border-border/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Button variant="outline" size="sm" className="h-9">
                  <Filter size={14} className="mr-1" />
                  Filter
                </Button>
                
                <Button variant="outline" size="sm" className="h-9">
                  <SortDesc size={14} className="mr-1" />
                  Sort
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto px-4 md:px-8 py-6">
              {renderContent()}
            </div>
            
            <NewPostForm onSubmit={handleNewPost} channelId={selectedChannel} />
          </div>
          
          <div className="hidden lg:block w-[220px] bg-card/40 backdrop-blur-sm border-l border-border/50 overflow-auto">
            <MentorsList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
