import LeftBar from '@/components/staff/LeftBar'
import StaffSteps from '@/components/staff/StaffSteps'
import StaffTopbar from '@/components/staff/StaffTopbar'
import React, { ReactNode } from 'react'
import Studentbar from '../components/student/studentbar'

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Studentbar />
      <div className="w-full mt-8 bg-white py-5 px-0 md:px-8">{children}</div>
    </div>
  )
}

export default layout
