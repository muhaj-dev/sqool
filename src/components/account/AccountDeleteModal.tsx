"use client"
import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { useState } from "react"

type TProps = {
  account_name: string
  account_no: string
  bank_name: string
}
type Checked = DropdownMenuCheckboxItemProps["checked"]
export function AccountDeleteModal({
  account_name,
  account_no,
  bank_name,
}: TProps) {
  return (
    <div className=" w-full ">
      <div className="flex flex-col">
        <DialogContent className="sm:max-w-[40%] rounded-none  ">
          <DialogClose className=" outline-none border-none absolute bg-white -top-16 right-0 rounded-full w-10 h-10">
            X
          </DialogClose>
          <DialogHeader className="flex flex-col items-center w-[60%] mx-auto my-4">
            <DialogTitle className="text-primaryColor font-semibold text-xl mb-2">
              Delete My Account
            </DialogTitle>
            <DialogDescription className="text-center">
              This will delete the account
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="">
                Bank Name
              </Label>
              <Select disabled>
                <SelectTrigger className="w-full bg-[#E9EBEB]">
                  <SelectValue placeholder={bank_name} />
                </SelectTrigger>
                {/* <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent> */}
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="">
                Account Nunber
              </Label>
              <Input
                id="account_no"
                value={account_no}
                placeholder="Bank name"
                className="bg-[#E9EBEB]"
                disabled
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="">
                Account Name
              </Label>
              <Input
                id="account_no"
                value={account_name}
                placeholder="Bank name"
                className="bg-[#E9EBEB]"
                disabled
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose
              type="submit"
              className="w-full p-2 outline-none  bg-transparent text-red-600 border hover:bg-slate-100"
            >
              Delete Bank
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </div>
    </div>
  )
}
