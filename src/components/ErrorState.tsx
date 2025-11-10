"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorStateProps {
  error: string | Error
  onRetry: () => void
  title?: string
  description?: string
}

const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  title = "Something went wrong",
  description = "An unexpected issue occurred. Please try again.",
}) => {
  const message = typeof error === "string" ? error : error?.message

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] min-h-[300px] text-center px-6 py-10 space-y-3">
      <AlertTriangle className="h-14 w-14 text-red-500 mb-4" />

      <h2 className="text-2xl font-semibold mb-2">{title}</h2>

      <p className="text-muted-foreground max-w-md mb-2">{description}</p>

      {message && (
        <p className="text-sm text-red-600 max-w-md bg-red-100 px-3 py-2 rounded-md mb-4 border border-red-200">
          {message}
        </p>
      )}

      <Button onClick={onRetry} className="bg-primary text-white px-6">
        Retry
      </Button>
    </div>
  )
}

export default ErrorState
