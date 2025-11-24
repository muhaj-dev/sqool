"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { getClasses, updateStudent, searchParents } from "@/utils/api";

// Define local types based on your actual API response
interface StudentParent {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
  };
  isActive: boolean;
}

interface StudentClass {
  _id: string;
  className: string;
}

interface StudentData {
  _id: string;
  firstName: string;
  lastName: string;
  parent: StudentParent;
  class: StudentClass;
  school: string;
  gender: "male" | "female";
  language: string;
  dateOfBirth: string;
  address: string;
  aboutMe: string;
  hobbies: string[];
  photo: string;
  enrolmentDate: string;
}

// Define parent option type
interface ParentOption {
  parentId: string;
  name: string;
  email?: string;
  occupation: string;
}

// Form validation schema based on the PATCH endpoint and student response
const EditStudentSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  gender: z.enum(["male", "female"], {
    required_error: "Gender is required.",
  }),
  class: z.string().min(1, { message: "Class is required." }),
  parent: z.string().min(1, { message: "Parent is required." }),
  language: z.string().min(1, { message: "Language is required." }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  aboutMe: z.string().min(1, { message: "About me is required." }),
  hobbies: z.string().min(1, { message: "Hobbies are required." }),
});

type EditStudentData = z.infer<typeof EditStudentSchema>;

interface StudentSettingsProps {
  studentId: string;
  studentData: StudentData | null;
  onStudentUpdated?: () => void; // Add refresh callback
}

export default function StudentSettings({
  studentId,
  studentData,
  onStudentUpdated,
}: StudentSettingsProps) {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [parents, setParents] = useState<ParentOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [classLoading, setClassLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showParentList, setShowParentList] = useState(false);
  const parentListRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EditStudentData>({
    resolver: zodResolver(EditStudentSchema),
    defaultValues: {
      firstName: studentData?.firstName ?? "",
      lastName: studentData?.lastName ?? "",
      gender: studentData?.gender ?? undefined,
      class: studentData?.class?._id ?? "",
      parent: studentData?.parent?._id ?? "",
      language: studentData?.language ?? "",
      dateOfBirth: studentData?.dateOfBirth ?? "",
      address: studentData?.address ?? "",
      aboutMe: studentData?.aboutMe ?? "",
      hobbies: studentData?.hobbies?.join(", ") ?? "",
    },
  });

  // Watch parent field value
  const selectedParentId = form.watch("parent");

  // Update form when student data changes
  useEffect(() => {
    if (studentData) {
      form.reset({
        firstName: studentData?.firstName ?? "",
        lastName: studentData?.lastName ?? "",
        gender: studentData?.gender ?? undefined,
        class: studentData?.class?._id ?? "",
        parent: studentData?.parent?._id ?? "",
        language: studentData?.language ?? "",
        dateOfBirth: studentData?.dateOfBirth ?? "",
        address: studentData?.address ?? "",
        aboutMe: studentData?.aboutMe ?? "",
        hobbies: studentData?.hobbies?.join(", ") ?? "",
      });
    }
  }, [studentData, form]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        parentListRef.current &&
        !parentListRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowParentList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      setClassLoading(true);
      try {
        const response = await getClasses("1", "40");
        setClasses(response.data.result);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
        toast({
          title: "Error",
          description: "Failed to load classes",
          variant: "destructive",
        });
      } finally {
        setClassLoading(false);
      }
    };
    void fetchClasses(); // Add void operator here
  }, []);

  // Search parents
  useEffect(() => {
    const fetchParents = async () => {
      if (!searchQuery.trim()) {
        setParents([]);
        return;
      }

      setSearchLoading(true);
      try {
        const response = await searchParents(searchQuery, 1);
        console.log("Parent search response:", response);

        // Map the API response to ParentOption
        const parentData: ParentOption[] = response.data.result.map((parent: any) => ({
          parentId: parent._id,
          name: `${parent.user.firstName} ${parent.user.lastName}`,
          email: parent.user.email,
          occupation: parent.occupation || "Not specified",
        }));

        setParents(parentData);
      } catch (err) {
        console.error("Failed to search parents:", err);
        toast({
          title: "Search Error",
          description: "Failed to search for parents",
          variant: "destructive",
        });
        setParents([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      void fetchParents(); // Add void operator here
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const onSubmit = async (data: EditStudentData) => {
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);

    try {
      // Prepare student data according to PATCH endpoint
      const studentUpdateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        class: data.class,
        parent: data.parent, // Include parent ID in the update
        language: data.language,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        aboutMe: data.aboutMe,
        hobbies: data.hobbies
          .split(",")
          .map((hobby) => hobby.trim())
          .filter((hobby) => hobby.length > 0),
      };

      console.log("Submitting student update data:", JSON.stringify(studentUpdateData, null, 2));

      // Update student
      const response = await updateStudent(studentId, studentUpdateData);
      console.log("Student update response:", response);

      toast({
        title: "Success!",
        description: response?.message || "Student updated successfully",
      });

      // Call the refresh callback if provided
      if (onStudentUpdated) {
        onStudentUpdated();
      }

      // Also refresh the page
      router.refresh();
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update student",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // const handleParentSelect = (parentId: string) => {
  //   form.setValue("parent", parentId, { shouldValidate: true });
  // };

  // Get current parent name for display
  const getCurrentParentName = () => {
    if (!studentData?.parent) return "No parent assigned";
    return `${studentData.parent.userId?.firstName} ${studentData.parent.userId?.lastName}`;
  };

  // Get selected parent name
  const getSelectedParentName = () => {
    if (!selectedParentId) return "";
    const selectedParent = parents.find((p) => p.parentId === selectedParentId);
    return selectedParent ? selectedParent.name : "";
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      setShowParentList(true);
    }
  };

  const handleSearchFocus = () => {
    if (parents.length > 0 && searchQuery.trim()) {
      setShowParentList(true);
    }
  };

  const handleParentSelect = (parentId: string) => {
    form.setValue("parent", parentId, { shouldValidate: true });
    setShowParentList(false);
    // setSearchQuery(""); // Clear search query after selection
  };
  return (
    <div className=" mx-auto ">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Student Profile</h1>
        <p className="text-muted-foreground">Update student information and parent assignment</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Parent Information Section */}
          <div className="bg-white py-4 rounded-lg shadow">
            <h3 className="font-medium mb-4 text-lg">Parent Information</h3>

            {/* Current Parent Display */}
            {studentData?.parent ? (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Current Parent</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-blue-700">Parent Name</div>
                    <p className="text-sm text-blue-900">{getCurrentParentName()}</p>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-blue-700">Status</div>
                    <p className="text-sm text-blue-900">
                      {studentData.parent.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Parent Search and Selection */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="parent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Change Parent *</FormLabel>
                    <FormControl>
                      <div className="space-y-3 relative">
                        <div className="flex gap-2">
                          {/* <Input
                            placeholder="Search by parent name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1"
                          /> */}

                          <Input
                            ref={searchInputRef}
                            placeholder="Search by parent name..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            onFocus={handleSearchFocus}
                            className="flex-1"
                          />
                        </div>

                        {searchLoading ? (
                          <p className="text-sm text-muted-foreground">Searching parents...</p>
                        ) : null}

                        {showParentList && parents.length > 0 ? (
                          <div
                            ref={parentListRef}
                            className="absolute top-full w-[350px] left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto mt-1"
                          >
                            <div className="p-2 space-y-1">
                              {parents.map((parent) => (
                                <button
                                  key={parent.parentId}
                                  type="button"
                                  onClick={() => handleParentSelect(parent.parentId)}
                                  className={`w-full text-left p-3 rounded-md hover:bg-gray-50 transition-colors ${
                                    field.value === parent.parentId
                                      ? "bg-blue-50 border border-blue-200"
                                      : "border border-transparent"
                                  }`}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">{parent.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {parent.occupation}
                                      {parent.email ? ` • ${parent.email}` : ""}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {/* <div
                          ref={parentListRef}
                          className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto mt-1"
                        >
                          <div className="p-2 space-y-1">
                            {parents.map((parent) => (
                              <button
                                key={parent.parentId}
                                type="button"
                                onClick={() => handleParentSelect(parent.parentId)}
                                className={`w-full text-left p-3 rounded-md hover:bg-gray-50 transition-colors ${
                                  field.value === parent.parentId
                                    ? "bg-blue-50 border border-blue-200"
                                    : "border border-transparent"
                                }`}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">{parent.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {parent.occupation}
                                    {parent.email ? ` • ${parent.email}` : ""}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div> */}

                        {searchQuery && parents.length === 0 && !searchLoading ? (
                          <p className="text-sm text-muted-foreground">
                            No parents found. Try a different search term.
                          </p>
                        ) : null}

                        {/* Display selected parent */}
                        {selectedParentId && getSelectedParentName() ? (
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-green-800">
                              <strong>Selected Parent:</strong> {getSelectedParentName()}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Student Information Section */}
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={classLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={classLoading ? "Loading classes..." : "Select a class"}
                          />
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
                name="hobbies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hobbies *</FormLabel>
                    <FormControl>
                      <Input placeholder="reading, swimming, drawing" {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Separate multiple hobbies with commas
                    </p>
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button type="button" onClick={handleCancel} variant="outline" className="px-6 py-2">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Student"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
