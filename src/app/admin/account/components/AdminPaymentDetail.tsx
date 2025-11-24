"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Edit,
  Mail,
  Printer,
  Receipt,
  User,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { type Payment } from "@/types";
import { getPaymentById, updatePaymentAdmin } from "@/utils/api";

interface AdminPaymentDetailProps {
  paymentId: string;
}

const AdminPaymentDetail = ({ paymentId }: AdminPaymentDetailProps) => {
  const router = useRouter();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    paymentDate: "",
    amountPaid: "",
    paymentMethod: "",
    paymentStatus: "",
    paymentType: "",
    paymentCategory: "",
    transactionId: "",
  });

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await getPaymentById(paymentId);
        setPayment(response?.data);

        // Initialize edit form with current payment data
        if (response?.data) {
          const paymentData = response.data;
          setEditFormData({
            paymentDate: paymentData.paymentDate
              ? new Date(paymentData.paymentDate).toISOString().split("T")[0]
              : "",
            amountPaid: paymentData.amountPaid?.toString() || "",
            paymentMethod: paymentData.paymentMethod || "",
            paymentStatus: paymentData.paymentStatus || "",
            paymentType: paymentData.paymentType || "",
            paymentCategory: paymentData.paymentCategory || "",
            transactionId: paymentData.transactionId || "",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch payment details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) {
      void fetchPayment();
    }
  }, [paymentId]);

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleupdatePaymentAdmin = async () => {
    if (!payment?._id) return;

    setIsUpdating(true);
    try {
      const payload = {
        paymentDate: editFormData.paymentDate,
        amountPaid: parseFloat(editFormData.amountPaid),
        paymentMethod: editFormData.paymentMethod,
        paymentStatus: editFormData.paymentStatus,
        paymentType: editFormData.paymentType,
        paymentCategory: editFormData.paymentCategory,
        transactionId: editFormData.transactionId,
        userId: payment.userId || "", // Keep the original userId
      };

      await updatePaymentAdmin(payment._id, payload);

      toast({
        title: "Success",
        description: "Payment updated successfully",
      });

      // Refresh payment data
      const response = await getPaymentById(paymentId);
      setPayment(response?.data);

      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update payment:", error);
      toast({
        title: "Error",
        description: "Failed to update payment",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

  const getStatusIcon = (status?: string) => {
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

  const getStatusBadge = (status?: string) => {
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

  const formatCurrency = (amount?: number) => {
    if (!amount) return "₦0.00";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading payment details...</div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Payment not found</h2>
          <Button onClick={() => router.push("/admin/account")}>Back to Payments</Button>
        </div>
      </div>
    );
  }

  // Mock payment history
  const paymentHistory = [
    {
      id: "1",
      date: payment?.paymentDate ? new Date(payment.paymentDate).toLocaleString() : "N/A",
      action: "Payment Received",
      amount: payment?.amountPaid,
      method: payment?.paymentMethod,
      by: "System",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="min-w-[100%] max-w-[1500px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/admin/account")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Payment Details</h1>
                {getStatusIcon(payment?.paymentStatus)}
              </div>
              <p className="text-muted-foreground">
                Transaction ID: {payment?.transactionId || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Payment
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
                    <p className="font-medium capitalize">
                      {payment?.paymentCategory?.replace("_", " ") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Type</p>
                    <p className="font-medium capitalize">
                      {payment?.paymentType?.replace("_", " ") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium capitalize">{payment?.paymentMethod || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Date</p>
                    <p className="font-medium">
                      {payment?.paymentDate
                        ? new Date(payment.paymentDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(payment?.amountPaid)}
                    </span>
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
                    <p className="font-mono text-sm">{payment?.transactionId || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Date</p>
                    <p className="font-medium">
                      {payment?.paymentDate
                        ? new Date(payment.paymentDate).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium capitalize">{payment?.paymentMethod || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Type</p>
                    <p className="font-medium capitalize">
                      {payment?.paymentType?.replace("_", " ") || "N/A"}
                    </p>
                  </div>
                </div>
                {payment?.paymentMemo ? (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Memo</p>
                      <p className="text-sm break-words">{payment.paymentMemo}</p>
                    </div>
                  </>
                ) : null}
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
                            {record.amount ? formatCurrency(record.amount) : "-"}
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
            {payment?.parent ? (
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
                    <p className="font-medium">{payment?.parent?.name || "N/A"}</p>
                  </div>
                  {payment?.parent?.email ? (
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-sm">{payment.parent.email}</p>
                    </div>
                  ) : null}
                  {payment?.parent?.phone ? (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="text-sm">{payment.parent.phone}</p>
                    </div>
                  ) : null}
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
            ) : null}

            {/* Student Information */}
            {payment?.student ? (
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
                    <p className="font-medium">{payment?.student?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Student ID</p>
                    <p className="font-mono text-sm">{payment?.student?.studentId || "N/A"}</p>
                  </div>
                  {payment?.student?.class ? (
                    <div>
                      <p className="text-sm text-muted-foreground">Class</p>
                      <p className="font-medium">{payment.student.class}</p>
                    </div>
                  ) : null}
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
            ) : null}
          </div>
        </div>
      </div>

      {/* Edit Payment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Payment</DialogTitle>
            <DialogDescription>Update payment information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Payment Date *</Label>
              <Input
                type="date"
                value={editFormData.paymentDate}
                onChange={(e) => handleInputChange("paymentDate", e.target.value)}
              />
            </div>

            <div>
              <Label>Amount Paid (₦) *</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={editFormData.amountPaid}
                onChange={(e) => handleInputChange("amountPaid", e.target.value)}
              />
            </div>

            <div>
              <Label>Payment Method *</Label>
              <Select
                value={editFormData.paymentMethod}
                onValueChange={(value) => handleInputChange("paymentMethod", value)}
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
                value={editFormData.paymentStatus}
                onValueChange={(value) => handleInputChange("paymentStatus", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Payment Type *</Label>
              <Select
                value={editFormData.paymentType}
                onValueChange={(value) => handleInputChange("paymentType", value)}
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
                value={editFormData.paymentCategory}
                onValueChange={(value) => handleInputChange("paymentCategory", value)}
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
                value={editFormData.transactionId}
                onChange={(e) => handleInputChange("transactionId", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button onClick={handleupdatePaymentAdmin} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPaymentDetail;
