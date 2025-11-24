"use client";

import {
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  DollarSign,
  Mail,
  Phone,
  School,
  TrendingUp,
  Edit,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { getParentById, updateParentById } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FeeItem {
  id: string;
  childName: string;
  childClass: string;
  childSection: string;
  feeName: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paidDate?: string;
  paymentMethod?: string;
}

// Calculate total fees for past and current terms only - FIXED VERSION
const calculateTotalFees = (studentFee: any) => {
  if (!studentFee) return 0;

  // Sum all fees in past array
  const pastTotal = (studentFee.past || []).reduce((total: number, fee: any) => {
    return total + (fee.totalAmount || 0);
  }, 0);

  // Sum all fees in current array
  const currentTotal = (studentFee.current || []).reduce((total: number, fee: any) => {
    return total + (fee.totalAmount || 0);
  }, 0);

  return pastTotal + currentTotal;
};

// Get description of terms included - UPDATED to handle multiple fees per term
const getTermsDescription = (studentFee: any) => {
  if (!studentFee) return "No fee data available";

  const terms = new Set<string>();
  const sessions = new Set<string>();

  // Collect terms and sessions from all past and current fees
  const allFees = [...(studentFee.past || []), ...(studentFee.current || [])];

  allFees.forEach((fee) => {
    if (fee.term) terms.add(fee.term);
    if (fee.session?.session) sessions.add(fee.session.session);
  });

  const termList = Array.from(terms)
    .filter((term) => term && typeof term === "string")
    .map((term) => `${term.charAt(0).toUpperCase() + term.slice(1)} Term`)
    .join(", ");

  const sessionList = Array.from(sessions).join(", ");

  // Count total number of fee items
  const feeCount = allFees.length;

  if (termList && sessionList) {
    return `${feeCount} fee(s) • ${termList} • ${sessionList}`;
  } else if (termList) {
    return `${feeCount} fee(s) • ${termList}`;
  } else {
    return `${feeCount} fee item(s)`;
  }
};

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
    };
  }

  let totalOwing = 0;
  let totalPaid = 0;
  const totalFees = calculateTotalFees(studentFee);
  let overdueAmount = 0;
  let unpaidCount = 0;
  let paidCount = 0;
  let overdueCount = 0;

  // Calculate Total Owing (amount left to pay in past + current terms)
  const pastAndCurrentFees = [...(studentFee.past || []), ...(studentFee.current || [])];

  pastAndCurrentFees.forEach((fee) => {
    const amountOwed = (fee.totalAmount || 0) - (fee.totalPaid || 0);

    // Total Owing - only include positive amounts (not overpaid)
    if (amountOwed > 0) {
      totalOwing += amountOwed;
      unpaidCount++;
    }

    // Total Paid - include payments from both past and current terms
    if (fee.totalPaid > 0) {
      totalPaid += fee.totalPaid || 0;
      paidCount++;
    }
  });

  // Calculate Overdue Amount (from past terms that are not fully paid)
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

// Transform API data to FeeItem format - FIXED VERSION
const transformFeeDataToItems = (studentFee: any, children: any[] = []) => {
  const feeItems: FeeItem[] = [];

  if (!studentFee) return feeItems;

  // Create child mapping for better display
  const childMap = new Map();
  children.forEach((child) => {
    childMap.set(child._id, {
      name: `${child.firstName} ${child.lastName}`,
      className: child.class?.className || "Class Pending",
      classSection: child.class?.classSection || "Section Pending",
    });
  });

  // Process all fees
  const allFees = [
    ...(studentFee.past || []),
    ...(studentFee.current || []),
    ...(studentFee.upcoming || []),
  ];

  allFees.forEach((fee) => {
    const childData = childMap.get(fee.student._id) || {
      name: `${fee.student.firstName} ${fee.student.lastName}`,
      className: "Class Pending",
      classSection: "Section Pending",
    };

    const amountOwed = fee.totalAmount - fee.totalPaid;

    // Determine status based on paymentStatus, computedStatus, and amount owed
    let status: "paid" | "pending" | "overdue" = "pending";

    if (amountOwed <= 0) {
      status = "paid";
    } else if (fee.computedStatus === "past") {
      status = "overdue";
    } else if (fee.paymentStatus === "OVERDUE") {
      status = "overdue";
    } else {
      status = "pending";
    }

    // Create due date based on term and session (fallback logic)
    const dueDate = estimateDueDate(fee.term, fee.session.session);

    feeItems.push({
      id: fee._id,
      childName: childData.name,
      childClass: childData.className,
      childSection: childData.classSection,
      feeName: `School Fees - ${fee.term.charAt(0).toUpperCase() + fee.term.slice(1)} Term ${fee.session.session}`,
      amount: fee.totalAmount,
      dueDate,
      status,
      paidDate: fee.payments?.[0]?.date || undefined,
      paymentMethod: fee.payments?.[0]?.method || undefined,
    });
  });

  return feeItems;
};

// Fallback function to estimate due dates
const estimateDueDate = (term: string, session: string): string => {
  const [startYear] = session.split("/");
  const year = parseInt(startYear);

  switch (term) {
    case "first":
      return `${year}-09-30`; // End of September
    case "second":
      return `${year + 1}-01-31`; // End of January next year
    case "third":
      return `${year + 1}-05-31`; // End of May next year
    default:
      return `${year}-12-31`;
  }
};

const AdminParentDetail = ({ parentId }: { parentId: string }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [parent, setParent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    occupation: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!parentId) return;
    const fetchParent = async () => {
      setLoading(true);
      try {
        const res = await getParentById(parentId);
        // Get the main data object that contains both parent and studentFee
        const parentData = res?.data ?? res;
        setParent(parentData);

        // ADD THIS CODE: Initialize edit form data when parent is loaded
        const userInfo =
          parentData?.parent?.userId ??
          parentData?.user ??
          (typeof parentData?.userId === "object" ? parentData.userId : null);

        const occupation = parentData?.parent?.occupation ?? parentData?.occupation ?? "";

        setEditFormData({
          firstName: userInfo?.firstName || "",
          lastName: userInfo?.lastName || "",
          occupation: occupation,
          email: userInfo?.email || "",
        });

        // For debugging - log the structure
        console.log("API Response:", res);
        console.log("Parent Data:", parentData);
        console.log("Student Fee Data:", parentData?.studentFee);
      } catch (err: any) {
        toast({
          title: "Error",
          description: err?.message || "Failed to fetch parent details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    void fetchParent();
  }, [parentId, toast]);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // FIXED: Use the correct data structure that matches your API expectations
      const updateData = {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        occupation: editFormData.occupation,
      };

      const response = await updateParentById(parentId, updateData);

      // Show success message first
      toast({
        title: "Success",
        description: "Parent information updated successfully",
      });

      // Close the modal
      setIsEditModalOpen(false);

      // Refetch parent data to get the latest information
      setLoading(true);
      try {
        const res = await getParentById(parentId);
        const parentData = res?.data ?? res;
        setParent(parentData);

        // FIXED: Update edit form data with the fresh data using same structure as initialization
        const userInfo =
          parentData?.parent?.userId ??
          parentData?.user ??
          (typeof parentData?.userId === "object" ? parentData.userId : null);

        const occupation = parentData?.parent?.occupation ?? parentData?.occupation ?? "";

        setEditFormData({
          firstName: userInfo?.firstName || "",
          lastName: userInfo?.lastName || "",
          occupation: occupation,
          email: userInfo?.email || "",
        });
      } catch (fetchError: any) {
        toast({
          title: "Warning",
          description:
            "Parent updated but failed to refresh details: " +
            (fetchError?.message || "Unknown error"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to update parent information",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
      };

  // Transform API data to fee items - CORRECTED
  const feeItems = parent?.studentFee
    ? transformFeeDataToItems(parent.studentFee, parent.parent?.children)
    : [];

  // Filter for display
  const pendingFees = feeItems.filter((fee) => fee.status === "pending");
  const overdueFees = feeItems.filter((fee) => fee.status === "overdue");
  const paidFees = feeItems.filter((fee) => fee.status === "paid");

  // Use the calculated financial data
  const { totalOwing, totalPaid, totalFees, overdueAmount, unpaidCount, paidCount, overdueCount } =
    financialData;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading parent information...</div>
      </div>
    );
  }

  if (!parent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">No parent data available.</div>
      </div>
    );
  }

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="default" className="bg-green-500">
            Paid
          </Badge>
        );
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const userInfo =
    parent?.parent?.userId ??
    parent?.user ??
    (typeof parent?.userId === "object" ? parent.userId : null);
  const childrenList =
    parent?.parent?.children ?? parent?.childrenDetails ?? parent?.children ?? [];
  const displayName = `${userInfo?.firstName ?? ""} ${userInfo?.lastName ?? ""}`.trim() || "Parent";
  const avatarInitials = (userInfo?.firstName?.[0] ?? "") + (userInfo?.lastName?.[0] ?? "");

  // Calculate child-specific owing (only from past and current terms)
  const calculateChildOwing = (childId: string, childName: string) => {
    if (!parent?.studentFee) return 0;

    const pastAndCurrentFees = [
      ...(parent.studentFee.past || []),
      ...(parent.studentFee.current || []),
    ];

    const childFees = pastAndCurrentFees.filter((fee) => fee.student._id === childId);

    return childFees.reduce((sum, fee) => {
      const amountOwed = fee.totalAmount - fee.totalPaid;
      return amountOwed > 0 ? sum + amountOwed : sum;
    }, 0);
  };

  console.log(parent);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className=" mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/admin/parent")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Parent Details</h1>
                <p className="text-sm text-muted-foreground">
                  View parent details and comprehensive fee information
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className=" mx-auto px-4 py-8">
        {/* Alert for overdue fees */}
        {overdueCount > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This parent has {overdueCount} overdue payment(s) totaling{" "}
              {formatCurrency(overdueAmount)}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
          {/* Parent Information Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Parent Information</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={userInfo?.photo ?? undefined} alt={displayName} />
                  <AvatarFallback className="text-3xl">{avatarInitials || "P"}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{displayName}</h2>
                <p className="text-muted-foreground">Parent</p>
                <Badge
                  variant={parent?.parent?.isActive ? "default" : "secondary"}
                  className="mt-2"
                >
                  {parent?.parent?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-sm">{userInfo?.email ?? "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{userInfo?.phoneId?.phoneNumber ?? "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Occupation</p>
                    <p className="font-medium capitalize">{parent?.parent?.occupation ?? "N/A"}</p>
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
                  <div className="text-2xl font-bold text-destructive">
                    {formatCurrency(totalOwing)}
                  </div>
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
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalPaid)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {paidCount} payment(s) in past & current terms
                  </p>
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
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(totalFees)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getTermsDescription(parent?.studentFee)}
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
                  {childrenList?.map((child: any) => {
                    const childName = `${child.firstName} ${child.lastName}`;
                    const childOwing = calculateChildOwing(child._id, childName);

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
                                {child.class?.className || "Class not set"}
                              </p>
                              <Badge variant="secondary" className="mt-1">
                                {child.class?.levelType || "Level not set"}
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
                            pendingFees.map((fee) => (
                              <TableRow key={fee.id}>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{fee.childName}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {fee.childClass}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>{fee.feeName}</TableCell>
                                <TableCell className="font-semibold">
                                  {formatCurrency(fee.amount)}
                                </TableCell>
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
                                    <p className="text-sm text-muted-foreground">
                                      {fee.childClass}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>{fee.feeName}</TableCell>
                                <TableCell className="font-semibold text-destructive">
                                  {formatCurrency(fee.amount)}
                                </TableCell>
                                <TableCell className="text-destructive">
                                  {formatDate(fee.dueDate)}
                                </TableCell>
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
                                    <p className="text-sm text-muted-foreground">
                                      {fee.childClass}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>{fee.feeName}</TableCell>
                                <TableCell className="font-semibold text-green-600">
                                  {formatCurrency(fee.amount)}
                                </TableCell>
                                <TableCell>
                                  {fee.paidDate ? formatDate(fee.paidDate) : "-"}
                                </TableCell>
                                <TableCell>{fee.paymentMethod || "-"}</TableCell>
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

        {/* Edit Parent Modal */}
        {isEditModalOpen ? (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Edit Parent Information</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    ×
                  </Button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={editFormData.firstName}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={editFormData.lastName}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={editFormData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      name="occupation"
                      value={editFormData.occupation}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditModalOpen(false)}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? "Updating..." : "Update"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default AdminParentDetail;
