'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'

type Participant = {
  name: string
  role: string
}

type Event = {
  title: string
  participants: Participant[]
  time: string
  date: string
  description: string
  attachments: string[]
  eventDate: string
  eventTime: string
}

interface EventModalProps {
  event: Event
}

const FormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
})

export function EventModal({ event }: EventModalProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  })
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <DialogContent className="lg:max-w-[40%] w-[600px] ">
      <DialogClose className="p-1 bg-white rounded-full absolute right-0 -top-10">
        <X className="text-primary" />
      </DialogClose>

      <div className=" ">
        <div className="flex gap-3">
          <div className="bg-[#E5CFFF] basis-[50px] h-fit py-2.5 px-3.5 rounded-md">
            <File />
          </div>
          <div className="basis-full">
            <h2 className="font-bold ">{event.title}</h2>
            <div className="flex text-sm justify-between">
              <div className="mt-4 pb-3">
                {event?.participants.map((participant, index) => (
                  <p key={index} className="flex gap-5 justify-between">
                    <span>{participant.name}</span> <span>{participant.role}</span>
                  </p>
                ))}
              </div>
              <div className="text-[#A7A9AD] text-sm flex justify-between items-center">
                <span>{event.time}</span>
                <span>{event.date}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 mt-3">
          <p className=" ">{event.description}</p>
          <p className="">{event.description}</p>
          <div className="border-b-[1px] border-[#A7A9AD] pb-6">
            <p>Time: {event.time}</p>
            <p>Date: {event.date}</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="mt-4 text-sm  flex gap-5">
              <a href="#" className="text-blue-500">
                {event.attachments[0]}
              </a>
              <span>{event.eventDate}</span>
              <span>{event.eventTime}</span>
            </div>
            <div className="mt-2">
              <Dots />
            </div>
          </div>

          <div className="flex justify-between my-14 p-4 rounded-md bg-[#dfdede]">
            <p>Do you want to perticipate?</p>
            <div className="space-x-3 mt-10">
              <Button
                //  onClick={toggleTexam}
                className="text-white px-5"
              >
                Yes
              </Button>
              <Button type="submit" className=" border-primary text-primary border-[1px] bg-transparent px-5">
                No
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

const File = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15.2145 26.25H11.25C8.89298 26.25 7.71447 26.25 6.98223 25.5178C6.25 24.7855 6.25 23.607 6.25 21.25V8.75C6.25 6.39298 6.25 5.21447 6.98223 4.48223C7.71447 3.75 8.89298 3.75 11.25 3.75H18.75C21.107 3.75 22.2855 3.75 23.0178 4.48223C23.75 5.21447 23.75 6.39298 23.75 8.75V17.7145C23.75 18.2254 23.75 18.4809 23.6548 18.7106C23.5597 18.9403 23.3791 19.1209 23.0178 19.4822L16.9822 25.5178C16.6209 25.8791 16.4403 26.0597 16.2106 26.1548C15.9809 26.25 15.7254 26.25 15.2145 26.25Z"
      stroke="#9530AE"
    />
    <path
      d="M15 26.25V20.4167C15 19.0417 15 18.3543 15.4271 17.9271C15.8543 17.5 16.5417 17.5 17.9167 17.5H23.75"
      stroke="#9530AE"
    />
  </svg>
)

const Dots = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_1069_26036)">
      <path
        d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
        stroke="#181336"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
        stroke="#181336"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
        stroke="#181336"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_1069_26036">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
)
