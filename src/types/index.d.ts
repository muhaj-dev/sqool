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
    phoneNumber?: string;
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

