"use client"
import React from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChatJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { min } from "date-fns"

ChatJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const TestPerformanceChart = () => {
  const data = {
    labels: ["Math", "English", "Government", "Biology", "Chemistry"],
    datasets: [
      {
        label: "Performance",
        data: [82, 72, 95, 78, 100],
        backgroundColor: "#5542F6",
      },
    ],
  }
  const options = {
    scale: "",
    indexAxis: "y",
    barThickness: 20,
    layout: {
      padding: 16,
    },
    height: 20,
  }
  return (
    <div>
      <div className="flex justify-between  flex-wrap gap-3 items-center mt-8">
        <p className="text-xl">Test Performance</p>
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
        <Bar
          data={data}
          options={{
            indexAxis: "y",
            barThickness: 20,
            layout: {
              padding: 0,
              autoPadding: false,
            },
            height: 10,
          }}
        />
      </div>
    </div>
  )
}

export default TestPerformanceChart
