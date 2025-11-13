import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export const QuickActionsCard = () => {
  const router = useRouter()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button variant="outline" className="justify-start" onClick={() => router.push(`/parent/fees`)}>
            View Fee Records
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => router.push(`/parent/notices`)}>
            View All Notices
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}