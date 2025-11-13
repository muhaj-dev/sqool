import { Bell, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Notice } from '@/types'

interface NoticesCardProps {
  notices: Notice[]
}

export const NoticesCard = ({ notices }: NoticesCardProps) => {
  const formatDate = (date: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Card className="w-full h-[400px] overflow-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Recent Notices ({notices?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notices && notices.length > 0 ? (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {notices.slice(0, 5).map((notice) => (
              <Card key={notice._id} className={notice.isPinned ? 'border-primary' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{notice.title || 'Untitled Notice'}</CardTitle>
                        {notice.isPinned && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            Pinned
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {notice.content || 'No content available.'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <Badge variant="outline">{notice.notificationType || 'general'}</Badge>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(notice.expirationDate)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notices available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}