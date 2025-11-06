'use client'
import { HiMenu, HiX } from 'react-icons/hi'
import NavItems from './NavItems'
import { sections } from '@/lib/sections'

interface NavbarProps {
  toggleSidebar: () => void
  isOpen: boolean
}

const Navbar = ({ toggleSidebar, isOpen }: NavbarProps) => {
  return (
    <div className="text-center">
      <div>
        {/* Hamburger button - toggles sidebar */}
        <button className="max-[700px]:block hidden text-3xl focus:outline-none" onClick={toggleSidebar}>
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>
      <h2 className="text-2xl text-primary font-semibold">Welcome to your dashboard</h2>
      <p className="text-[#515B6F] mt-6">
        Your account is currently in <span className="text-red-700">test mode</span>, so there are a few more things to
        do before you can go live and start management. Follow the steps below to get activated.
      </p>
      <NavItems />
    </div>
  )
}

export default Navbar
