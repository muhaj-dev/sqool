"use client";
import {
  type ComponentType,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import StudyProgress from "@/components/student/graphs";
import StudentProfile from "@/components/student/StudentProfile";
import AttendanceTable from "@/components/student/tables/AttendanceTable";
import { type ISingleStudent, type StudentResponse } from "@/types";
import { getStudentById } from "@/utils/api";

// Define the props interface for components
interface StepComponentProps {
  studentId: string;
  studentData: ISingleStudent | null;
}

// Define the context value type
interface StudentContextValue {
  updateIndex: (index: number) => void;
  StepComponent: React.ReactNode; // Changed to ReactNode
  activeIndex: number;
  studentId: string;
  studentData: ISingleStudent | null;
  loading: boolean;
  error: string | null;
}

export const StudentContext = createContext<StudentContextValue>({
  updateIndex: (index: number): void => {},
  StepComponent: null,
  activeIndex: 0,
  studentId: "",
  studentData: null,
  loading: false,
  error: null,
});

const StudentContextProvider = ({
  children,
  studentId,
}: {
  children: ReactNode;
  studentId: string;
}) => {
  const Elements: ComponentType<StepComponentProps>[] = [
    StudentProfile,
    StudyProgress,
    AttendanceTable,
  ];
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [studentData, setStudentData] = useState<ISingleStudent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateIndex = (index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) return;
      setLoading(true);
      setError(null);
      try {
        const response: StudentResponse = await getStudentById(studentId);
        setStudentData(response.data);
        console.log(response.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch student";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    void fetchStudent();
  }, [studentId]);

  const CurrentComponent =
    Elements[activeIndex < Elements.length ? activeIndex : Elements.length - 1];

  // Create the component with props already bound
  const StepComponent = CurrentComponent ? (
    <CurrentComponent studentId={studentId} studentData={studentData} />
  ) : null;

  const value = {
    updateIndex,
    StepComponent,
    activeIndex,
    studentId,
    studentData,
    loading,
    error,
  };

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
};

export function useStudent(): StudentContextValue {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentContextProvider");
  }
  return context;
}

export default StudentContextProvider;
