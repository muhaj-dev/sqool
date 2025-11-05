import { FormControl } from '@/components/ui/form'
import React, { useState } from 'react'
import { Input } from './ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface CountryCode {
  label: string
  value: string
}

const countryCodes: CountryCode[] = [
  { label: '+234 (NGN)', value: '+234' },
  { label: '+1 (US)', value: '+1' },
  { label: '+44 (UK)', value: '+44' },
  { label: '+91 (India)', value: '+91' },
  // Add more country codes as needed
]

const PhoneNumberInput = ({ field }: { field: any }) => {
  return (
    <div className="flex w-full  items-center ">
      <div className=" ">
        <Select>
          <SelectTrigger className="w-[80px] bg-[#FAFAFA] rounded-r-none">
            <SelectValue placeholder="+234 (NGN)" />
          </SelectTrigger>
          <SelectContent>
            {countryCodes.map(code => (
              <SelectGroup key={code.value}>
                <SelectItem value={code.value}>{code.label}</SelectItem>
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 w-full">
        <FormControl>
          <Input placeholder="Enter phone number" {...field} type="number" className="outline-none w-full" />
        </FormControl>
      </div>
    </div>
  )
}

export default PhoneNumberInput
