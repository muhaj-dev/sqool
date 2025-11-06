import Overview from '@/components/admin/overviews'
import React from 'react'
import { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Overview />
    </Suspense>
  )
}

export default page
