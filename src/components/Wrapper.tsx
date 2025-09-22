import { cn } from "@/lib/utils"
import React, { ReactNode } from "react"

const Wrapper = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center w-full h-full ",
        className
      )}
    >
      {children}
    </div>
  )
}

export default Wrapper
