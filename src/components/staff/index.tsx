"use client"

import { useStaff } from "@/contexts/staff-context"

const Staff = () => {
  const { step: Component } = useStaff()
  return <div className="flex-1 p-4">{<Component />}</div>
}

export default Staff
