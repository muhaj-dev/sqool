import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import React from 'react'

const AttendanceTable = () => {
  return (
    <section className="flex flex-col gap-4 overflow-auto">
      <div className="flex items-center justify-between">
        <p>Total Attendance</p>
        <Select>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Weekly" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div className="w-[400px] space-y-3">
        <div className="flex items-center justify-between text-muted-foreground ">
          <p>Weekly</p>
          <div className="grid grid-cols-3 w-[200px]">
            <p>Absent</p>
            <p>Present</p>
            <p>Total</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between text-[#2E2C34]">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-[#515B6F]"></div>Week 1
          </div>
          <div className="grid grid-cols-3 w-[200px] place-items-center">
            <p>0</p>
            <p>5</p>
            <p>5</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-[#2E2C34]">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-[#515B6F]"></div>Week 2
          </div>
          <div className="grid grid-cols-3 w-[200px] place-items-center">
            <p>0</p>
            <p>5</p>
            <p>5</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-[#2E2C34]">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-[#515B6F]"></div>Week 3
          </div>
          <div className="grid grid-cols-3 w-[200px] place-items-center">
            <p>0</p>
            <p>5</p>
            <p>5</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-[#2E2C34]">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-[#515B6F]"></div>Week 4
          </div>
          <div className="grid grid-cols-3 w-[200px] place-items-center">
            <p>0</p>
            <p>5</p>
            <p>5</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-[#2E2C34]">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-[#515B6F]"></div>Week 5
          </div>
          <div className="grid grid-cols-3 w-[200px] place-items-center">
            <p>0</p>
            <p>5</p>
            <p>5</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AttendanceTable
