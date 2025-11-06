import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'

const lessons = [
  { subject: 'Mathematics', class: 'Primary 3', time: '9:00 AM - 10:00 AM', room: 'Room 204' },
  { subject: 'Science', class: 'Primary 3', time: '10:30 AM - 11:30 AM', room: 'Room 204' },
  { subject: 'Mathematics', class: 'Primary 5', time: '2:00 PM - 3:00 PM', room: 'Room 308' },
]

export function UpcomingLessons() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Lessons</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <div key={index} className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-sm">{lesson.subject}</h4>
                  <span className="text-xs text-muted-foreground">{lesson.room}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{lesson.class}</p>
                <p className="text-xs text-primary font-medium">{lesson.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
