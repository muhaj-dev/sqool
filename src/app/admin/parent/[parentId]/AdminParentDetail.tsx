'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, Briefcase, Users, School, DollarSign, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Parent } from "@/types/parent";

interface FeeItem {
  id: string;
  childName: string;
  childClass: string;
  feeName: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paidDate?: string;
  paymentMethod?: string;
}

// Mock data
const mockParentData: any = {
  _id: "683112addb58d74f5da0511b",
  userId: "683112addb58d74f5da05119",
  children: ["683112addb58d74f5da05120", "683112addb58d74f5da05121"],
  occupation: "Lecturer",
  schools: ["6828ae29252ba86fcc693144"],
  isActive: true,
  user: {
    firstName: "Adewale",
    lastName: "Okonkwo",
    email: "adewale.okonkwo@email.com",
    phone: "+234 803 456 7890",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adewale"
  },
  childrenDetails: [
    {
      _id: "683112addb58d74f5da05120",
      firstName: "Chioma",
      lastName: "Okonkwo",
      class: {
        className: "JSS 2A",
        levelType: "Junior Secondary"
      },
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma"
    },
    {
      _id: "683112addb58d74f5da05121",
      firstName: "Emeka",
      lastName: "Okonkwo",
      class: {
        className: "Primary 5B",
        levelType: "Primary"
      },
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emeka"
    }
  ]
};

const mockFeeItems: FeeItem[] = [
  {
    id: "1",
    childName: "Chioma Okonkwo",
    childClass: "JSS 2A",
    feeName: "Tuition Fee - Term 1",
    amount: 75000,
    dueDate: "2025-02-15",
    status: "pending"
  },
  {
    id: "2",
    childName: "Chioma Okonkwo",
    childClass: "JSS 2A",
    feeName: "Development Levy",
    amount: 15000,
    dueDate: "2025-01-30",
    status: "overdue"
  },
  {
    id: "3",
    childName: "Emeka Okonkwo",
    childClass: "Primary 5B",
    feeName: "Tuition Fee - Term 1",
    amount: 60000,
    dueDate: "2025-02-15",
    status: "pending"
  },
  {
    id: "4",
    childName: "Emeka Okonkwo",
    childClass: "Primary 5B",
    feeName: "Textbook Fee",
    amount: 12000,
    dueDate: "2025-02-01",
    status: "overdue"
  },
  {
    id: "5",
    childName: "Chioma Okonkwo",
    childClass: "JSS 2A",
    feeName: "Tuition Fee - Term 3 2024",
    amount: 70000,
    dueDate: "2024-09-15",
    status: "paid",
    paidDate: "2024-09-10",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "6",
    childName: "Emeka Okonkwo",
    childClass: "Primary 5B",
    feeName: "Tuition Fee - Term 3 2024",
    amount: 55000,
    dueDate: "2024-09-15",
    status: "paid",
    paidDate: "2024-09-10",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "7",
    childName: "Chioma Okonkwo",
    childClass: "JSS 2A",
    feeName: "Sports Fee - Term 3 2024",
    amount: 8000,
    dueDate: "2024-10-01",
    status: "paid",
    paidDate: "2024-09-28",
    paymentMethod: "Card Payment"
  }
];

const AdminParentDetail = ({ parentId }: { parentId: string }) => {
  // const { parentId } = useParams();
    const router = useRouter();
  
  const [parent] = useState<any>(mockParentData);
  const [feeItems] = useState<FeeItem[]>(mockFeeItems);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate fee summaries
  const pendingFees = feeItems.filter(fee => fee.status === "pending");
  const overdueFees = feeItems.filter(fee => fee.status === "overdue");
  const paidFees = feeItems.filter(fee => fee.status === "paid");

  const totalOwing = [...pendingFees, ...overdueFees].reduce((sum, fee) => sum + fee.amount, 0);
  const totalPaid = paidFees.reduce((sum, fee) => sum + fee.amount, 0);
  const overdueAmount = overdueFees.reduce((sum, fee) => sum + fee.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="default" className="bg-green-500">Paid</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/admin/student")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Admin - Parent Fee Management</h1>
                <p className="text-sm text-muted-foreground">
                  View parent details and comprehensive fee information
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Alert for overdue fees */}
        {overdueFees.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This parent has {overdueFees.length} overdue payment(s) totaling {formatCurrency(overdueAmount)}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
          {/* Parent Information Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Parent Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={parent.user?.photo} alt={`${parent.user?.firstName} ${parent.user?.lastName}`} />
                  <AvatarFallback className="text-3xl">
                    {parent.user?.firstName?.[0]}{parent.user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">
                  {parent.user?.firstName} {parent.user?.lastName}
                </h2>
                <p className="text-muted-foreground">Parent</p>
                <Badge variant={parent.isActive ? "default" : "secondary"} className="mt-2">
                  {parent.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-sm">{parent.user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{parent.user?.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Occupation</p>
                    <p className="font-medium">{parent.occupation}</p>
                  </div>
                </div>

                {/* <div className="flex items-start gap-3">
                  <School className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Schools</p>
                    <p className="font-medium">{parent.schools.length} School(s)</p>
                  </div>
                </div> */}

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Children</p>
                    <p className="font-medium">{parent.childrenDetails?.length || 0} Child(ren)</p>
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
                    {pendingFees.length + overdueFees.length} unpaid fee(s)
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
                  <p className="text-xs text-muted-foreground mt-1">
                    {paidFees.length} payment(s) received
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Overdue Amount
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{formatCurrency(overdueAmount)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {overdueFees.length} overdue fee(s)
                  </p>
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
                  {parent?.childrenDetails?.map(({child}: any) => {
                    const childFees = feeItems.filter(fee => fee?.childName === `${child?.firstName} ${child?.lastName}`);
                    const childOwing = childFees
                      .filter(fee => fee.status !== "paid")
                      .reduce((sum, fee) => sum + fee.amount, 0);
                    
                    return (
                      <Card
                      key={child?._id} 
                      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" 
                      onClick={() => router.push(`/admin/student/${child?._id}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={child?.photo} alt={`${child?.firstName} ${child?.lastName}`} />
                              <AvatarFallback>
                                {child?.firstName?.[0]}{child?.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold">
                                {child?.firstName} {child?.lastName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {child?.class?.className}
                              </p>
                              <Badge variant="secondary" className="mt-1">
                                {child?.class.levelType}
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
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Fee Details Tabs */}
            <Card>
              <CardHeader>
                <CardTitle>Fee Details</CardTitle>
                <CardDescription>Complete breakdown of all fees and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending">
                      Pending ({pendingFees.length})
                    </TabsTrigger>
                    <TabsTrigger value="overdue">
                      Overdue ({overdueFees.length})
                    </TabsTrigger>
                    <TabsTrigger value="paid">
                      Paid ({paidFees.length})
                    </TabsTrigger>
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
                            pendingFees.map((fee) => (
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
                            overdueFees.map((fee) => (
                              <TableRow key={fee.id}>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{fee.childName}</p>
                                    <p className="text-sm text-muted-foreground">{fee.childClass}</p>
                                  </div>
                                </TableCell>
                                <TableCell>{fee.feeName}</TableCell>
                                <TableCell className="font-semibold text-destructive">{formatCurrency(fee.amount)}</TableCell>
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
                            paidFees.map((fee) => (
                              <TableRow key={fee.id}>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{fee.childName}</p>
                                    <p className="text-sm text-muted-foreground">{fee.childClass}</p>
                                  </div>
                                </TableCell>
                                <TableCell>{fee.feeName}</TableCell>
                                <TableCell className="font-semibold text-green-600">{formatCurrency(fee.amount)}</TableCell>
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

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline">Send Reminder</Button>
                  <Button variant="outline">Generate Invoice</Button>
                  <Button variant="outline">Payment History</Button>
                  <Button variant="outline">Contact Parent</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminParentDetail;
