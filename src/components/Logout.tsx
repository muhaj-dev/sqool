'use client'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/zustand/authStore'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const { logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/signin')
  }

  return (
    <Button
      onClick={handleLogout}
      className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
      variant="default"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  )
}
