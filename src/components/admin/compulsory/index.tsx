"use client"
import { useCompulsory } from "@/contexts/compulsory-context"
import React from "react"
const Compulsory = () => {
  const { step: Component } = useCompulsory()
  return (
    <div className="w-full">
      <Component />
    </div>
  )
}

export default Compulsory
