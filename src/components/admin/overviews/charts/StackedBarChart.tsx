"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  {
    month: "Jan",
    TotalExpenses: 2000,
    TotalEarnings: 26400,
  },
  {
    month: "Feb",
    TotalExpenses: 800,
    TotalEarnings: 17298,
  },

  {
    month: "Mar",
    TotalExpenses: 3530,
    TotalEarnings: 13200,
  },
  {
    month: "Apr",
    TotalExpenses: 5890,
    TotalEarnings: 48000,
  },
  {
    month: "May",
    TotalExpenses: 3290,
    TotalEarnings: 22600,
  },
  {
    month: "Jun",
    TotalExpenses: 2090,
    TotalEarnings: 15000,
  },
  {
    month: "Jul",
    TotalExpenses: 8320,
    TotalEarnings: 41300,
  },
  {
    month: "Aug",
    TotalExpenses: 9790,
    TotalEarnings: 53500,
  },
  {
    month: "Sep",
    TotalExpenses: 1760,
    TotalEarnings: 18300,
  },
  {
    month: "Oct",
    TotalExpenses: 9090,
    TotalEarnings: 41300,
  },
  {
    month: "Nov",
    TotalExpenses: 2490,
    TotalEarnings: 22500,
  },
  {
    month: "Dec",
    TotalExpenses: 1490,
    TotalEarnings: 50300,
  },
];

export default function StackedBarChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={600}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="2 2" vertical={false} />
        <XAxis dataKey="month" />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip />
        {/* <Legend /> */}
        <Bar dataKey="TotalExpenses" stackId="a" fill="#1F1D18" legendType="circle" />
        <Bar dataKey="TotalEarnings" stackId="a" fill="#E5B80B" legendType="circle" />
      </BarChart>
    </ResponsiveContainer>
  );
}
