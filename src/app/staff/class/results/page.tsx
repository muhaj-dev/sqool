'use client'

import React, { useState } from 'react'
import Resultbar from '../../components/class/result/Resultbar'
import Texam from '../../components/class/result/Texam'
import { Upload } from '../../components/class/result/Upload'

const Page = () => {
  const [showTexam, setShowTexam] = useState<boolean>(false)

  return (
    <div>
      <Resultbar />
      <div className="w-full mt-0 md:mt-8 bg-white py-0 md:py-5 px-0 md:px-9">
        {showTexam ? (
          <Upload toggleTexam={() => setShowTexam(!showTexam)} />
        ) : (
          <Texam toggleTexam={() => setShowTexam(!showTexam)} />
        )}
      </div>
    </div>
  )
}

export default Page
