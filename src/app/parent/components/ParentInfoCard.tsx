import { Mail, Phone, Briefcase, School, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

// Define the same DisplayUser type here or import it
interface DisplayUser {
  _id?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  phoneId?: {
    phoneNumber: string
  }
  photo?: string
  role?: string
  school?: {
    name: string
  }
}

interface ParentInfoCardProps {
  user: DisplayUser
  occupation?: string
  schoolName: string
}

export const ParentInfoCard = ({ user, occupation, schoolName }: ParentInfoCardProps) => {
  const displayName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
  const avatarInitials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`
  const phoneNumber = user?.phoneId?.phoneNumber || user?.phone
  const email = user?.email

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Parent Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-32 w-32 mb-4">
            <AvatarImage src={user?.photo} alt={displayName} />
            <AvatarFallback className="text-3xl">{avatarInitials || 'P'}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{displayName || 'Parent'}</h2>
          <p className="text-muted-foreground">Parent</p>
          <Badge variant="secondary" className="mt-2">
            {schoolName}
          </Badge>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{email || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{phoneNumber || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Occupation</p>
                <p className="font-medium">{occupation || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <School className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">School</p>
              <p className="font-medium">{schoolName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium capitalize">{user?.role || 'Parent'}</p>
            </div>
          </div>
        </div>

        <Separator />
      </CardContent>
    </Card>
  )
}