'use client'
import React, { useEffect, useState } from 'react'
import { parentData } from '@/components/student/student-data'
import { ParentExpCol } from './ParentExpCol'
import { ParentTable } from './ParentTable'

const ParentExp = () => {
  return (
    <section className="flex flex-col gap-4">
      <div className="bg-white p-4 rounded-md">
        <p className="font-semibold text-lg">All Expenses</p>
        <ParentTable data={parentData} columns={ParentExpCol} />
      </div>
    </section>
  )
}

export default ParentExp
