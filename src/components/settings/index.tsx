'use client'
import { useSetting } from '@/contexts/setting-context'
import React from 'react'

const Settings = () => {
  const { step: Component } = useSetting()

  return <div className="w-full">{<Component />}</div>
}

export default Settings
