// components/payment/PaymentTable.tsx
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PaymentRecord, PaginationState } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaymentTableProps {
  paymentRecords: PaymentRecord[]
  paymentsLoading: boolean
  pagination: PaginationState
  filteredRecords: PaymentRecord[]
  onPageChange: (page: number) => void
  onNextPage: () => void
  onPrevPage: () => void
  generatePageNumbers: () => number[]
  getStatusBadge: (status: string) => JSX.Element
  formatCurrency: (amount: number) => string
}

export const PaymentTable = ({
  paymentRecords,
  paymentsLoading,
  pagination,
  filteredRecords,
  onPageChange,
  onNextPage,
  onPrevPage,
  generatePageNumbers,
  getStatusBadge,
  formatCurrency
}: PaymentTableProps) => {
  const router = useRouter()

  if (paymentsLoading) {
    return <div className="text-center py-8">Loading payments...</div>
  }

  return (
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
              onClick={onPrevPage}
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
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}

            <Button variant="outline" size="sm" onClick={onNextPage} disabled={!pagination.hasNextPage}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}