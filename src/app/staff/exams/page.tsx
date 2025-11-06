'use client'

import React, { useState } from 'react'

import Examinations from '../components/exam/Examinations'

const Page = () => {
  const [showPersonalInfo, setShowPersonalInfo] = useState<boolean>(true)

  const togglePersonalInfo = () => {
    setShowPersonalInfo(!showPersonalInfo)
  }

  return (
    <div>
      {/* <Staffbar /> */}
      <Examinations />
    </div>
  )
}

export default Page
