import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Instagram, Mail, Smartphone, Star, Twitter } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useStaffProfile } from '@/hooks/useStaffProfile'

const AgentProfile = ({
  togglePersonalInfo,
  showPersonalInfo,
}: {
  togglePersonalInfo: () => void
  showPersonalInfo: boolean
}) => {
  const { staffData, loading, error } = useStaffProfile()

  // Calculate years of experience
  const calculateExperience = (experienceDate: string) => {
    const startDate = new Date(experienceDate)
    const currentDate = new Date()
    const years = currentDate.getFullYear() - startDate.getFullYear()
    return years > 0 ? `${years} Years` : 'Less than a year'
  }

  // Format date of birth with age
  const formatDateOfBirth = (dob: string) => {
    const birthDate = new Date(dob)
    const currentDate = new Date()
    const age = currentDate.getFullYear() - birthDate.getFullYear()
    const formattedDate = birthDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    return `${formattedDate} (${age} y.o)`
  }

  if (loading) {
    return (
      <div className="py-6 px-4 border-2 min-[850px]:border-none border-[#F8F8FD] flex flex-col gap-4">
        <div className="animate-pulse">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 bg-gray-300 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !staffData) {
    return (
      <div className="py-6 px-4 border-2 min-[850px]:border-none border-[#F8F8FD] flex flex-col gap-4">
        <div className="text-red-500 text-center">Error loading profile</div>
      </div>
    )
  }

  const fullName = `${staffData.firstName} ${staffData.lastName}`
  const initials = `${staffData.firstName.charAt(0)}${staffData.lastName.charAt(0)}`

  return (
    <div className="py-6 px-4 border-2 min-[850px]:border-none border-[#F8F8FD] flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/images/user.png" alt={fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center items-baseline">
          <p className="text-lg min-[850px]:text-xl font-semibold">{fullName}</p>
          <p>ID {staffData.userId.slice(-6)}</p>
          <div className="flex items-center gap-1">
            <Star className="text-yellow-400" size={20} />
            <span className="text-[18px]">4.0</span>
          </div>
        </div>
      </div>

      <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2">
        <p className="text-muted-foreground">Teaching Role</p>
        <Separator />
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">{staffData?.primarySubject}</p>
          <span className="bg-[#5542F61A] px-2 py-1 rounded-sm text-[#5542F6]">{staffData.level}</span>
        </div>
      </div>

      <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Qualification</p>
          <p className="">{staffData.qualification}</p>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Experience</p>
          <p className="">{calculateExperience(staffData.experience)}</p>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <p className="text-xl">Contact</p>
        <div className="flex gap-6">
          <Mail className="text-muted-foreground" size={20} />
          <div>
            <p className="text-muted-foreground">Phone</p>
            <p className="text-[14px]">{staffData?.phoneId?.phoneNumber}</p>
          </div>
        </div>

        {staffData.phone && (
          <div className="flex gap-6">
            <Smartphone className="text-muted-foreground" size={23} />
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="text-[14px]">{staffData.phone}</p>
            </div>
          </div>
        )}

        {/* <div className="flex gap-6">
          <Instagram className="text-muted-foreground" size={20} />
          <div>
            <p className="text-muted-foreground">Instagram</p>
            <p className="text-[14px]">instagram.com/{staffData.firstName.toLowerCase()}{staffData.lastName.toLowerCase()}</p>
          </div>
        </div>
        
        <div className="flex gap-6">
          <Twitter className="text-muted-foreground" size={22} />
          <div>
            <p className="text-muted-foreground">Twitter</p>
            <p className="text-[14px]">twitter.com/{staffData.firstName.toLowerCase()}{staffData.lastName.toLowerCase()}</p>
          </div>
        </div> */}

        <button
          onClick={togglePersonalInfo}
          className="block min-[850px]:hidden mt-4 px-4 py-2 underline text-[#5542F6] w-fit ml-auto"
        >
          {showPersonalInfo ? 'View More' : 'View Less'}
        </button>
      </div>
    </div>
  )
}

export default AgentProfile
