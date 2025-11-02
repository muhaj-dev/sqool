'use client';


import { useRouter } from "next/navigation";

import { ArrowLeft, Download, Printer, Mail, Phone, Calendar, CreditCard, User, Receipt, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

interface AdminPaymentDetailProps {
  paymentId: string;
}

const AdminPaymentDetail = ({paymentId}: AdminPaymentDetailProps) => {
  // const router.push = useNavigate();
    const router = useRouter();
  

  // Mock data - replace with real data from your backend
  const payment = {
    id: paymentId || "1",
    date: "2024-01-15",
    dueDate: "2024-01-10",
    parentName: "John Doe",
    parentEmail: "john.doe@example.com",
    parentPhone: "+234 803 456 7890",
    studentName: "Emma Doe",
    studentClass: "Primary 5A",
    studentId: "STD001",
    feeType: "Tuition Fee - Term 1",
    term: "First Term",
    session: "2023/2024",
    amount: 5000,
    amountPaid: 5000,
    balance: 0,
    status: "paid",
    paymentMethod: "Bank Transfer",
    transactionId: "TXN001234",
    bankName: "First Bank",
    reference: "REF123456",
    paidBy: "John Doe",
    receivedBy: "Admin User",
    notes: "Payment received for first term tuition",
  };

  const paymentHistory = [
    {
      id: "1",
      date: "2024-01-15 10:30 AM",
      action: "Payment Received",
      amount: 5000,
      method: "Bank Transfer",
      by: "Admin User",
    },
    {
      id: "2",
      date: "2024-01-10 09:15 AM",
      action: "Invoice Generated",
      amount: 5000,
      by: "System",
    },
  ];

  const handleDownloadReceipt = () => {
    toast({
      title: "Downloading receipt",
      description: "Payment receipt is being downloaded",
    });
  };

  const handlePrint = () => {
    toast({
      title: "Printing",
      description: "Preparing payment details for printing",
    });
  };

  const handleSendEmail = () => {
    toast({
      title: "Email sent",
      description: "Payment receipt has been sent to parent's email",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "overdue":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/admin/account')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Payment Details</h1>
                {getStatusIcon(payment.status)}
              </div>
              <p className="text-muted-foreground">Transaction ID: {payment.transactionId}</p>
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
                  {getStatusBadge(payment.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Fee Type</p>
                    <p className="font-medium">{payment.feeType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Session</p>
                    <p className="font-medium">{payment.session}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Term</p>
                    <p className="font-medium">{payment.term}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium">{new Date(payment.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="text-xl font-bold">₦{payment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="text-lg font-semibold text-green-600">₦{payment.amountPaid.toLocaleString()}</span>
                  </div>
                  {payment.balance > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Balance</span>
                      <span className="text-lg font-semibold text-red-600">₦{payment.balance.toLocaleString()}</span>
                    </div>
                  )}
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
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium">{payment.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Date</p>
                    <p className="font-medium">{new Date(payment.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction ID</p>
                    <p className="font-mono text-sm">{payment.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reference Number</p>
                    <p className="font-mono text-sm">{payment.reference}</p>
                  </div>
                  {payment.bankName && (
                    <div>
                      <p className="text-sm text-muted-foreground">Bank Name</p>
                      <p className="font-medium">{payment.bankName}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Received By</p>
                    <p className="font-medium">{payment.receivedBy}</p>
                  </div>
                </div>
                {payment.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm">{payment.notes}</p>
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
                      {paymentHistory.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.date}</TableCell>
                          <TableCell>{record.action}</TableCell>
                          <TableCell>
                            {record.amount ? `₦${record.amount.toLocaleString()}` : "-"}
                          </TableCell>
                          <TableCell>{record.method || "-"}</TableCell>
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
                  <p className="font-medium">{payment.parentName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm">{payment.parentEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-sm">{payment.parentPhone}</p>
                </div>
                <Separator />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push(`/admin/parent/${payment.parentName}`)}
                >
                  View Parent Profile
                </Button>
              </CardContent>
            </Card>

            {/* Student Information */}
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
                  <p className="font-medium">{payment.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Student ID</p>
                  <p className="font-mono text-sm">{payment.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Class</p>
                  <p className="font-medium">{payment.studentClass}</p>
                </div>
                <Separator />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push(`/student/${payment.studentId}`)}
                >
                  View Student Profile
                </Button>
              </CardContent>
            </Card>

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
                {payment.status !== "paid" && (
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
  );
};

export default AdminPaymentDetail;
