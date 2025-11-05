"use client"
import React, { useState } from "react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormMessage,
} from "./ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog } from "./ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import Requirement from "./Requirement"

type MouseEvent = React.MouseEvent<HTMLButtonElement>
type StateProp = {
  label: string
  value: string
}

const SchoolInfoForm = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const [localGovernment, setLocalGovernment] = useState<StateProp[]>()
  const schoolTypes = [
    { label: "Primary" },
    { label: "Secondary" },
    { label: "Both" },
    { label: "Sixth Form" },
  ]

  const formData = {
    states: [
      {
        label: "Oyo",
        value: "oyo",
        localGovernments: [
          {
            label: "Ido",
            value: "ido",
          },
          {
            label: "Egbeda",
            value: "egbeda",
          },
          {
            label: "Ibadan-North",
            value: "ibadan-north",
          },
          {
            label: "Akinyele",
            value: "akinyele",
          },
        ],
      },

      {
        label: "lagos",
        value: "Lagos",
        localGovernments: [
          {
            label: "Ido",
            value: "ido",
          },
          {
            label: "Egbeda",
            value: "egbeda",
          },
          {
            label: "Ibadan-North",
            value: "ibadan-north",
          },
          {
            label: "Akinyele",
            value: "akinyele",
          },
        ],
      },
      {
        label: "osun",
        value: "Osun",
        localGovernments: [
          {
            label: "Ido",
            value: "ido",
          },
          {
            label: "Egbeda",
            value: "egbeda",
          },
          {
            label: "Ibadan-North",
            value: "ibadan-north",
          },
          {
            label: "Akinyele",
            value: "akinyele",
          },
        ],
      },
      {
        label: "ogun",
        value: "Ogun",
        localGovernments: [
          {
            label: "Ido",
            value: "ido",
          },
          {
            label: "Egbeda",
            value: "egbeda",
          },
          {
            label: "Ibadan-North",
            value: "ibadan-north",
          },
          {
            label: "Akinyele",
            value: "akinyele",
          },
        ],
      },
    ],
  }
  const FormSchema = z.object({
    schoolName: z
      .string()
      .min(2, { message: "School name must be at least 2 characters" }),
    aboutSchool: z
      .string()
      .min(2, { message: "About school name must be at least 2 characters" })
      .max(500, { message: "About school cannot be more than 500 characters" }),
    schoolAddress: z
      .string()
      .min(2, { message: "School address must be at least 2 characters" }),
    localGovernment: z
      .string()
      .min(2, { message: "Please select a local government" }),
    state: z.string().min(2, { message: "Please select a state" }),
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      schoolAddress: "",
      schoolName: "",
      state: "",
      localGovernment: "",
      aboutSchool: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log({ ...data, schoolType: schoolTypes[activeIndex].label })
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white rounded-md p-4 space-y-6"
      >
        <div className="border-b-2 grid grid-cols-1 sm:grid-cols-2">
          <span>Type of school</span>
          <div className="flex flex-col gap-4 mb-4 ">
            <p>School Type</p>
            <div className="grid grid-cols-2 w-[25rem]  gap-4  ">
              {schoolTypes.map((item, i) => {
                const handleOpen = (e: MouseEvent) => {
                  e.preventDefault();
                  setActiveIndex(i);
                };

                const isOpen = i === activeIndex;
                return (
                  <div key={item.label}>
                    <Button
                      onClick={handleOpen}
                      className={cn(
                        "shadow-sm border w-full sm:w-[12rem] text-muted-foreground",
                        {
                          "bg-[rgba(0,0,0,0.05)] text-primary": isOpen,
                        }
                      )}
                      variant={isOpen ? "secondary" : "ghost"}
                    >
                      {item.label}
                    </Button>
                  </div>
                );
              })}
            </div>
            <Dialog>
              <DialogTrigger>
                <span className="text-sm text-primary underline cursor-pointer">
                  View the requirement document we need
                </span>
              </DialogTrigger>
              <Requirement />
            </Dialog>
          </div>
        </div>

        <div className="border-b-2  grid grid-col-1 sm:grid-cols-2 py-4">
          <div className="max-w-[24.5rem]">
            <h3>Tell us your School Register </h3>
            <p className="text-sm text-muted-foreground">
              this most be the name on your registration Documentation.
              <span className="text-red-600">
                {" "}
                Note: the name can not be change again
              </span>
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter your School name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="PURS"
                      type="text"
                      className="sm:w-[25rem]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="border-b-2 grid sm:grid-cols-2 py-4">
          <div className="max-w-[24.5rem]">
            <h3>Tell us about your School</h3>
            <p className="text-sm text-muted-foreground">
              in a few sentence describe your Company and the Product or
              Services your render
            </p>
          </div>
          <div className="grid gap-1.5 mt-4 sm:mt-0 sm:w-[25rem]">
            <FormField
              control={form.control}
              name="aboutSchool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About your School</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your product or service."
                      id="message-2"
                      className="resize-none"
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Maximum 500 characters.
              </p>
              <div className="flex items-center text-muted-foreground text-sm">
                <span>0</span>
                <span>/</span>
                <span>500</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-b-2 grid sm:grid-cols-2 py-4">
          <div className="max-w-[24.5rem]">
            <h3>Verity your School Location </h3>
            <p className="text-sm text-muted-foreground">
              We will Require you to Submit A copy of your utility bill
              associated to the address in the documentation part of the
              onboarding
            </p>
          </div>
          <div className="flex flex-col gap-4 mt-4 sm:mt-0 sm:w-[25rem]">
            <FormField
              control={form.control}
              name="schoolAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="School address"
                      type="text"
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Label></Label>
            </div>

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select
                    onValueChange={(state) => {
                      field.onChange(state);
                      formData.states.forEach((item) => {
                        if (item.value.toLowerCase() === state.toLowerCase()) {
                          setLocalGovernment(item.localGovernments);
                        }
                      });
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {formData.states.map((state) => (
                        <SelectItem key={state.label} value={state.value}>
                          {state.label}
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
              name="localGovernment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local government area</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Local Government" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {localGovernment?.map((item) => (
                        <SelectItem key={item.label} value={item.value}>
                          {item.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 py-4">
          <div></div>
          <div>
            <Button type="submit" className="text-white w-full sm:w-[25rem] ">
              Save
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default SchoolInfoForm
