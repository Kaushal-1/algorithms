
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  avatar?: string;
  specialty: string;
  isOnline: boolean;
}

const mentors: Mentor[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://source.unsplash.com/random/400x400/?portrait,man,1',
    specialty: 'DSA Expert',
    isOnline: true
  },
  {
    id: '2',
    name: 'Maria Chen',
    avatar: 'https://source.unsplash.com/random/400x400/?portrait,woman,1',
    specialty: 'ML Specialist',
    isOnline: true
  },
  {
    id: '3',
    name: 'Rahul Patel',
    avatar: 'https://source.unsplash.com/random/400x400/?portrait,man,2',
    specialty: 'Web Developer',
    isOnline: false
  },
  {
    id: '4',
    name: 'Sophia Williams',
    avatar: 'https://source.unsplash.com/random/400x400/?portrait,woman,2',
    specialty: 'System Design',
    isOnline: true
  },
  {
    id: '5',
    name: 'Marcus Lee',
    avatar: 'https://source.unsplash.com/random/400x400/?portrait,man,3',
    specialty: 'Backend Engineer',
    isOnline: false
  }
];

const MentorsList: React.FC = () => {
  return (
    <div className="py-4 px-2">
      <h3 className="text-sm font-semibold mb-4 text-foreground/80">Mentors Online</h3>
      <div className="space-y-3">
        {mentors.map((mentor) => (
          <div key={mentor.id} className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-8 w-8 border border-primary/20">
                <AvatarImage src={mentor.avatar} />
                <AvatarFallback><User size={16} /></AvatarFallback>
              </Avatar>
              {mentor.isOnline && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-background"></span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/90">{mentor.name}</p>
              <p className="text-xs text-muted-foreground">{mentor.specialty}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorsList;
