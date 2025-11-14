import { useState, useEffect } from 'react'
import { getAllExams } from '@/utils/api'
import { Exam, PaginationInfo, ExamsResponse } from '@/types'

interface UseExamsOptions {
  page?: number
  limit?: number
}

export const useExams = (options: UseExamsOptions = {}) => {
  const { page = 1, limit = 10 } = options
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: page,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: limit,
  })

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true)
        const response = await getAllExams(pagination.currentPage, limit)

        setExams(response.result || []);

        // If your API returns pagination info, update these:
        // Note: Your current ExamsResponse doesn't include pagination fields
        // You'll need to update the ExamsResponse type if the API returns pagination data
        setPagination((prev) => ({
          ...prev,
          // These fields might not exist in your current API response
          // totalPages: response.totalPages || 1,
          // totalItems: response.total || 0
          totalPages: 1, // Default until API provides pagination
          totalItems: response.result?.length || 0,
        }));

        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch exams')
        console.error('Error fetching exams:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchExams()
  }, [pagination.currentPage, limit])

  const refetch = async (newPage?: number) => {
    try {
      setLoading(true)
      const pageToFetch = newPage !== undefined ? newPage : pagination.currentPage
      const response = await getAllExams(pageToFetch, limit)

      setExams(response.result || []);

      setPagination((prev) => ({
        ...prev,
        currentPage: pageToFetch,
        totalItems: response.result?.length || 0,
      }));

      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exams')
    } finally {
      setLoading(false)
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: page }))
    }
  }

  const nextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))
    }
  }

  const prevPage = () => {
    if (pagination.currentPage > 1) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))
    }
  }

  return {
    exams,
    loading,
    error,
    refetch,
    pagination,
    goToPage,
    nextPage,
    prevPage,
  }
}
