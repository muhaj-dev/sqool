import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock } from 'lucide-react'

const exams = [
  { subject: 'Mathematics', class: 'Primary 3', date: 'Dec 15, 2025', time: '9:00 AM' },
  { subject: 'Science', class: 'Primary 5', date: 'Dec 16, 2025', time: '10:00 AM' },
]

export function ExaminationCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Examinations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exams.map((exam, index) => (
            <div key={index} className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Calendar className="h-4 w-4 text-warning" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">{exam.subject}</h4>
                <p className="text-xs text-muted-foreground mb-2">{exam.class}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {exam.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {exam.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
