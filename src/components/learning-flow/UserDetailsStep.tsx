
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLearningProfile } from '@/contexts/LearningProfileContext';
import { UserType } from '@/types/UserProfile';

const UserDetailsStep: React.FC = () => {
  const { userProfile, setUserDetails, setCurrentStep } = useLearningProfile();
  const [fields, setFields] = useState(() => {
    // Populate initial values if they already exist in the profile
    if (userProfile && userProfile.details) return userProfile.details;
    return {};
  });

  if (!userProfile) return null;

  const onFieldChange = (key: string, val: string) => {
    setFields(prev => ({ ...prev, [key]: val }));
  };

  let fieldsToRender: { label: string; key: string; placeholder: string; type?: string }[] = [];
  if (userProfile.userType === 'school_student') {
    fieldsToRender = [
      { label: 'Standard', key: 'standard', placeholder: '10th Grade (example)' },
      { label: 'School Name', key: 'schoolName', placeholder: 'e.g. Delhi Public School' },
      { label: 'Board', key: 'board', placeholder: 'CBSE / ICSE / State Board' }
    ];
  } else if (userProfile.userType === 'college_student') {
    fieldsToRender = [
      { label: 'Degree', key: 'degree', placeholder: 'B.Tech / B.Sc / etc.' },
      { label: 'Domain', key: 'domain', placeholder: 'Computer Science' },
      { label: 'College Name', key: 'collegeName', placeholder: 'IIT Bombay' }
    ];
  } else if (userProfile.userType === 'working_professional') {
    fieldsToRender = [
      { label: 'Company Name', key: 'companyName', placeholder: 'Google' },
      { label: 'Current Role', key: 'currentRole', placeholder: 'Software Engineer' },
      { label: 'Experience (years)', key: 'experience', placeholder: '3', type: 'number' },
      { label: 'Domain', key: 'domain', placeholder: 'Backend Development' }
    ];
  } else {
    fieldsToRender = []; // For "other", skip details step
  }

  // Only allow proceed if all fields are filled
  const canProceed = fieldsToRender.length === 0 || fieldsToRender.every(field => fields[field.key] && fields[field.key].toString().trim() !== '');

  function handleContinue() {
    setUserDetails(fields);
    setCurrentStep(3); // Next step: Topic selection (old step 2 becomes 3)
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2">
        {userProfile.userType === 'school_student' && 'Tell us about your school'}
        {userProfile.userType === 'college_student' && 'Tell us about your college'}
        {userProfile.userType === 'working_professional' && 'Tell us about your profession'}
      </h2>
      <form
        className="space-y-4"
        onSubmit={e => {
          e.preventDefault();
          handleContinue();
        }}
      >
        {fieldsToRender.map(field => (
          <div className="flex flex-col gap-1" key={field.key}>
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              type={field.type || 'text'}
              placeholder={field.placeholder}
              value={fields[field.key] || ''}
              onChange={e => onFieldChange(field.key, e.target.value)}
              required
            />
          </div>
        ))}
        <Button type="submit" className="w-full mt-2" disabled={!canProceed}>Continue</Button>
      </form>
    </div>
  );
};

export default UserDetailsStep;
