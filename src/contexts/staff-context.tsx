'use client'
import { ReactNode, createContext, useContext, useState, useEffect } from 'react'
import TeacherDetail from '@/components/staff/TeacherDetail'
import { TimeTable } from '@/components/staff/tables/timetable'
import { LessonTable } from '@/components/staff/tables/lesson-table'
import { getStaffs, addStaff } from '@/utils/api'
import { StaffResult, AddStaffPayload, StaffResponse } from '@/types'

// interface StaffContextType {
//   updateIndex: (index: number) => void;
//   step: () => JSX.Element;
//   activeIndex: number;
//   staffData: StaffResult[];
//   refreshStaff: () => void;
//   mutate: (data: AddStaffPayload) => Promise<{ message: string }>;
//   loading: boolean;
//   error: string | null;
// }
interface StaffContextType {
  updateIndex: (index: number) => void
  step: (props: { staffId: string }) => JSX.Element // <-- Update here
  activeIndex: number
  staffData: StaffResult[]
  refreshStaff: () => void
  mutate: (data: AddStaffPayload) => Promise<{ message: string }>
  loading: boolean
  error: string | null
}

export const StaffContext = createContext<StaffContextType>({
  updateIndex: (index: number) => {},
  step: () => <></>,
  activeIndex: 0,
  staffData: [],
  refreshStaff: () => {},
  mutate: async (data: AddStaffPayload) => ({ message: '' }),
  loading: false,
  error: null,
})

const StaffContextProvider = ({ children }: { children: ReactNode }) => {
  const Elements = [TeacherDetail, LessonTable, TimeTable]
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [staffData, setStaffData] = useState<StaffResult[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState<number>(0)

  const fetchStaffs = async () => {
    setLoading(true)
    setError(null)
    try {
      const response: StaffResponse = await getStaffs(10, 1)
      setStaffData(response?.data?.result ?? [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch staff'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaffs()
  }, [refreshKey])

  const refreshStaff = () => {
    setRefreshKey(prev => prev + 1) // Trigger re-fetch
  }

  const mutate = async (data: AddStaffPayload) => {
    setLoading(true)
    try {
      const response = await addStaff(data)
      setRefreshKey(prev => prev + 1) // Trigger re-fetch after mutation
      return { message: 'Staff created successfully' } // Adjust based on actual API response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add staff'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateIndex = (index: number) => {
    setActiveIndex(index)
  }

  const step = activeIndex < 3 ? activeIndex : 2
  const value = {
    updateIndex,
    step: Elements[step],
    activeIndex,
    staffData,
    refreshStaff,
    mutate,
    loading,
    error,
  }

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>
}

export function useStaff() {
  const { step, updateIndex, activeIndex, staffData, refreshStaff, mutate, loading, error } = useContext(StaffContext)
  return { step, updateIndex, activeIndex, staffData, refreshStaff, mutate, loading, error }
}

export default StaffContextProvider
