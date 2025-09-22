"use client"
import React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"

const Action = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="border-none outline-none">
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 outline-none border-none"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="outlin-none border-none">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => {}}>Copy payment ID</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View customer</DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="account/1">View payment details</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Action
