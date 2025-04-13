
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLearningProfile } from '@/contexts/LearningProfileContext';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

// Popular topics list
const popularTopics = [
  "Python Programming",
  "Web Development",
  "Data Structures & Algorithms",
  "Machine Learning",
  "JavaScript",
  "React",
  "UI/UX Design",
  "Mobile App Development",
  "Cloud Computing",
  "Database Management",
  "Cybersecurity",
  "Blockchain"
];

const TopicSelectionStep: React.FC = () => {
  const { userProfile, setTopic, setCurrentStep } = useLearningProfile();
  const [searchTerm, setSearchTerm] = useState(userProfile?.topic || '');
  
  const handleTopicSelection = (topic: string) => {
    setTopic(topic);
    setSearchTerm(topic);
  };

  const handleContinue = () => {
    if (searchTerm.trim()) {
      setTopic(searchTerm);
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  // Filter topics based on search term
  const filteredTopics = popularTopics.filter(topic => 
    topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">What do you want to learn?</h2>
        <p className="text-muted-foreground">
          Select a topic or subject you're interested in
        </p>
      </div>

      <div className="relative">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search topics or enter your own..."
          className="pl-10"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchTerm.trim()) {
              handleContinue();
            }
          }}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      {!searchTerm && (
        <div>
          <h3 className="text-sm font-medium mb-3">Popular Topics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {popularTopics.map((topic, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                onClick={() => handleTopicSelection(topic)}
              >
                <CardContent className="p-3 text-center">
                  <span className="text-sm">{topic}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {searchTerm && filteredTopics.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">Matching Topics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredTopics.map((topic, index) => (
              <Card 
                key={index}
                className={`cursor-pointer hover:border-primary hover:bg-primary/5 transition-all ${
                  searchTerm === topic ? 'border-primary bg-primary/10' : ''
                }`}
                onClick={() => handleTopicSelection(topic)}
              >
                <CardContent className="p-3 text-center">
                  <span className="text-sm">{topic}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        
        <Button onClick={handleContinue} disabled={!searchTerm.trim()}>
          Continue <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TopicSelectionStep;
