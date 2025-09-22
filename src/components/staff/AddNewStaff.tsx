import React from "react"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Button } from "../ui/button"
import { DialogClose } from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { AddStaffPayload } from "@/types"
import { useStaff } from "@/contexts/staff-context"

const FormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  level: z.string().min(1, {
    message: "Level is required.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  role: z.string().min(1, {
    message: "Role is required.",
  }),
  primarySubject: z.string().min(2, {
    message: "Primary subject must be at least 2 characters.",
  }),
  language: z.string().min(1, {
    message: "Language is required.",
  }),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date of birth must be in YYYY-MM-DD format.",
  }),
  address: z.string().min(1, {
    message: "Address is required.",
  }),
  aboutMe: z.string().min(1, {
    message: "About me is required.",
  }),
  hobbies: z.array(z.string()).min(1, {
    message: "At least one hobby is required.",
  }),
  employmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Employment date must be in YYYY-MM-DD format.",
  }),
  qualification: z.string().min(1, {
    message: "Qualification is required.",
  }),
  experience: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Experience must be a date in YYYY-MM-DD format.",
  }), 
})

const AddNewStaff = ({setOpen}: any) => {
  const { mutate, loading } = useStaff()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      level: "",
      email: "",
      role: "",
      primarySubject: "",
      language: "",
      dateOfBirth: "",
      address: "",
      aboutMe: "",
      hobbies: [],
      employmentDate: "",
      qualification: "",
      experience: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // console.log("Form data:", data)
    try {
      const staffData: AddStaffPayload = {
        firstName: data.firstName,
        lastName: data.lastName,
        level: data.level,
        email: data.email,
        role: data.role,
        primarySubject: data.primarySubject,
        language: data.language,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        aboutMe: data.aboutMe,
        hobbies: data.hobbies,
        employmentDate: data.employmentDate,
        qualification: data.qualification,
        experience: data.experience,
      }
      const response = await mutate(staffData)
      toast({
        title: "Staff added successfully",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <p className="text-white">{response?.message || "Staff created successfully"}</p>
          </pre>
        ),
      })
      setOpen(false);

      form.reset()
    } catch (err) {
      toast({
        title: "Error adding staff",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <DialogContent className="sm:max-w-[60%]">
      <DialogClose className="absolute right-0 -top-10 bg-white p-1 rounded-full">
        <X className="text-primaryColor" />
      </DialogClose>
      <DialogHeader>
        <DialogTitle>Add New Staff</DialogTitle>
        {/* <DialogDescription>
          Lorem ipsum dolor sit amet consectetur. Sollicitudin mauris sit
          egestas gravida nisl nunc diam libero amet. Aliquam nunc.
        </DialogDescription> */}
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          <div className="h-[900px] max-h-[85dvh] overflow-auto">

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} />
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
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Junior Teacher">Junior Teacher</SelectItem>
                    <SelectItem value="Senior Teacher">Senior Teacher</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="teacher">Teacher</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="primarySubject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Primary subject" {...field} />
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
                  <Input placeholder="Language" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth (YYYY-MM-DD)</FormLabel>
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
                  <Input placeholder="Address" {...field} />
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
                  <Input placeholder="About me" {...field} />
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
                <FormLabel>Hobbies (comma-separated)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Hobbies (e.g., reading, swimming)"
                    onChange={(e) => field.onChange(e.target.value.split(',').map(hobby => hobby.trim()))}
                    value={field.value.join(', ')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employmentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Date (YYYY-MM-DD)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                  <Input placeholder="Qualification" {...field} />
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
                  <FormLabel>Experience Date (YYYY-MM-DD)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="text-white w-full" disabled={loading}>
            Send Invite
          </Button>
        </form>
      </Form>
    </DialogContent>
  )
}

export default AddNewStaff