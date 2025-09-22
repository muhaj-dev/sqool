// CircularProgress.tsx
import React from "react"

interface CircularProgressProps {
  value: number
}

const CircularProgress: React.FC<CircularProgressProps> = ({ value }) => {
  // Calculate the stroke-dasharray based on the percentage value
  const dashArray = `${value}, 100`

  return (
    <div className="flex items-center justify-center">
      <svg className="w-16 h-16">
        <circle
          className="text-gray-300 dark:text-gray-700"
          strokeWidth="8"
          fill="transparent"
          r="64"
          cx="80"
          cy="80"
        />
        <circle
          className="text-blue-500"
          strokeWidth="8"
          strokeDasharray={dashArray}
          fill="transparent"
          r="64"
          cx="80"
          cy="80"
        />
        <text
          x="50%"
          y="50%"
          className="text-center text-lg text-blue-500 dark:text-gray-300"
          dy=".3em"
        >
          {value}%
        </text>
      </svg>
    </div>
  )
}

export default CircularProgress
