'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  Users,
  School,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'
import { getParentById } from '@/utils/api'

interface FeeItem {
  id: string
  childName: string
  childClass: string
  feeName: string
  amount: number
  dueDate: string
  status: 'paid' | 'pending' | 'overdue'
  paidDate?: string
  paymentMethod?: string
}

// Calculate total fees for past and current terms only - FIXED VERSION
const calculateTotalFees = (studentFee: any) => {
  if (!studentFee) return 0

  // Sum all fees in past array
  const pastTotal = (studentFee.past || []).reduce((total: number, fee: any) => {
    return total + (fee.totalAmount || 0)
  }, 0)

  // Sum all fees in current array
  const currentTotal = (studentFee.current || []).reduce((total: number, fee: any) => {
    return total + (fee.totalAmount || 0)
  }, 0)

  return pastTotal + currentTotal
}

// Get description of terms included - UPDATED to handle multiple fees per term
const getTermsDescription = (studentFee: any) => {
  if (!studentFee) return 'No fee data available'

  const terms = new Set<string>()
  const sessions = new Set<string>()

  // Collect terms and sessions from all past and current fees
  const allFees = [...(studentFee.past || []), ...(studentFee.current || [])]

  allFees.forEach(fee => {
    if (fee.term) terms.add(fee.term)
    if (fee.session?.session) sessions.add(fee.session.session)
  })

  const termList = Array.from(terms)
    .filter(term => term && typeof term === 'string')
    .map(term => `${term.charAt(0).toUpperCase() + term.slice(1)} Term`)
    .join(', ')

  const sessionList = Array.from(sessions).join(', ')

  // Count total number of fee items
  const feeCount = allFees.length

  if (termList && sessionList) {
    return `${feeCount} fee(s) • ${termList} • ${sessionList}`
  } else if (termList) {
    return `${feeCount} fee(s) • ${termList}`
  } else {
    return `${feeCount} fee item(s)`
  }
}

// Update the financial data calculation to include totalPaid from both past and current
const calculateFinancialData = (studentFee: any) => {
  if (!studentFee) {
    return {
      totalOwing: 0,
      totalPaid: 0,
      totalFees: 0,
      overdueAmount: 0,
      unpaidCount: 0,
      paidCount: 0,
      overdueCount: 0,
    }
  }

  let totalOwing = 0
  let totalPaid = 0
  let totalFees = calculateTotalFees(studentFee)
  let overdueAmount = 0
  let unpaidCount = 0
  let paidCount = 0
  let overdueCount = 0

  // Calculate Total Owing (amount left to pay in past + current terms)
  const pastAndCurrentFees = [...(studentFee.past || []), ...(studentFee.current || [])]

  pastAndCurrentFees.forEach(fee => {
    const amountOwed = (fee.totalAmount || 0) - (fee.totalPaid || 0)

    // Total Owing - only include positive amounts (not overpaid)
    if (amountOwed > 0) {
      totalOwing += amountOwed
      unpaidCount++
    }

    // Total Paid - include payments from both past and current terms
    if (fee.totalPaid > 0) {
      totalPaid += fee.totalPaid || 0
      paidCount++
    }
  })

  // Calculate Overdue Amount (from past terms that are not fully paid)
  ;(studentFee.past || []).forEach((fee: any) => {
    const amountOwed = (fee.totalAmount || 0) - (fee.totalPaid || 0)
    if (amountOwed > 0) {
      overdueAmount += amountOwed
      overdueCount++
    }
  })

  return {
    totalOwing,
    totalPaid,
    totalFees,
    overdueAmount,
    unpaidCount,
    paidCount,
    overdueCount,
  }
}

// Transform API data to FeeItem format
const transformFeeDataToItems = (studentFee: any, children: any[] = []) => {
  const feeItems: FeeItem[] = []

  if (!studentFee) return feeItems

  // Create child name mapping for better display
  const childMap = new Map()
  children.forEach(child => {
    childMap.set(child._id, `${child.firstName} ${child.lastName}`)
  })

  // Process all fees
  const allFees = [...(studentFee.past || []), ...(studentFee.current || []), ...(studentFee.upcoming || [])]

  allFees.forEach(fee => {
    const childName = childMap.get(fee.student._id) || `${fee.student.firstName} ${fee.student.lastName}`
    const amountOwed = fee.totalAmount - fee.totalPaid

    // Determine status based on paymentStatus, computedStatus, and amount owed
    let status: 'paid' | 'pending' | 'overdue' = 'pending'

    if (amountOwed <= 0) {
      status = 'paid'
    } else if (fee.computedStatus === 'past') {
      status = 'overdue'
    } else if (fee.paymentStatus === 'OVERDUE') {
      status = 'overdue'
    } else {
      status = 'pending'
    }

    // Create due date based on term and session (fallback logic)
    const dueDate = estimateDueDate(fee.term, fee.session.session)

    feeItems.push({
      id: fee._id,
      childName,
      childClass: fee.student.class?.className || 'Class Pending',
      feeName: `School Fees - ${fee.term.charAt(0).toUpperCase() + fee.term.slice(1)} Term ${fee.session.session}`,
      amount: fee.totalAmount,
      dueDate,
      status,
      paidDate: fee.payments?.[0]?.date || undefined,
      paymentMethod: fee.payments?.[0]?.method || undefined,
    })
  })

  return feeItems
}

// Fallback function to estimate due dates
const estimateDueDate = (term: string, session: string): string => {
  const [startYear] = session.split('/')
  const year = parseInt(startYear)

  switch (term) {
    case 'first':
      return `${year}-09-30` // End of September
    case 'second':
      return `${year + 1}-01-31` // End of January next year
    case 'third':
      return `${year + 1}-05-31` // End of May next year
    default:
      return `${year}-12-31`
  }
}

const AdminParentDetail = ({ parentId }: { parentId: string }) => {
  const router = useRouter()
  const { toast } = useToast()
  const [parent, setParent] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!parentId) return
    const fetchParent = async () => {
      setLoading(true)
      try {
        const res = await getParentById(parentId)
        // Get the main data object that contains both parent and studentFee
        const parentData = res?.data ?? res
        setParent(parentData)

        // For debugging - log the structure
        console.log('API Response:', res)
        console.log('Parent Data:', parentData)
        console.log('Student Fee Data:', parentData?.studentFee)
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err?.message || 'Failed to fetch parent details',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchParent()
  }, [parentId, toast])

  // Calculate financial data from API
  const financialData = parent?.studentFee
    ? calculateFinancialData(parent.studentFee)
    : {
        totalOwing: 0,
        totalPaid: 0,
        totalFees: 0,
        overdueAmount: 0,
        unpaidCount: 0,
        paidCount: 0,
        overdueCount: 0,
      }

  // Transform API data to fee items - CORRECTED
  const feeItems = parent?.studentFee ? transformFeeDataToItems(parent.studentFee, parent.parent?.children) : []

  // Filter for display
  const pendingFees = feeItems.filter(fee => fee.status === 'pending')
  const overdueFees = feeItems.filter(fee => fee.status === 'overdue')
  const paidFees = feeItems.filter(fee => fee.status === 'paid')

  // Use the calculated financial data
  const { totalOwing, totalPaid, totalFees, overdueAmount, unpaidCount, paidCount, overdueCount } = financialData

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading parent information...</div>
      </div>
    )
  }

  if (!parent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">No parent data available.</div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="default" className="bg-green-500">
            Paid
          </Badge>
        )
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const userInfo = parent?.parent?.userId ?? parent?.user ?? (typeof parent?.userId === 'object' ? parent.userId : null)
  const childrenList = parent?.parent?.children ?? parent?.childrenDetails ?? parent?.children ?? []
  const displayName = `${userInfo?.firstName ?? ''} ${userInfo?.lastName ?? ''}`.trim() || 'Parent'
  const avatarInitials = (userInfo?.firstName?.[0] ?? '') + (userInfo?.lastName?.[0] ?? '')

  // Calculate child-specific owing (only from past and current terms)
  const calculateChildOwing = (childId: string, childName: string) => {
    if (!parent?.studentFee) return 0

    const pastAndCurrentFees = [...(parent.studentFee.past || []), ...(parent.studentFee.current || [])]

    const childFees = pastAndCurrentFees.filter(fee => fee.student._id === childId)

    return childFees.reduce((sum, fee) => {
      const amountOwed = fee.totalAmount - fee.totalPaid
      return amountOwed > 0 ? sum + amountOwed : sum
    }, 0)
  }

  console.log(parent)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push('/admin/parent')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Parent Details</h1>
                <p className="text-sm text-muted-foreground">View parent details and comprehensive fee information</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Alert for overdue fees */}
        {overdueCount > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This parent has {overdueCount} overdue payment(s) totaling {formatCurrency(overdueAmount)}
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Actions */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline">Generate Invoice</Button>
                <Button variant="outline" onClick={() => router.push('/admin/account')}>
                  Payment History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* {
                "_id": "68cc5db9c031eb3ef15607de",
                "paymentDate": "2022-01-01T00:00:00.000Z",
                "paymentStatus": "paid",
                "amount": 10000,
                "userId": "683112addb58d74f5da05120",
                "paymentMemo": "http://localhost:3000/public/files/1758223798053--Screenshot 2023-05-22 at 13.18.30.png"
            }, */}

        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
          {/* Parent Information Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Parent Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={userInfo?.photo ?? undefined} alt={displayName} />
                  <AvatarFallback className="text-3xl">{avatarInitials || 'P'}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{displayName}</h2>
                <p className="text-muted-foreground">Parent</p>
                <Badge variant={parent?.isActive ? 'default' : 'secondary'} className="mt-2">
                  {parent?.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-sm">{userInfo?.email ?? 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{userInfo?.phoneId?.phoneNumber ?? 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Occupation</p>
                    <p className="font-medium">{parent?.occupation ?? 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Children</p>
                    <p className="font-medium">{childrenList?.length ?? 0} Child(ren)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fee Information and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Fee Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Owing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{formatCurrency(totalOwing)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {unpaidCount} unpaid fee(s) in past & current terms
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Total Paid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
                  <p className="text-xs text-muted-foreground mt-1">{paidCount} payment(s) in past & current terms</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <School className="h-4 w-4" />
                    Total Fees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalFees)}</div>
                  <p className="text-xs text-muted-foreground mt-1">{getTermsDescription(parent?.studentFee)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Children Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Children
                </CardTitle>
                <CardDescription>Students registered under this parent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {childrenList?.map((child: any) => {
                    const childName = `${child.firstName} ${child.lastName}`
                    const childOwing = calculateChildOwing(child._id, childName)

                    return (
                      <Card
                        key={child._id}
                        className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => router.push(`/admin/student/${child._id}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={child?.photo} alt={childName} />
                              <AvatarFallback>
                                {child.firstName?.[0]}
                                {child.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold">{childName}</h3>
                              <p className="text-sm text-muted-foreground">
                                {child.class?.className || 'Class not set'}
                              </p>
                              <Badge variant="secondary" className="mt-1">
                                {child.class?.levelType || 'Level not set'}
                              </Badge>
                              {childOwing > 0 && (
                                <p className="text-sm font-semibold text-destructive mt-2">
                                  Owes: {formatCurrency(childOwing)}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Rest of your component remains the same... */}
            {/* Fee Details Tabs */}
            <Card>
              <CardHeader>
                <CardTitle>Fee Details</CardTitle>
                <CardDescription>Complete breakdown of all fees and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending">Pending ({pendingFees.length})</TabsTrigger>
                    <TabsTrigger value="overdue">Overdue ({overdueFees.length})</TabsTrigger>
                    <TabsTrigger value="paid">Paid ({paidFees.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pending" className="mt-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Child</TableHead>
                            <TableHead>Fee Name</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingFees.length > 0 ? (
                            pendingFees.map(fee => (
                              <TableRow key={fee.id}>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{fee.childName}</p>
                                    <p className="text-sm text-muted-foreground">{fee.childClass}</p>
                                  </div>
                                </TableCell>
                                <TableCell>{fee.feeName}</TableCell>
                                <TableCell className="font-semibold">{formatCurrency(fee.amount)}</TableCell>
                                <TableCell>{formatDate(fee.dueDate)}</TableCell>
                                <TableCell>{getStatusBadge(fee.status)}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center text-muted-foreground">
                                No pending fees
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="overdue" className="mt-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Child</TableHead>
                            <TableHead>Fee Name</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {overdueFees.length > 0 ? (
                            overdueFees.map(fee => (
                              <TableRow key={fee.id}>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{fee.childName}</p>
                                    <p className="text-sm text-muted-foreground">{fee.childClass}</p>
                                  </div>
                                </TableCell>
                                <TableCell>{fee.feeName}</TableCell>
                                <TableCell className="font-semibold text-destructive">
                                  {formatCurrency(fee.amount)}
                                </TableCell>
                                <TableCell className="text-destructive">{formatDate(fee.dueDate)}</TableCell>
                                <TableCell>{getStatusBadge(fee.status)}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center text-muted-foreground">
                                No overdue fees
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="paid" className="mt-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Child</TableHead>
                            <TableHead>Fee Name</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Paid Date</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paidFees.length > 0 ? (
                            paidFees.map(fee => (
                              <TableRow key={fee.id}>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{fee.childName}</p>
                                    <p className="text-sm text-muted-foreground">{fee.childClass}</p>
                                  </div>
                                </TableCell>
                                <TableCell>{fee.feeName}</TableCell>
                                <TableCell className="font-semibold text-green-600">
                                  {formatCurrency(fee.amount)}
                                </TableCell>
                                <TableCell>{fee.paidDate ? formatDate(fee.paidDate) : '-'}</TableCell>
                                <TableCell>{fee.paymentMethod || '-'}</TableCell>
                                <TableCell>{getStatusBadge(fee.status)}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-muted-foreground">
                                No payment history
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminParentDetail
