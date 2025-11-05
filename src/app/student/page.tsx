'use client'

import React, { useState } from 'react'

import LeftBar from '@/components/staff/LeftBar'
import LearningActivity from '../staff/components/student/LearningActivity'
import Studentbar from './components/Studentbar'
import Noticeboard from '../staff/components/staff/Noticeboard'

const Page = () => {
  const [showPersonalInfo, setShowPersonalInfo] = useState<boolean>(true)

  const togglePersonalInfo = () => {
    setShowPersonalInfo(!showPersonalInfo)
  }

  return (
    <div>
      <Studentbar />
      <div className="grid grid-cols-1 tablet:grid-cols-5 gap-6 mb-6">
        <div className="tablet:col-span-3 px-4  bg-white">
          <div className="">
            <LearningActivity />
          </div>
        </div>

        <div className="tablet:col-span-2 bg-white">
          <Noticeboard />
        </div>
      </div>
    </div>
  )
}

export default Page
