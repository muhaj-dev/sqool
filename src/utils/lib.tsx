import {
  addBusinessDays,
  differenceInYears,
  formatISO,
  isEqual,
  isWeekend,
  nextMonday,
  parse,
} from "date-fns";

import { Badge } from "@/components/ui/badge";
import { type FeeItem, type IStudent, type Session, type StudentAttendance } from "@/types";

// utils/dateUtils.ts
export const formatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) return "No date available";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const calculateAge = (dateString: string | Date | undefined): number | string => {
  if (!dateString) return "N/A";

  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

export const generateBusinessDayDates = (
  businessDaysDifference: number,
): { start: string; end: string } => {
  if (!businessDaysDifference || businessDaysDifference < 1) {
    throw new Error("Business days difference must be at least 1");
  }

  let startDate = new Date();

  // Ensure start date is not weekend
  if (isWeekend(startDate)) {
    startDate = nextMonday(startDate);
  }

  const endDate = addBusinessDays(startDate, businessDaysDifference);

  // Double-check that dates are different (should always be true with businessDaysDifference >= 1)
  if (isEqual(startDate, endDate)) {
    throw new Error("Start and end dates cannot be the same");
  }

  return {
    start: formatISO(startDate),
    end: formatISO(endDate),
  };
};

export const getStatusBadge = (status: string) => {
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

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const transformFeeDataToItems = (studentFee: any, children: any[] = []) => {
  const feeItems: FeeItem[] = [];

  if (!studentFee) return feeItems;

  // Create child name mapping for better display
  const childMap = new Map();
  children.forEach((child) => {
    childMap.set(child._id, `${child.firstName} ${child.lastName}`);
  });

  // Process all fees
  const allFees = [
    ...(studentFee.past || []),
    ...(studentFee.current || []),
    ...(studentFee.upcoming || []),
  ];

  allFees.forEach((fee) => {
    const childName =
      childMap.get(fee.student._id) || `${fee.student.firstName} ${fee.student.lastName}`;
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
      childName,
      childClass: fee.student.class?.className || "Class Pending",
      feeName: `School Fees - ${
        fee.term.charAt(0).toUpperCase() + fee.term.slice(1)
      } Term ${fee.session.session}`,
      amount: fee.totalAmount,
      dueDate,
      status,
      paidDate: fee.payments?.[0]?.date || undefined,
      paymentMethod: fee.payments?.[0]?.method || undefined,
    });
  });

  return feeItems;
};

export // Fallback function to estimate due dates
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

export function mapStudentToAttendance(student: IStudent, index: number): StudentAttendance {
  const name = `${student.firstName} ${student.lastName}`.trim();

  const age = student.dateOfBirth
    ? differenceInYears(new Date(), parse(student.dateOfBirth, "yyyy-MM-dd", new Date()))
    : 1;

  const guardianName = student.parent?.userId
    ? `${student.parent.userId.firstName} ${student.parent.userId.lastName}`.trim()
    : "N/A";
  const getRollNumber = (className: string, index: number): string => {
    if (!className) return "";

    const level = className[0].charAt(0).toUpperCase(); // "P"
    const classNum = className[1]; // "3"

    const padded = String(index + 1).padStart(4, "0"); // 4-digit padded index

    return `${level}${classNum}/${padded}`;
  };

  return {
    id: student._id,
    name,
    rollNumber: student.rollNumber ?? getRollNumber(`${student.class?.className}` || "", index),
    age,
    guardianName,

    // Default attendance status
    status: "present", // or "absent" / "late" depending on your logic

    //expected from the server
    attendanceRate: student.attendanceRate ?? 0,

    _id: student._id,
    firstName: student.firstName,
    lastName: student.lastName,
    parent: student.parent?._id ?? "",
    class: student.class?._id ?? "",
    school: student.school as string,
    gender: student.gender as "male",
    hobbies: student.hobbies ?? [],
    photo: student.photo,
    language: student.language,
    dateOfBirth: student.dateOfBirth,
    address: student.address,
    aboutMe: student.aboutMe,
    enrolmentDate: student.enrolmentDate,
  };
}

export function getDefaultSchoolSession(): string {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  return `${previousYear}/${currentYear}`;
}

export function normalizeSessionTermsData(apiData: Session[]) {
  const academicSessions: string[] = [];
  const termRanges: Record<
    string,
    {
      session: string;
      termDates: {
        first?: { start: string; end: string };
        second?: { start: string; end: string };
        third?: { start: string; end: string };
      };
    }
  > = {};

  apiData.forEach((item) => {
    if (!item.session) return;

    academicSessions.push(item.session);

    const formatDate = (iso: string) => iso.split("T")[0];

    termRanges[item.session] = {
      session: item.session,
      termDates: {
        first: item.firstTerm
          ? {
              start: formatDate(item.firstTerm.startDate),
              end: formatDate(item.firstTerm.endDate),
            }
          : undefined,
        second: item.secondTerm
          ? {
              start: formatDate(item.secondTerm.startDate),
              end: formatDate(item.secondTerm.endDate),
            }
          : undefined,
        third: item.thirdTerm
          ? {
              start: formatDate(item.thirdTerm.startDate),
              end: formatDate(item.thirdTerm.endDate),
            }
          : undefined,
      },
    };
  });

  return { academicSessions, termRanges };
}

export const getInitials = (name: string): string => {
  const namesArray = name.trim().split(" ");
  if (namesArray.length === 0) return "";

  const initials =
    namesArray.length === 1
      ? namesArray[0].charAt(0)
      : namesArray[0].charAt(0) + namesArray[namesArray.length - 1].charAt(0);

  return initials.toUpperCase();
};

export const formatTime = (d: string) =>
  new Date(d).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
