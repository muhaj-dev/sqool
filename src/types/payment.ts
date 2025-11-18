export interface FeeItem {
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
