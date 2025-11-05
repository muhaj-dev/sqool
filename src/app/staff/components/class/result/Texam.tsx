'use client'

import React, { useState, useEffect } from 'react'
import ExameTable from './Exam'
import TestTable from './Test'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

interface TexamProps {
  toggleTexam: () => void
}

const Texam: React.FC<TexamProps> = ({ toggleTexam }) => {
  const [activeTab, setActiveTab] = useState<'exam' | 'test'>('exam') // Manage which tab is active
  const [showUploadButton, setShowUploadButton] = useState(false) // State to track button display
  const router = useRouter()
  const pathname = usePathname()

  // Check the current path and update the button display state
  useEffect(() => {
    if (pathname.startsWith('/student')) {
      setShowUploadButton(true)
    } else if (pathname.startsWith('/staff')) {
      setShowUploadButton(false)
    }
  }, [pathname]) // Re-run this effect when the pathname changes

  // Function to switch between tabs
  const handleTabSwitch = (tab: 'exam' | 'test') => {
    setActiveTab(tab)
  }

  return (
    <div className="">
      <div className="flex justify-between flex-wrap gap-2">
        <Input type="text" placeholder="Search..." icon={<Search />} className="my-2 w-[250px]" />
        {!showUploadButton ? (
          <Button onClick={toggleTexam} className="px-3 text-white">
            Upload New
          </Button>
        ) : (
          <Button onClick={toggleTexam} className="px-3 bg-white border border-input">
            Expot
          </Button>
        )}
      </div>

      <div className="flex justify-between flex-wrap mt-2 gap-2 md:gap-5 border-b-2 border-[#D6DDEB]">
        <div className="space-x-3">
          <button
            className={`px-1 py-2 text-[1.125rem] font-semibold ${
              activeTab === 'exam' ? 'border-b-primary border-b-2 text-[#2E2C34]' : 'text-[#84818A]'
            }`}
            onClick={() => handleTabSwitch('exam')}
          >
            Exam
          </button>
          <button
            className={`px-1 py-2 text-[1.125rem] font-semibold ${
              activeTab === 'test' ? 'border-b-primary border-b-2 text-[#2E2C34]' : 'text-[#84818A]'
            }`}
            onClick={() => handleTabSwitch('test')}
          >
            Test
          </button>
        </div>
        <div className="mt-2.5">
          <select className="text-[#828282] px-2 rounded">
            <option value="10">Session</option>
            <option value="20">1st</option>
            <option value="20">2nd</option>
            <option value="20">3rd</option>
          </select>
          <select className="text-[#828282] px-2 rounded">
            <option value="10">Type</option>
            <option value="20">View 20</option>
          </select>
        </div>
      </div>

      <div className="py-4">
        {activeTab === 'exam' && <ExameTable />}
        {activeTab === 'test' && <TestTable />}
      </div>
    </div>
  )
}

export default Texam

export const Search = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="6" stroke="#222222" />
    <path d="M20 20L17 17" stroke="#222222" strokeLinecap="round" />
  </svg>
)
