'use client'

import { useState } from 'react'

import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { Plus } from 'lucide-react'
import React from 'react'
import AddNewStaff from './AddNewStaff'

const StaffSubbar = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="my-6">
      <div className="flex items-center flex-wrap gap-2 justify-between">
        <div className="w-full md:w-[50%]">
          <h3 className="text-xl font-bold">Staff</h3>
          <p className="text-muted-foreground w-full  max-w-[490px] text-sm">
            Showing your Account metrics for July 19, 2021 - July 25, 2021
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="flex items-center gap-2 bg-primary rounded-md text-white py-3 px-10">
            <Plus />
            Add Staff
          </DialogTrigger>
          <AddNewStaff setOpen={setOpen} />
        </Dialog>
      </div>
      <div className="flex items-center  gap-8 my-6">
        <div className="flex items-center gap-4 bg-white p-4 rounded-md w-[48%] md:w-[200px]">
          <div className="h-[3.5rem] w-[3.5rem] rounded-full bg-gray-50"></div>
          <div>
            <p>Teacher</p>
            <p className="text-3xl">12</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-md w-[48%] md:w-[200px]">
          <div className="h-[3.5rem] w-[3.5rem] rounded-full bg-gray-50"></div>
          <div>
            <p>Non Teacher</p>
            <p className="text-3xl">40</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffSubbar
