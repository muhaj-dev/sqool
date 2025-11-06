'use client'

import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import TopBar from '@/components/TopBar'
import Wrapper from '@/components/Wrapper'
import React from 'react'
import Link from 'next/link'

const FormSchema = z.object({
  email: z.string().email('Please enter your email address'),
})

const ForgotPassword = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  })
  return (
    <MaxWidthWrapper className="flex flex-col ">
      <TopBar text="New to SQOOLIFY?" btnText="Sign Up" />
      <Wrapper
        className="max-w-[470px] w-full mx-auto mt-[6rem] sm:mt-[8rem]
      "
      >
        <div className="text-center mb-6 ">
          <h3 className="text-primary text-2xl sm:text-3xl  mb-4">Reset Password</h3>
          <p className="text-[#434547] sm:text-xl">
            {' '}
            Enter the email associated with your account and we’ll send an email with instruction to reset your Password
          </p>
        </div>
        <Form {...form}>
          <form action="" className="w-full space-y-6 ">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary text-white font-semibold">
              Send reset link
            </Button>
            <div className="text-sm">
              Remembered your password ? kindly to
              <Link href={'/signin'} className=" text-primary px-2  ">
                click here
              </Link>
              Login
            </div>
          </form>
        </Form>
      </Wrapper>
    </MaxWidthWrapper>
  )
}

export default ForgotPassword
