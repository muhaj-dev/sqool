import CalendarWithCheckboxes from '@/app/parent/components/parent/schedule/CalendarWithCheckboxes'
import SchedulBar from '@/app/parent/components/parent/schedule/SchedulBar'
import ScheduleCalendar from '@/app/parent/components/parent/schedule/ScheduleCalender'
import React from 'react'
import TimeTableBar from '../../components/TimeTable'

const Page = () => {
  return (
    <div>
      <TimeTableBar />
      <div className="w-full mt-0 md:mt-8 bg-white py-0 md:py-5 px-0 md:px-9">
        <ScheduleCalendar />
        <CalendarWithCheckboxes />
      </div>
    </div>
  )
}

export default Page
