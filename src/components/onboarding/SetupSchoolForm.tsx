"use client";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import DatePicker from "../DatePicker";
import AttachmentUpload from "../AttachmentUpload";
import { Plus } from "lucide-react";
import { Separator } from "../ui/separator";
import { useOnboarding } from "@/contexts/onboarding-context";
import { useSchoolStore } from "@/zustand/useSetupSchool";
import React from "react";

const formSchema = z.object({
  schoolLogoId: z.instanceof(File).optional(),
  schoolShortName: z
    .string({ required_error: "School short name is required" })
    .min(2)
    .max(50),
  schoolMotto: z
    .string({ required_error: "School motto is required" })
    .min(2)
    .max(50),
  schoolPhoneNumber: z
    .string({ required_error: "Phone number is required" })
    .min(2)
    .max(50),
  lga: z.string({ required_error: "Local government is required" }).min(2),
  foundingDate: z.string().min(2, { message: "Date is required" }),
  schoolWebsite: z.string({ required_error: "Website is required" }).min(2),
  country: z.string({ required_error: "Country is required" }).min(2),
  state: z.string({ required_error: "State is required" }).min(2),
  schoolAddress: z
    .string({ required_error: "School address is required" })
    .min(2),
  schoolEmailAddress: z
    .string()
    .email({ message: "Please provide a valid email address" }),
});

const SetupSchoolForm = () => {
  const { setSchoolData, schoolData } = useSchoolStore();
  const { updateCompletionState, goNextPage, updateFormData } = useOnboarding();
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...schoolData,
      foundingDate: schoolData.foundingDate || undefined,
      schoolLogoId: undefined,
    },
  });


function onSubmit(data: z.infer<typeof formSchema>) {
  // Prepare the school setup data
  const schoolSetupData = {
    schoolShortName: data.schoolShortName,
    schoolMotto: data.schoolMotto,
    schoolPhoneNumber: data.schoolPhoneNumber,
    lga: data.lga,
    foundingDate: data.foundingDate,
    schoolWebsite: data.schoolWebsite,
    country: data.country,
    state: data.state,
    schoolAddress: data.schoolAddress,
    schoolEmailAddress: data.schoolEmailAddress,
  };

  // Prepare the files data
  const uploadedFiles: File[] = [];
  if (data.schoolLogoId) {
    uploadedFiles.push(data.schoolLogoId);
  }

  // Update the form data in context (this will append files)
  updateFormData('SchoolSetup', schoolSetupData);
  updateFormData('UploadedFiles', uploadedFiles);
  
  // Update the school store
  setSchoolData(schoolSetupData);
  
  console.log('Submitted data:', { schoolSetupData, uploadedFiles });
  goNextPage();
  updateCompletionState("Setup School");
}

  const handleSelect = (selectedDate: Date | string | undefined) => {
    if (typeof selectedDate === "string") {
      selectedDate = new Date(selectedDate);
    }
    setDate(selectedDate);
    form.setValue("foundingDate", (selectedDate as Date).toLocaleString());
  };

  
  return (
    <div className="bg-white rounded-md px-0 md:p-4 mt-8">
      <div className="flex items-center justify-between border-b-2 pb-4 mb-4">
        <div>
          <h3 className="text-xl font-semibold">Setup your school system</h3>
          <p className="text-sm text-muted-foreground">
            This information that you can update anytime.
          </p>
        </div>
      </div>

      <div className="flex sm:w-[100%] flex-col lg:flex-row gap-3 justify-between mt-12">
        <div>
          <h3 className="text-xl font-semibold">Tell us about your school</h3>
          <p className="text-sm text-muted-foreground w-[16rem]">
            This must be the name on your registration documentation.
          </p>
        </div>
        <div className="w-full lg:w-[60%]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
            <FormField
  name="schoolLogoId"
  control={form.control}
  render={({ field }) => (
    <FormItem className="w-full">
      <FormLabel>Upload School Logo</FormLabel>
      <FormControl>
        <AttachmentUpload 
          {...field}
          onChange={(file) => {
            if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
              form.setValue('schoolLogoId', file);
            } else {
              form.setError('schoolLogoId', { message: 'Only JPG/PNG files are allowed' });
            }
          }}
          accept=".jpg,.jpeg,.png"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
              
              {/* Rest of your form fields remain the same */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <FormField
                  name="foundingDate"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full grid">
                      <FormLabel>Founding Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date?.toISOString())
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="schoolShortName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>School Short Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter school short name"
                          {...field}
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="schoolMotto"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>School Moto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter firstname"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="schoolPhoneNumber"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>School Phone Number </FormLabel>
                    <FormControl className="">
                      <div className="flex">
                        <Select>
                          <SelectTrigger className="w-[80px] rounded-r-none">
                            <SelectValue placeholder="+234" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="apple">+234</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Phone Number"
                          {...field}
                          className="rounded-l-none"
                          type="text"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="schoolEmailAddress"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>School Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter school email address"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schoolAddress"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>School Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter school address"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="nigeria">Nigeria</SelectItem>
                        <SelectItem value="ghana">Ghana</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>State</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="national_id">Oyo</SelectItem>
                          <SelectItem value="voter's_card">Lagos</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lga"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>LGA</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select LGA" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="national_id">Egbeda</SelectItem>
                          <SelectItem value="voter's_card">Irepodun</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="schoolWebsite"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>School Website</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter address"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="flex-1 text-white text-lg">
                Save and Continue
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <Separator className="my-6 h-[2px]" />
      <div className="flex sm:w-[95%] justify-between mt-4">
        <div>
          <h3 className="text-xl font-semibold">School Brands</h3>
          <p className="text-sm text-muted-foreground  w-[16rem]">
            if your school don&apos;t have a brands ignore.
          </p>
        </div>
        <Button className="text-primaryColor bg-white hover:bg-gray-200">
          <Plus /> Add Brands
        </Button>
      </div>
    </div>
  );
};

export default SetupSchoolForm;
