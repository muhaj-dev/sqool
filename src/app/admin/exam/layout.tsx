import ExamTopBar from '@/components/exams/ExamTopBar'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="px-3 md:px-8">
      <div>{children}</div>
    </section>
  )
}

export default layout
