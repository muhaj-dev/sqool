'use client'

import * as React from 'react'
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Loader2 } from 'lucide-react'
import { useTimetable } from '@/hooks/useTimeTable'
import { ClassSchedule, TimetableView } from '@/types'
import { getSubjectsForStaff } from '@/utils/api'

const data: Period[] = [
  {
    id: 1,
    time: '9:40 am - 10:20 am',
    subject: 'Physics',
    topic: 'Nuclear Boom',
    class: 'SS1',
    status: 'Attend',
  },
  {
    id: 2,
    time: '9:40 am - 10:20 am',
    subject: 'Physics',
    topic: 'Nuclear Boom',
    class: 'SS1',
    status: 'Attend',
  },
  {
    id: 3,
    time: '9:40 am - 10:20 am',
    subject: 'Physics',
    topic: 'Nuclear Boom',
    class: 'SS1',
    status: 'Cancel',
  },
  {
    id: 4,
    time: '9:40 am - 10:20 am',
    subject: 'Physics',
    topic: 'Nuclear Boom',
    class: 'SS1',
    status: 'Cancel',
  },
  {
    id: 5,
    time: '9:40 am - 10:20 am',
    subject: 'Physics',
    topic: 'Nuclear Boom',
    class: 'SS1',
    status: 'Up coming',
  },
]

export type Period = {
  id: number
  time: string
  subject: string
  topic: string
  class: string
  status: 'Attend' | 'Cancel' | 'Up coming'
}

export const columns: ColumnDef<Period>[] = [
  {
    accessorKey: 'time',
    header: 'Time',
    cell: ({ row }) => <div className="capitalize">{row.getValue('time')}</div>,
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => <div className="capitalize">{row.getValue('subject')}</div>,
  },
  {
    accessorKey: 'topic',
    header: 'Topic',
    cell: ({ row }) => <div className="capitalize">{row.getValue('topic')}</div>,
  },
  {
    accessorKey: 'class',
    header: 'Class',
    cell: ({ row }) => <div className="capitalize">{row.getValue('class')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status')
      return (
        <div className="w-full">
          {status === 'Attend' ? (
            <div className="capitalize w-[110px] bg-[#20C9AC1A] text-[#20C9AC] py-2 px-5 rounded-md flex justify-center items-center">
              Attend
            </div>
          ) : status === 'Cancel' ? (
            <div className="capitalize w-[110px] bg-[#FC34001A] text-[#FC3400] py-2 px-5 rounded-md flex justify-center items-center">
              Cancel
            </div>
          ) : (
            <div className="capitalize w-[110px] bg-[#00A5FF1A] text-[#00A5FF] py-2 px-5 rounded-md flex justify-center items-center">
              Edit
            </div>
          )}
        </div>
      )
    },
  },
]

export const TeacherTimeTable = ({ staffId }: { staffId: string }) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const { schedules, loading, error, refetch } = useTimetable()
  const [staffSubjects, setStaffSubjects] = React.useState<any[]>([])
  const [subjectLoading, setSubjectLoading] = React.useState(false)

  React.useEffect(() => {
    const fetchSubjects = async () => {
      setSubjectLoading(true)
      try {
        const res = await getSubjectsForStaff(1, '')
        setStaffSubjects(res.data || [])
      } catch {
        setStaffSubjects([])
      } finally {
        setSubjectLoading(false)
      }
    }
    fetchSubjects()
  }, [])

  // Group schedules by day
  const groupSchedulesByDay = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const grouped: { [key: string]: ClassSchedule[] } = {}

    days.forEach(day => {
      grouped[day] = schedules.filter(schedule => schedule.day.toLowerCase() === day.toLowerCase())
    })

    return grouped
  }

  // Find current and next classes
  const getCurrentClassesInfo = () => {
    const now = new Date()
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' })

    const todaySchedules = schedules.filter(schedule => schedule.day.toLowerCase() === currentDay.toLowerCase())

    const currentClass = todaySchedules.find(schedule => {
      const start = new Date(schedule.startTime)
      const end = new Date(schedule.endTime)
      return now >= start && now <= end
    })

    const nextClass = todaySchedules.find(schedule => {
      const start = new Date(schedule.startTime)
      return start > now
    })

    const completedClasses = todaySchedules.filter(schedule => {
      const end = new Date(schedule.endTime)
      return end < now
    }).length

    return {
      currentClass,
      nextClass,
      completedClasses,
      totalToday: todaySchedules.length,
    }
  }

  const getSubjectColor = (subjectName: string) => {
    const colorMap: { [key: string]: string } = {
      arabic: 'bg-blue-100 text-blue-800 border-blue-200',
      mathematics: 'bg-green-100 text-green-800 border-green-200',
      physics: 'bg-purple-100 text-purple-800 border-purple-200',
      chemistry: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      english: 'bg-red-100 text-red-800 border-red-200',
      biology: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      science: 'bg-orange-100 text-orange-800 border-orange-200',
      history: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      geography: 'bg-pink-100 text-pink-800 border-pink-200',
    }
    return colorMap[subjectName.toLowerCase()] || 'bg-gray-100 text-gray-600 border-gray-200'
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  })

  const schedulesByDay = groupSchedulesByDay()
  const { currentClass, nextClass, completedClasses, totalToday } = getCurrentClassesInfo()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Timetable</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>Home</span>
              <span>›</span>
              <span>Timetable</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading timetable...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Timetable</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>Home</span>
              <span>›</span>
              <span>Timetable</span>
            </div>
          </div>
        </div>
        <div className="text-center py-12 text-red-500">
          <p>Error: {error}</p>
          <Button onClick={refetch} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Timetable</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span>Home</span>
            <span>›</span>
            <span>Timetable</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Today(10/01/24)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Current Class Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Class</p>
              <p className="text-lg font-semibold">{currentClass ? currentClass.subject.name : 'No class'}</p>
              <p className="text-sm text-primary">
                {currentClass
                  ? `${formatTime(currentClass.startTime)} - ${formatTime(currentClass.endTime)}`
                  : 'Free period'}
              </p>
            </div>
            <Clock className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Next Class</p>
              <p className="text-lg font-semibold">{nextClass ? nextClass.subject.name : 'No more classes'}</p>
              <p className="text-sm text-orange-500">
                {nextClass ? `Starts at ${formatTime(nextClass.startTime)}` : 'Day ended'}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Classes Today</p>
              <p className="text-2xl font-bold">{totalToday}</p>
              <p className="text-sm text-green-500">{completedClasses} Completed</p>
            </div>
            <Badge variant={currentClass ? 'default' : 'outline'}>{currentClass ? 'Active' : 'Inactive'}</Badge>
          </div>
        </Card>
      </div>

      {/* Weekly Timetable */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Timetable</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(schedulesByDay).map(([day, periods]) => (
              <div key={day} className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">{day}</h3>
                {periods.length === 0 ? (
                  <div className="p-4 rounded-lg border border-dashed bg-muted/50 text-center text-muted-foreground">
                    No classes scheduled for {day}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {periods.map(period => (
                      <div
                        key={period._id}
                        className={`p-4 rounded-lg border bg-card hover:shadow-md transition-shadow`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium capitalize">{period.subject.name}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {period?.classLevel?.name || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>
                              {formatTime(period.startTime)} - {formatTime(period.endTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subject Legend */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Subjects</h3>
          {subjectLoading ? (
            <div className="text-muted-foreground">Loading subjects...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {staffSubjects.map(subject => (
                <div
                  key={subject._id}
                  className={`px-2 py-1 rounded text-xs font-medium border text-center ${getSubjectColor(
                    subject.name,
                  )}`}
                >
                  <div className="font-semibold capitalize">{subject.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center p-4 justify-between flex-wrap gap-3">
            <div className="flex gap-3 items-center">
              <p className="text-[#25324B] text-sm">Total Attendance</p>
              <p className="font-semibold text-[#25324B] text-sm">100/79</p>
            </div>
          </div>
          <div className="rounded-md">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow className="bg-[#F2F2F2] hover:bg-[#F2F2F2]" key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



const Export = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.23852 14.8117C5.63734 16.3002 6.51616 17.6154 7.73867 18.5535C8.96118 19.4915 10.4591 20 12 20C13.5409 20 15.0388 19.4915 16.2613 18.5535C17.4838 17.6154 18.3627 16.3002 18.7615 14.8117"
      stroke="white"
    />
    <path
      d="M12 4L11.6877 3.60957L12 3.35969L12.3123 3.60957L12 4ZM12.5 13C12.5 13.2761 12.2761 13.5 12 13.5C11.7239 13.5 11.5 13.2761 11.5 13L12.5 13ZM6.68765 7.60957L11.6877 3.60957L12.3123 4.39043L7.31235 8.39043L6.68765 7.60957ZM12.3123 3.60957L17.3123 7.60957L16.6877 8.39043L11.6877 4.39043L12.3123 3.60957ZM12.5 4L12.5 13L11.5 13L11.5 4L12.5 4Z"
      fill="white"
    />
  </svg>
)

const Attended = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7.5" cy="10.5" r="5.25" fill="#7E869E" fill-opacity="0.25" />
    <path d="M4.5 9.75L7.5 12L12.75 5.25" stroke="#20C9AC" stroke-width="1.2" />
  </svg>
)

const Cancel = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="10" r="6.75" fill="#7E869E" fill-opacity="0.25" />
    <path d="M6.75 12.2498L11.25 7.74976" stroke="#FD4B1C" stroke-width="1.2" />
    <path d="M11.25 12.25L6.75 7.75" stroke="#FD4B1C" stroke-width="1.2" />
  </svg>
)
