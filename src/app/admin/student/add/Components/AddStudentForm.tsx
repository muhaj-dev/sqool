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

  const onSubmit = async (data: FormData) => {
    let parentId = data.parentId;
    console.log('Selected parentId:', parentId);

    try {
      if (!parentId && data.newParentEmail) {
        const newParentResponse = await addParent({
          firstName: data.newParentFirstName || data.studentFirstName,
          lastName: data.newParentLastName || data.studentLastName,
          occupation: '',
          email: data.newParentEmail,
        });
        parentId = newParentResponse.data._id;
        console.log('New parentId:', parentId);
      }
      console.log('Final parentId:', parentId);

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

      const response = await (addStudent as (payload: AddStudentPayload) => Promise<StudentResponse>)(studentData);
      toast({
        title: 'Student and Parent added successfully',
        description: response?.data?.message || 'Success',
      });
      handleReset();
      router.push('/admin/student');
    } catch (error) {
      toast({
        title: 'Error adding student or parent',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form id="studentForm" onSubmit={form.handleSubmit(onSubmit)} className="mt-6">

      <div className="my-6 flex justify-end gap-4">
          <Button
            type="button"
            onClick={handleCancel}
            className="px-5 py-4 bg-white text-primaryColor border-[1px] border-primaryColor hover:bg-primaryColor hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="px-5 py-4 bg-white text-primaryColor border-[1px] border-primaryColor hover:bg-primaryColor hover:text-white"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="studentForm"
            className="px-5 py-4 bg-primaryColor text-white border-[1px] border-primaryColor hover:bg-white hover:text-primaryColor"
          >
            Save
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="studentFirstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
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
                    <FormLabel>Last Name</FormLabel>
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
                    <FormLabel>Class</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a class" />
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
                      <Input placeholder="Hobbies (comma-separated)" {...field} />
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
                      <Input placeholder="Language (e.g., English)" {...field} />
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
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Address (e.g., 123 Main St, Lagos)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aboutMe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Me</FormLabel>
                    <FormControl>
                      <Input placeholder="About the student (e.g., Loves drawing and reading)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Parent Details */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-4">Parent Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          placeholder="Search for a parent..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchLoading && <p>Loading...</p>}
                        {parents.length > 0 && (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a parent" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {parents.map((parent) => (
                                <SelectItem key={parent.parentId} value={parent.parentId}>
                                  {parent.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {!field.value && (
                          <>
                            <FormField
                              control={form.control}
                              name="newParentFirstName"
                              render={({ field: newField }) => (
                                <FormItem>
                                  <FormLabel>Parent First Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Parent First Name" {...newField} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="newParentLastName"
                              render={({ field: newField }) => (
                                <FormItem>
                                  <FormLabel>Parent Last Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Parent Last Name" {...newField} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="newParentEmail"
                              render={({ field: newField }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="john.doe@example.com" {...newField} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      
      </form>
    </Form>
  );
}