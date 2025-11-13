import { Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Child } from '@/types'
import { useRouter } from 'next/navigation'

interface ChildrenCardProps {
  children: Child[]
}

export const ChildrenCard = ({ children }: ChildrenCardProps) => {
  const router = useRouter()

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  const getGenderColor = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'female':
        return 'bg-pink-100 text-pink-800 border-pink-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (date: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Children ({children?.length || 0})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {children && children.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children.map((child) => (
              <Card
                key={child._id}
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/parent/kid/${child._id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`/images/user.png`} alt={`${child.firstName} ${child.lastName}`} />
                      <AvatarFallback>{getInitials(child.firstName, child.lastName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {child.firstName} {child.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {child.class?.className || 'N/A'} - {child.class?.levelType || 'N/A'}
                      </p>
                      <Badge variant="outline" className={getGenderColor(child.gender || '')}>
                        {child.gender || 'N/A'}
                      </Badge>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Enrolled: {formatDate(child.createdAt || '')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No children registered</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
