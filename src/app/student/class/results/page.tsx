'use client'

import Resultbar from '@/app/staff/components/class/result/Resultbar'
import React, { useState } from 'react'
import ResultExam from '../../components/ResultExam'

const Page = () => {
  return (
    <div>
      <Resultbar />
      <div className="w-full mt-0 md:mt-8 bg-white py-0 md:py-5 px-0 md:px-9">
        <ResultExam />
      </div>
    </div>
  )
}

export default Page
