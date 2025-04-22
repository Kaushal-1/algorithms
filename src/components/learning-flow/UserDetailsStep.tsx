
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLearningProfile } from '@/contexts/LearningProfileContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CollegeStudentDetails, WorkingProfessionalDetails } from '@/types/UserProfile';

const collegeStudentSchema = z.object({
  collegeName: z.string().min(2, 'College name is required'),
  course: z.string().min(2, 'Course is required'),
  year: z.string().min(1, 'Year is required'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  dob: z.date({
    required_error: "Please select a date of birth",
  }),
});

const workingProfessionalSchema = z.object({
  company: z.string().min(2, 'Company name is required'),
  designation: z.string().min(2, 'Designation is required'),
  experience: z.string().min(1, 'Experience is required'),
  qualification: z.string().min(2, 'Qualification is required'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  dob: z.date({
    required_error: "Please select a date of birth",
  }),
});

type CollegeFormValues = z.infer<typeof collegeStudentSchema>;
type ProfessionalFormValues = z.infer<typeof workingProfessionalSchema>;

const UserDetailsStep: React.FC = () => {
  const { userProfile, setUserDetails, setCurrentStep } = useLearningProfile();

  const isCollegeStudent = userProfile?.userType === 'college_student';
  
  // Use different default values based on user type
  let defaultValues = {};
  
  if (isCollegeStudent) {
    defaultValues = {
      collegeName: userProfile?.collegeDetails?.collegeName || '',
      course: userProfile?.collegeDetails?.course || '',
      year: userProfile?.collegeDetails?.year || '',
      phoneNumber: userProfile?.collegeDetails?.phoneNumber || '',
      dob: userProfile?.collegeDetails?.dob || undefined,
    };
  } else {
    defaultValues = {
      company: userProfile?.professionalDetails?.company || '',
      designation: userProfile?.professionalDetails?.designation || '',
      experience: userProfile?.professionalDetails?.experience || '',
      qualification: userProfile?.professionalDetails?.qualification || '',
      phoneNumber: userProfile?.professionalDetails?.phoneNumber || '',
      dob: userProfile?.professionalDetails?.dob || undefined,
    };
  }

  const form = useForm({
    resolver: zodResolver(isCollegeStudent ? collegeStudentSchema : workingProfessionalSchema),
    defaultValues,
  });

  const onSubmit = async (values: CollegeFormValues | ProfessionalFormValues) => {
    if (isCollegeStudent) {
      const collegeDetails: CollegeStudentDetails = values as CollegeFormValues;
      setUserDetails(collegeDetails);
    } else {
      const professionalDetails: WorkingProfessionalDetails = values as ProfessionalFormValues;
      setUserDetails(professionalDetails);
    }
    setCurrentStep(3); // Move to topic selection
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Tell us more about yourself</h2>
        <p className="text-muted-foreground">
          This helps us provide a more personalized learning experience
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {isCollegeStudent ? (
            // College Student Form
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
                      <Input placeholder="Current year of study" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            // Working Professional Form
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
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter years of experience" {...field} />
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
                      <Input placeholder="Enter your highest qualification" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Common fields for both types */}
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
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Continue</Button>
        </form>
      </Form>
    </div>
  );
};

export default UserDetailsStep;
