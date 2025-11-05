'use client'
import React from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#5542F6', '#FFA043']

interface CustomPieChartProps {
  maleCount: number
  femaleCount: number
  totalStudents: number
}

const CustomPieChart = ({ maleCount, femaleCount, totalStudents }: CustomPieChartProps) => {
  const data = [
    { name: 'Female', value: femaleCount },
    { name: 'Male', value: maleCount },
  ]

  const renderCenterText = () => {
    return (
      <>
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
          {totalStudents}
        </text>
        <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle">
          {'Total Students'}
        </text>
      </>
    )
  }

  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <PieChart>
        <Pie
          data={data}
          outerRadius={90}
          innerRadius={75}
          label={() => renderCenterText()}
          dataKey="value"
          nameKey="name"
          cx={'50%'}
          cy={'50%'}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${value} students`, name]} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default CustomPieChart
