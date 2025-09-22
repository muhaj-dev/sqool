"use client"
import React from "react"
import ImageUpload from "./ImageUpload"
import { Separator } from "../ui/separator"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { zodResolver } from "@hookform/resolvers/zod"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { useSetting } from "@/contexts/setting-context"

const PersonDetail = () => {
  const formSchema = z.object({
    firstname: z.string().min(2, {
      message: "firstname must be at least 2 characters.",
    }),
    lastname: z.string().min(2, {
      message: "lastname must be at least 2 characters.",
    }),
    phone: z.string().min(2, {
      message: "phone is required.",
    }),
    email: z.string().min(2, { message: "email is required" }),
  })

  const { register, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
    },
  })

  const { goNextStep } = useSetting()

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    goNextStep()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-md md:p-4 flex flex-col gap-4 "
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16 py-4 w-full md:w-[90%] ">
        <p className="font-semibold grid-cols-1">Profile Photo</p>
        <div className="col-span-2 ">
          <ImageUpload />
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16  py-4 w-[90%] ">
        <div className="col-span-1">
          <p className="font-semibold">Full Name</p>
          <p className="text-muted-foreground">
            You won&apos;t be able to change your name.
          </p>
        </div>
        <div className="col-span-1 md:col-span-2 flex items-center gap-4">
          <div className="flex-1">
            <Label>First Name</Label>
            <Input {...register("firstname")} />
          </div>
          <div className="flex-1">
            <Label>Last Name</Label>
            <Input {...register("lastname")} />
          </div>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16 w-[90%] py-4">
        <div className="col-span-1">
          <p className="font-semibold">Email Address</p>
          <p className="text-muted-foreground">
            Your email address will receive all communications and activity
            notifications from your account.
          </p>
        </div>
        <div className="col-span-1 md:col-span-2 ">
          <div className="flex-1">
            <Label>Email Address</Label>
            <Input type="email" {...register("email")} />
          </div>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16 w-[90%]">
        <div className="col-span-1">
          <p className="font-semibold">Phone Number</p>
          <p className="text-muted-foreground">
            OTP is sent to your phone number for verification purposes.
          </p>
        </div>
        <div className="col-span-1 md:col-span-2 ">
          <div className="flex-1">
            <Label>Phone Number</Label>
            <Input {...register("phone")} />
          </div>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-6 md:gap-16 w-[90%]">
        <div className="col-span-1"></div>
        <div className="col-span-2 ">
          <Button type="submit" className="w-full text-white">
            Save Change
          </Button>
        </div>
      </div>
    </form>
  )
}

export default PersonDetail


