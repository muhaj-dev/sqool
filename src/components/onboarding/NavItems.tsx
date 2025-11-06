'use client'
import NavItem from './NavItem'
import { sections } from '@/lib/sections'

const NavItems = () => {
  return (
    <div className="overflow-auto">
      <div className="flex gap-8 h-full w-fif transition-all animate-in my-4">
        {sections.map((section, index) => (
          <NavItem key={section.label} section={section} index={index} />
        ))}
      </div>
    </div>
  )
}

export default NavItems
