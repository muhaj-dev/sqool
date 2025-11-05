'use client'
import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const LearningActivity = () => {
  const data = {
    labels: ['Math', 'English', 'Government', 'Biology', 'Chemistry'],
    datasets: [
      {
        label: 'Performance',
        data: [82, 72, 95, 78, 100],
        backgroundColor: '#5542F6',
      },
    ],
  }

  // Correcting the indexAxis type to strictly use "y" as the value
  const options = {
    indexAxis: 'y' as const, // Explicitly type as "y"
    scales: {
      x: {
        beginAtZero: true,
      },
    },
    barPercentage: 0.5, // Controls bar width (from 0 to 1, where 1 is the full category width)
    categoryPercentage: 0.5, // Adjusts the size of the category spacing
    layout: {
      padding: 16,
    },
  }

  return (
    <div>
      <div className="flex justify-between items-center mt-8 w-full">
        <p className="text-xl">Learning Activity</p>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="This month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}

export default LearningActivity
