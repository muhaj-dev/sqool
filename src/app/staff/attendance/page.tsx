import { AttendanceHeader } from "../components/attendance/AttendanceHeader";
import StatsOverview from "../components/attendance/StatsOverview";


export default function Attendance() {
  return (
      <div className="space-y-6 pb-10">
        <AttendanceHeader />
        <StatsOverview/>
      </div>
  );
}
