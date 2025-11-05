// components/class-management/types.ts

export interface Teacher {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  specialization: string
  qualification: string
}

export interface Subject {
  id: string
  name: string
  code: string
  description: string
  credits: number
  level: string // 'basic' or 'secondary'
  streams: string[] // Which streams this subject applies to
}

export interface SubjectAssignment {
  id: string
  subject: Subject
  teacher: Teacher | null
  classId: string
}

export interface Schedule {
  id: string
  classId: string
  subjectAssignmentId: string
  dayOfWeek: string
  startTime: string
  endTime: string
  room: string
}

export interface Resource {
  id: string
  title: string
  description: string
  url: string
  type: string // 'syllabus', 'assignment', 'reading', 'video', 'other'
}

// export interface Class {
//   id: string;
//   name: string;
//   level: string; // 'basic' or 'secondary'
//   stream?: string; // For secondary: 'science', 'arts', 'commerce'
//   description: string;
//   capacity: number;
//   classTeacher: Teacher | null;
//   subjects: SubjectAssignment[];
//   schedules: Schedule[];
//   resources: Resource[];
//   createdAt: string;
// }

// components/class-management/types.ts

// API Response Types
export interface IClassConfigurationResponse {
  _id: string
  className: string
  shortName: string
  levelType: string
  classSection?: string // Made optional with ?
  classTeacher: any[]
  classSchedule: any[]
  resources: any[]
  tutors: any[]
  subjects: string[]
  students: string[]
}

export interface ClassPaginationResponse {
  data: {
    result: IClassConfigurationResponse[]
    pagination: {
      total: number
      currentPage: string
      pageSize: number
      totalPages: number
      hasNextPage: boolean
      hasPreviousPage: boolean
      nextPage: null | string
      previousPage: null | string
    }
  }
  message: string
}

// Application Types
// export interface Class {
//   id: string;
//   name: string;
//   level: string;
//   section?: string;
//   // ... other properties you need in your app
// }

export interface Class {
  id: string
  section?: string

  name: string
  level: string // 'basic' or 'secondary'
  stream?: string // For secondary: 'science', 'arts', 'commerce'
  description: string
  capacity: number
  classTeacher: Teacher | null
  subjects: SubjectAssignment[]
  schedules: Schedule[]
  resources: Resource[]
  createdAt: string
}

export interface ClassFormData {
  name: string
  level: string
  stream: string
  description: string
  capacity: string
  classTeacherId: string
}

export interface ScheduleFormData {
  dayOfWeek: string
  startTime: string
  endTime: string
  room: string
}

export interface ResourceFormData {
  title: string
  description: string
  url: string
  type: string
}

// Subject-related types
export interface ISubject {
  name: string
  code: string
  category: string
  description: string
}

export interface ISubjectResponse extends ISubject {
  _id: string
  createdAt?: string
  updatedAt?: string
}

export interface ISubject {
  _id: string
  name: string
  code: string
  category: string
  description: string
  isActive?: boolean
  prerequisites?: any[]
  slug?: string
}

export interface ISubjectResponse extends ISubject {
  _id: string
  createdAt?: string
  updatedAt?: string
}

export interface SubjectAssignmentPayload {
  classId: string
  subjectIds: string[]
}

export interface IClassSubject {
  _id: string
  name: string
  code: string
}

export interface IClassTutor {
  subject: string[] // Array of subject IDs
  teacher: string // Teacher ID
  _id: string
}

export interface IClassByIdResponse {
  _id: string
  className: string
  shortName: string
  levelType: string
  classSection?: string
  classTeacher: string[] // Array of teacher IDs
  classSchedule: any[]
  resources: any[]
  tutors: IClassTutor[]
  subjects: IClassSubject[]
  students: string[]
}

//  data: {
//     _id: string;
//     className: string;
//     shortName: string;
//     levelType: string;
//     classSection?: string;
//     classTeacher: string[]; // Array of teacher IDs
//     classSchedule: any[];
//     resources: any[];
//     tutors: IClassTutor[];
//     subjects: IClassSubject[];
//     students: string[];
// message: string;
//   }
