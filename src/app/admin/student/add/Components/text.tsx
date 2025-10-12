// src/app/admin/student/add/Components/AddStudentForm.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { addStudent, searchParents, getClasses, addParent } from '@/utils/api';

// Define the payload type for addStudent
interface AddStudentPayload {
  firstName: string;
  lastName: string;
  gender?: 'male' | 'female';
  class: string;
  parent: string;
  language?: string;
  dateOfBirth?: string;
  address?: string;
  aboutMe?: string;
  hobbies: string[];
  enrolmentDate?: string;
  school?: string;
  photo?: string;
}

// Define the response type for addStudent (already provided in index.d.ts)
interface StudentResponse {
  data: ISingleStudent;
  message: string;
}

interface ISingleStudent {
  message: string;
  _id?: string;
  firstName: string;
  lastName: string;
  parent: string;
  class: string;
  school?: string;
  gender?: 'male' | 'female';
  hobbies: string[];
  photo?: string;
  language?: string;
  dateOfBirth?: string;
  address?: string;
  aboutMe?: string;
  enrolmentDate?: string;
}

// Define the parent type for the dropdown
interface ParentOption {
  parentId: string;
  name: string;
}

const FormSchema = z.object({
  studentFirstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  studentLastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  gender: z.enum(['male', 'female']).optional(),
  class: z.string().min(1, { message: 'Class ID is required.' }),
  parentId: z.string().optional(),
  language: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  aboutMe: z.string().optional(),
  hobbies: z.string().optional(),
  enrolmentDate: z.string().optional(),
  newParentFirstName: z.string().min(2, { message: 'Parent first name must be at least 2 characters.' }).optional(),
  newParentLastName: z.string().min(2, { message: 'Parent last name must be at least 2 characters.' }).optional(),
  newParentEmail: z.string().email({ message: 'Invalid email address.' }).optional(),
  username: z.string().min(1, { message: 'Username is required.' }).optional(),
  password: z.string().min(1, { message: 'Password is required.' }).optional(),
});

type FormData = z.infer<typeof FormSchema>;

export default function AddStudentForm() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      studentFirstName: '',
      studentLastName: '',
      gender: undefined,
      class: '',
      parentId: '',
      language: '',
      dateOfBirth: '',
      address: '',
      aboutMe: '',
      hobbies: '',
      enrolmentDate: '',
      newParentFirstName: '',
      newParentLastName: '',
      newParentEmail: '',
      username: '',
      password: '',
    },
  });

  const [parents, setParents] = useState<ParentOption[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [classLoading, setClassLoading] = useState(false);
 const [isSubmitting, setIsSubmitting] = useState(false);
 
  useEffect(() => {
    const fetchClasses = async () => {
      setClassLoading(true);
      try {
        const response = await getClasses('1', '40');
        setClasses(response.data.result);
      } catch (err) {
        console.error('Failed to fetch classes:', err);
      } finally {
        setClassLoading(false);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchParents = async () => {
      if (!searchQuery) {
        setParents([]);
        return;
      }
      setSearchLoading(true);
      try {
        const response = await searchParents(searchQuery, 1);
        const parentData: ParentOption[] = response.data.result.map((parent: any) => ({
          parentId: parent._id,
          name: `${parent.userId.firstName} ${parent.userId.lastName}`,
        }));
        setParents(parentData);
      } catch (err) {
        console.error('Failed to search parents:', err);
        setParents([]);
      } finally {
        setSearchLoading(false);
      }
    };
    fetchParents();
  }, [searchQuery]);

  const handleReset = () => {
    form.reset();
    setSearchQuery('');
    setParents([]);
  };

  const handleCancel = () => {
    router.push('/admin/student');
  };

  // const onSubmit = async (data: FormData) => {
    
  //   let parentId = data?.parentId;
  //   console.log('Selected parentId:', parentId);

  //   try {
  //     if (!parentId && data.newParentEmail) {
  //       const newParentResponse = await addParent({
  //         firstName: data.newParentFirstName || data.studentFirstName,
  //         lastName: data.newParentLastName || data.studentLastName,
  //         occupation: '',
  //         email: data?.newParentEmail,
  //       });
  //       parentId = newParentResponse.data._id;
  //       console.log('New parentId:', parentId);
  //     }
  //     console.log('Final parentId:', parentId);

  //     const studentData: AddStudentPayload = {
  //       firstName: data.studentFirstName,
  //       lastName: data.studentLastName,
  //       gender: data.gender,
  //       class: data.class,
  //       parent: parentId || '',
  //       language: data.language,
  //       dateOfBirth: data.dateOfBirth,
  //       address: data.address,
  //       aboutMe: data.aboutMe,
  //       hobbies: data.hobbies ? data.hobbies.split(',').map((hobby) => hobby.trim()) : [],
  //       enrolmentDate: data.enrolmentDate,
  //     };

  //     const response = await (addStudent as (payload: AddStudentPayload) => Promise<StudentResponse>)(studentData);
  //     toast({
  //       title: 'Student and Parent added successfully',
  //       description: response?.data?.message || 'Success',
  //     });
  //     handleReset();
  //     router.push('/admin/student');
  //   } catch (error) {
  //     toast({
  //       title: 'Error adding student or parent',
  //       description: error instanceof Error ? error.message : 'An error occurred',
  //       variant: 'destructive',
  //     });
  //   }
  // };


    const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Validate that either parentId or new parent details are provided
      if (!data.parentId && (!data.newParentEmail || !data.newParentFirstName || !data.newParentLastName)) {
        toast({
          title: 'Validation Error',
          description: 'Please either select an existing parent or provide new parent details',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      let parentId = data.parentId;

      // Create new parent if no existing parent selected
      if (!parentId && data.newParentEmail) {
        try {
          const newParentResponse = await addParent({
            firstName: data.newParentFirstName || '',
            lastName: data.newParentLastName || '',
            occupation: '',
            email: data.newParentEmail,
          });
          parentId = newParentResponse.data._id;
          console.log('New parent created with ID:', parentId);
        } catch (error) {
          console.error('Error creating parent:', error);
          toast({
            title: 'Error creating parent',
            description: error instanceof Error ? error.message : 'Failed to create parent account',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare student data
      const studentData: AddStudentPayload = {
        firstName: data.studentFirstName,
        lastName: data.studentLastName,
        gender: data.gender,
        class: data.class,
        parent: parentId || '',
        language: data.language,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        aboutMe: data.aboutMe,
        hobbies: data.hobbies ? data.hobbies.split(',').map((hobby) => hobby.trim()) : [],
        enrolmentDate: data.enrolmentDate,
      };

      console.log('Submitting student data:', studentData);

      // Add student
      const response = await addStudent(studentData);
      
      toast({
        title: 'Success!',
        description: response?.message || 'Student added successfully',
      });
      
      handleReset();
      router.push('/admin/student');
      
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: 'Error adding student',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Form Fields - MOVE BUTTONS TO THE BOTTOM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="studentFirstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentLastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
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
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={classLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={classLoading ? "Loading classes..." : "Select a class"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls._id} value={cls._id}>
                            {cls.className}
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
                name="hobbies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hobbies</FormLabel>
                    <FormControl>
                      <Input placeholder="Reading, Sports, Music" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input placeholder="English" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enrolmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enrolment Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, Lagos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="aboutMe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About Me</FormLabel>
                      <FormControl>
                        <Input placeholder="Loves drawing and reading" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Parent Details */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-4">Parent Details</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search Existing Parent</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          placeholder="Type to search for parents..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
                        {parents.length > 0 && (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a parent" />
                            </SelectTrigger>
                            <SelectContent>
                              {parents.map((parent) => (
                                <SelectItem key={parent.parentId} value={parent.parentId}>
                                  {parent.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Show new parent form only if no parent is selected */}
              {!form.watch('parentId') && (
                <div className="border-t pt-4 space-y-4">
                  <h4 className="font-medium text-sm">Or Create New Parent</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="newParentFirstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="First Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newParentLastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="newParentEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input placeholder="john.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons - MOVED TO BOTTOM */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button
            type="button"
            onClick={handleCancel}
            variant="outline"
            className="px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleReset}
            variant="outline"
            className="px-6 py-2"
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primaryColor text-white hover:bg-primaryColor/90"
          >
            {isSubmitting ? 'Saving...' : 'Save Student'}
          </Button>
        </div>
      </form>
    </Form>
  );
}