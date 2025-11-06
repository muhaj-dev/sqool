'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import React, { useState } from 'react'

type EditField = 'name' | 'email' | 'phone' | 'emergency' | 'address'

const PersonalDetails = () => {
  const [isEdit, setIsEdit] = useState({
    name: true,
    email: true,
    phone: true,
    emergency: true,
    address: true,
  })

  const handleEditToggle = (field: EditField) => {
    setIsEdit(prevState => ({
      ...prevState,
      [field]: !prevState[field],
    }))
  }

  return (
    <div className="bg-white rounded-md p-6 flex flex-col gap-4 ">
      <form className="mx-auto gap-10 py-4 w-[95%] max-w-[500px] ">
        <div className="flex flex-col gap-4 ">
          {/* Legal Name */}
          <div className="flex-1 flex justify-between items-start">
            <div className="w-[80%]">
              <Label>Legal name</Label>
              <Input
                className="border-none pl-0"
                placeholder="Enter your name"
                type="text"
                value=""
                disabled={isEdit.name}
              />
            </div>
            <p
              className={`underline font-medium w-fit ${isEdit.name ? 'text-black' : 'text-yellow-500'} cursor-pointer`}
              onClick={() => handleEditToggle('name')}
            >
              {isEdit.name ? 'Edit' : 'Save'}
            </p>
          </div>
          <Separator />

          {/* Email Address */}
          <div className="flex-1 flex justify-between items-start">
            <div className="w-[80%]">
              <Label>Email address</Label>
              <Input
                className="border-none pl-0"
                placeholder="Enter your email"
                type="email"
                value=""
                disabled={isEdit.email}
              />
            </div>
            <p
              className={`underline font-medium w-fit ${
                isEdit.email ? 'text-black' : 'text-yellow-500'
              } cursor-pointer`}
              onClick={() => handleEditToggle('email')}
            >
              {isEdit.email ? 'Edit' : 'Save'}
            </p>
          </div>
          <Separator />

          {/* Phone Numbers */}
          <div className="flex-1 flex justify-between items-start">
            <div className="w-[80%]">
              <Label>Phone numbers</Label>
              <Input
                className="border-none pl-0"
                placeholder="Add a number"
                type="number"
                value=""
                disabled={isEdit.phone}
              />
            </div>
            <p
              className={`underline font-medium w-fit ${
                isEdit.phone ? 'text-black' : 'text-yellow-500'
              } cursor-pointer`}
              onClick={() => handleEditToggle('phone')}
            >
              {isEdit.phone ? 'Edit' : 'Save'}
            </p>
          </div>
          <Separator />

          {/* Emergency Contact */}
          <div className="flex-1 flex justify-between items-start">
            <div className="w-[80%]">
              <Label>Emergency contact</Label>
              <Input
                className="border w-full pl-0"
                placeholder="Provide an emergency contact"
                type="text"
                value=""
                disabled={isEdit.emergency}
              />
            </div>
            <p
              className={`underline font-medium w-fit ${
                isEdit.emergency ? 'text-black' : 'text-yellow-500'
              } cursor-pointer`}
              onClick={() => handleEditToggle('emergency')}
            >
              {isEdit.emergency ? 'Edit' : 'Save'}
            </p>
          </div>
          <Separator />

          {/* Address */}
          <div className="flex-1 flex justify-between items-start">
            <div className="w-[80%]">
              <Label>Address</Label>
              <Input
                className="border-none pl-0"
                placeholder="Provide an address"
                type="text"
                value=""
                disabled={isEdit.address}
              />
            </div>
            <p
              className={`underline font-medium w-fit ${
                isEdit.address ? 'text-black' : 'text-yellow-500'
              } cursor-pointer`}
              onClick={() => handleEditToggle('address')}
            >
              {isEdit.address ? 'Edit' : 'Save'}
            </p>
          </div>
          <Separator />

          {/* <Button className="w-full text-white mt-6">Save Change</Button> */}
        </div>
      </form>
    </div>
  )
}

export default PersonalDetails
