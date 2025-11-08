'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Edit, Globe, Trash2 } from 'lucide-react'
import { FeeStructure } from '@/types'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'

interface FeesTableProps {
  fees: FeeStructure[]
  classes: any[]
  sessions: any[]
  isLoading: boolean
  searchQuery: string
  filterClass: string
  filterSession: string
  onEdit: (fee: FeeStructure) => void
  onDelete: (feeId: string) => void
  onPublish: (fee: FeeStructure) => void
  onViewDetails: (fee: FeeStructure) => void
}

// Enhanced Skeleton Loading Component
function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <TableRow key={index} className="animate-pulse">
          <TableCell>
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/5"></div>
              <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-3/5"></div>
            </div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3"></div>
          </TableCell>
          <TableCell>
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
          </TableCell>
          <TableCell>
            <div className="flex justify-end gap-2">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-8"></div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-8"></div>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

// Enhanced skeleton for empty state during loading
function EmptyStateSkeleton() {
  return (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48 mx-auto"></div>
            <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}

export function FeesTable({
  fees,
  classes,
  sessions,
  isLoading,
  searchQuery,
  filterClass,
  filterSession,
  onEdit,
  onDelete,
  onPublish,
  onViewDetails,
}: FeesTableProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [feeToDelete, setFeeToDelete] = useState<FeeStructure | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

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

  const handleDeleteClick = (fee: FeeStructure) => {
    setFeeToDelete(fee)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!feeToDelete) return

    setDeleteLoading(true)
    try {
      await onDelete(feeToDelete._id)
      setDeleteModalOpen(false)
      setFeeToDelete(null)
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setFeeToDelete(null)
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
  }, [fees, searchQuery, filterClass, filterSession, classes, sessions])

  // Show different skeleton based on whether it's initial load or no data
  const showLoadingSkeleton = isLoading && fees.length === 0
  const showEmptyStateSkeleton = isLoading && filteredFees.length === 0

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class</TableHead>
            <TableHead>Session</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {showLoadingSkeleton ? (
            <TableSkeleton />
          ) : showEmptyStateSkeleton ? (
            <EmptyStateSkeleton />
          ) : filteredFees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No fee structures found matching your filters
              </TableCell>
            </TableRow>
          ) : (
            filteredFees.map(fee => (
              <TableRow
                key={fee._id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onViewDetails(fee)}
              >
                <TableCell className="font-medium">{getClassName(fee)}</TableCell>
                <TableCell>{getSessionName(fee)}</TableCell>
                <TableCell className="font-semibold">₦{fee.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={fee.isPublished ? "default" : "outline"}>
                    {fee.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-end gap-2">
                    {!fee.isPublished && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onPublish(fee)}
                        title="Publish Fee Structure"
                        className="gap-1"
                      >
                        <Globe className="w-3 h-3" />
                        Publish
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onEdit(fee)} 
                      title="Edit Fee Structure"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClick(fee)
                      }} 
                      title="Delete Fee Structure"
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        itemName={feeToDelete ? `${getClassName(feeToDelete)} - ${getSessionName(feeToDelete)}` : ''}
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  )
}