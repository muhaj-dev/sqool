'use client'
import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChatJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

ChatJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const ExamPerformanceChart = () => {
  const data = {
    labels: ['Math', 'English', 'Government', 'Biology', 'Chemistry'],
    datasets: [
      {
        label: 'exam performance',
        data: [82, 72, 95, 78, 100],
        backgroundColor: '#E5B80B',
      },
    ],
  }
  const options = {
    indexAxis: 'y',
    barThickness: 20,
    layout: {
      padding: 18,
    },
    height: 20,
  }
  return (
    <div>
      <div className="flex justify-between flex-wrap gap-3  items-center mt-8">
        <p className="text-xl">Exam Performance</p>
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
      <div className="w-full">
        <Bar data={data} options={options} className="" />
      </div>
    </div>
  )
}

export default ExamPerformanceChart
