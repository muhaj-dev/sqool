import {
  formatISO,
  isWeekend,
  nextMonday,
  addBusinessDays,
  isEqual,
} from "date-fns";

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

export const calculateAge = (
  dateString: string | Date | undefined
): number | string => {
  if (!dateString) return "N/A";

  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

export const generateBusinessDayDates = (
  businessDaysDifference: number = 1
): { start: string; end: string } => {
  if (businessDaysDifference < 1) {
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
