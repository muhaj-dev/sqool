"use client"
import { ReactNode, createContext, useContext, ComponentType, useState, useEffect } from "react"
import StudyProgress from "@/components/student/graphs"
import StudentProfile from "@/components/student/StudentProfile"
import AttendanceTable from "@/components/student/tables/AttendanceTable"
import { getStudentById } from "@/utils/api"
import { ISingleStudent, StudentResponse } from "@/types"

// Define the props interface for components
interface StepComponentProps {
  studentId: string;
  studentData: ISingleStudent | null; // Changed to ISingleStudent | null to match context
}

// Define the context value type
interface StudentContextValue {
  updateIndex: (index: number) => void;
  step: ComponentType<StepComponentProps>;
  activeIndex: number;
  studentId: string;
  studentData: ISingleStudent | null;
  loading: boolean;
  error: string | null;
}

export const StudentContext = createContext<StudentContextValue>({
  updateIndex: (index: number): void => {},
  step: StudentProfile,
  activeIndex: 0,
  studentId: "",
  studentData: null,
  loading: false,
  error: null,
})

const StudentContextProvider = ({ children, studentId }: { children: ReactNode; studentId: string }) => {
  const Elements: ComponentType<StepComponentProps>[] = [
    StudentProfile,
    StudyProgress,
    AttendanceTable,
    AttendanceTable,
  ]
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [studentData, setStudentData] = useState<ISingleStudent | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const updateIndex = (index: number) => {
    setActiveIndex(index)
  }

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) return;
      setLoading(true)
      setError(null)
      try {
        const response: StudentResponse = await getStudentById(studentId)
        setStudentData(response.data)
        console.log(response.data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch student"
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  }, [studentId])

  const step = Elements[activeIndex < Elements.length ? activeIndex : Elements.length - 1]
  const value = { updateIndex, step, activeIndex, studentId, studentData, loading, error }

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  )
}

export function useStudent(): StudentContextValue {
  const context = useContext(StudentContext)
  if (!context) {
    throw new Error("useStudent must be used within a StudentContextProvider")
  }
  return context
}

export default StudentContextProvider