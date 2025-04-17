import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLearningProfile } from '@/contexts/LearningProfileContext';
import { SchoolStudentDetails } from '@/types/UserProfile';

const SchoolStudentForm: React.FC = () => {
  const { setUserTypeDetails, setCurrentStep } = useLearningProfile();
  const [details, setDetails] = useState<SchoolStudentDetails>({
    standard: '',
    schoolName: '',
    board: ''
  });
  
  const handleSubmit = () => {
    setUserTypeDetails(details);
    setCurrentStep(3); // Move to experience level step
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">School Student Details</h2>
        <p className="text-muted-foreground">
          Tell us more about your educational background
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="standard">Standard/Grade</Label>
            <Select 
              onValueChange={(value) => setDetails({...details, standard: value})}
              value={details.standard}
            >
              <SelectTrigger id="standard">
                <SelectValue placeholder="Select your standard" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(12)].map((_, i) => (
                  <SelectItem key={i+1} value={(i+1).toString()}>
                    {i+1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="school-name">School Name</Label>
            <Input 
              id="school-name"
              value={details.schoolName}
              onChange={(e) => setDetails({...details, schoolName: e.target.value})}
              placeholder="Enter your school name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="board">Board</Label>
            <Select 
              onValueChange={(value) => setDetails({...details, board: value})}
              value={details.board}
            >
              <SelectTrigger id="board">
                <SelectValue placeholder="Select your board" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cbse">CBSE</SelectItem>
                <SelectItem value="icse">ICSE</SelectItem>
                <SelectItem value="state">State Board</SelectItem>
                <SelectItem value="igcse">IGCSE</SelectItem>
                <SelectItem value="ib">IB</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full mt-6"
            onClick={handleSubmit}
            disabled={!details.standard || !details.schoolName || !details.board}
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SchoolStudentForm;
