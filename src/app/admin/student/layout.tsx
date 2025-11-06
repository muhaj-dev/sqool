import React, { ReactNode } from 'react'

const layout = ({ children }: { children: ReactNode }) => {
  return <section className="w-full">{children}</section>
}

export default layout
