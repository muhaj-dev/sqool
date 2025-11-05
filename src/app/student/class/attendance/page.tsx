'use client'

import ADetails from '@/app/staff/components/attendance/ADetails'
import { ATable } from '@/app/staff/components/attendance/ATable'
import Attendancebar from '@/app/staff/components/attendance/Attendancebar'
import React, { useState } from 'react'
import StudentAttendance from '../../components/StudentAttendance'

const Page = () => {
  const [activeComponent, setActiveComponent] = useState<'attendance' | 'library'>('attendance')

  return (
    <div>
      <Attendancebar />
      <div className="w-full mt-0 md:mt-8 bg-white py-0 md:py-5 px-0 md:px-9">
        {/* Two Buttons for Switching */}
        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6 mb-6">
          <div className="tablet:col-span-1">
            <ADetails />
          </div>

          <div className="tablet:col-span-2 flex flex-col pl-6 overflow-auto">
            {/* <div className="flex-1 "> */}
            <div className="flex flex-col justify-end mb-4 gap-4">
              <div className="flex  px-4 gap-4  border-[1px] border-[#D6DDEB] rounded-lg w-full items-center justify-start">
                <button
                  onClick={() => setActiveComponent('attendance')}
                  className={` py-2 text-sm ${
                    activeComponent === 'attendance'
                      ? 'border-primary border-b-[4px]'
                      : 'text-[#a4a4a5] border-b-[4px] border-transparent'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-bold">
                      Subject: <span>English Language</span>
                    </p>
                    <p>
                      Time: <span>09:00AM-11:00AM</span>
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setActiveComponent('library')}
                  className={` py-2   text-sm ${
                    activeComponent === 'library'
                      ? 'border-primary  border-b-[4px]'
                      : 'text-[#a4a4a5] border-b-[4px] border-transparent '
                  }`}
                >
                  <div className=" text-left">
                    <p className="font-bold">
                      Subject: <span>Mathematics</span>
                    </p>
                    <p>
                      Time: <span>09:00AM-11:00AM</span>
                    </p>
                  </div>
                </button>
              </div>
            </div>
            <div className="w-full min-w-full  max-w-[900px] mt-8 bg-red py-5 px-0 ">
              {activeComponent === 'attendance' ? (
                <div>
                  <StudentAttendance />
                </div>
              ) : (
                <StudentAttendance />
              )}
            </div>
            <div>{/* Conditionally Render Components */}</div>
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
