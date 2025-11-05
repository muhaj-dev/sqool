'use client'
import React from 'react'
// import { Ellipsis } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CircularProgressbar } from 'react-circular-progressbar'
import { Separator } from '@/components/ui/separator'

const TopTeachers = () => {
  return (
    <section className="bg-white rounded-md p-4">
      <div>
        <h3 className="text-2xl mb-4 ">Top Teacher</h3>
        {/* <Ellipsis /> */}
      </div>
      <Separator />
      <div className="flex items-center justify-between my-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h4>Maria Roselia</h4>
            <div className="flex items-center text-[14px] gap-1">
              <p className="text-muted-foreground">Course -</p>
              <p>English ,math,...</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1 w-[64px] h-[54px] items-center ">
          <CircularProgressbar strokeWidth={15} value={85} />
          <span>{'85%'}</span>
        </div>
      </div>
      <Separator />
      <div className="flex items-center justify-between my-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h4>Maria Roselia</h4>
            <div className="flex items-center text-[14px] gap-1">
              <p className="text-muted-foreground">Course -</p>
              <p>English ,math,...</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1 w-[64px] h-[54px] items-center ">
          <CircularProgressbar strokeWidth={15} value={85} />
          <span>{'85%'}</span>
        </div>
      </div>
      <Separator />
      <div className="flex items-center justify-between my-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h4>Maria Roselia</h4>
            <div className="flex items-center text-[14px] gap-1">
              <p className="text-muted-foreground">Course -</p>
              <p>English ,math,...</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1 w-[64px] h-[54px] items-center ">
          <CircularProgressbar strokeWidth={15} value={85} />
          <span>{'85%'}</span>
        </div>
      </div>
      <Separator />
      <div className="flex items-center justify-between my-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h4>Maria Roselia</h4>
            <div className="flex items-center text-[14px] gap-1">
              <p className="text-muted-foreground">Course -</p>
              <p>English ,math,...</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1 w-[64px] h-[54px] items-center ">
          <CircularProgressbar strokeWidth={15} value={85} />
          <span>{'85%'}</span>
        </div>
      </div>
      <Separator />
      <div className="flex items-center justify-between my-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h4>Maria Roselia</h4>
            <div className="flex items-center text-[14px] gap-1">
              <p className="text-muted-foreground">Course -</p>
              <p>English ,math,...</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1 w-[64px] h-[54px] items-center ">
          <CircularProgressbar strokeWidth={15} value={85} />
          <span>{'85%'}</span>
        </div>
      </div>
      <Separator />
      <div className="flex items-center justify-between my-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h4>Maria Roselia</h4>
            <div className="flex items-center text-[14px] gap-1">
              <p className="text-muted-foreground">Course -</p>
              <p>English ,math,...</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1 w-[64px] h-[54px] items-center ">
          <CircularProgressbar strokeWidth={15} value={85} />
          <span>{'85%'}</span>
        </div>
      </div>
      {/* <Separator /> */}
    </section>
  )
}

export default TopTeachers
