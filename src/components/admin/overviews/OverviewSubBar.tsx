'use client'
import React from 'react'
import { Select, SelectContent, SelectItem } from '../../ui/select'
import { SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { ChevronDown } from 'lucide-react'

const OverviewSubBar = () => {
  return (
    <div className=" w-full flex justify-between flex-col lg:flex-row my-4">
      <div className="w-full md:w-[50%]">
        <h3 className="text-xl font-bold">
          Dashboard - <span className="text-muted-foreground text-[16px] font-normal ml-1">Overview</span>
        </h3>
        <p className="text-muted-foreground w-full  max-w-[490px] text-sm">
          Showing your Account metrics for July 19, 2021 - July 25, 2021
        </p>
      </div>
      <div className="flex items-center p-4 bg-white rounded-md shadow-sm gap-1 w-fit md:w-fit">
        <span className="text-muted-foreground">Show stats:</span>
        <Select>
          <SelectTrigger className="outline-none w-24 pr-6 relative">
            <ChevronDown className="absolute right-0 text-muted-foreground" />
            <SelectValue placeholder="Duration" className="outline-none" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yearly">Yearly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default OverviewSubBar
