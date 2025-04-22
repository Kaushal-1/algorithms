
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLearningProfile } from '@/contexts/LearningProfileContext';

const schoolStudentSchema = z.object({
  schoolName: z.string().min(2, 'School name is required'),
  standard: z.string().min(1, 'Standard is required'),
  board: z.string().min(2, 'Board name is required'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  dob: z.string().min(1, 'Date of birth is required'),
});

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

const UserDetailsStep: React.FC = () => {
  const { userProfile, setCurrentStep, updateUserProfile } = useLearningProfile();
  
  const getFormSchema = () => {
    switch (userProfile?.userType) {
      case 'school_student':
        return schoolStudentSchema;
      case 'college_student':
        return collegeStudentSchema;
      case 'working_professional':
        return workingProfessionalSchema;
      default:
        return schoolStudentSchema;
    }
  };
  
  const form = useForm({
    resolver: zodResolver(getFormSchema()),
    defaultValues: userProfile?.userType === 'school_student'
      ? userProfile?.schoolDetails || {
          schoolName: '',
          standard: '',
          board: '',
          phoneNumber: '',
          dob: '',
        }
      : userProfile?.userType === 'college_student'
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

  const onSubmit = async (data: any) => {
    const updatedProfile = { ...userProfile };
    
    switch (userProfile?.userType) {
      case 'school_student':
        updatedProfile.schoolDetails = data;
        break;
      case 'college_student':
        updatedProfile.collegeDetails = data;
        break;
      case 'working_professional':
        updatedProfile.professionalDetails = data;
        break;
    }
    
    updateUserProfile(updatedProfile);
    setCurrentStep(3);
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
          {userProfile?.userType === 'school_student' && (
            <>
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
                name="standard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Standard</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your standard" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((std) => (
                          <SelectItem key={std} value={std.toString()}>
                            {std}th Standard
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="board"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Board</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your board" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CBSE">CBSE</SelectItem>
                        <SelectItem value="ICSE">ICSE</SelectItem>
                        <SelectItem value="State">State Board</SelectItem>
                        <SelectItem value="IB">IB</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {userProfile?.userType === 'college_student' && (
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">First Year</SelectItem>
                        <SelectItem value="2">Second Year</SelectItem>
                        <SelectItem value="3">Third Year</SelectItem>
                        <SelectItem value="4">Fourth Year</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {userProfile?.userType === 'working_professional' && (
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
                      <Input placeholder="Years of experience" type="number" min="0" {...field} />
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
                  <Input placeholder="Enter your phone number" type="tel" {...field} />
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
