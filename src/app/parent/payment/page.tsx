'use client'

import React from 'react'
import PaymentBar from '../components/payment/PaymentBar'
import PaymentTable from '../components/payment/PaymentTable'

const Page = () => {
  return (
    <div>
      <PaymentBar />
      <div className="w-full mt-8 bg-white py-5 px-0 md:px-9">
        <PaymentTable />
      </div>
    </div>
  )
}

export default Page
