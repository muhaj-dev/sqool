// src/app/staff/[staffId]/page.tsx
'use client'
import LeftBar from '@/components/staff/LeftBar'
import StaffSteps from '@/components/staff/StaffSteps'
import StaffTopbar from '@/components/staff/StaffTopbar'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getStaffById } from '@/utils/api'
import { StaffResult, SingleStaffResponse, StaffSchedule } from '@/types'

const Page = () => {
  const pathname = usePathname()
  const [staffId, setStaffId] = useState('')
  const [staffData, setStaffData] = useState<{
    staff: StaffResult | null
    staffSchedules: StaffSchedule[]
  }>({
    staff: null,
    staffSchedules: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Extract the id from the pathname
    const pathSegments = pathname?.split('/') ?? []
    const extractedStaffId = pathSegments[pathSegments.length - 1]
    
    if (extractedStaffId && extractedStaffId !== 'staff') {
      setStaffId(extractedStaffId)
      console.log('Staff ID:', extractedStaffId)
    }
  }, [pathname])

  useEffect(() => {
    const fetchStaff = async () => {
      if (!staffId) return
      
      setLoading(true)
      setError(null)
      
      try {
        const response: SingleStaffResponse = await getStaffById(staffId)
        setStaffData({
          staff: response.data.staff,
          staffSchedules: response.data.staffSchedules
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch staff details'
        setError(errorMessage)
        console.error('Error fetching staff:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStaff()
  }, [staffId])

  return (
    <>
      <StaffTopbar staffId={staffId} />
      <section className="flex gap-8 flex-col lg:flex-row w-full">
        <LeftBar 
          staffId={staffId} 
          staff={staffData.staff} 
          loading={loading} 
          error={error} 
        />
        <div className="bg-white flex-1 rounded-md">
          <StaffSteps 
            staffId={staffId} 
            staff={staffData.staff}
            staffSchedules={staffData.staffSchedules}
          />
        </div>
      </section>
    </>
  )
}

export default Page