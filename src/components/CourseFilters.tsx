
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen, Clock, BarChart, ArrowDownAZ } from 'lucide-react';

interface CourseFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  topicFilter: string;
  setTopicFilter: (topic: string) => void;
  difficultyFilter: string;
  setDifficultyFilter: (difficulty: string) => void;
  durationFilter: string;
  setDurationFilter: (duration: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  topicFilter,
  setTopicFilter,
  difficultyFilter,
  setDifficultyFilter,
  durationFilter,
  setDurationFilter,
  typeFilter,
  setTypeFilter,
  sortOrder,
  setSortOrder
}) => {
  return (
    <div className="w-full sticky top-20 z-30 pt-4 pb-6 bg-algos-dark/90 backdrop-blur-sm border-b border-border/50">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="w-full md:w-1/3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by course name, topic, or tag..."
            className="pl-10 bg-card/40 border-border/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-3 md:flex-1 justify-end">
          <Select value={topicFilter} onValueChange={setTopicFilter}>
            <SelectTrigger className="w-[130px] bg-card/40 border-border/50">
              <BookOpen className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              <SelectItem value="ai">AI & ML</SelectItem>
              <SelectItem value="webdev">Web Dev</SelectItem>
              <SelectItem value="dsa">DSA</SelectItem>
              <SelectItem value="database">Databases</SelectItem>
              <SelectItem value="os">OS</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[130px] bg-card/40 border-border/50">
              <BarChart className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={durationFilter} onValueChange={setDurationFilter}>
            <SelectTrigger className="w-[130px] bg-card/40 border-border/50">
              <Clock className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Duration</SelectItem>
              <SelectItem value="short">Short (<5h)</SelectItem>
              <SelectItem value="medium">Medium (5-15h)</SelectItem>
              <SelectItem value="long">Long (>15h)</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[130px] bg-card/40 border-border/50">
              <ArrowDownAZ className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="alphabetical">A-Z</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CourseFilters;
