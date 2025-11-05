import React from 'react'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'

const SettingTopBar = () => {
  return (
    <section className="my-4">
      <div className="flex items-center justify-between ">
        <div className="w-full md:w-[50%]">
          <h3 className="text-xl font-bold">Settings</h3>
          <p className="text-muted-foreground w-full  max-w-[490px] text-sm">
            Showing your Account metrics for July 19, 2021 - July 25, 2021
          </p>
        </div>
      </div>
    </section>
  )
}

export default SettingTopBar
