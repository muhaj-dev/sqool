// src/app/admin/student/add/Components/AddStudentForm.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { addStudent, searchParents, getClasses, addParent } from '@/utils/api'

// Define the payload type for addStudent based on your API
interface AddStudentPayload {
  firstName: string
  lastName: string
  gender: 'male' | 'female'
  class: string
  parent: string
  language: string
  dateOfBirth: string
  address: string
  aboutMe: string
  hobbies: string[]
  enrolmentDate: string
}

// Define the parent type for the dropdown based on the new API response
interface ParentOption {
  parentId: string
  name: string
  email?: string
  occupation: string
}

// Form validation schema - SIMPLIFIED
const FormSchema = z.object({
  // Student fields
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  gender: z.enum(['male', 'female'], {
    required_error: 'Gender is required.',
  }),
  class: z.string().min(1, { message: 'Class is required.' }),
  language: z.string().min(1, { message: 'Language is required.' }),
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required.' }),
  address: z.string().min(1, { message: 'Address is required.' }),
  aboutMe: z.string().min(1, { message: 'About me is required.' }),
  hobbies: z.string().min(1, { message: 'Hobbies are required.' }),
  enrolmentDate: z.string().min(1, { message: 'Enrolment date is required.' }),

  // Parent selection - this is the only parent field needed when selecting existing parent
  parentId: z.string().min(1, { message: 'Please select or create a parent.' }),

  // New parent fields (optional - only needed if creating new parent)
  newParentFirstName: z.string().optional(),
  newParentLastName: z.string().optional(),
  newParentEmail: z.string().email({ message: 'Invalid email address.' }).optional().or(z.literal('')),
  newParentOccupation: z.string().optional(),
})

type FormData = z.infer<typeof FormSchema>

export default function AddStudentForm() {
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: undefined,
      class: '',
      language: '',
      dateOfBirth: '',
      address: '',
      aboutMe: '',
      hobbies: '',
      enrolmentDate: '',
      parentId: '',
      newParentFirstName: '',
      newParentLastName: '',
      newParentEmail: '',
      newParentOccupation: '',
    },
  })

  const [parents, setParents] = useState<ParentOption[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [classes, setClasses] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [classLoading, setClassLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Watch form values
  const formValues = form.watch()
  const selectedParentId = form.watch('parentId')

  // Debug: Log form values and validation state
  useEffect(() => {
    console.log('Form values:', formValues)
    console.log('Form errors:', form.formState.errors)
    console.log('Is form valid:', form.formState.isValid)
    console.log('Selected parent ID:', selectedParentId)
  }, [formValues, form.formState.errors, form.formState.isValid, selectedParentId])

  useEffect(() => {
    const fetchClasses = async () => {
      setClassLoading(true)
      try {
        const response = await getClasses('1', '40')
        setClasses(response.data.result)
      } catch (err) {
        console.error('Failed to fetch classes:', err)
        toast({
          title: 'Error',
          description: 'Failed to load classes',
          variant: 'destructive',
        })
      } finally {
        setClassLoading(false)
      }
    }
    fetchClasses()
  }, [])

  useEffect(() => {
    const fetchParents = async () => {
      if (!searchQuery.trim()) {
        setParents([])
        return
      }

      setSearchLoading(true)
      try {
        const response = await searchParents(searchQuery, 1)
        console.log('Parent search response:', response)

        // Map the API response to ParentOption
        const parentData: ParentOption[] = response.data.result.map((parent: any) => ({
          parentId: parent._id, // Use _id as parentId
          name: `${parent.user.firstName} ${parent.user.lastName}`,
          email: parent.user.email,
          occupation: parent.occupation || 'Not specified',
        }))

        setParents(parentData)
        console.log('Mapped parent data:', parentData)
      } catch (err) {
        console.error('Failed to search parents:', err)
        toast({
          title: 'Search Error',
          description: 'Failed to search for parents',
          variant: 'destructive',
        })
        setParents([])
      } finally {
        setSearchLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchParents, 500)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleReset = () => {
    form.reset()
    setSearchQuery('')
    setParents([])
  }

  const handleCancel = () => {
    router.push('/admin/student')
  }

  const onSubmit = async (data: FormData) => {
    console.log('Form submitted with data:', data)
    console.log('Form validation state:', form.formState.isValid)

    setIsSubmitting(true)

    try {
      let parentId = data.parentId

      // If parentId starts with "new_", it means we need to create a new parent
      if (parentId.startsWith('new_')) {
        console.log('Creating new parent...')

        const parentPayload = {
          firstName: data.newParentFirstName!,
          lastName: data.newParentLastName!,
          occupation: data.newParentOccupation!,
          email: data.newParentEmail!,
        }

        console.log('Parent payload:', parentPayload)

        try {
          const newParentResponse = await addParent(parentPayload)
          console.log('Parent creation response:', newParentResponse)

          const parentId = newParentResponse.data?.parentId

          if (!parentId) {
            throw new Error('Failed to get parent ID from response')
          }

          console.log('New parent created with ID:', parentId)

          toast({
            title: 'Parent Created',
            description: 'New parent account created successfully',
          })
        } catch (parentError) {
          console.error('Error creating parent:', parentError)
          toast({
            title: 'Parent Creation Failed',
            description: 'Failed to create parent account',
            variant: 'destructive',
          })
          return
        }
      } else {
        console.log('Using existing parent ID:', parentId)
      }

      // Prepare student data
      const studentData: AddStudentPayload = {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        class: data.class,
        parent: parentId, // Use the parent ID (either existing or newly created)
        language: data.language,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        aboutMe: data.aboutMe,
        hobbies: data.hobbies
          .split(',')
          .map(hobby => hobby.trim())
          .filter(hobby => hobby.length > 0),
        enrolmentDate: data.enrolmentDate,
      }

      console.log('Submitting student data:', JSON.stringify(studentData, null, 2))

      // Add student
      try {
        // const response = await addStudent(studentData);
        const response = await addStudent(studentData as any)
        console.log('Student creation response:', response)

        toast({
          title: 'Success!',
          description: response?.message || 'Student added successfully',
        })

        handleReset()
        router.push('/admin/student')
      } catch (studentError) {
        console.error('Error creating student:', studentError)
        toast({
          title: 'Student Creation Failed',
          description: studentError instanceof Error ? studentError?.message : 'Failed to create student',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Unexpected error in form submission:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleParentSelect = (parentId: string) => {
    console.log('Parent selected:', parentId)
    form.setValue('parentId', parentId, { shouldValidate: true })
    // Clear new parent fields when selecting existing parent
    if (parentId && !parentId.startsWith('new_')) {
      form.setValue('newParentFirstName', '')
      form.setValue('newParentLastName', '')
      form.setValue('newParentEmail', '')
      form.setValue('newParentOccupation', '')
    }
  }

  const handleCreateNewParent = () => {
    // Set a special value to indicate new parent creation
    form.setValue('parentId', 'new_parent', { shouldValidate: true })
    setSearchQuery('')
    setParents([])
  }

  // Check if form is ready for submission
  const isFormValid = form.formState.isValid

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Debug info - remove in production */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Debug Info:</strong> Form valid: {form.formState.isValid ? 'Yes' : 'No'}, Parent selected:{' '}
            {selectedParentId ? 'Yes' : 'No'}, Ready to submit: {isFormValid ? 'Yes' : 'No'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium mb-4 text-lg">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
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
                name="lastName"
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
                    <FormLabel>Gender *</FormLabel>
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
                    <FormLabel>Date of Birth *</FormLabel>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={classLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={classLoading ? 'Loading classes...' : 'Select a class'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes.map(cls => (
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
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language *</FormLabel>
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
                    <FormLabel>Enrolment Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hobbies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hobbies *</FormLabel>
                    <FormControl>
                      <Input placeholder="reading, swimming, drawing" {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">Separate multiple hobbies with commas</p>
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, Lagos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="aboutMe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About Me *</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                          placeholder="Loves drawing and reading..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium mb-4 text-lg">Parent Information</h3>

            {/* Search Existing Parent */}
            <div className="mb-6">
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Parent *</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Search by parent name..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            disabled={!!selectedParentId}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCreateNewParent}
                            disabled={!!selectedParentId}
                          >
                            Create New
                          </Button>
                        </div>

                        {searchLoading && <p className="text-sm text-muted-foreground">Searching parents...</p>}

                        {parents.length > 0 && !selectedParentId && (
                          <Select onValueChange={handleParentSelect} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a parent from results" />
                            </SelectTrigger>
                            <SelectContent>
                              {parents.map(parent => (
                                <SelectItem key={parent.parentId} value={parent.parentId}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{parent.name}</span>
                                    <span className="text-xs text-muted-foreground">{parent.occupation}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {selectedParentId && selectedParentId !== 'new_parent' && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm text-green-800">
                              Parent selected: {parents.find(p => p.parentId === selectedParentId)?.name}
                            </p>
                            <Button
                              type="button"
                              variant="link"
                              className="p-0 h-auto text-sm text-green-600"
                              onClick={() => {
                                form.setValue('parentId', '')
                                setSearchQuery('')
                              }}
                            >
                              Change parent
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* New Parent Form - Only show if creating new parent */}
            {selectedParentId === 'new_parent' && (
              <div className="border-t pt-6 space-y-4">
                <h4 className="font-medium text-lg">Create New Parent</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="newParentFirstName"
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
                    name="newParentLastName"
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
                  <div className="md:col-span-2">
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
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="newParentOccupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occupation *</FormLabel>
                          <FormControl>
                            <Input placeholder="Engineer, Teacher, etc." {...field} />
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

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" onClick={handleCancel} variant="outline" className="px-6 py-2">
            Cancel
          </Button>
          <Button type="button" onClick={handleReset} variant="outline" className="px-6 py-2">
            Reset
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="px-6 py-2 bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Student'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
