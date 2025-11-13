import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  isActive?: boolean
}

export const Header = ({ isActive = true }: HeaderProps) => {
  const router = useRouter()

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Parent Dashboard</h1>
              <p className="text-sm text-muted-foreground">View and manage parent information</p>
            </div>
          </div>
          <Badge variant={isActive ? 'default' : 'secondary'} className="text-sm">
            {isActive ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Active
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-1" />
                Inactive
              </>
            )}
          </Badge>
        </div>
      </div>
    </header>
  )
}