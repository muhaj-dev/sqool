'use client'
import React, { useEffect, useState } from 'react'
import { Separator } from '../ui/separator'
import { getStaffById } from '@/utils/api'
import { StaffResult, SingleStaffResponse } from '@/types'

console.log()
const TeacherDetail = ({ staffId }: { staffId: string }) => {
  const [staff, setStaff] = useState<StaffResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true)
      setError(null)
      try {
        const response: SingleStaffResponse = await getStaffById(staffId)
        console.log(response)
        setStaff(response?.data ?? null)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch staff details'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    if (staffId) {
      fetchStaff()
    }
  }, [staffId])

  if (loading) {
    return <div className="bg-white min-w-[25%] py-8 px-4 max-h-screen">Loading...</div>
  }

  if (error || !staff) {
    return (
      <div className="bg-white min-w-[25%] py-8 px-4 max-h-screen">
        <p className="text-red-500">{error || 'Staff not found'}</p>
      </div>
    )
  }

  const fullName = staff.userId ? `${staff.userId?.firstName} ${staff.userId?.lastName}` : 'Unknown Staff'
  const address = staff.address ?? '-- --'
  const aboutMe = staff.aboutMe ?? '-- --'

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Personal Info</h2>
      <section className="grid grid-cols-2 gap-y-4">
        <div className="flex flex-col  max-w-[300px]">
          <p className="text-muted-foreground">Full Name</p>
          <p>{fullName}</p>
        </div>
        <div className="flex flex-col  max-w-[300px]">
          <p className="text-muted-foreground">Gender</p>
          <p>Male</p>
        </div>
        <div className="flex flex-col  max-w-[300px]">
          <p className="text-muted-foreground">Date of Birth</p>
          <p>
            March 23, 1995 <span className="text-muted-foreground">(26 y.o)</span>{' '}
          </p>
        </div>
        <div className="flex flex-col  max-w-[300px]">
          <p className="text-muted-foreground">Language</p>
          <p>English, French,</p>
        </div>
        <div className="flex flex-col  max-w-[300px]">
          <p className="text-muted-foreground">Address</p>
          <p>{address}</p>
        </div>
      </section>
      <Separator />
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">More Details</h2>
        <p className="text-muted-foreground">About Me</p>
        <p>{aboutMe}</p>
        <div className="flex gap-8">
          <div className="flex flex-col  max-w-[200px]">
            <p className="text-muted-foreground">Employed Date</p>
            <p>March 23, 1999</p>
          </div>
          <div className="flex flex-col  max-w-[200px]">
            <p className="text-muted-foreground">Total year spends with us</p>
            <p>6 Years</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TeacherDetail
