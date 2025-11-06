'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { School, Role } from '@/types'

interface SchoolSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schools: School[]
  onSchoolSelect: (school: School) => void
}

export const SchoolSelectionModal = ({ open, onOpenChange, schools, onSchoolSelect }: SchoolSelectionModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="lg:max-w-[40%] w-[500px]">
        <DialogHeader>
          <DialogTitle>Select School</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {schools.map(school => (
            <div
              key={school.schoolId._id}
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => onSchoolSelect(school)}
            >
              <h3 className="font-medium">{school.schoolId.name}</h3>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface RoleSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  school: School | null
  onRoleSelect: (role: Role) => void
}

export const RoleSelectionModal = ({ open, onOpenChange, school, onRoleSelect }: RoleSelectionModalProps) => {
  if (!school) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="lg:max-w-[40%] w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Role</DialogTitle>
          <p className="text-sm text-gray-500">{school.schoolId.name}</p>
        </DialogHeader>
        <div className="space-y-4">
          {school.roles.map(role => (
            <div
              key={role}
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => onRoleSelect(role as Role)}
            >
              <h3 className="font-medium capitalize">{role}</h3>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
