// hooks/useTimetable.ts
import { useState, useEffect } from 'react'
import { getClassScheduleForStaff } from '@/utils/api'
import { ClassSchedule } from '@/types'

export const useTimetable = () => {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true)
        const response = await getClassScheduleForStaff()
        setSchedules(response.data || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch timetable')
        console.error('Error fetching timetable:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTimetable()
  }, [])

  const refetch = async () => {
    try {
      setLoading(true)
      const response = await getClassScheduleForStaff()
      setSchedules(response.data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch timetable')
    } finally {
      setLoading(false)
    }
  }

  return { schedules, loading, error, refetch }
}
