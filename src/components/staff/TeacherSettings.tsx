import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { type StaffResult } from "@/types";
import { updateStaffByAdmin } from "@/utils/api";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Reuse the same schema but make email and name optional since we can't edit them
const EditFormSchema = z.object({
  level: z.string().min(1, {
    message: "Level is required.",
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
  phoneNumber: z.string().min(1, {
    message: "Phone number is required.",
  }),
  isActive: z.boolean(),
});

export default function TeacherSettings({
  staffId,
  staff,
  refreshStaff,
}: {
  staffId: string;
  staff: StaffResult | null;
  refreshStaff?: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof EditFormSchema>>({
    resolver: zodResolver(EditFormSchema),
    defaultValues: {
      level: staff?.level ?? "",
      role: staff?.role ?? "",
      primarySubject: staff?.primarySubject ?? "",
      language: "English",
      dateOfBirth: staff?.dateOfBirth
        ? new Date(staff?.dateOfBirth)?.toISOString()?.split("T")[0]
        : "",
      address: staff?.address ?? "",
      aboutMe: staff?.aboutMe ?? "",
      hobbies: staff?.hobbies ?? ["reading"],
      employmentDate: staff?.employmentDate
        ? new Date(staff?.employmentDate)?.toISOString()?.split("T")[0]
        : "",
      qualification: staff?.qualification ?? "",
      experience: staff?.experience
        ? new Date(staff?.experience)?.toISOString()?.split("T")[0]
        : "",
      phoneNumber: staff?.phoneNumber ?? "",
      isActive: staff?.isActive ?? true,
    },
  });

  // Update form when staff data changes
  useEffect(() => {
    if (staff) {
      form.reset({
        level: staff?.level ?? "",
        role: staff?.role ?? "",
        primarySubject: staff?.primarySubject ?? "",
        language: "English",
        dateOfBirth: staff?.dateOfBirth
          ? new Date(staff?.dateOfBirth)?.toISOString()?.split("T")[0]
          : "",
        address: staff?.address ?? "",
        aboutMe: staff?.aboutMe ?? "",
        hobbies: staff?.hobbies ?? ["reading"],
        employmentDate: staff?.employmentDate
          ? new Date(staff?.employmentDate)?.toISOString()?.split("T")[0]
          : "",
        qualification: staff?.qualification ?? "",
        experience: staff?.experience
          ? new Date(staff?.experience)?.toISOString()?.split("T")[0]
          : "",
        phoneNumber: staff?.phoneNumber ?? "",
        isActive: staff?.isActive ?? true,
      });
    }
  }, [staff, form]);

  async function onSubmit(data: z.infer<typeof EditFormSchema>) {
    try {
      setLoading(true);

      // Prepare the payload according to your API documentation
      const updateData = {
        level: data?.level,
        role: data?.role,
        primarySubject: data?.primarySubject,
        language: data?.language,
        dateOfBirth: data?.dateOfBirth,
        address: data?.address,
        aboutMe: data?.aboutMe,
        hobbies: data?.hobbies,
        employmentDate: data?.employmentDate,
        qualification: data?.qualification,
        experience: data?.experience,
        phoneNumber: data?.phoneNumber,
        isActive: data?.isActive,
      };

      const response = await updateStaffByAdmin(staffId, updateData);

      toast({
        title: "Staff updated successfully",
        description: response?.message || "Staff updated successfully",
      });

      if (refreshStaff) {
        await refreshStaff();
      }
    } catch (err) {
      toast({
        title: "Error updating staff",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Staff Profile</h1>
          <p className="text-muted-foreground">
            Update staff information. Email and name cannot be changed.
          </p>
        </div>
      </div>
      {/* Display read-only email and name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label htmlFor="readonly-name" className="text-sm font-medium text-gray-700">
            Name
          </label>
          <p id="readonly-name" className="text-sm text-gray-900 mt-1">
            {staff?.userId?.firstName} {staff?.userId?.lastName}
          </p>
        </div>
        <div>
          <label htmlFor="readonly-email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <p id="readonly-email" className="text-sm text-gray-900 mt-1">
            {staff?.userId?.email}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
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
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
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
              name="employmentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <FormLabel>Experience Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Full width fields */}
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
                    onChange={(e) =>
                      field.onChange(e?.target?.value?.split(",")?.map((hobby) => hobby?.trim()))
                    }
                    value={field?.value?.join(", ")}
                  />
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
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Whether the staff member is active
                  </div>
                </div>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 text-white" disabled={loading}>
              {loading ? "Updating..." : "Update Staff"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
