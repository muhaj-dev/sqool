'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Download,
  Printer,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  User,
  Receipt,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'
import { getPaymentById } from '@/utils/api'
import { Payment } from '@/types'

interface AdminPaymentDetailProps {
  paymentId: string
}

const AdminPaymentDetail = ({ paymentId }: AdminPaymentDetailProps) => {
  const router = useRouter()
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await getPaymentById(paymentId)
        setPayment(response?.data)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch payment details',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    if (paymentId) {
      fetchPayment()
    }
  }, [paymentId])

  const handleDownloadReceipt = () => {
    toast({
      title: 'Downloading receipt',
      description: 'Payment receipt is being downloaded',
    })
  }

  const handlePrint = () => {
    toast({
      title: 'Printing',
      description: 'Preparing payment details for printing',
    })
  }

  const handleSendEmail = () => {
    toast({
      title: 'Email sent',
      description: "Payment receipt has been sent to parent's email",
    })
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'overdue':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return '₦0.00'
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading payment details...</div>
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Payment not found</h2>
          <Button onClick={() => router.push('/admin/account')}>Back to Payments</Button>
        </div>
      </div>
    )
  }

  // Mock payment history - you might want to fetch this from another endpoint
  const paymentHistory = [
    {
      id: '1',
      date: payment?.paymentDate ? new Date(payment.paymentDate).toLocaleString() : 'N/A',
      action: 'Payment Received',
      amount: payment?.amountPaid,
      method: payment?.paymentMethod,
      by: 'System',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="min-w-[100%] max-w-[1500px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/admin/account')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Payment Details</h1>
                {getStatusIcon(payment?.paymentStatus)}
              </div>
              <p className="text-muted-foreground">Transaction ID: {payment?.transactionId || 'N/A'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSendEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownloadReceipt}>
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payment Summary</CardTitle>
                    <CardDescription>Overview of payment details</CardDescription>
                  </div>
                  {getStatusBadge(payment?.paymentStatus)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Category</p>
                    <p className="font-medium capitalize">{payment?.paymentCategory?.replace('_', ' ') || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Type</p>
                    <p className="font-medium capitalize">{payment?.paymentType?.replace('_', ' ') || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium capitalize">{payment?.paymentMethod || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Date</p>
                    <p className="font-medium">
                      {payment?.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="text-xl font-bold text-green-600">{formatCurrency(payment?.amountPaid)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Transaction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction ID</p>
                    <p className="font-mono text-sm">{payment?.transactionId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Date</p>
                    <p className="font-medium">
                      {payment?.paymentDate ? new Date(payment.paymentDate).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium capitalize">{payment?.paymentMethod || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Type</p>
                    <p className="font-medium capitalize">{payment?.paymentType?.replace('_', ' ') || 'N/A'}</p>
                  </div>
                </div>
                {payment?.paymentMemo && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Memo</p>
                      <p className="text-sm break-words">{payment.paymentMemo}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Payment History
                </CardTitle>
                <CardDescription>Timeline of all payment activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentHistory.map(record => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.date}</TableCell>
                          <TableCell>{record.action}</TableCell>
                          <TableCell>{record.amount ? formatCurrency(record.amount) : '-'}</TableCell>
                          <TableCell>{record.method || '-'}</TableCell>
                          <TableCell>{record.by}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Parent Information */}
            {payment?.parent && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Parent Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{payment?.parent?.name || 'N/A'}</p>
                  </div>
                  {payment?.parent?.email && (
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-sm">{payment.parent.email}</p>
                    </div>
                  )}
                  {payment?.parent?.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="text-sm">{payment.parent.phone}</p>
                    </div>
                  )}
                  <Separator />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push(`/admin/parent/${payment?.parent?._id}`)}
                  >
                    View Parent Profile
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Student Information */}
            {payment?.student && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Student Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{payment?.student?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Student ID</p>
                    <p className="font-mono text-sm">{payment?.student?.studentId || 'N/A'}</p>
                  </div>
                  {payment?.student?.class && (
                    <div>
                      <p className="text-sm text-muted-foreground">Class</p>
                      <p className="font-medium">{payment.student.class}</p>
                    </div>
                  )}
                  <Separator />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push(`/student/${payment?.student?._id}`)}
                  >
                    View Student Profile
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Reminder
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Receipt className="h-4 w-4 mr-2" />
                  Generate Invoice
                </Button>
                {payment?.paymentStatus !== 'paid' && (
                  <Button className="w-full justify-start">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark as Paid
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPaymentDetail
