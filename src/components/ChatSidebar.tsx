
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  MessageSquare, 
  Clock, 
  Plus, 
  Search,
  Trash2,
  Edit
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChatSession } from '@/types/ChatSession';

// Mock data for demonstration
const MOCK_SESSIONS: ChatSession[] = [
  {
    id: '1',
    title: 'Learning React Hooks',
    createdAt: new Date('2025-04-11T14:30:00'),
    messages: [],
    domain: 'React',
    experienceLevel: 'Intermediate'
  },
  {
    id: '2',
    title: 'Python Data Structures',
    createdAt: new Date('2025-04-10T09:15:00'),
    messages: [],
    domain: 'Python',
    experienceLevel: 'Beginner'
  },
  {
    id: '3',
    title: 'Algorithms - Sorting',
    createdAt: new Date('2025-04-09T16:45:00'),
    messages: [],
    domain: 'Algorithms',
    experienceLevel: 'Advanced'
  }
];

interface ChatSidebarProps {
  activeSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  activeSessionId,
  onSessionSelect,
  onNewSession
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter sessions based on search term
  const filteredSessions = MOCK_SESSIONS.filter(session => 
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.domain?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="flex flex-col h-full bg-muted/20 border-r border-border w-64">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h2 className="font-medium flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span>Saved Sessions</span>
        </h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onNewSession}
          className="h-7 w-7"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">New Session</span>
        </Button>
      </div>
      
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search sessions..."
            className="pl-9 h-9 bg-muted"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        {filteredSessions.length > 0 ? (
          <div className="space-y-1 px-2">
            {filteredSessions.map((session) => (
              <button
                key={session.id}
                className={`w-full text-left rounded-md p-2.5 text-sm transition-colors relative group ${
                  session.id === activeSessionId 
                    ? 'bg-primary/20 text-primary' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => onSessionSelect(session.id)}
              >
                <div className="font-medium truncate pr-6">{session.title}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{format(session.createdAt, 'MMM d, yyyy')}</span>
                  {session.domain && (
                    <span className="ml-2 bg-muted px-1.5 py-0.5 rounded text-[10px]">
                      {session.domain}
                    </span>
                  )}
                </div>
                <div className="absolute right-2 top-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-4 py-8 text-center text-muted-foreground text-sm">
            No sessions found
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
