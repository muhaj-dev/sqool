import React from "react"
import TestPerformanceChart from "./TestPerformanceChart"
import ExamPerformanceChart from "./ExamPerformanceChart"

const StudyProgress = () => {
  return (
    <div>
      <TestPerformanceChart />
      <ExamPerformanceChart />
    </div>
  )
}

export default StudyProgress
