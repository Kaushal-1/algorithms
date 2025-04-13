
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserType } from '@/types/UserProfile';
import { useLearningProfile } from '@/contexts/LearningProfileContext';
import { School, GraduationCap, Briefcase, Users } from 'lucide-react';

const UserTypeStep: React.FC = () => {
  const { userProfile, setUserType, setCurrentStep } = useLearningProfile();
  const [customType, setCustomType] = useState(userProfile?.customUserType || '');
  
  const handleTypeSelection = (type: UserType) => {
    if (type === 'other') {
      setUserType(type, customType);
    } else {
      setUserType(type);
    }
    setCurrentStep(2);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Tell us about yourself</h2>
        <p className="text-muted-foreground">
          This helps us personalize your learning experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className={`cursor-pointer border-2 hover:border-primary hover:bg-primary/5 transition-all ${
            userProfile?.userType === 'school_student' ? 'border-primary bg-primary/10' : ''
          }`}
          onClick={() => handleTypeSelection('school_student')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6">
            <School className="h-12 w-12 mb-4 text-primary" />
            <h3 className="font-medium text-lg">School Student</h3>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer border-2 hover:border-primary hover:bg-primary/5 transition-all ${
            userProfile?.userType === 'college_student' ? 'border-primary bg-primary/10' : ''
          }`}
          onClick={() => handleTypeSelection('college_student')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6">
            <GraduationCap className="h-12 w-12 mb-4 text-primary" />
            <h3 className="font-medium text-lg">College Student</h3>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer border-2 hover:border-primary hover:bg-primary/5 transition-all ${
            userProfile?.userType === 'working_professional' ? 'border-primary bg-primary/10' : ''
          }`}
          onClick={() => handleTypeSelection('working_professional')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Briefcase className="h-12 w-12 mb-4 text-primary" />
            <h3 className="font-medium text-lg">Working Professional</h3>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer border-2 hover:border-primary hover:bg-primary/5 transition-all ${
            userProfile?.userType === 'other' ? 'border-primary bg-primary/10' : ''
          }`}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-4">
              <Users className="h-12 w-12 mb-2 text-primary" />
              <h3 className="font-medium text-lg">Other</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-type">Please specify:</Label>
              <Input 
                id="custom-type"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="e.g., Self-learner"
                className="w-full"
              />
            </div>
            
            <Button 
              className="w-full mt-4"
              onClick={() => handleTypeSelection('other')}
              disabled={userProfile?.userType === 'other' && !customType.trim()}
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserTypeStep;
