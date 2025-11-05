'use client'
import React, { useState, useEffect } from 'react'
import ExamCard from './ExamCard'
import avatar from '../../assets/avatar.png'
import { Separator } from '../ui/separator'
import FilterBar from './Filterbar'
import { SchoolSession } from './SchoolSession'
import { getAllExaminations, updateExaminationStatus } from '@/utils/api'

// Removed static Department array

const STEPS = ['Pending Approval', 'Approved', 'Rejected']

const STATUS_OPTIONS = ['approve', 'reject', 'pending', 'scheduled']

const Exam = () => {
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  // Fetch exams from API
  const fetchExams = async () => {
    setLoading(true)
    try {
      const res = await getAllExaminations(1, 50)
      setExams(res.data || [])
    } catch {
      setExams([])
    } finally {
      setLoading(false)
    }
  }

  console.log(exams)
  useEffect(() => {
    fetchExams()
  }, [])

  // Filter exams by status
  const filteredExams = exams.filter(exam => {
    if (STEPS[activeIndex] === 'Pending Approval') return exam.status === 'pending'
    if (STEPS[activeIndex] === 'Approved') return exam.status === 'approve'
    if (STEPS[activeIndex] === 'Rejected') return exam.status === 'reject'
    return true
  })

  // Handle approve
  const handleApprove = async (examId: string) => {
    setLoading(true)
    try {
      await updateExaminationStatus(examId, 'approve')
      fetchExams()
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (examId: string) => {
    setLoading(true)
    try {
      await updateExaminationStatus(examId, 'reject')
      fetchExams()
    } finally {
      setLoading(false)
    }
  }

  const handleSchedule = async (examId: string) => {
    setLoading(true)
    try {
      await updateExaminationStatus(examId, 'scheduled')
      fetchExams()
    } finally {
      setLoading(false)
    }
  }
  return (
    <section>
      <div className="flex justify-end">
        <SchoolSession />
      </div>
      <div className="flex items-center gap-8">
        {STEPS.map((item, ind) => (
          <div
            key={ind}
            className={`cursor-pointer ${activeIndex === ind && 'text-primary border-b-[2px] border-b-primary '}`}
            onClick={() => setActiveIndex(ind)}
          >
            {item}
          </div>
        ))}
      </div>
      <Separator className="mb-4 mt-0" />
      {/* {classes.map((className) => (
        <div key={className} className="mb-8">
          <h3 className="text-lg font-bold mb-2">{className}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
            {examsByClass[className].map((exam) => (
              <ExamCard
                key={exam._id}
                fullname={`${exam.creator.details.firstName} ${exam.creator.details.lastName}`}
                email={exam.creator.details.email}
                subject={exam.subject.name}
                total={exam.students}
                photo={avatar}
                approved={exam.status === "approve"}
                onApprove={() => handleApprove(exam._id)}
                loading={loading}
              />
            ))}
          </div>
        </div>
      ))} */}

      {filteredExams.map(exam => (
        <ExamCard
          key={exam._id}
          fullname={`${exam.creator.details.firstName} ${exam.creator.details.lastName}`}
          email={exam.creator.details.email}
          subject={exam.subject.name}
          total={exam.students}
          photo={avatar}
          approved={exam.status === 'approve'}
          status={exam.status}
          onApprove={() => handleApprove(exam._id)}
          onReject={() => handleReject(exam._id)}
          onSchedule={() => handleSchedule(exam._id)}
          loading={loading}
        />
      ))}
    </section>
  )
}

export default Exam
