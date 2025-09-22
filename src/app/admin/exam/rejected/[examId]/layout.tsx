import ClassExamBar from "@/components/exams/ClassExamBar"
import React from "react"

const layout = ({ children, params }: { 
    children: React.ReactNode,
    params: { examId: string }

 }) => {
  return (
    <section className="px-3 md:px-8">
      <ClassExamBar level={params.examId} />
      <div >{children}</div>
    </section>
  )
}

export default layout
