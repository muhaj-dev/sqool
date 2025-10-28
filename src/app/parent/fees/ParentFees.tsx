
'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

import { CreditCard, Building2, Smartphone, CheckCircle, Clock, AlertCircle, Download, Receipt } from "lucide-react";

interface FeeItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paidDate?: string;
  paymentMethod?: string;
  receiptNumber?: string;
}

interface Student {
  id: string;
  name: string;
  class: string;
  admissionNumber: string;
}

const ParentFees = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>("1");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const { toast } = useToast();

  // Mock student data
  const students: Student[] = [
    { id: "1", name: "Adewale Johnson", class: "JSS 1", admissionNumber: "2024/JSS1/001" },
    { id: "2", name: "Amaka Johnson", class: "SS 2", admissionNumber: "2022/SS2/045" },
  ];

  // Mock fee data for selected student
  const [feeItems, setFeeItems] = useState<FeeItem[]>([
    { 
      id: "1", 
      name: "Tuition Fee", 
      amount: 150000, 
      category: "Tuition", 
      dueDate: "2024-11-30",
      status: "pending"
    },
    { 
      id: "2", 
      name: "PTA Levy", 
      amount: 5000, 
      category: "Levy", 
      dueDate: "2024-11-30",
      status: "pending"
    },
    { 
      id: "3", 
      name: "Textbooks", 
      amount: 25000, 
      category: "Books", 
      dueDate: "2024-11-15",
      status: "overdue"
    },
    { 
      id: "4", 
      name: "Uniform", 
      amount: 15000, 
      category: "Uniform", 
      dueDate: "2024-10-31",
      status: "paid",
      paidDate: "2024-10-15",
      paymentMethod: "Bank Transfer",
      receiptNumber: "RCP/2024/001234"
    },
    { 
      id: "5", 
      name: "Exam Fee", 
      amount: 8000, 
      category: "Examination", 
      dueDate: "2024-12-01",
      status: "paid",
      paidDate: "2024-10-18",
      paymentMethod: "Card Payment",
      receiptNumber: "RCP/2024/001235"
    },
  ]);

  const currentStudent = students.find(s => s.id === selectedStudent);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalPending = feeItems
    .filter(f => f.status === "pending" || f.status === "overdue")
    .reduce((sum, f) => sum + f.amount, 0);

  const totalPaid = feeItems
    .filter(f => f.status === "paid")
    .reduce((sum, f) => sum + f.amount, 0);

  const handleFeeSelection = (feeId: string) => {
    setSelectedFees(prev => 
      prev.includes(feeId) 
        ? prev.filter(id => id !== feeId)
        : [...prev, feeId]
    );
  };

  const handlePayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (selectedFees.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one fee to pay",
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    // Simulate payment processing
    const updatedFees = feeItems.map(fee => {
      if (selectedFees.includes(fee.id)) {
        return {
          ...fee,
          status: "paid" as const,
          paidDate: new Date().toISOString().split('T')[0],
          paymentMethod: paymentMethod,
          receiptNumber: `RCP/2024/${Math.floor(Math.random() * 900000 + 100000)}`
        };
      }
      return fee;
    });

    setFeeItems(updatedFees);
    setSelectedFees([]);
    setPaymentMethod("");
    setIsPaymentDialogOpen(false);
    toast({
        title: "Success",
        description: "Payment successful! Receipt has been sent to your email.",
      });
  };

  const selectedFeesTotal = feeItems
    .filter(f => selectedFees.includes(f.id))
    .reduce((sum, f) => sum + f.amount, 0);

  const pendingFees = feeItems.filter(f => f.status === "pending" || f.status === "overdue");
  const paidFees = feeItems.filter(f => f.status === "paid");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fee Payment Portal</h1>
            <p className="text-muted-foreground">View and pay school fees for your children</p>
          </div>
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {students.map(student => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} - {student.class}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Student Info Card */}
        {currentStudent && (
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-semibold">{currentStudent.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Class</p>
                  <p className="font-semibold">{currentStudent.class}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Admission Number</p>
                  <p className="font-semibold">{currentStudent.admissionNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{formatCurrency(totalPending)}</div>
              <p className="text-xs text-muted-foreground">
                {pendingFees.length} pending payment{pendingFees.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
              <p className="text-xs text-muted-foreground">
                {paidFees.length} payment{paidFees.length !== 1 ? 's' : ''} completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPending + totalPaid)}</div>
              <p className="text-xs text-muted-foreground">This term</p>
            </CardContent>
          </Card>
        </div>

        {/* Overdue Alert */}
        {feeItems.some(f => f.status === "overdue") && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have overdue payments. Please settle them as soon as possible to avoid penalties.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Payments ({pendingFees.length})
            </TabsTrigger>
            <TabsTrigger value="paid">
              Payment History ({paidFees.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingFees.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground">No pending payments at this time.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-3">
                  {pendingFees.map((fee) => (
                    <Card key={fee.id} className={selectedFees.includes(fee.id) ? "border-primary" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <input
                              type="checkbox"
                              checked={selectedFees.includes(fee.id)}
                              onChange={() => handleFeeSelection(fee.id)}
                              className="mt-1 h-4 w-4 rounded border-gray-300"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{fee.name}</h3>
                                <Badge variant={fee.status === "overdue" ? "destructive" : "secondary"}>
                                  {fee.status === "overdue" ? "Overdue" : "Pending"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Category: {fee.category}</p>
                              <p className="text-sm text-muted-foreground">
                                Due Date: {new Date(fee.dueDate).toLocaleDateString('en-NG', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">{formatCurrency(fee.amount)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedFees.length > 0 && (
                  <Card className="border-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {selectedFees.length} item{selectedFees.length !== 1 ? 's' : ''} selected
                          </p>
                          <p className="text-2xl font-bold">{formatCurrency(selectedFeesTotal)}</p>
                        </div>
                        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="lg">Proceed to Payment</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <form onSubmit={handlePayment}>
                              <DialogHeader>
                                <DialogTitle>Complete Payment</DialogTitle>
                                <DialogDescription>
                                  Choose your preferred payment method
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Payment Amount</Label>
                                  <div className="text-3xl font-bold">{formatCurrency(selectedFeesTotal)}</div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                                  <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Bank Transfer">
                                        <div className="flex items-center gap-2">
                                          <Building2 className="w-4 h-4" />
                                          Bank Transfer
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="Card Payment">
                                        <div className="flex items-center gap-2">
                                          <CreditCard className="w-4 h-4" />
                                          Debit/Credit Card
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="USSD">
                                        <div className="flex items-center gap-2">
                                          <Smartphone className="w-4 h-4" />
                                          USSD
                                        </div>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {paymentMethod === "Bank Transfer" && (
                                  <Alert>
                                    <Building2 className="h-4 w-4" />
                                    <AlertDescription>
                                      <p className="font-semibold mb-2">Bank Details:</p>
                                      <p className="text-sm">Bank: Access Bank</p>
                                      <p className="text-sm">Account Name: SchoolsFocus Academy</p>
                                      <p className="text-sm">Account Number: 0123456789</p>
                                      <p className="text-sm mt-2 text-muted-foreground">
                                        Please use your child&apos;s admission number as reference
                                      </p>
                                    </AlertDescription>
                                  </Alert>
                                )}

                                <div className="space-y-2">
                                  <Label htmlFor="email">Email for Receipt</Label>
                                  <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="parent@email.com"
                                    defaultValue="parent@example.com"
                                    required
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button type="submit">Confirm Payment</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="paid" className="space-y-4">
            {paidFees.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Payment History</h3>
                  <p className="text-muted-foreground">Your payment history will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {paidFees.map((fee) => (
                  <Card key={fee.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <h3 className="font-semibold">{fee.name}</h3>
                            <Badge variant="default">Paid</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Category: {fee.category}</p>
                          <p className="text-sm text-muted-foreground">
                            Paid on: {fee.paidDate && new Date(fee.paidDate).toLocaleDateString('en-NG', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">Method: {fee.paymentMethod}</p>
                          <p className="text-sm font-mono text-muted-foreground">Receipt: {fee.receiptNumber}</p>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="text-2xl font-bold">{formatCurrency(fee.amount)}</p>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Receipt
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParentFees;