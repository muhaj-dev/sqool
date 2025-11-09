'use client'

import React, { useState } from 'react'
import Studentbar from '../components/student/studentbar'
import ListStudent from '../components/student/ListStudent'

const Page = () => {
  const staffId = "68cd468d8d84caff4981b225";
  return (
    <div className="">
      <ListStudent staffId={staffId} />
    </div>
  );
}

export default Page
