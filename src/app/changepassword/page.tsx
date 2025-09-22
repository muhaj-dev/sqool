"use client"

import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import TopBar from "@/components/TopBar"
import Wrapper from "@/components/Wrapper"
import React from "react"

const FormSchema = z
  .object({
    password: z.string().min(5, "provide a valid password"),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
  })

const ResetPassword = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const { toast } = useToast()
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Hello")
    console.log(data)
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "Invalid email or password!.",
    })
  }
  return (
    <MaxWidthWrapper className="flex flex-col ">
      <TopBar text="New to SQOOLIFY?" btnText="Sign Up" />
      <Wrapper
        className="max-w-[450px] w-full mx-auto mt-[6rem] sm:mt-[8rem]
      "
      >
        <div className="text-center mb-6 ">
          <h3 className="text-primaryColor text-2xl sm:text-3xl  mb-4">
            Change Password
          </h3>
          <p className="text-[#434547] text-[14px] sm:text-xl">
            Your new password must be different from previous used passwords
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 "
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="new password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="confirm password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full py-4 bg-primaryColor text-white">
              Change Password
            </Button>
          </form>
        </Form>
      </Wrapper>
    </MaxWidthWrapper>
  )
}

export default ResetPassword
