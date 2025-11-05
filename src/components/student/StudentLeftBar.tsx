import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronRight, Instagram, Mail, Smartphone, Star, Twitter, User } from 'lucide-react'
import { Separator } from '../ui/separator'
import MultiLevelProgressBar from '../progressbar'
import { useStudent } from '@/contexts/student-context'

interface StudentLeftBarProps {
  studentId: string
}

const StudentLeftBar = ({ studentId }: StudentLeftBarProps) => {
  const { studentId: contextStudentId, studentData, loading, error } = useStudent()
  const resolvedStudentId = contextStudentId || studentId

  if (loading) {
    return <div>Loading student data...</div>
  }

  if (error || !studentData) {
    return <div>Error: {error || 'Student data not available'}</div>
  }

  const { firstName, lastName, photo, gender } = studentData

  return (
    <div className="bg-white min-w-[25%] py-4 md:py-8 md:px-4 max-h-screen flex flex-col gap-4">
      {/* <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={photo || "/images/user.png"} />
          <AvatarFallback>{`${firstName[0]}${lastName[0]}`}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center items-baseline">
          <p className="text-2xl font-semibold">{`${firstName} ${lastName}`}</p>
          <p>ID {resolvedStudentId.slice(0, 6)}</p> 
          <div className="flex items-center gap-1">
            <Star className="text-yellow-400" size={20} />
            <span className="text-[18px]">4.0</span>
          </div>
        </div>
      </div>
      <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2">
        <p className="text-muted-foreground">Teaching Role</p>
        <Separator />
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold">Physics</p>
          <span className="bg-[#5542F61A] px-2 py-1 rounded-sm text-[#5542F6]">
            Full time
          </span>
        </div>
      </div>
      <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Class</p>
          <p className="">SS 2B</p>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Sub Subject</p>
          <p className="">Chemistry</p>
        </div>
      </div> */}
      {/* <MultiLevelProgressBar completionPercent={70} /> */}
      {/* <Separator /> */}
    </div>
  )
}

export default StudentLeftBar
