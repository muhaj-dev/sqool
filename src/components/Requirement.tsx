'use client'
import { Button } from './ui/button'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { CheckCircle2 } from 'lucide-react'

const Requirement = () => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-primary font-semibold text-xl">The follow requirement is needed</DialogTitle>
        <DialogDescription>
          <p className="text-muted-foreground">
            The following information is required depending on the sort of School you run.
          </p>
        </DialogDescription>
        <div className="bg-gray-100 rounded-md p-6 text-primary flex flex-col gap-4 ">
          <h4 className="font-semibold">Secondary school</h4>
          <div className="flex items-center gap-4">
            <CheckCircle2 className="text-[#2EB57E]" /> <span>Full Name</span>
          </div>
          <div className="flex items-center gap-4">
            <CheckCircle2 className="text-[#2EB57E]" /> <span>Founding date</span>
          </div>
          <div className="flex items-center gap-4">
            <CheckCircle2 className="text-[#2EB57E]" /> <span>Logo</span>
          </div>
          <div className="flex items-center gap-4">
            <CheckCircle2 className="text-[#2EB57E]" /> <span>Owner information</span>
          </div>
          <div className="flex items-center gap-4">
            <CheckCircle2 className="text-[#2EB57E]" /> <span>School Address</span>
          </div>
          <div className="flex items-center gap-4">
            <CheckCircle2 className="text-[#2EB57E]" /> <span>School Utility Bill</span>
          </div>
          <div className="flex items-center gap-4">
            <CheckCircle2 className="text-[#2EB57E]" /> <span>School CAC</span>
          </div>
        </div>
        <DialogFooter>
          <DialogClose className="w-full">
            <Button
              variant={'outline'}
              type="submit"
              className="w-full text-primary mt-6 hover:text-yellow-500 font-bold"
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogHeader>
    </DialogContent>
  )
}

export default Requirement
