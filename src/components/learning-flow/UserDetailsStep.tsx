
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { 
  SchoolStudentDetails, 
  CollegeStudentDetails, 
  WorkingProfessionalDetails, 
  UserType 
} from '@/types/UserProfile';
import { useLearningProfile } from '@/contexts/LearningProfileContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const UserDetailsStep: React.FC = () => {
  const { userProfile, updateUserDetails, setCurrentStep } = useLearningProfile();
  
  // Create different schemas based on user type
  const schoolStudentSchema = z.object({
    standard: z.string().min(1, { message: "Please enter your grade/standard" }),
    schoolName: z.string().min(1, { message: "Please enter your school name" }),
    board: z.string().min(1, { message: "Please enter your school board" }),
  });

  const collegeStudentSchema = z.object({
    degree: z.string().min(1, { message: "Please enter your degree" }),
    domain: z.string().min(1, { message: "Please enter your domain/major" }),
    collegeName: z.string().min(1, { message: "Please enter your college name" }),
  });

  const workingProfessionalSchema = z.object({
    companyName: z.string().min(1, { message: "Please enter your company name" }),
    currentRole: z.string().min(1, { message: "Please enter your current role" }),
    experienceYears: z.string().min(1, { message: "Please enter your years of experience" }),
    domain: z.string().min(1, { message: "Please enter your domain/industry" }),
  });

  // Determine which schema to use based on user type
  const getSchemaForUserType = (userType: UserType) => {
    switch (userType) {
      case 'school_student':
        return schoolStudentSchema;
      case 'college_student':
        return collegeStudentSchema;
      case 'working_professional':
        return workingProfessionalSchema;
      default:
        return z.object({});
    }
  };

  const userType = userProfile?.userType || 'other';
  const formSchema = getSchemaForUserType(userType);

  // Get default values based on user type
  const getDefaultValues = () => {
    switch (userType) {
      case 'school_student':
        return userProfile?.schoolDetails || { standard: '', schoolName: '', board: '' };
      case 'college_student':
        return userProfile?.collegeDetails || { degree: '', domain: '', collegeName: '' };
      case 'working_professional':
        return userProfile?.professionalDetails || { companyName: '', currentRole: '', experienceYears: '', domain: '' };
      default:
        return {};
    }
  };

  // Create form with the appropriate schema
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });

  // Handle form submission
  const onSubmit = (data: any) => {
    switch (userType) {
      case 'school_student':
        updateUserDetails({ schoolDetails: data as SchoolStudentDetails });
        break;
      case 'college_student':
        updateUserDetails({ collegeDetails: data as CollegeStudentDetails });
        break;
      case 'working_professional':
        updateUserDetails({ professionalDetails: data as WorkingProfessionalDetails });
        break;
    }
    
    // Move to the next step (topic selection)
    setCurrentStep(3);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Tell us more about yourself</h2>
        <p className="text-muted-foreground">
          This helps us tailor your learning experience better
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {userType === 'school_student' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="standard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade/Standard</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 10th, 12th" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your school name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="board"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>School Board</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CBSE, ICSE, State Board" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {userType === 'college_student' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., B.Tech, BCA, MSc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain/Major</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Computer Science, Mechanical" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collegeName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>College Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your college name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {userType === 'working_professional' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Software Engineer, Data Scientist" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experienceYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience (years)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2, 5+" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain/Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., IT, Healthcare, Finance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="flex justify-center mt-8">
            <Button type="submit" className="w-full md:w-1/3">Continue</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserDetailsStep;
