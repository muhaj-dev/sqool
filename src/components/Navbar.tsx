"use client"
import { Dispatch, SetStateAction } from "react"
import NavItems from "./NavItems"
import { sections } from "@/lib/sections"

type Sections = typeof sections
export interface NavbarProps {
  sections: Sections
  setActiveIndex: Dispatch<SetStateAction<number | null>>
  activeIndex: number | null
}

const Navbar = ({ sections, activeIndex, setActiveIndex }: NavbarProps) => {
  return (
    <>
      <div className="text-center ">
        <h2 className="text-2xl text-primaryColor font-semibold">
          Welcome to your dashboard
        </h2>
        <p className="text-[#515B6F] mt-6 ">
          Your account is currently in{" "}
          <span className="text-red-700">test mode</span>, so there are a few
          more things to fo before you can go live and start managment, Follow
          the steps below too get activated.
        </p>
      </div>
      <NavItems
        sections={sections}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </>
  )
}

export default Navbar
