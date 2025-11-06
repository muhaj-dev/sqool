'use client'
import { Plus } from 'lucide-react'
import React from 'react'
import { DialogTrigger } from '../ui/dialog'

const AccountTopbar = () => {
  return (
    <div className="flex justify-between items-center flex-wrap">
      <div>
        <p className="textmd md:text-xl">Account</p>
        {/* <p className="text-muted-foreground text-sm ">
          Showing your Account metrics for July 19, 2021 - July 25, 2021
        </p> */}
      </div>
      <DialogTrigger className="flex items-center bg-primary text-white py-2 px-4 text-sm rounded-md cursor-pointer my-4 ">
        <Plus /> <p>Add Bank Account</p>
      </DialogTrigger>
    </div>
  )
}

export default AccountTopbar
