
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, Star } from 'lucide-react';
import CourseBadge from './CourseBadge';

export interface CourseData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  topics: string[];
  difficulty: string;
  duration: string;
  type: string;
  rating: number;
  enrolled: boolean;
}

interface CourseCardProps {
  course: CourseData;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  // Generate a fallback image URL based on the course topic if the thumbnail is missing or invalid
  const fallbackImage = `https://source.unsplash.com/random/800x600/?${course.topics[0]?.toLowerCase() || 'coding'}`;
  
  return (
    <Card className="bg-card/60 backdrop-blur-md border-border/50 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 group">
      <div className="relative overflow-hidden h-40">
        <img 
          src={course.thumbnail || fallbackImage} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loop
            target.src = fallbackImage;
          }}
        />
        <div className="absolute top-3 right-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-black/30 backdrop-blur-sm text-white rounded-full h-8 w-8 hover:bg-primary/60"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold line-clamp-1">{course.title}</CardTitle>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-semibold">{course.rating.toFixed(1)}</span>
          </div>
        </div>
        <CardDescription className="line-clamp-2 text-muted-foreground/80">
          {course.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2">
          {course.topics.slice(0, 2).map((topic, index) => (
            <CourseBadge key={`${topic}-${index}`} label={topic} type="topic" />
          ))}
          <CourseBadge label={course.difficulty} type="difficulty" />
          <CourseBadge label={course.duration} type="duration" />
        </div>
      </CardContent>
      
      <CardFooter className="pb-4">
        <Button className="w-full bg-primary/90 hover:bg-primary text-primary-foreground group-hover:shadow-lg transition-all">
          {course.enrolled ? 'Continue Learning' : 'Start Now'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
