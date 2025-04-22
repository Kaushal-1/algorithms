
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

type SchoolFormValues = z.infer<typeof schoolStudentSchema>;
type CollegeFormValues = z.infer<typeof collegeStudentSchema>;
type ProfessionalFormValues = z.infer<typeof workingProfessionalSchema>;

const UserDetailsStep: React.FC = () => {
  const { userProfile, setCurrentStep, updateUserProfile } = useLearningProfile();
  
  const getSchoolFormDefaults = () => {
    return userProfile?.schoolDetails || {
      schoolName: '',
      standard: '',
      board: '',
      phoneNumber: '',
      dob: '',
    };
  };
  
  const getCollegeFormDefaults = () => {
    return userProfile?.collegeDetails || {
      collegeName: '',
      course: '',
      year: '',
      phoneNumber: '',
      dob: '',
    };
  };
  
  const getProfessionalFormDefaults = () => {
    return userProfile?.professionalDetails || {
      company: '',
      designation: '',
      experience: '',
      qualification: '',
      phoneNumber: '',
      dob: '',
    };
  };
  
  const schoolForm = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolStudentSchema),
    defaultValues: getSchoolFormDefaults(),
  });
  
  const collegeForm = useForm<CollegeFormValues>({
    resolver: zodResolver(collegeStudentSchema),
    defaultValues: getCollegeFormDefaults(),
  });
  
  const professionalForm = useForm<ProfessionalFormValues>({
    resolver: zodResolver(workingProfessionalSchema),
    defaultValues: getProfessionalFormDefaults(),
  });

  const onSchoolSubmit = (data: SchoolFormValues) => {
    if (!userProfile) return;
    const updatedProfile = { ...userProfile };
    updatedProfile.schoolDetails = data;
    updateUserProfile(updatedProfile);
    setCurrentStep(3);
  };
  
  const onCollegeSubmit = (data: CollegeFormValues) => {
    if (!userProfile) return;
    const updatedProfile = { ...userProfile };
    updatedProfile.collegeDetails = data;
    updateUserProfile(updatedProfile);
    setCurrentStep(3);
  };
  
  const onProfessionalSubmit = (data: ProfessionalFormValues) => {
    if (!userProfile) return;
    const updatedProfile = { ...userProfile };
    updatedProfile.professionalDetails = data;
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

      {userProfile?.userType === 'school_student' && (
        <Form {...schoolForm}>
          <form onSubmit={schoolForm.handleSubmit(onSchoolSubmit)} className="space-y-4">
            <FormField
              control={schoolForm.control}
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
              control={schoolForm.control}
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
              control={schoolForm.control}
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
            <FormField
              control={schoolForm.control}
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
              control={schoolForm.control}
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
      )}

      {userProfile?.userType === 'college_student' && (
        <Form {...collegeForm}>
          <form onSubmit={collegeForm.handleSubmit(onCollegeSubmit)} className="space-y-4">
            <FormField
              control={collegeForm.control}
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
              control={collegeForm.control}
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
              control={collegeForm.control}
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
            <FormField
              control={collegeForm.control}
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
              control={collegeForm.control}
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
      )}

      {userProfile?.userType === 'working_professional' && (
        <Form {...professionalForm}>
          <form onSubmit={professionalForm.handleSubmit(onProfessionalSubmit)} className="space-y-4">
            <FormField
              control={professionalForm.control}
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
              control={professionalForm.control}
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
              control={professionalForm.control}
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
              control={professionalForm.control}
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
            <FormField
              control={professionalForm.control}
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
              control={professionalForm.control}
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
      )}
    </div>
  );
};

export default UserDetailsStep;
