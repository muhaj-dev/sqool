// src/types.ts
// Student-related types
export interface IStudent {
  photo: string;
  _id: string;
  firstName: string;
  lastName: string;
  parent: {
    _id: string;
    userId: {
      firstName: string;
      lastName: string;
    };
    isActive: boolean;
  };
  class: {
    _id: string;
    className: string;
  };
  gender: string;
  hobbies: string[];
}

export interface ISingleStudent {
  message: string;
  _id?: string;
  firstName: string;
  lastName: string;
  parent: string;
  class: string;
  school?: string;
  gender?: 'male' | 'female';
  hobbies: string[];
  photo?: string;
  language?: string;
  dateOfBirth?: string ;
  address?: string;
  aboutMe?: string;
  enrolmentDate?: string;
}

export interface StudentResponse {
  data: ISingleStudent;
  message: string;
}

export interface StudentPaginationResponse {
  data: {
    result: IStudent[];
    pagination: {
      total: number;
      currentPage: number;
      pageSize: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      nextPage: number | null;
      previousPage: number | null;
    };
  };
  message: string;
}

// Parent-related types
export interface IParent {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  children: string[];
  occupation: string;
  schools: string[];
  isActive: boolean;
}

export interface ParentSearchResult {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  children: string[];
  occupation: string;
  schools: string[];
  isActive: boolean;
}

export interface ParentSearchResponse {
  data: {
    parentId: any; // Consider refining this type if possible
    result: ParentSearchResult[];
    pagination: {
      total: number;
      currentPage: string;
      pageSize: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      nextPage: number | null;
      previousPage: number | null;
    };
  };
  message: string;
}

export interface ParentPayload {
  firstName: string;
  lastName: string;
  occupation?: string;
  email: string;
}

export interface ParentResponse {
  data: {
    parentId: string | undefined;
    _id: string;
    userId: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    children: string[];
    occupation?: string;
    email: string;
    schools: string[];
    isActive: boolean;
  };
  message: string;
}

// Add ParentPaginationResponse
export interface ParentPaginationResponse {
  data: {
    result: IParent[];
    pagination: {
      total: number;
      currentPage: number; // Matches the API response where currentPage is a string
      pageSize: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      nextPage: number | null;
      previousPage: number | null;
    };
  };
  message: string;
}

// Class-related types
export interface ClassSearchResult {
  _id: string;
  className: string;
}

export interface ClassSearchResponse {
  data: {
    result: ClassSearchResult[];
  };
  message: string;
}

export interface IClassConfiguration {
  className: string;
  shortName: string;
  levelType: 'nursery' | 'primary' | 'secondary';
  classSection?: string;
}

export interface IClassConfigurationResponse extends IClassConfiguration {
  _id: string;
   className: string;
   shortName: string;
   levelType: string;
   classSection?: string;
   classTeacher: any[]; // Array of teacher IDs
   classSchedule: any[];
   resources: any[];
   tutors: IClassTutor[];
   subjects: IClassSubject[];
   students: string[];
  message?: string; 
}

export interface ClassPaginationResponse {
  data: {
    result: IClassConfigurationResponse[];
    message: string;
    pagination: {
      total: number;
      currentPage: number;
      pageSize: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      nextPage: number | null;
      previousPage: number | null;
    };
  };
}

// Staff-related types
export interface UserId {
  email: string;
  _id?: string;
  firstName: string;
  lastName: string;
}

export interface StaffResult {
  result?: null;
  _id: string;
  level: string;
  userId: UserId;
  subjects: string[];
  role: string;
  primarySubject: string;
  isActive: boolean;
  qualification?: string;
  aboutMe?: string;
  address?: string;
}

export interface SingleStaffResponse {
  data: StaffResult;
  message: string;
}

export interface AddStaffPayload {
  firstName: string;
  lastName: string;
  level: string;
  email: string;
  role: string;
  primarySubject: string;
  language: string;
  dateOfBirth: string;
  address: string;
  aboutMe: string;
  hobbies: string[];
  employmentDate: string;
  qualification: string;
  experience: string;
}

export interface Pagination {
  total: number;
  currentPage: string;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

export interface StaffResponse {
  data: {
    result: StaffResult[];
    pagination: Pagination;
  };
  message: string;
}

// Bank-related types
export interface IBankAccount {
  _id?: string; // Added _id as optional since it's present in the API response
  accountName: string;
  bankName: string;
  accountNumber: string;
}

export interface BankResponse {
  data: IBankAccount[];
  message: string;
}

// Other types
export interface ILibrary {
  id: string;
  date: string;
  bookName: string;
  author: string;
  class: string;
  type: string;
}

export interface IParentExp {
  id: number;
  date: string;
  expenses: string;
  amount: string;
  status: string;
  action: string;
}

export interface IPayment {
  id: number;
  date: string;
  counterparty: string;
  paymentMemo: string;
  amount: string;
  type: string;
  action: string;
}

export type TimetableView = 'result' | 'upload' | 'download';

export interface ISessionAndTerm {
  session: string;
  firstTermStartDate: string;
  firstTermEndDate: string;
  secondTermStartDate: string;
  secondTermEndDate: string;
  thirdTermStartDate: string;
  thirdTermEndDate: string;
}

export const ROLES = ['superAdmin', 'admin', 'teacher', 'parent', 'student'] as const;
export type Role = typeof ROLES[number];

export function isRole(role: string): role is Role {
  return ROLES.includes(role as Role);
}

export interface School {
  schoolId: {
    _id: string;
    name: string;
  };
  roles: Role[];
}

export function ToValidSchool(school: {
  schoolId: { _id: string; name: string };
  roles: string[];
}): School | null {
  const validRoles = school.roles.filter(isRole);
  return validRoles.length
    ? {
        schoolId: school.schoolId,
        roles: validRoles,
      }
    : null;
}

export interface LoginFirstResponse {
  accessToken: string;
  schools?: School[];
}

export interface LoginSecondResponse {
  accessToken: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
      phoneId:{
    phoneNumber?: string; // Made optional
  }
    // phoneNumber?: string;
    isVerify: boolean;
    isBlock: boolean;
    schools: School[];
  };
}

export interface GenderDistribution {
  totalStudents: number;
  totalMale: number;
  totalFemale: number;
}

export interface SchoolUsersCount {
  totalStudents: number;
  totalParents: number;
  totalNonTeachingStaff: number;
  totalTeachingStaff: number;
  totalStaffs: number;
}

export interface DashboardData {
  genderDistribution: GenderDistribution;
  schoolUsersCount: SchoolUsersCount;
}

export interface DashboardResponse {
  data: DashboardData;
  message: string;
}

// Subject-related types
export interface ISubject {
  name: string;
  code: string;
  category: string;
  description: string;
}

export interface ISubjectResponse extends ISubject {
  // _id: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface ISubject {
  _id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  isActive?: boolean;
  prerequisites?: any[];
  slug?: string;
}

export interface ISubjectResponse extends ISubject {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}




export interface ParentUser {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface ParentResult {
  _id: string;
  userId: ParentUser;
  children: string[];
  occupation: string;
  schools: string[];
  isActive: boolean;
}

export interface ParentResponse {
  data: {
    result: ParentResult[];
    pagination: {
      total: number;
      currentPage: string;
      pageSize: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      nextPage: string | null;
      previousPage: string | null;
    };
  };
  message: string;
}

export interface AddParentPayload {
  firstName: string;
  lastName: string;
  occupation: string;
  email: string;
}


//staff  


export interface StaffProfileResponse {
  data: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneId:{
      phoneNumber: string;
    };
    level: string;
    userId: string;
    qualification: string;
    aboutMe: string;
    subjects: string[];
    role: string;
    address: string;
    experience: string;
    primarySubject: string;
    phone?: string; // Optional field
    dateOfBirth?: string; // Optional field
    gender?: string; // Optional field
    employedDate?: string; // Optional field
  };
  message: string;
}

// Add to your types
export interface CreateExamPayload {
  subject: string;
  class: string;
  examDate: string;
  startTime: string;
  endTime: string;
  venue?: string;
  mode?: string;
  sessionId: string;
  questions: File;
}

export interface CreateExamResponse {
  data?: {
    _id: string;
    subject: string;
    class: string;
    examDate: string;
    startTime: string;
    endTime: string;
    venue?: string;
    mode?: string;
    sessionId: string;
    status: string;
    createdAt: string;
  };
  message?: string;
}


// Add these types
// export interface Class {
//   _id: string;
//   className: string;
//   shortName: string;
//   levelType: string;
//   classSection: string;
// }

export interface Subject {
  _id: string;
  name: string;
  code?: string;
  category: string;
  description: string;
  isActive: boolean;
}

export interface Session {
  _id: string;
  session: string;
  isActive: boolean;
  firstTerm: {
    startDate: string;
    endDate: string;
  };
  secondTerm: {
    startDate: string;
    endDate: string;
  };
  thirdTerm: {
    startDate: string;
    endDate: string;
  };
}


// In your types.ts file, update the Class interface:
export interface Class {
  _id: string;
  className: string;
  shortName: string;
  levelType: string;
  classSection?: string; // Make this optional to match IClassConfigurationResponse
  classTeacher?: Array<{
    _id: string;
    userId: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    subjects: string[];
    isActive: boolean;
  }>;
  classSchedule?: any[];
  resources?: any[];
  tutors?: any[];
  subjects?: string[];
  students?: any[];
}
export interface ClassesResponse {
  data?: {
    result: Class[];
    pagination: any;
  };
  message?: string;
}

export interface SubjectsResponse {
  data?: {
    result: Subject[];
    pagination: any;
  };
  message?: string;
}

export interface SessionsResponse {
  data?: {
    result: Session[];
    pagination: any;
  };
  message?: string;
}




// Exam-related types
export interface ExamCreator {
  role: string;
  primarySubject: string;
  isActive: boolean;
  details: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ExamSubject {
  name: string;
  _id?: string;
}

// types/index.ts
export interface ExamSubject {
  _id: string;
  name: string;
}

export interface ExamCreator {
  role: string;
  primarySubject: string;
  isActive: boolean;
  details: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface SessionTerm {
  startDate: string;
  endDate: string;
}

export interface Session {
  _id: string;
  session: string;
  firstTerm: SessionTerm;
  secondTerm: SessionTerm;
  thirdTerm: SessionTerm;
  isActive: boolean;
  school: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exam {
  _id: string;
  subject: ExamSubject;
  questions: string; // This is now the file URL/path
  class: {
    _id: string;
    className: string;
  };
  creator: ExamCreator;
  status: 'pending' | 'approve' | 'completed' | 'cancelled' | 'reject' | 'scheduled';
  examDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  mode: 'online' | 'offline' | 'hybrid';
  session: Session; // Changed from sessionId to session object
  students: number;
  createdAt?: string;
  updatedAt?: string;
}

// types/index.ts
export interface ExamsResponse {
  data: Exam[];
  message: string;
  // Add these if your API returns pagination data
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}


// types/timetable.ts
export interface Subject {
  _id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  isActive: boolean;
  prerequisites: string[];
  slug: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface TeacherSubject {
  _id: string;
  name: string;
  code: string;
}

export interface Teacher {
  _id: string;
  userId: User;
  subjects: TeacherSubject[];
  isActive: boolean;
}

export interface ClassSchedule {
  _id: string;
  class: string;
  day: string;
  subject: Subject;
  teacher: Teacher;
  startTime: string;
  endTime: string;
}

export interface TimetableResponse {
  data: ClassSchedule[];
  message: string;
}


export interface Notice {
  id?: string;
  title: string;
  content: string;
  body: string;
  visibility: "parent" | "staff" | "everyone";
  resources: string[];
  expirationDate: string;
  notificationDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export type NoticeFormData = Omit<Notice, "id" | "createdAt" | "updatedAt">;


// types/index.ts
export interface ParentDashboardResponse {
  data: {
    children: Child[];
    notices: Notice[];
    expenses: Expense[];
  };
  message: string;
}

export interface Child {
  _id: string;
  firstName: string;
  lastName: string;
  class: {
    _id: string;
    className: string;
    levelType: string;
  };
  gender: string;
  createdAt: string;
}

export interface Notice {
  _id: string;
  title: string;
  content: string;
  visibility: string;
  notificationType: string;
  isActive: boolean;
  isPinned: boolean;
  resources: string[];
  expirationDate: string;
}

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: string;
  category: string;
}


// Fee-related types
export type TermBreakdown = Record<string, number>;

export interface FeeTerm {
  term: "first" | "second" | "third";
  amount: number;
  breakdown: TermBreakdown;
  _id?: string;
}

export interface ClassInfo {
  _id: string;
  className: string;
  shortName: string;
  levelType: string;
  classSection?: string;
}

export interface SessionTerm {
  startDate: string;
  endDate: string;
}

export interface SessionInfo {
  _id: string;
  firstTerm: SessionTerm;
  secondTerm: SessionTerm;
  thirdTerm: SessionTerm;
}

export interface FeeStructure {
  _id: string;
  school: string;
  class: ClassInfo;
  session: SessionInfo | string; // Can be string (session ID) or full session object
  totalAmount: number;
  terms: FeeTerm[];
  isActive: boolean;
}

export interface FeesResponse {
  data: {
    result: FeeStructure[];
    pagination: {
      total: number;
      currentPage: number;
      pageSize: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      nextPage: number | null;
      previousPage: number | null;
    };
  };
  message: string;
}

export interface CreateFeeData {
  class: string; // class ID
  session: string; // session ID
  totalAmount: number;
  terms: Omit<FeeTerm, '_id'>[];
  // isActive: boolean;
}

export interface UpdateFeeData {
  totalAmount?: number;
  terms?: Omit<FeeTerm, '_id'>[];
  isActive?: boolean;
}

export interface GetFeesParams {
  search?: string;
  filter?: string;
  skip?: number;
  limit?: number;
  class?: string;
  session?: string;
}


// Add to your existing types

// Session types
export interface SessionTerm {
  startDate: string;
  endDate: string;
}

export interface Session {
  _id: string;
  session: string;
  firstTerm: SessionTerm;
  secondTerm: SessionTerm;
  thirdTerm: SessionTerm;
  isActive: boolean;
  school: string;
}

export interface SessionsResponse {
  data: {
    result: Session[];
    pagination: {
      total: number;
      currentPage: string;
      pageSize: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      nextPage: number | null;
      previousPage: number | null;
    };
  };
  message: string;
}

// Class types (if not already defined)
export interface ClassTeacher {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  subjects: string[];
  isActive: boolean;
}

export interface ClassTutor {
  subject: string[];
  teacher: string;
  _id: string;
}

export interface Class {
  _id: string;
  className: string;
  shortName: string;
  levelType: string;
  classSection: string;
  classTeacher: ClassTeacher[];
  classSchedule: string[];
  resources: string[];
  tutors: ClassTutor[];
  subjects: string[];
  students: string[];
}

export interface ClassPaginationResponse {
  data: {
    result: Class[];
    pagination: {
      total: number;
      currentPage: string;
      pageSize: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      nextPage: number | null;
      previousPage: number | null;
    };
  };
  message: string;
}

// Fee types (add these to your existing fee types)
export interface TermBreakdown {
  tuition: number;
  uniform: number;
  excursion: number;
  books?: number;
  sports?: number;
  pta?: number;
}

export interface FeeTerm {
  term: "first" | "second" | "third";
  amount: number;
  breakdown: TermBreakdown;
  _id?: string;
}

export interface ClassInfo {
  _id: string;
  className: string;
  shortName: string;
  levelType: string;
  classSection?: string;
}

export interface SessionInfo {
  _id: string;
  firstTerm: SessionTerm;
  secondTerm: SessionTerm;
  thirdTerm: SessionTerm;
}


export interface FeeStructure {
  _id: string;
  school: string;
  class: ClassInfo;
  session: SessionInfo | string; // Can be string (session ID) or full session object
  totalAmount: number;
  terms: FeeTerm[];
  // removed isActive
}
export interface FeesResponse {
  data: {
    result: FeeStructure[];
    pagination: {
      total: number;
      currentPage: number;
      pageSize: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      nextPage: number | null;
      previousPage: number | null;
    };
  };
  message: string;
}

export interface CreateFeeData {
  class: string; // class ID
  session: string; // session ID
  totalAmount: number;
  terms: Omit<FeeTerm, '_id'>[];
  // removed isActive
}

export interface UpdateFeeData {
  totalAmount?: number;
  terms?: Omit<FeeTerm, '_id'>[];
  // removed isActive
}

export interface GetFeesParams {
  search?: string;
  filter?: string;
  skip?: number;
  limit?: number;
  class?: string;
  session?: string;
}


// In your types file
export interface FeeStructure {
  _id: string;
  class: string | Class;
  session: string | Session;
  totalAmount: number;
  terms: Term[];
  isActive: boolean;
  isPublished: boolean; // Add this field
  createdAt: string;
  updatedAt: string;
}

// types/payment.ts
export interface CreatePaymentRequest {
  paymentDate: string;
  amountPaid: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentType: string;
  paymentCategory: string;
  transactionId?: string;
  paymentMemo: File | null;
  userId: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  parentName: string;
  studentName: string;
  feeType: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  paymentMethod?: string;
  transactionId?: string;
}