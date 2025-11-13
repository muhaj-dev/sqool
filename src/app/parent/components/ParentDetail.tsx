'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/zustand/authStore'
import { useToast } from '@/components/ui/use-toast'
import { getParentDashboard } from '@/utils/api'
import { ExaminationCard } from '@/app/staff/components/dashboard/ExaminationCard'

// Components
import { LoadingState } from './LoadingState'
import { Header } from './Header'
import { ParentInfoCard } from './ParentInfoCard'
import { QuickActionsCard } from './QuickActionsCard'
import { StatsCards } from './StatsCards'
import { ChildrenCard } from './ChildrenCard'
import { NoticesCard } from './NoticesCard'

// Types
import { ParentData, Child, Notice, Expense, User } from '@/types'

// Mock data - replace with actual API call
const mockParentData: ParentData = {
  _id: '683112addb58d74f5da0511b',
  userId: '683112addb58d74f5da05119',
  children: ['683112addb58d74f5da05120'],
  occupation: 'Lecturer',
  schools: ['6828ae29252ba86fcc693144'],
  isActive: true,
  user: {
    _id: '683112addb58d74f5da05119',
    firstName: 'Adewale',
    lastName: 'Okonkwo',
    email: 'adewale.okonkwo@email.com',
    phone: '+234 803 456 7890',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adewale',
  },
  childrenDetails: [
    {
      _id: '683112addb58d74f5da05120',
      firstName: 'Chioma',
      lastName: 'Okonkwo',
      class: {
        _id: '6828ae29252ba86fcc693144',
        className: 'JSS 2A',
        levelType: 'Junior Secondary',
      },
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma',
    },
  ],
}

// Create a type that works with both User and AuthUser
type DisplayUser = (User & { _id: string }) | { _id?: string; firstName?: string; lastName?: string; email?: string; phone?: string; photo?: string; role?: string; school?: { name: string } }

const ParentDetail = () => {
  const router = useRouter()
  const { user } = useAuthStore.getState()
  const { toast } = useToast()
  const [parent, setParent] = useState<ParentData>(mockParentData)
  
  // Dashboard data states
  const [children, setChildren] = useState<Child[]>([])
  const [notices, setNotices] = useState<Notice[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use auth user data to enhance parent information
  const displayUser: DisplayUser = user || parent?.user
  const schoolName = displayUser?.school?.name || 'Al-Faruq'

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await getParentDashboard()
        setChildren(response?.data?.children || [])
        setNotices(response?.data?.notices || [])
        setExpenses(response?.data?.expenses || [])
        setError(null)

        // Save to localStorage
        localStorage.setItem('parentDashboard', JSON.stringify(response?.data?.children))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  if (loading) {
    return <LoadingState />
  }

  const activeNoticesCount = notices?.filter(n => n?.isActive).length || 0

  return (
    <div className="min-h-screen bg-background">
      <Header isActive={parent?.isActive} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
          {/* Parent Information Card */}
          <ParentInfoCard 
            user={displayUser}
            occupation={parent?.occupation}
            schoolName={schoolName}
          />

          {/* Children and Additional Info */}
          <div className="lg:col-span-2 space-y-6">
            <QuickActionsCard />

            {/* Quick Stats Cards */}
            <StatsCards 
              childrenCount={children?.length || 0}
              activeNoticesCount={activeNoticesCount}
              pendingExpensesCount={expenses?.length || 0}
            />

            {/* Children Card */}
            <ChildrenCard children={children} />

            {/* Notices and Examination Cards */}
            <div className="flex items-center justify-between gap-5">
              <NoticesCard notices={notices} />
              <div className="w-full h-[400px] overflow-auto">
                <ExaminationCard />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ParentDetail