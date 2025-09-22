"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formSchema = z.object({
  schoolName: z.string().min(2, {
    message: "School name must be at least 2 characters.",
  }),
  typeOfSchool: z.string().min(2, {
    message: "Select type of school",
  }),
  schoolSize: z.string().min(2, { message: "Select school size" }),
  country: z.string().min(2, { message: "Select a location of school" }),
});

const SignUpBusiness = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: "",
      typeOfSchool: "",
      country: "",
      schoolSize: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <MaxWidthWrapper>
      <div className="flex justify-between items-center w-full">
        <Link
          href={"/"}
          className="uppercase text-[#E5B80B] text-md font-bold sm:text-3xl hover:cursor-pointer  transition "
        >
          Sqoolify
        </Link>
      </div>
      <div className="flex justify-center items-center flex-col w-full h-screen">
        <div className="flex flex-col justify-center items-center w-[500px]">
          <h2 className="text-xl text-primaryColor font-semibold">
            Tell us about your School
          </h2>
          <p className="text-muted-foreground">
            A few more things to help us set up your dashboard
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="School name"
                        {...field}
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
                  <FormItem>
                    <FormLabel>What country are you based in?</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="nigeria">Nigeria</SelectItem>
                        <SelectItem value="ghana">Ghana</SelectItem>
                        <SelectItem value="cameroon">Cameroon</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="typeOfSchool"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of School</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Type of School" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="community">Community</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schoolSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select School Size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-100">1-100</SelectItem>
                        <SelectItem value="101-500">101-500</SelectItem>
                        <SelectItem value="500-1000">500-1000</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full text-white font-semibold" type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default SignUpBusiness;
