
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useLearningProfile } from '@/contexts/LearningProfileContext';
import { CollegeStudentDetails, WorkingProfessionalDetails } from '@/types/UserProfile';

const collegeStudentSchema = z.object({
  collegeName: z.string().min(2, 'College name is required'),
  course: z.string().min(2, 'Course name is required'),
  year: z.string().min(1, 'Year is required'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  dob: z.string().min(1, 'Date of birth is required'),
});

const workingProfessionalSchema = z.object({
  company: z.string().min(2, 'Company name is required'),
  designation: z.string().min(2, 'Designation is required'),
  experience: z.string().min(1, 'Experience is required'),
  qualification: z.string().min(2, 'Qualification is required'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  dob: z.string().min(1, 'Date of birth is required'),
});

type CollegeStudentFormValues = z.infer<typeof collegeStudentSchema>;
type WorkingProfessionalFormValues = z.infer<typeof workingProfessionalSchema>;

const UserDetailsStep: React.FC = () => {
  const { userProfile, setCurrentStep } = useLearningProfile();
  
  const isCollegeStudent = userProfile?.userType === 'college_student';
  
  const form = useForm<CollegeStudentFormValues | WorkingProfessionalFormValues>({
    resolver: zodResolver(isCollegeStudent ? collegeStudentSchema : workingProfessionalSchema),
    defaultValues: isCollegeStudent
      ? userProfile?.collegeDetails || {
          collegeName: '',
          course: '',
          year: '',
          phoneNumber: '',
          dob: '',
        }
      : userProfile?.professionalDetails || {
          company: '',
          designation: '',
          experience: '',
          qualification: '',
          phoneNumber: '',
          dob: '',
        },
  });

  const onSubmit = async (data: CollegeStudentFormValues | WorkingProfessionalFormValues) => {
    setCurrentStep(2); // Move to topic selection after details are collected
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Additional Details</h2>
        <p className="text-muted-foreground">
          Please provide some additional information to personalize your learning experience
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {isCollegeStudent ? (
            <>
              <FormField
                control={form.control}
                name="collegeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your college name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your course" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input placeholder="Current year" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your designation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience (in years)</FormLabel>
                    <FormControl>
                      <Input placeholder="Years of experience" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualification</FormLabel>
                    <FormControl>
                      <Input placeholder="Your highest qualification" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button type="submit" className="w-full">Continue</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserDetailsStep;
