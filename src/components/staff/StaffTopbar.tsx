import { MoveLeft } from 'lucide-react'
import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '../ui/separator'
import Link from 'next/link'
import { toast } from '@/components/ui/use-toast' // Assuming you have a toast library
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { updateStaffStatus } from '@/utils/api'
// import {
//   // DialogContent,
//   // DialogHeader,
//   // DialogFooter,
//   // DialogTitle,
//   // DialogDescription,
//   DialogClose,
// } from "@radix-ui/react-dialog"; // Additional Dialog components
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
interface Props {
  staffId: string
}

const StaffTopbar = ({ staffId }: Props) => {
  const [status, setStatus] = useState<'enable' | 'disable' | null>(null)
  const [open, setOpen] = useState(false) // State to control modal visibility

  const handleStatusChange = (value: string) => {
    setStatus(value as 'enable' | 'disable')
    setOpen(true) // Open modal when a status is selected
  }

  const handleUpdateStatus = async () => {
    if (!staffId || !status) {
      toast({
        title: 'Error',
        description: 'Please select a status and ensure a valid staff ID.',
        variant: 'destructive',
      })
      setOpen(false) // Close modal on error
      return
    }

    try {
      const isActive = status === 'enable' // Map "enable" to true, "disable" to false
      await updateStaffStatus(staffId, isActive)
      toast({
        title: 'Success',
        description: `Staff member has been ${status}ed successfully.`,
      })
      setOpen(false) // Close modal on success
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update staff status'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <div className="flex items-center justify-between my-4">
        <Link
          href="/admin/staff"
          className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 py-2 px-4 rounded-md"
        >
          <MoveLeft />
          <p>Back</p>
        </Link>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Select onValueChange={handleStatusChange} value={status || undefined}>
              <SelectTrigger className="w-[120px] text-primary">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enable">Enable</SelectItem>
                <SelectItem value="disable">Disable</SelectItem>
              </SelectContent>
            </Select>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>
                {status === 'disable'
                  ? 'Are you sure you want to deactivate this staff?'
                  : 'Are you sure you want to activate this staff?'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-4 justify-end">
              <div>
                <button className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 border-1 border-primary">
                  Close
                </button>
              </div>
              <button
                onClick={handleUpdateStatus}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/40"
              >
                {status === 'disable' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Separator />
    </>
  )
}

export default StaffTopbar
