import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLearningProfile } from '@/contexts/LearningProfileContext';
import { CollegeStudentDetails } from '@/types/UserProfile';

const CollegeStudentForm: React.FC = () => {
  const { setUserTypeDetails, setCurrentStep } = useLearningProfile();
  const [details, setDetails] = useState<CollegeStudentDetails>({
    degree: '',
    domain: '',
    collegeName: '',
    year: ''
  });
  
  const handleSubmit = () => {
    setUserTypeDetails(details);
    setCurrentStep(3); // Move to experience level step
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">College Student Details</h2>
        <p className="text-muted-foreground">
          Tell us more about your college education
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="degree">Degree</Label>
            <Select 
              onValueChange={(value) => setDetails({...details, degree: value})}
              value={details.degree}
            >
              <SelectTrigger id="degree">
                <SelectValue placeholder="Select your degree" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bachelor">Bachelor's</SelectItem>
                <SelectItem value="master">Master's</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
                <SelectItem value="diploma">Diploma</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain/Field</Label>
            <Select 
              onValueChange={(value) => setDetails({...details, domain: value})}
              value={details.domain}
            >
              <SelectTrigger id="domain">
                <SelectValue placeholder="Select your domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cs">Computer Science</SelectItem>
                <SelectItem value="it">Information Technology</SelectItem>
                <SelectItem value="electrical">Electrical Engineering</SelectItem>
                <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                <SelectItem value="civil">Civil Engineering</SelectItem>
                <SelectItem value="business">Business/Management</SelectItem>
                <SelectItem value="science">Natural Sciences</SelectItem>
                <SelectItem value="arts">Arts & Humanities</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="college-name">College/University Name</Label>
            <Input 
              id="college-name"
              value={details.collegeName}
              onChange={(e) => setDetails({...details, collegeName: e.target.value})}
              placeholder="Enter your college name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year of Study</Label>
            <Select 
              onValueChange={(value) => setDetails({...details, year: value})}
              value={details.year}
            >
              <SelectTrigger id="year">
                <SelectValue placeholder="Select your year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
                <SelectItem value="5+">5+ Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full mt-6"
            onClick={handleSubmit}
            disabled={!details.degree || !details.domain || !details.collegeName || !details.year}
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CollegeStudentForm;
