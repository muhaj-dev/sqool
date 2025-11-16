'use client'

import { useEffect, useState, useCallback } from 'react'
import ClassHeader from './ClassHeader'
import ClassStats from './ClassStats'
import ClassTable from './ClassTable'

import { getClasses } from '@/utils/api'
import { IClassConfigurationResponse } from '@/types'
import { useToast } from '@/components/ui/use-toast' // <-- Import useToast

interface ClassManagementProps {
  // initialTeachers: Teacher[];
  //   initialSubjects: Subject[];
  //   initialClasses: Class[];
}

const ClassList = ({
  // initialTeachers,
  //   initialSubjects,
  //   initialClasses,
}: ClassManagementProps) => {
  const [classes, setClasses] = useState<IClassConfigurationResponse[]>([])
  const [refresh, setRefresh] = useState(false)

  const { toast } = useToast()

  const handleRefresh = useCallback(() => setRefresh(r => !r), [])

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getClasses('1', '10')
        setClasses(response.data.result || [])
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Unable to fetch data',
          description: 'There was an error fetching class data.',
        })
      }
    }
    fetchClasses()
  }, [refresh])

  // Optionally filter classes if you want search to work
  // const filteredClasses = filterClasses(classes, searchTerm);

  return (
    <div className="min-h-screen bg-gray-50">
      <ClassHeader
      // searchTerm={searchTerm}
      // onSearchChange={setSearchTerm}
      // teachers={teachers}
      // classes={classes}
      // setClasses={setClasses}
      onRefresh={handleRefresh}
      />

      <div className="p-6">
        <ClassStats onRefresh={handleRefresh} />
        <div className="overflow-auto ">
          <ClassTable classes={classes} />
        </div>
      </div>
    </div>
  )
}

export default ClassList
