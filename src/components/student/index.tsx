"use client"
import { useStudent } from "@/contexts/student-context"
import React from "react"

const Student = () => {
  const { step: Component } = useStudent()
  return (
    <div className="mx-2 md:mx-8">
      <Component />
    </div>
  )
}

export default Student
