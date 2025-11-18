"use client";
import { AlertCircle, CheckCircle, Clock, Download, Loader2, Receipt } from "lucide-react";
import { useEffect, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { getParentFees } from "@/utils/api";
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
  receiptNumber?: string;
  term?: string;
  session?: string;
  outstanding?: number;
  totalPaid?: number;
}

interface Student {
  id: string;
  name: string;
  class: string;
  admissionNumber: string;
}

// Helper functions
const estimateDueDate = (term: string, session: string): string => {
  const [startYear] = session.split("/");
  const year = parseInt(startYear);

  switch (term) {
    case "first":
      return `${year}-09-30`;
    case "second":
      return `${year + 1}-01-31`;
    case "third":
      return `${year + 1}-05-31`;
    default:
      return `${year}-12-31`;
  }
};

const getDueDateFromSession = (fee: any): string => {
  if (!fee.session) return estimateDueDate(fee.term, fee.session?.session);

  const term = fee.term;
  const sessionData = fee.session;

  switch (term) {
    case "first":
      return sessionData.firstTerm?.endDate || estimateDueDate(term, sessionData.session);
    case "second":
      return sessionData.secondTerm?.endDate || estimateDueDate(term, sessionData.session);
    case "third":
      return sessionData.thirdTerm?.endDate || estimateDueDate(term, sessionData.session);
    default:
      return estimateDueDate(term, sessionData.session);
  }
};

const determineFeeStatus = (fee: any, amountOwed: number): "paid" | "pending" | "overdue" => {
  if (amountOwed <= 0) {
    return "paid";
  }

  const dueDate = getDueDateFromSession(fee);
  const currentDate = new Date();
  const dueDateObj = new Date(dueDate);

  if (currentDate > dueDateObj) {
    return "overdue";
  }

  if (fee.computedStatus === "past" || fee.computedStatus === "current") {
    return "overdue";
  } else if (fee.computedStatus === "upcoming") {
    return "pending";
  }

  return "pending";
};

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
    };
  }

  let totalOwing = 0;
  let totalPaid = 0;
  let totalFees = 0;
  let overdueAmount = 0;
  let unpaidCount = 0;
  let paidCount = 0;
  let overdueCount = 0;

  const pastAndCurrentFees = [...(studentFee.past || []), ...(studentFee.current || [])];

  pastAndCurrentFees.forEach((fee) => {
    const amountOwed = (fee.totalAmount || 0) - (fee.totalPaid || 0);
    totalFees += fee.totalAmount || 0;

    if (amountOwed > 0) {
      totalOwing += amountOwed;
      unpaidCount++;
    }

    if (fee.totalPaid > 0) {
      totalPaid += fee.totalPaid || 0;
      paidCount++;
    }
  });
  (studentFee.past || []).forEach((fee: any) => {
    const amountOwed = (fee.totalAmount || 0) - (fee.totalPaid || 0);
    if (amountOwed > 0) {
      overdueAmount += amountOwed;
      overdueCount++;
    }
  });

  return {
    totalOwing,
    totalPaid,
    totalFees,
    overdueAmount,
    unpaidCount,
    paidCount,
    overdueCount,
  };
};

const transformFeeDataToItems = (studentFee: any, children: any[] = []) => {
  const feeItems: FeeItem[] = [];

  if (!studentFee) return feeItems;

  const childMap = new Map();
  children.forEach((child) => {
    childMap.set(child._id, `${child.firstName} ${child.lastName}`);
  });

  const allFees = [
    ...(studentFee.past || []),
    ...(studentFee.current || []),
    ...(studentFee.upcoming || []),
  ];

  allFees.forEach((fee) => {
    const childName =
      childMap.get(fee.student._id) || `${fee.student.firstName} ${fee.student.lastName}`;
    const totalAmount = fee.totalAmount || 0;
    const totalPaid = fee.totalPaid || 0;
    const amountOwed = totalAmount - totalPaid;

    // Use the new status determination function
    const status = determineFeeStatus(fee, amountOwed);

    const dueDate = getDueDateFromSession(fee);

    feeItems.push({
      id: fee._id,
      childName,
      childClass: fee.student.class?.className || "Class Pending",
      feeName: `School Fees - ${fee.term.charAt(0).toUpperCase() + fee.term.slice(1)} Term ${fee.session.session}`,
      amount: totalAmount,
      dueDate,
      status,
      paidDate: fee.payments?.[0]?.date || undefined,
      paymentMethod: fee.payments?.[0]?.method || undefined,
      term: fee.term,
      session: fee.session.session,
      outstanding: amountOwed > 0 ? amountOwed : 0,
      totalPaid: totalPaid,
    });
  });

  return feeItems;
};

const ParentFees = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feeData, setFeeData] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [feeItems, setFeeItems] = useState<FeeItem[]>([]);
  const { toast } = useToast();

  // Fetch fee data
  useEffect(() => {
    const fetchFeeData = async () => {
      try {
        setLoading(true);
        // Since getParentFees doesn't need an ID for parent, we can call it directly
        const response = await getParentFees();

        setFeeData(response);

        // Transform API data
        const children = response?.data?.parent?.children || [];
        const studentFee = response?.data?.studentFee;

        // Create student list
        const studentList: Student[] = children.map((child: any) => ({
          id: child._id,
          name: `${child.firstName} ${child.lastName}`,
          class: child.class?.className || "N/A",
          admissionNumber: child.admissionNumber || `STD/${child._id.slice(-6)}`,
        }));

        setStudents(studentList);

        // Transform fee items
        const transformedFees = transformFeeDataToItems(studentFee, children);
        setFeeItems(transformedFees);

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load fee data");
        toast({
          title: "Error",
          description: "Failed to load fee information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    void fetchFeeData();
  }, [toast]);

  // Calculate financial data
  const financialData = feeData?.data?.studentFee
    ? calculateFinancialData(feeData.data.studentFee)
    : {
        totalOwing: 0,
        totalPaid: 0,
        totalFees: 0,
        overdueAmount: 0,
        unpaidCount: 0,
        paidCount: 0,
        overdueCount: 0,
      };

  const { totalOwing, totalPaid, totalFees, overdueAmount, unpaidCount, paidCount, overdueCount } =
    financialData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter fees based on selected student
  const filteredFees =
    selectedStudent === "all"
      ? feeItems
      : feeItems.filter((fee) => {
          const student = students.find((s) => s.id === selectedStudent);
          return student && fee.childName === student.name;
        });

  const pendingFees = filteredFees.filter(
    (fee) => fee.status === "pending" || fee.status === "overdue",
  );
  const paidFees = filteredFees.filter((fee) => fee.status === "paid");

  const currentStudent =
    selectedStudent === "all"
      ? {
          name: "All Children",
          class: "Multiple Classes",
          admissionNumber: "Multiple",
        }
      : students.find((s) => s.id === selectedStudent);

  const handleFeeSelection = (feeId: string) => {
    setSelectedFees((prev) =>
      prev.includes(feeId) ? prev.filter((id) => id !== feeId) : [...prev, feeId],
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
    const updatedFees = feeItems.map((fee) => {
      if (selectedFees.includes(fee.id)) {
        return {
          ...fee,
          status: "paid" as const,
          paidDate: new Date().toISOString().split("T")[0],
          paymentMethod: paymentMethod,
          receiptNumber: `RCP/2024/${Math.floor(Math.random() * 900000 + 100000)}`,
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
    .filter((f) => selectedFees.includes(f.id))
    .reduce((sum, f) => sum + f.amount, 0);

  // Helper functions to calculate student-specific totals
  const getStudentTotalOwing = (studentId: string) => {
    if (studentId === "all") return totalOwing;

    const student = students.find((s) => s.id === studentId);
    if (!student) return 0;

    const studentFees = feeItems.filter((fee) => fee.childName === student.name);
    return studentFees
      .filter((fee) => fee.status === "pending" || fee.status === "overdue")
      .reduce((sum, fee) => sum + fee.amount, 0);
  };

  const getStudentTotalPaid = (studentId: string) => {
    if (studentId === "all") return totalPaid;

    const student = students.find((s) => s.id === studentId);
    if (!student) return 0;

    const studentFees = feeItems.filter((fee) => fee.childName === student.name);
    return studentFees
      .filter((fee) => fee.status === "paid")
      .reduce((sum, fee) => sum + fee.amount, 0);
  };

  const getStudentTotalFees = (studentId: string) => {
    if (studentId === "all") return totalFees;

    const student = students.find((s) => s.id === studentId);
    if (!student) return 0;

    const studentFees = feeItems.filter((fee) => fee.childName === student.name);
    return studentFees.reduce((sum, fee) => sum + fee.amount, 0);
  };

  const getStudentUnpaidCount = (studentId: string) => {
    if (studentId === "all") return unpaidCount;

    const student = students.find((s) => s.id === studentId);
    if (!student) return 0;

    const studentFees = feeItems.filter((fee) => fee.childName === student.name);
    return studentFees.filter((fee) => fee.status === "pending" || fee.status === "overdue").length;
  };

  const getStudentPaidCount = (studentId: string) => {
    if (studentId === "all") return paidCount;

    const student = students.find((s) => s.id === studentId);
    if (!student) return 0;

    const studentFees = feeItems.filter((fee) => fee.childName === student.name);
    return studentFees.filter((fee) => fee.status === "paid").length;
  };

  const getStudentOverdueCount = (studentId: string) => {
    if (studentId === "all") return overdueCount;

    const student = students.find((s) => s.id === studentId);
    if (!student) return 0;

    const studentFees = feeItems.filter((fee) => fee.childName === student.name);
    return studentFees.filter((fee) => fee.status === "overdue").length;
  };

  const getStudentOverdueAmount = (studentId: string) => {
    if (studentId === "all") return overdueAmount;

    const student = students.find((s) => s.id === studentId);
    if (!student) return 0;

    const studentFees = feeItems.filter((fee) => fee.childName === student.name);
    return studentFees
      .filter((fee) => fee.status === "overdue")
      .reduce((sum, fee) => sum + fee.amount, 0);
  };

  // Helper function to get total paid for a specific fee
  const getFeeTotalPaid = (feeId: string) => {
    if (!feeData?.data?.studentFee) return 0;

    // Search through all fee arrays to find the fee and get its totalPaid
    const allFees = [
      ...(feeData.data.studentFee.past || []),
      ...(feeData.data.studentFee.current || []),
      ...(feeData.data.studentFee.upcoming || []),
    ];

    const fee = allFees.find((f) => f._id === feeId);
    return fee?.totalPaid || 0;
  };

  const getFeeTotalPaidFromPayments = (feeId: string) => {
    if (!feeData?.data?.studentFee) return 0;

    const allFees = [
      ...(feeData.data.studentFee.past || []),
      ...(feeData.data.studentFee.current || []),
      ...(feeData.data.studentFee.upcoming || []),
    ];

    const fee = allFees.find((f) => f._id === feeId);
    if (!fee?.payments) return 0;

    return fee.payments.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0);
  };

  // Add this helper function near your other helper functions
  const formatTerm = (term: string | undefined): string => {
    if (!term) return "N/A";
    return term.charAt(0).toUpperCase() + term.slice(1);
  };

  const formatSession = (session: string | undefined): string => {
    return session || "N/A";
  };

  const getDueDateFromSession = (fee: any): string => {
    if (!fee.session) return estimateDueDate(fee.term, fee.session?.session);

    const term = fee.term;
    const sessionData = fee.session;

    // Use the actual end date from the session data
    switch (term) {
      case "first":
        return sessionData.firstTerm?.endDate || estimateDueDate(term, sessionData.session);
      case "second":
        return sessionData.secondTerm?.endDate || estimateDueDate(term, sessionData.session);
      case "third":
        return sessionData.thirdTerm?.endDate || estimateDueDate(term, sessionData.session);
      default:
        return estimateDueDate(term, sessionData.session);
    }
  };

  // Enhanced status determination with actual due dates
  const determineFeeStatus = (fee: any, amountOwed: number): "paid" | "pending" | "overdue" => {
    if (amountOwed <= 0) {
      return "paid";
    }

    const dueDate = getDueDateFromSession(fee);
    const currentDate = new Date();
    const dueDateObj = new Date(dueDate);

    // If current date is past due date, mark as overdue
    if (currentDate > dueDateObj) {
      return "overdue";
    }

    // Otherwise use computedStatus as fallback
    if (fee.computedStatus === "past" || fee.computedStatus === "current") {
      return "overdue";
    } else if (fee.computedStatus === "upcoming") {
      return "pending";
    }

    return "pending";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading fee information...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-red-500 text-center">
                <p className="text-lg font-semibold mb-2">Error Loading Fee Data</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
              <SelectItem value="all">All Children</SelectItem>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} - {student.class}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Student Info Card */}
        {/* Student Info Card - Compact Design */}
        {currentStudent ? (
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedStudent === "all" ? (
                // Compact table view for all children
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                    <div className="col-span-5">Full Name</div>
                    <div className="col-span-3">Class</div>
                    <div className="col-span-4">Admission Number</div>
                  </div>
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="grid grid-cols-12 gap-4 py-2 border-b last:border-b-0"
                    >
                      <div className="col-span-5 font-semibold">{student.name}</div>
                      <div className="col-span-3">
                        <Badge variant="secondary" className="text-xs">
                          {student.class}
                        </Badge>
                      </div>
                      <div className="col-span-4 font-mono text-sm">{student.admissionNumber}</div>
                    </div>
                  ))}
                  <div className="text-center text-sm text-muted-foreground pt-2">
                    Total: {students.length} child{students.length !== 1 ? "ren" : ""}
                  </div>
                </div>
              ) : (
                // Show single student details when a specific child is selected
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
              )}
            </CardContent>
          </Card>
        ) : null}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(
                  selectedStudent === "all" ? totalOwing : getStudentTotalOwing(selectedStudent),
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedStudent === "all" ? unpaidCount : getStudentUnpaidCount(selectedStudent)}{" "}
                unpaid fee
                {selectedStudent === "all"
                  ? unpaidCount !== 1
                    ? "s"
                    : ""
                  : getStudentUnpaidCount(selectedStudent) !== 1
                    ? "s"
                    : ""}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  selectedStudent === "all" ? totalPaid : getStudentTotalPaid(selectedStudent),
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedStudent === "all" ? paidCount : getStudentPaidCount(selectedStudent)}{" "}
                payment
                {selectedStudent === "all"
                  ? paidCount !== 1
                    ? "s"
                    : ""
                  : getStudentPaidCount(selectedStudent) !== 1
                    ? "s"
                    : ""}{" "}
                completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  selectedStudent === "all" ? totalFees : getStudentTotalFees(selectedStudent),
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedStudent === "all" ? "Past & Current Terms" : "Student's Total Fees"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Overdue Alert */}
        {/* Overdue Alert */}
        {(selectedStudent === "all" ? overdueCount : getStudentOverdueCount(selectedStudent)) >
          0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have{" "}
              {selectedStudent === "all" ? overdueCount : getStudentOverdueCount(selectedStudent)}{" "}
              overdue payment
              {selectedStudent === "all"
                ? overdueCount !== 1
                  ? "s"
                  : ""
                : getStudentOverdueCount(selectedStudent) !== 1
                  ? "s"
                  : ""}{" "}
              totaling{" "}
              {formatCurrency(
                selectedStudent === "all"
                  ? overdueAmount
                  : getStudentOverdueAmount(selectedStudent),
              )}
              . Please settle them as soon as possible to avoid penalties.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Payments ({pendingFees.length})</TabsTrigger>
            <TabsTrigger value="paid">Payment History ({paidFees.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingFees.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground">
                    No pending or overdue payments at this time.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Show overdue fees first with clear separation */}
                {pendingFees.filter((fee) => fee.status === "overdue").length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold">Overdue Payments</h3>
                      <Badge variant="destructive" className="ml-2">
                        {pendingFees.filter((fee) => fee.status === "overdue").length}
                      </Badge>
                    </div>
                    <div className="space-y-3 mb-6">
                      {pendingFees
                        .filter((fee) => fee.status === "overdue")
                        .map((fee) => (
                          <Card key={fee.id} className="">
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
                                      <h3 className="font-semibold">{fee.feeName}</h3>
                                      <Badge variant="destructive">
                                        OVERDUE
                                        {/* OVERDUE - PAY NOW */}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      Student: {fee.childName} - {fee.childClass}
                                    </p>
                                    <p className="text-sm font-semibold">
                                      Due Date: {formatDate(fee.dueDate)} ⚠️ PAST DUE
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {fee.term && fee.session ? (
                                        <>
                                          Term:{" "}
                                          {fee.term.charAt(0).toUpperCase() + fee.term.slice(1)} •{" "}
                                          {fee.session}
                                        </>
                                      ) : fee.term ? (
                                        <>
                                          Term:{" "}
                                          {fee.term.charAt(0).toUpperCase() + fee.term.slice(1)}
                                        </>
                                      ) : fee.session ? (
                                        <>Session: {fee.session}</>
                                      ) : (
                                        "Term information not available"
                                      )}
                                      {/* <span className="ml-2">• URGENT</span> */}
                                    </p>
                                    <p className="text-xs font-semibold mt-1">
                                      Outstanding: {formatCurrency(fee.outstanding || 0)}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold">{formatCurrency(fee.amount)}</p>
                                  <p className="text-xs font-semibold mt-1">
                                    Immediate Payment Required
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}

                {/* Show pending (upcoming) fees */}
                {pendingFees.filter((fee) => fee.status === "pending").length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-600">Upcoming Payments</h3>
                      <Badge variant="secondary" className="ml-2">
                        {pendingFees.filter((fee) => fee.status === "pending").length}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {pendingFees
                        .filter((fee) => fee.status === "pending")
                        .map((fee) => (
                          <Card
                            key={fee.id}
                            className={selectedFees.includes(fee.id) ? "border-primary" : ""}
                          >
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
                                      <h3 className="font-semibold">{fee.feeName}</h3>
                                      <Badge variant="secondary">Pending</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      Student: {fee.childName} - {fee.childClass}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Due Date: {formatDate(fee.dueDate)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Term: {formatTerm(fee.term)} • {formatSession(fee.session)}
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
                  </div>
                )}

                {/* Payment summary */}
                {selectedFees.length > 0 && (
                  <Card className="border-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {selectedFees.length} item{selectedFees.length !== 1 ? "s" : ""}{" "}
                            selected
                            {selectedFees.some((feeId) => {
                              const fee = feeItems.find((f) => f.id === feeId);
                              return fee?.status === "overdue";
                            }) && (
                              <span className="text-destructive ml-2">• Includes overdue fees</span>
                            )}
                          </p>
                          <p className="text-2xl font-bold">{formatCurrency(selectedFeesTotal)}</p>
                        </div>
                        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="lg" className="gap-2">
                              {selectedFees.some((feeId) => {
                                const fee = feeItems.find((f) => f.id === feeId);
                                return fee?.status === "overdue";
                              }) ? (
                                <>
                                  <AlertCircle className="w-4 h-4" />
                                  Pay Overdue Fees
                                </>
                              ) : (
                                "Proceed to Payment"
                              )}
                            </Button>
                          </DialogTrigger>
                          {/* Dialog content remains the same */}
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
                            <h3 className="font-semibold">{fee.feeName}</h3>
                            <Badge variant="default">Paid</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Student: {fee.childName} - {fee.childClass}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Paid on: {fee.paidDate ? formatDate(fee.paidDate) : null}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Method: {fee.paymentMethod}
                          </p>
                          {fee.term ? (
                            <p className="text-sm text-muted-foreground">
                              Term: {fee.term.charAt(0).toUpperCase() + fee.term.slice(1)} •{" "}
                              {fee.session}
                            </p>
                          ) : null}
                          <p className="text-sm font-mono text-muted-foreground">
                            Receipt: {fee.receiptNumber}
                          </p>
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
