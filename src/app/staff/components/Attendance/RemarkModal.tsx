'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StudentAttendance } from '@/types'
import { useState, useEffect } from 'react'
import { useAttendanceStore } from '@/zustand/staff/useAttendanceStore'
import { toast } from '@/components/ui/use-toast'

interface RemarkModalProps {
  student: StudentAttendance | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RemarkModal({ student, open, onOpenChange }: RemarkModalProps) {
  const { attendance, updateAttendance } = useAttendanceStore()
  const [remark, setRemark] = useState('')

  useEffect(() => {
    if (student && open) {
      setRemark(attendance[student.id]?.remarks || '')
    }
  }, [student, open, attendance])

  const handleSave = () => {
    if (student) {
      updateAttendance(student.id, { remarks: remark })
      toast({
        title: 'Remark Success',
        description: 'Remark Saved successfully',
      })
      onOpenChange(false)
    }
  }

  if (!student) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Remark</DialogTitle>
          <DialogDescription>Add or edit a remark for {student.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Student: <span className="text-muted-foreground">{student.name}</span>
            </label>
            <label className="text-sm text-muted-foreground block">Roll Number: {student.rollNumber}</label>
          </div>

          <Textarea
            placeholder="Enter your remark here..."
            value={remark}
            onChange={e => setRemark(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Remark</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
