"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import DatePicker from "./DatePicker";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  firstname: z.string({ required_error: "first name is required" }).min(2).max(50),
  lastname: z.string({ required_error: "last name is required" }).min(2).max(50),
  phone: z.string({ required_error: "phone number is required" }).min(2).max(50),
  gender: z.string({ required_error: "gender is required" }),
  dob: z.date({ required_error: "Please select a date" }),
  nationality: z.string({ required_error: "nationality is required" }),
  address: z.string({ required_error: "residential address is required" }),
  formofID: z.string(),
  idNumber: z.string({ required_error: "ID is required" }),
});

const SetupSchoolForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  function closeForm() {
    setIsVisible(false);
  }
  function openForm() {
    setIsVisible(true);
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      phone: "",
      dob: new Date(),
      nationality: "",
      address: "",
      formofID: "",
      idNumber: "",
      gender: "",
    },
  });
  function onSubmit(data: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(data);
  }
  return (
    <div className="bg-white rounded-md p-4 mt-8    ">
      <div className="flex items-center justify-between border-b-2 pb-4 mb-4">
        <div>
          <h3 className="text-xl font-semibold">Setup your school system</h3>
          <p className="text-sm text-muted-foreground">
            This information that you can update anytime.
          </p>
        </div>
        <Button className="bg-primary text-white" onClick={openForm}>
          Add School Owner
        </Button>
      </div>

      <div className="flex sm:w-[95%] justify-between mt-12 ">
        <div>
          <h3 className="text-xl font-semibold">Tell us your about business</h3>
          <p className="text-sm text-muted-foreground  w-[16rem]">
            this most be the name on your registration Documentation.
          </p>
        </div>
        <div className="w-[60%]">
          <Form {...form}>
            <form
              action=""
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Upload School Logo</FormLabel>
                    <FormControl>{/* <AttachmentUpload /> */}</FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="w-full grid">
                      <FormLabel>Founding Date</FormLabel>
                      <FormControl>
                        <DatePicker selected={field.value} onSelect={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>School Short Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter firstname" {...field} type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>School Moto</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter firstname" {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>School Phone Number </FormLabel>
                    <FormControl className="">
                      <div className="flex">
                        <Select>
                          <SelectTrigger className="w-[80px] rounded-r-none">
                            <SelectValue placeholder="+177" />
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
                name="lastname"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>School Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter school email address" {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>School Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter school address" {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>LGA</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ID" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="national_id">National ID</SelectItem>
                          <SelectItem value="voter's_card">Voter&apos;s Card</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ID" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="national_id">National ID</SelectItem>
                          <SelectItem value="voter's_card">Voter&apos;s Card</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>School Website</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="flex-1 text-white">Save</Button>
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
        <Button className="text-primary bg-white hover:bg-gray-200">
          <Plus /> Add Brands
        </Button>
      </div>
    </div>
  );
};

export default SetupSchoolForm;
