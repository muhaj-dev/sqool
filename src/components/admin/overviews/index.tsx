"use client";

import { useEffect, useState } from "react";

import { Separator } from "@/components/ui/separator";
import { type DashboardData } from "@/types";
import { getDashboardData } from "@/utils/api";

import outstanding from "../../../data/outstanding_fees.json";
import performance from "../../../data/performance.json";
import Card from "./Card";
import CustomPieChart from "./charts/PieChartPlot";
import StackedBarChart from "./charts/StackedBarChart";
import OverviewSubBar from "./OverviewSubBar";
import { outstandingColumns, performanceColumns } from "./tables/column";
import OutstandingTable from "./tables/OutstandinfTable";
import StudentPerformance from "./tables/StudentPerformance";
import TopTeachers from "./TopTeachers";

const Overview = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    genderDistribution: { totalStudents: 0, totalMale: 0, totalFemale: 0 },
    schoolUsersCount: {
      totalStudents: 0,
      totalParents: 0,
      totalNonTeachingStaff: 0,
      totalTeachingStaff: 0,
      totalStaffs: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data");
        // Keep the fallback data that was initialized in useState
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []); // Empty dependency array means this runs once on mount

  const { schoolUsersCount, genderDistribution } = dashboardData;

  if (loading) {
    return (
      <div className="w-full py-5 px-0 md:px-9 flex justify-center items-center h-[80vh]">
        <div>Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-5 px-0 md:px-9">
        <div className="text-red-500 p-4 border border-red-200 bg-red-50 rounded-md">
          {error} - Showing fallback data
        </div>
        {/* Continue rendering with fallback data */}
      </div>
    );
  }
  return (
    <div className="w-full  py-5 px-0 md:px-9">
      <Separator />
      <OverviewSubBar />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto gap-8">
        <Card title="Student" count={schoolUsersCount?.totalStudents} />
        <Card title="Teacher" count={schoolUsersCount?.totalTeachingStaff} />
        <Card title="Parent" count={schoolUsersCount?.totalParents} />
        <Card title="Staff" count={schoolUsersCount?.totalStaffs} />
      </div>
      <div className="flex justify-between flex-col lg:flex-row ">
        <div className="w-full lg:w-[60%]">
          <div className="mt-4 bg-white rounded-md p-4 mb-8">
            <div className="flex justify-between my-4 flex-col md:flex-row gap-3">
              <div className="w-full md:w-[50%]  ">
                <h2 className="font-semibold">Total Earnings</h2>
                <p>Here’s we show data about your effective monthly Earning</p>
                <div className="flex items-center gap-6 mt-8">
                  <div className="flex items-center space-x-2">
                    <span className="bg-[#E5B80B] h-[8px] w-[8px] rounded-full" />
                    <span>Total Earnings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-black h-[8px] w-[8px] rounded-full" />
                    <span>Total Expenses</span>
                  </div>
                </div>
              </div>
              <div className="border border-[#E9EBEB] h-fit p-4 rounded-sm">
                <p className="text-[#515B6F]">Overall Earning</p>
                <p className="text-xl font-semibold">N50,600,434.00</p>
              </div>
            </div>

            <div className="w-full h-[300px] hover:bg-transparent">
              <StackedBarChart />
            </div>
          </div>
          <div className="mb-8">
            <OutstandingTable columns={outstandingColumns} data={outstanding} />
          </div>
          <div className="mb-8">
            <StudentPerformance columns={performanceColumns} data={performance} />
          </div>
        </div>
        <div className="w-full lg:w-[38%]">
          <div className="mt-4 bg-white rounded-md p-6 mb-8 h-[500px] w-full ">
            <h2 className="text-xl font-semibold">Total Student gender</h2>
            <div className=" h-[300px]">
              {/* <CustomPieChart /> */}
              <CustomPieChart
                totalStudents={schoolUsersCount?.totalStudents}
                maleCount={genderDistribution?.totalMale}
                femaleCount={genderDistribution?.totalFemale}
              />
            </div>
            <div className="w-[80%] mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="bg-[#5542F6] h-[8px] w-[8px] rounded-full" />
                  <span>Female</span>
                </div>
                <span>{genderDistribution?.totalFemale}</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1">
                  <span className="bg-[#FFA043] h-[8px] w-[8px] rounded-full" />
                  <span>Male</span>
                </div>
                <span>{genderDistribution?.totalMale}</span>
              </div>
            </div>
          </div>
          <div>
            <TopTeachers />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
