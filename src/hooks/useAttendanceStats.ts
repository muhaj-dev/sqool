import { useMemo } from 'react'
import { useAttendanceStore } from '@/zustand/staff/useAttendanceStore'
import { Student } from '@/types/attendance'

export function useAttendanceStats(students: Student[]) {
  const { attendance } = useAttendanceStore()

  return useMemo(() => {
    const total = students.length
    if (total === 0) {
      return {
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        presentRate: 0,
        absentRate: 0,
      }
    }

    const present = students.filter(s => attendance[s.id]?.status === 'present').length
    const absent = students.filter(s => attendance[s.id]?.status === 'absent').length
    const late = students.filter(s => attendance[s.id]?.status === 'late').length
    const excused = students.filter(s => attendance[s.id]?.status === 'excused').length

    const presentRate = Math.round((present / total) * 100)
    const absentRate = Math.round((absent / total) * 100)

    return {
      total,
      present,
      absent,
      late,
      excused,
      presentRate,
      absentRate,
    }
  }, [students, attendance])
}
