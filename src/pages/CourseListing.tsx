
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import CourseCard, { CourseData } from '@/components/CourseCard';
import CourseFilters from '@/components/CourseFilters';
import { Button } from '@/components/ui/button';

// Mock data for demonstration
const MOCK_COURSES: CourseData[] = [
  {
    id: '1',
    title: 'Machine Learning Fundamentals',
    description: 'Learn the core concepts of machine learning from scratch. Perfect for beginners wanting to enter the AI field.',
    thumbnail: 'https://source.unsplash.com/random/800x600/?ai',
    topics: ['AI', 'Machine Learning'],
    difficulty: 'Beginner',
    duration: 'Medium (8h)',
    type: 'Video',
    rating: 4.8,
    enrolled: false
  },
  {
    id: '2',
    title: 'Advanced Data Structures & Algorithms',
    description: 'Master complex data structures and advanced algorithms used in tech interviews and real-world applications.',
    thumbnail: 'https://source.unsplash.com/random/800x600/?coding',
    topics: ['DSA', 'Algorithms'],
    difficulty: 'Advanced',
    duration: 'Long (20h)',
    type: 'Interactive',
    rating: 4.9,
    enrolled: true
  },
  {
    id: '3',
    title: 'Full-Stack Web Development with React & Node',
    description: 'Build scalable web applications with React on the frontend and Node.js on the backend.',
    thumbnail: 'https://source.unsplash.com/random/800x600/?webdev',
    topics: ['Web Dev', 'React'],
    difficulty: 'Intermediate',
    duration: 'Long (25h)',
    type: 'Project-Based',
    rating: 4.7,
    enrolled: false
  },
  {
    id: '4',
    title: 'Database Design & SQL Mastery',
    description: 'Learn how to design efficient databases, optimize queries, and master SQL for data management.',
    thumbnail: 'https://source.unsplash.com/random/800x600/?database',
    topics: ['Database', 'SQL'],
    difficulty: 'Intermediate',
    duration: 'Medium (12h)',
    type: 'Video',
    rating: 4.5,
    enrolled: false
  },
  {
    id: '5',
    title: 'Blockchain Development & Smart Contracts',
    description: 'Dive into blockchain technology and learn to build decentralized applications with smart contracts.',
    thumbnail: 'https://source.unsplash.com/random/800x600/?blockchain',
    topics: ['Blockchain', 'Web3'],
    difficulty: 'Advanced',
    duration: 'Medium (15h)',
    type: 'Interactive',
    rating: 4.6,
    enrolled: false
  },
  {
    id: '6',
    title: 'Python for Data Science',
    description: 'Master Python libraries for data analysis, manipulation, and visualization for data science applications.',
    thumbnail: 'https://source.unsplash.com/random/800x600/?python',
    topics: ['Python', 'Data Science'],
    difficulty: 'Beginner',
    duration: 'Medium (10h)',
    type: 'Project-Based',
    rating: 4.7,
    enrolled: true
  },
  {
    id: '7',
    title: 'Operating Systems Architecture',
    description: 'Understand the core concepts of operating systems, process management, memory allocation, and more.',
    thumbnail: 'https://source.unsplash.com/random/800x600/?computer',
    topics: ['OS', 'Systems'],
    difficulty: 'Advanced',
    duration: 'Long (18h)',
    type: 'Video',
    rating: 4.4,
    enrolled: false
  },
  {
    id: '8',
    title: 'Mobile App Development with Flutter',
    description: 'Build cross-platform mobile applications for iOS and Android using the Flutter framework.',
    thumbnail: 'https://source.unsplash.com/random/800x600/?mobile',
    topics: ['Mobile', 'Flutter'],
    difficulty: 'Intermediate',
    duration: 'Long (22h)',
    type: 'Project-Based',
    rating: 4.8,
    enrolled: false
  },
];

const CourseListing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  // Filter courses based on search term and filters
  const filteredCourses = MOCK_COURSES.filter(course => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Topic filter
    const matchesTopic = topicFilter === 'all' || 
      course.topics.some(topic => topic.toLowerCase().includes(topicFilter.toLowerCase()));
    
    // Difficulty filter
    const matchesDifficulty = difficultyFilter === 'all' || 
      course.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    
    // Duration filter
    const matchesDuration = durationFilter === 'all' || 
      course.duration.toLowerCase().includes(durationFilter.toLowerCase());
    
    return matchesSearch && matchesTopic && matchesDifficulty && matchesDuration;
  });

  // Sort filtered courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortOrder) {
      case 'popular':
        return b.rating - a.rating;
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'rating':
        return b.rating - a.rating;
      default: // newest
        return parseInt(b.id) - parseInt(a.id);
    }
  });

  // Pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = sortedCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-algos-dark">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto relative z-10 py-16 md:py-20">
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading text-center mb-4">
            Explore Courses, Build Skills, Level Up
          </h1>
          <p className="text-lg text-foreground/80 text-center max-w-2xl mx-auto mb-8">
            Browse curated tech and CS content from trusted sources
          </p>
          
          {/* Background Gradient Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary/20 to-transparent rounded-full blur-[120px] opacity-30 z-0"></div>
          <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[80px] opacity-20 z-0"></div>
          <div className="absolute top-20 right-1/4 w-[250px] h-[250px] bg-purple-500/20 rounded-full blur-[80px] opacity-20 z-0"></div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Filters Section */}
          <CourseFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            topicFilter={topicFilter}
            setTopicFilter={setTopicFilter}
            difficultyFilter={difficultyFilter}
            setDifficultyFilter={setDifficultyFilter}
            durationFilter={durationFilter}
            setDurationFilter={setDurationFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          
          {/* Courses Grid */}
          {currentCourses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {currentCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="bg-card/40 border-border/50"
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <Button
                        key={index}
                        variant={currentPage === index + 1 ? "default" : "outline"}
                        onClick={() => handlePageChange(index + 1)}
                        className={currentPage === index + 1 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-card/40 border-border/50"
                        }
                      >
                        {index + 1}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="bg-card/40 border-border/50"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium mb-2">No courses found</h3>
              <p className="text-muted-foreground max-w-md">
                We couldn't find any courses matching your current filters. Try adjusting your search criteria or explore other topics.
              </p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => {
                  setSearchTerm('');
                  setTopicFilter('all');
                  setDifficultyFilter('all');
                  setDurationFilter('all');
                  setTypeFilter('all');
                  setSortOrder('newest');
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseListing;
