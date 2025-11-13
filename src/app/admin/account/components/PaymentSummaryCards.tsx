// components/payment/PaymentSummaryCards.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PaymentStatistics } from '@/types'

interface PaymentSummaryCardsProps {
  paymentStats: PaymentStatistics
  statsLoading: boolean
  paymentRecords: any[]
  formatCurrency: (amount: number) => string
}

export const PaymentSummaryCards = ({
  paymentStats,
  statsLoading,
  paymentRecords,
  formatCurrency
}: PaymentSummaryCardsProps) => {
  const totalPaid = paymentStats.totalPaid
  const totalPending = paymentStats.totalPending
  const totalOverdue = paymentStats.totalOverdue

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Total Paid</CardDescription>
          <CardTitle className="text-2xl text-green-600">
            {statsLoading ? 'Loading...' : formatCurrency(totalPaid)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {paymentRecords.filter(p => p.paymentStatus === 'paid' || p.paymentStatus === 'Success').length}{' '}
            transactions
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Total Pending</CardDescription>
          <CardTitle className="text-2xl text-yellow-600">
            {statsLoading ? 'Loading...' : formatCurrency(totalPending)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {paymentRecords.filter(p => p.paymentStatus === 'pending' || p.paymentStatus === 'Processing').length}{' '}
            transactions
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Total Overdue</CardDescription>
          <CardTitle className="text-2xl text-red-600">
            {statsLoading ? 'Loading...' : formatCurrency(totalOverdue)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {paymentRecords.filter(p => p.paymentStatus === 'overdue' || p.paymentStatus === 'Failed').length}{' '}
            transactions
          </p>
        </CardContent>
      </Card>
    </div>
  )
}