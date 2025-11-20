"use client";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const LearningActivity = () => {
  const data = {
    labels: ["Math", "English", "Government", "Biology", "Chemistry"],
    datasets: [
      {
        label: "Performance",
        data: [82, 72, 95, 78, 100],
        backgroundColor: "#5542F6",
      },
    ],
  };

  // Correcting the indexAxis type to strictly use "y" as the value
  const options = {
    indexAxis: "y" as const, // Explicitly type as "y"
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
  };

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
  );
};

export default LearningActivity;

const LearningActivitySkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center mt-8 w-full">
        <Skeleton className="h-6 w-40" />

        {/* Select Skeleton */}
        <Skeleton className="h-10 w-[180px] rounded-md" />
      </div>

      {/* Chart Skeleton */}
      <div className="mt-6 space-y-4">
        {/* Fake bars mimicking horizontal bar chart */}
        <div className="flex flex-col gap-4">
          {/* Bar 1 */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-20" /> {/* Label */}
            <Skeleton className="h-4 flex-1" /> {/* Bar */}
          </div>

          {/* Bar 2 */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 flex-1" />
          </div>

          {/* Bar 3 */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 flex-1" />
          </div>

          {/* Bar 4 */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 flex-1" />
          </div>

          {/* Bar 5 */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export { LearningActivitySkeleton };
