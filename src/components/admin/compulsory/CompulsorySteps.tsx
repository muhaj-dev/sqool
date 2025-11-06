'use client'
import React from 'react'

import { useStaff } from '@/contexts/staff-context'
import { Separator } from '@/components/ui/separator'
import { useCompulsory } from '@/contexts/compulsory-context'
const tabs = ['Class Configuration', 'Session and terms', 'Bank']
const CompulsorySteps = () => {
  const { activeIndex, updateIndex } = useCompulsory()
  return (
    <div className="mb-4 overflow-auto">
      <div className=" w-fit flex items-center justify-between gap-8 px-8 pt-4 ">
        {tabs.map((item, ind) => (
          <p
            onClick={() => updateIndex(ind)}
            key={ind}
            className={`cursor-pointer transition pb-2 w-fit   ${
              activeIndex === ind ? 'border-b-[2px] border-primary text-black' : 'text-muted-foreground'
            }`}
          >
            {item}
          </p>
        ))}
      </div>
      <Separator />
    </div>
  )
}

export default CompulsorySteps
