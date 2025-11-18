"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

const BusinessDocForm = () => {
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
          <h3 className="text-xl font-semibold">Please submit your business documentation</h3>
          <p className="text-sm text-muted-foreground">
            Ensure the business documentation you are submitting is valid
          </p>
        </div>
      </div>

      <div className="flex sm:w-[95%] justify-between mt-12 ">
        <div className="w-full">
          <Form {...form}>
            <form
              action=""
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-4"
            >
              <div className="grid grid-cols-5 w-full">
                <div className="col-span-2">
                  <h3 className="text-xl font-semibold">Form CAC7</h3>
                  <p className="text-sm text-muted-foreground  w-[16rem]">
                    The Corporate Affairs Commission (CAC) is the statutory body charged with the
                    administration of the Companies and Allied Matters Act (the Act) which includes
                    the regulation and supervision of the formation.
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem className="w-full col-span-3">
                      <FormLabel>Attach your cooperate affairs commission</FormLabel>
                      <FormControl>{/* <AttachmentUpload /> */}</FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="my-6 h-[2px]" />
              <div className="grid grid-cols-5 w-full">
                <div className="col-span-2">
                  <h3 className="text-xl font-semibold">Utility Bills</h3>
                  <p className="text-sm text-muted-foreground  w-[16rem]">
                    A utility bill is a monthly statement of the amount a household or School owes
                    for essential services or utilities.
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem className="w-full col-span-3">
                      <FormLabel>Attach your utility bills</FormLabel>
                      <FormControl>{/* <AttachmentUpload /> */}</FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="my-6 h-[2px]" />
              <div className="grid grid-cols-5  w-full ">
                <div className="col-span-2" />
                <div className=" col-span-3">
                  <Button className="w-full text-white text-xl h-[60px]">Save</Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BusinessDocForm;
