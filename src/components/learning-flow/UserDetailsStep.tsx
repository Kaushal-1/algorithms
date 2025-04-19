
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
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

// Define schema interfaces for each user type
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

// Define the types from schemas
type SchoolStudentForm = z.infer<typeof schoolStudentSchema>;
type CollegeStudentForm = z.infer<typeof collegeStudentSchema>;
type WorkingProfessionalForm = z.infer<typeof workingProfessionalSchema>;

const UserDetailsStep: React.FC = () => {
  const { userProfile, updateUserDetails, setCurrentStep } = useLearningProfile();
  const userType = userProfile?.userType || 'other';
  
  // School student form
  const schoolForm = useForm<SchoolStudentForm>({
    resolver: zodResolver(schoolStudentSchema),
    defaultValues: userProfile?.schoolDetails || { 
      standard: '', 
      schoolName: '', 
      board: '' 
    },
  });

  // College student form
  const collegeForm = useForm<CollegeStudentForm>({
    resolver: zodResolver(collegeStudentSchema),
    defaultValues: userProfile?.collegeDetails || { 
      degree: '', 
      domain: '', 
      collegeName: '' 
    },
  });

  // Working professional form
  const professionalForm = useForm<WorkingProfessionalForm>({
    resolver: zodResolver(workingProfessionalSchema),
    defaultValues: userProfile?.professionalDetails || { 
      companyName: '', 
      currentRole: '', 
      experienceYears: '', 
      domain: '' 
    },
  });

  // Handle form submission for school students
  const onSchoolSubmit = (data: SchoolStudentForm) => {
    updateUserDetails({ schoolDetails: data });
    setCurrentStep(3);
  };

  // Handle form submission for college students
  const onCollegeSubmit = (data: CollegeStudentForm) => {
    updateUserDetails({ collegeDetails: data });
    setCurrentStep(3);
  };

  // Handle form submission for working professionals
  const onProfessionalSubmit = (data: WorkingProfessionalForm) => {
    updateUserDetails({ professionalDetails: data });
    setCurrentStep(3);
  };

  if (userType === 'other') {
    setCurrentStep(3);
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Tell us more about yourself</h2>
        <p className="text-muted-foreground">
          This helps us tailor your learning experience better
        </p>
      </div>

      {userType === 'school_student' && (
        <Form {...schoolForm}>
          <form onSubmit={schoolForm.handleSubmit(onSchoolSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={schoolForm.control}
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
            <div className="flex justify-center mt-8">
              <Button type="submit" className="w-full md:w-1/3">Continue</Button>
            </div>
          </form>
        </Form>
      )}

      {userType === 'college_student' && (
        <Form {...collegeForm}>
          <form onSubmit={collegeForm.handleSubmit(onCollegeSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={collegeForm.control}
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
                control={collegeForm.control}
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
                control={collegeForm.control}
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
            <div className="flex justify-center mt-8">
              <Button type="submit" className="w-full md:w-1/3">Continue</Button>
            </div>
          </form>
        </Form>
      )}

      {userType === 'working_professional' && (
        <Form {...professionalForm}>
          <form onSubmit={professionalForm.handleSubmit(onProfessionalSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={professionalForm.control}
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
                control={professionalForm.control}
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
                control={professionalForm.control}
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
                control={professionalForm.control}
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
            <div className="flex justify-center mt-8">
              <Button type="submit" className="w-full md:w-1/3">Continue</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default UserDetailsStep;
