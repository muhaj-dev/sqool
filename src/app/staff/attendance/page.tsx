import { AttendanceHeader } from '../components/Attendance/AttendanceHeader'
import StatsOverview from '../components/Attendance/StatsOverview'

export default function Attendance() {
  return (
    <div className="space-y-6 pb-10">
      <AttendanceHeader />
      <StatsOverview />
    </div>
  )
}
