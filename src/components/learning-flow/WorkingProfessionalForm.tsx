import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLearningProfile } from '@/contexts/LearningProfileContext';
import { WorkingProfessionalDetails } from '@/types/UserProfile';

const WorkingProfessionalForm: React.FC = () => {
  const { setUserTypeDetails, setCurrentStep } = useLearningProfile();
  const [details, setDetails] = useState<WorkingProfessionalDetails>({
    companyName: '',
    role: '',
    experience: '',
    domain: ''
  });
  
  const handleSubmit = () => {
    setUserTypeDetails(details);
    setCurrentStep(3); // Move to experience level step
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Professional Details</h2>
        <p className="text-muted-foreground">
          Tell us more about your work experience
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input 
              id="company-name"
              value={details.companyName}
              onChange={(e) => setDetails({...details, companyName: e.target.value})}
              placeholder="Enter your company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Current Role</Label>
            <Input 
              id="role"
              value={details.role}
              onChange={(e) => setDetails({...details, role: e.target.value})}
              placeholder="Enter your current role"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Select 
              onValueChange={(value) => setDetails({...details, experience: value})}
              value={details.experience}
            >
              <SelectTrigger id="experience">
                <SelectValue placeholder="Select years of experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1">Less than 1 year</SelectItem>
                <SelectItem value="1-3">1-3 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="5-10">5-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain/Industry</Label>
            <Select 
              onValueChange={(value) => setDetails({...details, domain: value})}
              value={details.domain}
            >
              <SelectTrigger id="domain">
                <SelectValue placeholder="Select your domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tech">Technology</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full mt-6"
            onClick={handleSubmit}
            disabled={!details.companyName || !details.role || !details.experience || !details.domain}
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default WorkingProfessionalForm;
