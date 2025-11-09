import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import React from "react";
import { formatDate,getStatusBadge,formatCurrency,transformFeeDataToItems } from "@/utils/lib";
import { useQuery } from "@tanstack/react-query";
import { getStudentById } from "@/utils/api/index";

interface FeeDetailsProp{
    studentId:string;
}
const FeeDetails:React.FC<FeeDetailsProp> = ({studentId}) => {
const {
    data: studentData,
    isPending,
    error,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["students-info-data",studentId],
    queryFn: async () => {
      const res = await getStudentById(studentId);
      return res.data;
    },
    enabled: !!studentId,
    staleTime: 60 * 60 * 1000, // (1hr)
    gcTime: 60 * 60 * 1000, // still cached for 60 min ~~ 1hr
  });

    const feeItems = studentData ? transformFeeDataToItems(studentData.studentFee) : []

  // Filter for display
  const pendingFees = feeItems.filter(fee => fee.status === 'pending')
  const overdueFees = feeItems.filter(fee => fee.status === 'overdue')
  const paidFees = feeItems.filter(fee => fee.status === 'paid')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Details</CardTitle>
        <CardDescription>
          Complete breakdown of all fees and payments
        </CardDescription>
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
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground"
                      >
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
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground"
                      >
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
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground"
                      >
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
  );
};

export default FeeDetails;
