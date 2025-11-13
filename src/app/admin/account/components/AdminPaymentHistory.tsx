'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import {
  ArrowLeft,
  Download,
  Search,
  Filter,
  Plus,
  Calendar,
  User,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'
import { adminCreatePayment, getAllStudents, getAllPayments, getPaymentStatistics } from '@/utils/api'
import { CreatePaymentRequest, IStudent, PaymentStatistics } from '@/types'

interface PaymentRecord {
  _id: string
  paymentDate: string
  paymentStatus: string
  amountPaid: number
  userId: string
  paymentMethod: string
  transactionId?: string
  paymentMemo: string
  paymentCategory: string
  paymentType: string
  student?: {
    firstName: string
    lastName: string
    parentName?: string
    className?: string
  }
}

const AdminPaymentHistory = () => {
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentsLoading, setPaymentsLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  // Student search state
  const [students, setStudents] = useState<IStudent[]>([])
  const [studentSearch, setStudentSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [refresh, setRefresh] = useState(false)

  // Payment data state
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([])
  const [paymentStats, setPaymentStats] = useState<PaymentStatistics>({
    totalPaid: 0,
    totalPending: 0,
    totalOverdue: 0
  })
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  })

  // Form state - matching API requirements
  const [formData, setFormData] = useState({
    paymentDate: new Date().toISOString().split('T')[0],
    amountPaid: '',
    paymentMethod: '',
    paymentStatus: 'pending',
    paymentType: '',
    paymentCategory: '',
    transactionId: '',
    paymentMemo: null as File | null,
    userId: '',
  })

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

  // Fetch students for search
  useEffect(() => {
    const fetchStudents = async () => {
      if (studentSearch.length < 2) {
        setStudents([])
        return
      }

      setIsSearching(true)
      try {
        const response = await getAllStudents(1, 10, studentSearch)
        setStudents(response.data?.result || response.data || [])
      } catch (error) {
        console.error('Failed to search students:', error)
        toast({
          title: 'Search failed',
          description: 'Failed to search students',
          variant: 'destructive',
        })
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(fetchStudents, 300)
    return () => clearTimeout(debounceTimer)
  }, [studentSearch, refresh, toast])

  const handleStudentSelect = (student: IStudent) => {
    setSelectedStudent(student)
    setFormData(prev => ({
      ...prev,
      userId: student._id,
    }))
    setStudentSearch(`${student.firstName} ${student.lastName}`)
    setStudents([])
  }

  // Calculate totals from real data (fallback if API fails)
  const totalPaid = paymentStats.totalPaid || paymentRecords
    .filter(p => p.paymentStatus === 'paid' || p.paymentStatus === 'Success')
    .reduce((sum, p) => sum + p.amountPaid, 0)

  const totalPending = paymentStats.totalPending || paymentRecords
    .filter(p => p.paymentStatus === 'pending' || p.paymentStatus === 'Processing')
    .reduce((sum, p) => sum + p.amountPaid, 0)

  const totalOverdue = paymentStats.totalOverdue || paymentRecords
    .filter(p => p.paymentStatus === 'overdue' || p.paymentStatus === 'Failed')
    .reduce((sum, p) => sum + p.amountPaid, 0)

  // Filter records based on search
  const filteredRecords = paymentRecords.filter(record => {
    const studentName = record.student
      ? `${record.student.firstName} ${record.student.lastName}`.toLowerCase()
      : 'Unknown Student'

    const parentName = record.student?.parentName?.toLowerCase() || ''

    const matchesSearch =
      searchQuery === '' ||
      studentName.includes(searchQuery.toLowerCase()) ||
      parentName.includes(searchQuery.toLowerCase()) ||
      record.paymentCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.transactionId?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }))
  }

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      handlePageChange(pagination.currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      handlePageChange(pagination.currentPage - 1)
    }
  }

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1)

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  const handleExport = () => {
    toast({
      title: 'Exporting data',
      description: 'Payment history is being exported to CSV',
    })
  }

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddPayment = async () => {
    if (
      !formData.userId ||
      !formData.amountPaid ||
      !formData.paymentMethod ||
      !formData.paymentType ||
      !formData.paymentCategory ||
      !formData.paymentDate
    ) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields including student selection',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const formDataToSend = new FormData()

      // Map form data to API expected fields
      formDataToSend.append('paymentDate', new Date(formData.paymentDate).toISOString())
      formDataToSend.append('amountPaid', formData.amountPaid)
      formDataToSend.append('paymentMethod', formData.paymentMethod)
      formDataToSend.append('paymentStatus', formData.paymentStatus)
      formDataToSend.append('paymentType', formData.paymentType)
      formDataToSend.append('paymentCategory', formData.paymentCategory)

      if (formData.transactionId) {
        formDataToSend.append('transactionId', formData.transactionId)
      }

      // Payment memo is required but can be empty
      if (formData.paymentMemo) {
        formDataToSend.append('paymentMemo', formData.paymentMemo)
      } else {
        formDataToSend.append('paymentMemo', new File([], 'empty.txt'))
      }

      formDataToSend.append('userId', formData.userId)

      await adminCreatePayment(formDataToSend)

      toast({
        title: 'Payment recorded',
        description: 'New payment has been added successfully',
      })

      setIsAddPaymentOpen(false)
      resetForm()
      setRefresh(prev => !prev) // Refresh payment data and statistics
    } catch (error) {
      console.error('Failed to create payment:', error)
      toast({
        title: 'Failed to record payment',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      paymentDate: new Date().toISOString().split('T')[0],
      amountPaid: '',
      paymentMethod: '',
      paymentStatus: 'pending',
      paymentType: '',
      paymentCategory: '',
      transactionId: '',
      paymentMemo: null,
      userId: '',
    })
    setSelectedStudent(null)
    setStudentSearch('')
    setStudents([])
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'success':
        return <Badge className="bg-green-500">Paid</Badge>
      case 'pending':
      case 'processing':
        return <Badge className="bg-yellow-500">Pending</Badge>
      case 'overdue':
      case 'failed':
      case 'not paid':
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container min-w-[100%] max-w-[1500px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Payment History</h1>
              <p className="text-muted-foreground">View and manage all payment records</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Record New Payment</DialogTitle>
                  <DialogDescription>Add a new payment record manually</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Student Search */}
                  <div className="relative">
                    <Label>Student *</Label>
                    <Input
                      placeholder="Search student by name..."
                      value={studentSearch}
                      onChange={e => setStudentSearch(e.target.value)}
                    />
                    {students?.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {students.map(student => (
                          <div
                            key={student?._id}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleStudentSelect(student)}
                          >
                            <div className="font-medium">
                              {student?.firstName} {student?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student?.class?.className || 'No grade'} • {student?._id}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {isSearching && (
                      <div className="absolute right-3 top-8">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      </div>
                    )}
                    {selectedStudent && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-800">
                          Selected:{' '}
                          <strong>
                            {selectedStudent?.firstName} {selectedStudent?.lastName}
                          </strong>
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Amount Paid (₦) *</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.amountPaid}
                      onChange={e => handleInputChange('amountPaid', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Payment Method *</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={value => handleInputChange('paymentMethod', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                        <SelectItem value="pos">POS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Payment Status *</Label>
                    <Select
                      value={formData.paymentStatus}
                      onValueChange={value => handleInputChange('paymentStatus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="not paid">Not paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Payment Type *</Label>
                    <Select
                      value={formData.paymentType}
                      onValueChange={value => handleInputChange('paymentType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Payment Category *</Label>
                    <Select
                      value={formData.paymentCategory}
                      onValueChange={value => handleInputChange('paymentCategory', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="school_fee">School Fee</SelectItem>
                        <SelectItem value="registration">Registration</SelectItem>
                        <SelectItem value="exam_fee">Exam Fee</SelectItem>
                        <SelectItem value="pta_dues">PTA Dues</SelectItem>
                        <SelectItem value="staff_salary">Staff Salary</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="transport_fee">Transport Fee</SelectItem>
                        <SelectItem value="hostel_fee">Hostel Fee</SelectItem>
                        <SelectItem value="uniforms">Uniforms</SelectItem>
                        <SelectItem value="books_and_supplies">Books & Supplies</SelectItem>
                        <SelectItem value="extra_curricular">Extra Curricular</SelectItem>
                        <SelectItem value="event_fee">Event Fee</SelectItem>
                        <SelectItem value="donation">Donation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Transaction ID (Optional)</Label>
                    <Input
                      placeholder="Enter transaction ID"
                      value={formData.transactionId}
                      onChange={e => handleInputChange('transactionId', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Payment Date *</Label>
                    <Input
                      type="date"
                      value={formData.paymentDate}
                      onChange={e => handleInputChange('paymentDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Payment Memo *</Label>
                    <Input type="file" onChange={e => handleInputChange('paymentMemo', e.target.files?.[0] || null)} />
                    <p className="text-sm text-muted-foreground mt-1">Required field, but can be empty</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddPaymentOpen(false)
                      resetForm()
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddPayment} disabled={isLoading || !selectedStudent}>
                    {isLoading ? 'Recording...' : 'Record Payment'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Paid</CardDescription>
              <CardTitle className="text-2xl text-green-600">
                {statsLoading ? 'Loading...' : formatCurrency(totalPaid)}
              </CardTitle>
            </CardHeader>
           
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Pending</CardDescription>
              <CardTitle className="text-2xl text-yellow-600">
                {statsLoading ? 'Loading...' : formatCurrency(totalPending)}
              </CardTitle>
            </CardHeader>
          
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Overdue</CardDescription>
              <CardTitle className="text-2xl text-red-600">
                {statsLoading ? 'Loading...' : formatCurrency(totalOverdue)}
              </CardTitle>
            </CardHeader>

          </Card>
        </div>


        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name, parent name, fee type, or transaction ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        {/* Payment Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Records</CardTitle>
            <CardDescription>
              Showing {filteredRecords.length} of {pagination.total} records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {paymentsLoading ? (
              <div className="text-center py-8">Loading payments...</div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Fee Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No payment records found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRecords.map(record => (
                          <TableRow key={record._id}>
                            <TableCell>{new Date(record.paymentDate).toLocaleDateString()}</TableCell>
                            <TableCell className="font-medium">
                              {record.student
                                ? `${record.student.firstName} ${record.student.lastName}`
                                : 'Unknown Student'}
                            </TableCell>
                            <TableCell>{record.paymentCategory}</TableCell>
                            <TableCell className="font-semibold">{formatCurrency(record.amountPaid)}</TableCell>
                            <TableCell>{getStatusBadge(record.paymentStatus)}</TableCell>
                            <TableCell>{record.paymentMethod || '-'}</TableCell>
                            <TableCell className="font-mono text-sm">{record.transactionId || '-'}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => router.push(`/admin/account/${record._id}`)}
                                >
                                  View
                                </Button>
                                {record.paymentStatus !== 'paid' && record.paymentStatus !== 'Success' && (
                                  <Button size="sm" variant="default">
                                    Mark Paid
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Showing {(pagination.currentPage - 1) * pagination.pageSize + 1} -{' '}
                        {Math.min(pagination.currentPage * pagination.pageSize, pagination.total)} of {pagination.total}{' '}
                        items
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevPage}
                        disabled={!pagination.hasPreviousPage}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>

                      {/* Page numbers */}
                      {generatePageNumbers().map(page => (
                        <Button
                          key={page}
                          variant={page === pagination.currentPage ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      ))}

                      <Button variant="outline" size="sm" onClick={handleNextPage} disabled={!pagination.hasNextPage}>
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminPaymentHistory
