import {
  type FeeStructure,
  type FeeTerm,
  type ISingleStudent,
  type StudentAttendance,
  type StudentResponse,
} from "@/types";

interface PaymentStudent {
  amount: number;
  date: Date | string;
  method: "bank" | "pos" | "transfer";
  reference: string;
  _id: string;
}

export interface FeeExtension extends FeeStructure {
  fee: { terms: FeeTerm[] };
  student: { firstName: string; lastName: string };
  term: string;
  totalAmount: number;
  discount: number;
  discountReason: string | null;
  payments: PaymentStudent[];
  totalPaid: number;
  paymentStatus: string;
  computedStatus: string;
}
export interface FeesCurrentPastFuture {
  current: FeeExtension[];
  past?: FeeExtension[];
  future?: FeeExtension[];
}

export interface StudentDetailsReturnType {
  student: ISingleStudent;
  studentFee: FeesCurrentPastFuture;
}

export interface StaffStudentResponse extends Partial<Omit<StudentResponse, "data">> {
  data: StudentDetailsReturnType;
}

export interface StudentAttendanceResponse extends Partial<Omit<StaffStudentResponse, "result">> {
  result: StudentAttendance[];
}
