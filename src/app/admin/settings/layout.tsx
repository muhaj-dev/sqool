import SettingSteps from '@/components/settings/SettingSteps'
import SettingTopBar from '@/components/settings/SettingTopBar'
import SettingContextProvider from '@/contexts/setting-context'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SettingContextProvider>
      <SettingTopBar />
      <SettingSteps />
      <div>{children}</div>
    </SettingContextProvider>
  )
}

export default layout
