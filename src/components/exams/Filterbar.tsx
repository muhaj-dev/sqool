import React, { useState } from 'react'
import ExamData from '../../data/exams.json'
import { MySelect } from './MySelect'
import { ListFilter } from 'lucide-react'
import Filter from '../Filter'

type TProps = {
  department: string[]
  level: string[]

  setData: React.Dispatch<
    React.SetStateAction<
      {
        id: number
        fullname: string
        subject: string
        email: string
      }[]
    >
  >
}
const FilterBar = ({ department, level, setData }: TProps) => {
  //   const [departmentFiltered, setDepartmentFilter] = useState([...department])
  //   const [classFilter, setClassFilter] = useState([...level])
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const filterData = () => {
    if (selectedDepartment === 'all') {
      setData(ExamData)
      return
    }
    setData(previousData => previousData.filter(item => item.subject === selectedDepartment))
    level.filter(item => item === selectedClass)
  }
  return (
    <div className="my-8 flex gap-3  flex-wrap items-center justify-between">
      <div className="flex items-center flex-wrap gap-3">
        <MySelect data={level} onValueChange={setSelectedClass} title="Class All" />
        <MySelect data={department} onValueChange={setSelectedDepartment} title="Subject" />
      </div>
      {/* <div
        // onClick={filterData}
        className="flex gap-1 bg-white border cursor-pointer py-2 px-6 rounded-md"
      >
        <ListFilter />
        <p>Filter</p>
      </div> */}
      <Filter />
    </div>
  )
}

export default FilterBar
