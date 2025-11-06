import Link from 'next/link'
import React from 'react'
import { Button, buttonVariants } from './ui/button'
import { ArrowRight } from 'lucide-react'

const TopBar = ({ text, btnText }: { text: string; btnText: string }) => {
  return (
    <div className="flex justify-between items-center w-full">
      <Link
        href={'/'}
        className="uppercase text-[#E5B80B] text-md font-bold sm:text-3xl hover:cursor-pointer  transition "
      >
        Sqoolify
      </Link>

      <div className="flex items-center gap-2 sm:gap-4 sm:text-lg ">
        <span className="text-[#616A6A] text-[12px] sm:text-[16px] ">{text}</span>

        <Link
          className="border border-[#FAFAFA]  p-2 sm:py-3 sm:px-4 shadow-sm rounded-none flex items-center gap-2"
          href={`${btnText === 'Sign Up' ? '/signup' : 'signin'}`}
        >
          {btnText} <ArrowRight className="sm:block hidden size-4" />
        </Link>
      </div>
    </div>
  )
}

export default TopBar

//  <Button
//         size={"default"}
//         variant={"ghost"}
//         className="border border-gray-300 text-[14px] sm:text-lg  p-2 sm:p-4 shadow-sm rounded-none"
//       >
//         {btnText} <ArrowRight className="sm:block hidden " />
//       </Button>
