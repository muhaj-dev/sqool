import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, MapPin, Monitor } from 'lucide-react'
import { Class, Subject, Session } from '@/types'

interface ExamFormData {
  subject: string
  class: string
  examDate: string
  startTime: string
  endTime: string
  venue: string
  mode: string
  sessionId: string
}

interface ExamBasicDetailsFormProps {
  examData: ExamFormData
  setExamData: (data: ExamFormData) => void
  classes: any[]
  subjects: any[]
  sessions: any[]
  isLoading: boolean
  isEditMode?: boolean // Add this line
}

// interface ExamBasicDetailsFormProps {
//   examData: ExamFormData;
//   setExamData: (data: ExamFormData) => void;
//   classes: Class[];
//   subjects: Subject[];
//   sessions: Session[];
//   isLoading: boolean;
// }

export const ExamBasicDetailsForm: React.FC<ExamBasicDetailsFormProps> = ({
  examData,
  setExamData,
  classes,
  subjects,
  sessions,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
              <div className="h-10 bg-muted rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
              <div className="h-10 bg-muted rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Select value={examData.subject} onValueChange={value => setExamData({ ...examData, subject: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects?.length > 0 ? (
                subjects.map(subject => (
                  <SelectItem key={subject?._id} value={subject?._id ?? ''}>
                    {subject?.name ?? 'Unknown Subject'} {subject?.code && `(${subject.code})`}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-subjects" disabled>
                  No subjects available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="class">Class *</Label>
          <Select value={examData.class} onValueChange={value => setExamData({ ...examData, class: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes?.length > 0 ? (
                classes.map(classItem => (
                  <SelectItem key={classItem?._id} value={classItem?._id ?? ''}>
                    {classItem?.className ?? 'Unknown Class'}({classItem?.shortName})
                    {classItem?.classSection && ` - ${classItem.classSection}`}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-classes" disabled>
                  No classes available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sessionId">Session *</Label>
          <Select value={examData.sessionId} onValueChange={value => setExamData({ ...examData, sessionId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select session" />
            </SelectTrigger>
            <SelectContent>
              {sessions?.length > 0 ? (
                sessions.map(session => (
                  <SelectItem key={session?._id} value={session?._id ?? ''}>
                    {session?.session ?? 'Unknown Session'}
                    {session?.isActive && ' (Active)'}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-sessions" disabled>
                  No sessions available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rest of the form remains the same */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="examDate" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Exam Date *
          </Label>
          <Input
            id="examDate"
            type="date"
            value={examData.examDate}
            onChange={e => setExamData({ ...examData, examDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Start Time *
          </Label>
          <Input
            id="startTime"
            type="time"
            value={examData.startTime}
            onChange={e => setExamData({ ...examData, startTime: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            End Time *
          </Label>
          <Input
            id="endTime"
            type="time"
            value={examData.endTime}
            onChange={e => setExamData({ ...examData, endTime: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="venue" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Venue
          </Label>
          <Input
            id="venue"
            placeholder="e.g., Room 101, Main Hall"
            value={examData.venue}
            onChange={e => setExamData({ ...examData, venue: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mode" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Exam Mode
          </Label>
          <Select value={examData.mode} onValueChange={value => setExamData({ ...examData, mode: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
