'use client'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/zustand/authStore'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import PhoneNumberInput from '@/components/PhoneInput'
import TopBar from '@/components/TopBar'
import Wrapper from '@/components/Wrapper'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react' // Import eye icons

const FormSchema = z
  .object({
    firstName: z.string().min(3, 'Please provide your first name'),
    lastName: z.string().min(3, 'Please provide your last name'),
    phoneNumber: z.string().refine(value => /^(\+\d{1,})?\d+$/.test(value), {
      message: 'Invalid phone number format',
    }),
    email: z.string().email('Please enter your email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Za-z]/, 'Password must contain at least one letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
    terms: z.boolean().refine(val => val, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

const SignUp = () => {
  const router = useRouter()
  const { setUserData, sendOtp, isLoading, error } = useAuthStore()
  const [isFormValid, setIsFormValid] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      terms: false,
    },
    mode: 'onChange', // This enables validation as fields change
  })

  // Use formState to track form validity
  const { isValid, isDirty, errors } = form.formState

  // Check if all required fields are filled and valid
  useEffect(() => {
    const allFieldsFilled =
      !!form.watch('firstName') &&
      !!form.watch('lastName') &&
      !!form.watch('phoneNumber') &&
      !!form.watch('email') &&
      !!form.watch('password') &&
      !!form.watch('confirmPassword') &&
      form.watch('terms') === true

    const formHasNoErrors = Object.keys(errors).length === 0

    setIsFormValid(allFieldsFilled && formHasNoErrors && isDirty)
  }, [form.watch(), errors, isDirty])

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      // Set user data (excluding confirmPassword and terms)
      const { confirmPassword, terms, ...userData } = data
      setUserData(userData)

      // Format phone number and send OTP
      const formattedPhone = data.phoneNumber.startsWith('+234')
        ? data.phoneNumber
        : `+234${data.phoneNumber.replace(/^0/, '')}`
      console.log(formattedPhone)
      const otpSent = await sendOtp(formattedPhone)
      if (otpSent) {
        router.push('/verify-phone-number')
      }
    } catch (err) {
      // Error is handled in the store
    }
  }

  return (
    <MaxWidthWrapper>
      <TopBar btnText="Login" text="Already have an account?" />
      <Wrapper className="h-full max-w-[500px] w-full mx-auto gap-12 sm:gap-20 mt-[4rem] sm:mt-[6rem]">
        <div>
          <h2 className="text-primary text-center text-2xl sm:text-3xl mb-3">Create an account</h2>
          <p className="text-[#434547] text-center">Sign up to create your School account</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-3 sm:gap-4">
            {/* Name Fields */}
            <div className="flex flex-col sm:flex-row items-center w-full gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>Phone Number</FormLabel>
                  <PhoneNumberInput field={field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Email Address" {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Fields */}
            <div className="flex flex-col w-full gap-4">
              <div className="self-start mt-4">
                <h3 className="text-xl font-semibold">Create your Password</h3>
                <p className="text-[#515B6F]">Enter your password</p>
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" {...field} type={showPassword ? 'text' : 'password'} />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute right-3 top-11 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Confirm Password"
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                      />
                    </FormControl>

                    <button
                      type="button"
                      className="absolute right-3 top-11 transform -translate-y-1/2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Terms Checkbox */}
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  {/* <div className="space-y-1 leading-none">
                    <FormLabel>
                      I accept the <a href="#" className="text-primary">Terms and Conditions</a>
                    </FormLabel>
                  </div> */}

                  <div className="space-y-1 leading-none">
                    <label htmlFor="policy" className="text-sm font-medium">
                      Accept terms and conditions
                    </label>
                    <p className="text-sm text-muted-foreground">
                      By clicking &apos;Continue&apos;, you acknowledge that you have read and accept the{' '}
                      <span className="text-primary font-semibold">Terms of Service and Privacy Policy</span>.
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error Message */}
            {error && <div className="text-red-500 text-sm">{error}</div>}

            {/* Submit Button */}
            <Button
              type="submit"
              className="mt-6 text-white font-semibold bg-primary"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? 'Sending OTP...' : 'Get Started'}
            </Button>

            {/* Login Link */}
            <span className="text-sm">
              Already have an account?{' '}
              <Link href="/signin" className="text-primary font-semibold">
                Login
              </Link>
            </span>
          </form>
        </Form>
      </Wrapper>
    </MaxWidthWrapper>
  )
}

export default SignUp
