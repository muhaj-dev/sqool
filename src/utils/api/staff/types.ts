import {
  StudentPaginationResponse,
  StudentResponse,
  ISingleStudent,
  FeeStructure,
  FeeTerm,
  StudentAttendance,
} from "@/types";

type PaymentStudent = {
  amount: number;
  date: Date | string;
  method: "bank" | "pos" | "transfer";
  reference: string;
  _id: string;
};

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

export type StudentDetailsReturnType = {
  student: ISingleStudent;
  studentFee: FeesCurrentPastFuture;
};

export interface StaffStudentResponse extends Partial<Omit<StudentResponse,"data">>{
    data:StudentDetailsReturnType
}

export interface StudentAttendanceResponse extends Partial<Omit<StaffStudentResponse,"result">>{
    result:StudentAttendance[]
}