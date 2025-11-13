// hooks/usePaymentData.ts
import { useState, useEffect } from 'react'
import { toast } from '@/components/ui/use-toast'
import { getAllPayments, getPaymentStatistics } from '@/utils/api'
import { PaymentStatistics, PaginationState } from '@/types'

export const usePaymentData = (statusFilter: string = 'all') => {
  const [paymentRecords, setPaymentRecords] = useState<any[]>([])
  const [paymentStats, setPaymentStats] = useState<PaymentStatistics>({
    totalPaid: 0,
    totalPending: 0,
    totalOverdue: 0
  })
  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  })
  const [paymentsLoading, setPaymentsLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)

  // Fetch payment statistics
  useEffect(() => {
    const fetchPaymentStats = async () => {
      setStatsLoading(true)
      try {
        const response = await getPaymentStatistics()
        setPaymentStats(response.data)
      } catch (error) {
        console.error('Failed to fetch payment statistics:', error)
        toast({
          title: 'Failed to fetch statistics',
          description: 'Please try again later',
          variant: 'destructive',
        })
      } finally {
        setStatsLoading(false)
      }
    }

    fetchPaymentStats()
  }, [refresh])

  // Fetch payments data with pagination
  useEffect(() => {
    const fetchPayments = async () => {
      setPaymentsLoading(true)
      try {
        const response = await getAllPayments(
          pagination.currentPage,
          pagination.pageSize,
          statusFilter !== 'all' ? statusFilter : undefined,
        )

        const paymentsData = response.data?.result || []
        setPaymentRecords(paymentsData)

        if (response.data?.pagination) {
          setPagination(prev => ({
            total:
              typeof response.data.pagination.total === 'string'
                ? parseInt(response.data.pagination.total)
                : response.data.pagination.total,
            currentPage:
              typeof response.data.pagination.currentPage === 'string'
                ? parseInt(response.data.pagination.currentPage)
                : response.data.pagination.currentPage,
            pageSize:
              typeof response.data.pagination.pageSize === 'string'
                ? parseInt(response.data.pagination.pageSize)
                : response.data.pagination.pageSize || prev.pageSize,
            totalPages:
              typeof response.data.pagination.totalPages === 'string'
                ? parseInt(response.data.pagination.totalPages)
                : response.data.pagination.totalPages,
            hasNextPage: response.data.pagination.hasNextPage,
            hasPreviousPage: response.data.pagination.hasPreviousPage,
          }))
        }
      } catch (error) {
        console.error('Failed to fetch payments:', error)
        toast({
          title: 'Failed to fetch payments',
          description: 'Please try again later',
          variant: 'destructive',
        })
      } finally {
        setPaymentsLoading(false)
      }
    }

    fetchPayments()
  }, [refresh, statusFilter, pagination.currentPage, pagination.pageSize])

  const refreshData = () => {
    setRefresh(prev => !prev)
  }

  return {
    paymentRecords,
    paymentStats,
    pagination,
    setPagination,
    paymentsLoading,
    statsLoading,
    refreshData
  }
}