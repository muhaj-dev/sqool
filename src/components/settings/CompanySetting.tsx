import React from 'react'
import ImageUpload from './ImageUpload'
import { Separator } from '../ui/separator'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { useSetting } from '@/contexts/setting-context'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
const CompanySetting = () => {
  const { goNextStep } = useSetting()

  const formSchema = z.object({
    schoolname: z.string().min(2, {
      message: 'school name must be at least 2 characters.',
    }),
    bio: z.string().min(2, {
      message: 'bio must be at least 2 characters.',
    }),
    industry: z.string().min(2, {
      message: 'industry is required.',
    }),
    address: z.string().min(2, { message: 'address is required' }),
  })

  const { register, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolname: '',
      bio: '',
      industry: '',
      address: '',
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('click')
    console.log(values)
    goNextStep()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-md p-6 flex flex-col gap-4 ">
      <div className="grid  grid-cols-1 md:grid-cols-3  gap-10 py-4 w-full md:w-[90%]">
        <p className="font-semibold">Company Logo</p>
        <div className="col-span-2  ">
          <ImageUpload />
        </div>
      </div>
      <Separator />
      <div className="grid-cols-1 md:grid-cols-3 gap-10 py-4 w-[90%]">
        <div className="col-span-1">
          <p className="font-semibold">School Name</p>
          <p className="text-muted-foreground">You won&apos;t be able to change your name.</p>
        </div>
        <div className="col-span-1 md:col-span-2 ">
          <div className="flex-1">
            <Label>School Name</Label>
            <Input {...register('schoolname')} />
          </div>
        </div>
      </div>
      <Separator />
      <div className="grid-cols-1 md:grid-cols-3 gap-10 py-4 w-[90%]">
        <div className="col-span-1">
          <p className="font-semibold">Company Bio</p>
          <p className="text-muted-foreground">Tell us more about your business</p>
        </div>
        <div className="col-span-1 md:col-span-2 ">
          <div className="flex-1">
            <Label>Bio</Label>
            <Textarea className="resize-none" {...register('bio')} />
            <div className="text-muted-foreground flex items-center justify-between">
              <span>Maximum 500 characters</span>
              <span>0/500</span>
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <div className="grid-cols-1 md:grid-cols-3 gap-10 w-[90%]">
        <div className="col-span-1">
          <p className="font-semibold">Industry</p>
          <p className="text-muted-foreground">Specific sector, in which your organization primarily operates.</p>
        </div>
        <div className="col-span-1 md:col-span-2 ">
          <div className="flex-1">
            <Label>Industry</Label>
            <Input {...register('industry')} />
          </div>
        </div>
      </div>
      <Separator />
      <div className="grid-cols-1 md:grid-cols-3 gap-10 w-[90%]">
        <div className="col-span-1">
          <p className="font-semibold">Address</p>
          <p className="text-muted-foreground">This is the location of your business..</p>
        </div>
        <div className="col-span-1 md:col-span-2 ">
          <div className="flex-1">
            <Label>Address</Label>
            <Input {...register('address')} />
          </div>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-10 w-[90%]">
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

export default CompanySetting
