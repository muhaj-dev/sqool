'use client'

import { useState, useMemo, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import {
  getSchoolFees,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  publishFeeStructure,
  getAllSessions,
  getAllClasses,
} from '@/utils/api'
import { FeeStructure, UpdateFeeData, GetFeesParams } from '@/types'
import { FeesTable } from './components/FeesTable'
import { FeeFormDialog } from './components/FeeFormDialog'
import { FeeFilters } from './components/FeeFilters'
import { FeeDetailsDialog } from './components/FeeDetailsDialog'
import { PublishDialog } from './components/PublishDialog'
import { PageHeader } from './components/PageHeader'

export default function FeesManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedFee, setSelectedFee] = useState<FeeStructure | null>(null)
  const [fees, setFees] = useState<FeeStructure[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false)
  const [feeToPublish, setFeeToPublish] = useState<FeeStructure | null>(null)
  const [publishing, setPublishing] = useState(false)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [filterClass, setFilterClass] = useState<string>('all')
  const [filterSession, setFilterSession] = useState<string>('all')
  const [limit, setLimit] = useState<number>(20)
  const [skip, setSkip] = useState<number>(0)

  const { toast } = useToast()

  // Fetch initial data
  useEffect(() => {
    fetchInitialData()
  }, [])

  // Fetch fees when filters change
  useEffect(() => {
    fetchFees()
  }, [searchQuery, filterClass, filterSession, limit, skip])

  const fetchInitialData = async () => {
    setIsLoading(true)
    try {
      const [sessionsData, classesData] = await Promise.all([getAllSessions(), getAllClasses()])

      setSessions(sessionsData || [])
      setClasses(classesData || [])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch initial data',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFees = async () => {
    setIsLoading(true)
    try {
      const params: GetFeesParams = {
        search: searchQuery || undefined,
        class: filterClass !== 'all' ? filterClass : undefined,
        session: filterSession !== 'all' ? filterSession : undefined,
        limit,
        skip,
      }

      const response = await getSchoolFees(params)
      setFees(response.data.result)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch fee structures',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = async (data: any) => {
    try {
      if (isEditMode && selectedFee) {
        const updateData: UpdateFeeData = {
          totalAmount: data.totalAmount,
          terms: data.terms,
        }

        await updateFeeStructure(selectedFee._id, updateData)

        toast({
          title: 'Fee Structure Updated',
          description: `Successfully updated fee structure`,
        })
      } else {
        const createData = {
          class: data.class,
          session: data.session,
          totalAmount: data.totalAmount,
          terms: data.terms,
        }

        await createFeeStructure(createData)

        toast({
          title: 'Fee Structure Created',
          description: `Successfully created fee structure`,
        })
      }

      await fetchFees()
      setIsDialogOpen(false)
      setIsEditMode(false)
      setSelectedFee(null)
    } catch (error: any) {
      console.error('Submission error:', error)
      toast({
        title: 'Error',
        description: error.message || `Failed to ${isEditMode ? 'update' : 'create'} fee structure`,
        variant: 'destructive',
      })
      throw error // Re-throw to let the dialog handle the loading state
    }
  }

  const handleEdit = (fee: FeeStructure) => {
    setSelectedFee(fee)
    setIsEditMode(true)
    setIsDialogOpen(true)
  }

  const handleCreateNew = () => {
    setSelectedFee(null)
    setIsEditMode(false)
    setIsDialogOpen(true)
  }

  const handleFormCancel = () => {
    setIsDialogOpen(false)
    setIsEditMode(false)
    setSelectedFee(null)
  }

  // Updated delete handler - removed the confirm dialog since it's now handled in the FeesTable component
  const handleDelete = async (feeId: string) => {
    try {
      await deleteFeeStructure(feeId)
      toast({
        title: 'Fee Structure Deleted',
        description: 'Fee structure has been successfully deleted',
      })
      await fetchFees()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete fee structure',
        variant: 'destructive',
      })
      throw error // Re-throw to let the table handle the loading state
    }
  }

  const handlePublishClick = (fee: FeeStructure) => {
    setFeeToPublish(fee)
    setIsPublishDialogOpen(true)
  }

  const handlePublishConfirm = async () => {
    if (!feeToPublish) return

    setPublishing(true)
    try {
      await publishFeeStructure(feeToPublish._id)
      toast({
        title: 'Fee Structure Published',
        description: 'Fee structure has been successfully published',
      })
      await fetchFees()
      setIsPublishDialogOpen(false)
      setFeeToPublish(null)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to publish fee structure',
        variant: 'destructive',
      })
    } finally {
      setPublishing(false)
    }
  }

  const handlePublishCancel = () => {
    setIsPublishDialogOpen(false)
    setFeeToPublish(null)
  }

  // Filtered fees based on search and filters
  const filteredFees = useMemo(() => {
    let filtered = [...fees]

    if (searchQuery.trim()) {
      filtered = filtered.filter(fee => {
        const className = getClassName(fee)
        const sessionName = getSessionName(fee)

        return (
          className.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sessionName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
    }

    if (filterClass !== 'all') {
      filtered = filtered.filter(fee => {
        const classId = typeof fee.class === 'string' ? fee.class : fee.class._id
        return classId === filterClass
      })
    }

    if (filterSession !== 'all') {
      filtered = filtered.filter(fee => {
        const sessionId = typeof fee.session === 'string' ? fee.session : (fee.session as any)._id
        return sessionId === filterSession
      })
    }

    return filtered
  }, [fees, searchQuery, filterClass, filterSession])

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilterClass('all')
    setFilterSession('all')
    setLimit(20)
    setSkip(0)
  }

  const handleViewDetails = (fee: FeeStructure) => {
    setSelectedFee(fee)
    setIsDetailDialogOpen(true)
  }

  // Helper function to get display name for class
  const getClassName = (fee: FeeStructure) => {
    if (typeof fee.class === 'string') {
      const classObj = classes.find(c => c._id === fee.class)
      return classObj ? `${classObj.className} (${classObj.shortName})` : fee.class
    }
    return `${fee.class.className} (${fee.class.shortName})`
  }

  // Helper function to get display name for session
  const getSessionName = (fee: FeeStructure) => {
    if (typeof fee.session === 'string') {
      const sessionObj = sessions.find(s => s._id === fee.session)
      return sessionObj ? sessionObj.session : fee.session
    }
    return (fee.session as any).session || 'Session'
  }

  // Format classes for dropdown
  const classOptions = classes.map(cls => ({
    value: cls._id,
    label: `${cls.className} (${cls.shortName})`,
  }))

  // Format sessions for dropdown
  const sessionOptions = sessions.map(session => ({
    value: session._id,
    label: session.session,
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Management"
        description="Create and manage fee structures for different classes and sessions"
        actionLabel="Create Fee Structure"
        onAction={handleCreateNew}
        actionDisabled={isLoading}
      />

      {/* Fee Form Dialog */}
      <FeeFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEditMode={isEditMode}
        selectedFee={selectedFee}
        classes={classes}
        sessions={sessions}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />

      <FeeFilters
        searchQuery={searchQuery}
        filterClass={filterClass}
        filterSession={filterSession}
        limit={limit}
        classOptions={classOptions}
        sessionOptions={sessionOptions}
        filteredCount={filteredFees.length}
        totalCount={fees.length}
        onSearchChange={setSearchQuery}
        onClassFilterChange={setFilterClass}
        onSessionFilterChange={setFilterSession}
        onLimitChange={setLimit}
        onClearFilters={handleClearFilters}
      />

      <FeesTable
        fees={fees}
        classes={classes}
        sessions={sessions}
        isLoading={isLoading}
        searchQuery={searchQuery}
        filterClass={filterClass}
        filterSession={filterSession}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPublish={handlePublishClick}
        onViewDetails={handleViewDetails}
      />

      <FeeDetailsDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        selectedFee={selectedFee}
        getClassName={getClassName}
        getSessionName={getSessionName}
      />

      <PublishDialog
        open={isPublishDialogOpen}
        onOpenChange={setIsPublishDialogOpen}
        feeToPublish={feeToPublish}
        publishing={publishing}
        getClassName={getClassName}
        getSessionName={getSessionName}
        onConfirm={handlePublishConfirm}
        onCancel={handlePublishCancel}
      />
    </div>
  )
}