'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/zustand/authStore'
import { LAST_PAGE_VISITED_BEFORE_AUTH } from '@/constants'

export default function useAuthRedirect() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, clearAuth } = useAuthStore()

  useEffect(() => {
    if (!user) {
      // Save the current page
      if (typeof window !== 'undefined') {
        localStorage.setItem(LAST_PAGE_VISITED_BEFORE_AUTH, pathname)
      }
      clearAuth()
      router.push('/signin')
    }
  }, [user, pathname, router, clearAuth])
}
