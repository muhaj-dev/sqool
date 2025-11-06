import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Instagram, Mail, Smartphone, Star, Twitter } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const Details = () => {
  return (
    <div className="min-w-[25%] flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/images/user.png" />
          <AvatarFallback>JB</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center items-baseline">
          <p className="text-2xl font-semibold">Jerome Bell</p>
          <p>ID AM21-10</p>
          <div className="flex items-center gap-1">
            <Star className="text-yellow-400" size={20} />
            <span className="text-[18px]">4.0</span>
          </div>
        </div>
      </div>
      <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Admission Date</p>
          <p className="">30.11.2023</p>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold">Gender</p>
          <span className="bg-[#5542F61A] text-sm px-2 py-1 rounded-sm text-[#5542F6]">Female</span>
        </div>
      </div>
      <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Class</p>
          <p className="">5</p>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Section</p>
          <p className="">A</p>
        </div>
      </div>
      <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Class Teacher</p>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Mrs Smith Rose</p>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <p className="text-xl">Contact</p>
        <div className="flex gap-6">
          <Mail className="text-muted-foreground" size={20} />
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="text-[14px]">jeromeBell45@email.com</p>
          </div>
        </div>
        <div className="flex gap-6">
          <Smartphone className="text-muted-foreground" size={23} />
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="text-[14px]">jeromeBell45@email.com</p>
          </div>
        </div>
        <div className="flex gap-6">
          <Instagram className="text-muted-foreground" size={20} />
          <div>
            <p className="text-muted-foreground">Phone</p>
            <p className="text-[14px]">+44 123 244 544</p>
          </div>
        </div>
        <div className="flex gap-6">
          <Twitter className="text-muted-foreground " size={22} />
          <div>
            <p className="text-muted-foreground">Address</p>
            <p className="text-[14px]">Lagos Nigeria</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Details
