import axios from 'axios'
import { useAuthStore } from '@/zustand/authStore'
import {
  DashboardData,
  DashboardResponse,
  IBankAccount,
  IClassConfiguration,
  IClassConfigurationResponse,
  ISessionAndTerm,
  ClassPaginationResponse,
  IStudent,
  StudentPaginationResponse,
  StudentResponse,
  ISingleStudent,
  ParentSearchResponse,
  ClassSearchResponse,
  StaffResponse,
  AddStaffPayload,
  SingleStaffResponse,
  ParentPayload,
  ParentResponse,
  IParent,
  ParentPaginationResponse,
  ISubjectResponse,
  ISubject,
  StaffProfileResponse,
  CreateExamResponse,
  SessionsResponse,
  Exam,
  ExamsResponse,
  TimetableResponse,
  ParentDashboardResponse,
  CreateFeeData,
  UpdateFeeData,
  GetFeesParams,
  FeesResponse,
  FeeStructure,
  Session,
  Class,
  ClassesResponse,
  PaymentResponse,
  NoticesResponse,
} from '@/types'
import { format } from "date-fns";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {},
});

// Add request interceptor to inject token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(token);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

// Define the response type for fetching banks
export interface BankResponse {
  data: IBankAccount[];
  message: string;
}

// School-related API calls
export const createSchool = async (data: FormData) => {
  try {
    const response = await api.post("/v1/admin/schools", data, {
      headers: {},
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to create school";
      console.error("API Error:", {
        status: error.response?.status,
        message: errorMessage,
        url: error.config?.url,
      });
      throw new Error(errorMessage);
    }
    throw new Error("Failed to create school");
  }
};

// Class-related API calls
export const createClasses = async (
  classData: IClassConfiguration
): Promise<IClassConfigurationResponse> => {
  try {
    const response = await api.post<IClassConfigurationResponse>(
      "/v1/admin/classes",
      classData
    );
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error?.response?.data?.message || "Failed to create class";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to create class");
  }
};

export const getClasses = async (page: string = "1", limit: string = "10") => {
  try {
    const response = await api.get<ClassPaginationResponse>(
      "/v1/admin/classes",
      {
        params: {
          page,
          limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch classes";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch classes");
  }
};

export const getClassById = async (classId: string): Promise<any> => {
  try {
    const response = await api.get<any>(`/v1/admin/classes/${classId}`);
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch class";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
      // return errorMessage
    }
    throw new Error("Failed to fetch class");
  }
};

export const updateClass = async (
  classId: string,
  classData: IClassConfiguration
): Promise<IClassConfigurationResponse> => {
  try {
    const response = await api.patch<IClassConfigurationResponse>(
      `/v1/admin/classes/${classId}`
    );
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to update class";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to update class");
  }
};

export const deleteClass = async (classId: string): Promise<void> => {
  try {
    const response = await api.delete(`/v1/admin/classes/${classId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete class";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to delete class");
  }
};

// Session and Term-related API calls
export const createSessionAndTerms = async (data: ISessionAndTerm) => {
  try {
    const response = await api.post("/v1/admin/session-and-terms", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to create session and terms";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to create session and terms");
  }
};

// Bank Account-related API calls
export const createBankAccount = async (data: IBankAccount) => {
  try {
    const response = await api.post("/v1/admin/banks", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to create bank account";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to create bank account");
  }
};

export const getBanks = async (): Promise<BankResponse> => {
  try {
    const response = await api.get<BankResponse>("/v1/admin/banks");
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch banks";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch banks");
  }
};

// Dashboard-related API calls
export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await api.get<DashboardResponse>("/v1/admin/dashboard");
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch dashboard data";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch dashboard data");
  }
};

export const getAllStudents = async (
  page: number,
  limit: number = 10,
  search?: string,
  filter?: string
): Promise<StudentPaginationResponse> => {
  try {
    const skip = (page - 1) * limit; // Calculate skip from page

    const response = await api.get<StudentPaginationResponse>(
      "/v1/admin/student/all",
      {
        params: {
          page,
          limit,
          // skip, // Add skip parameter
          search,
          filter,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch students";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch students");
  }
};

// API to add a new student
export const addStudent = async (
  studentData: ISingleStudent
): Promise<StudentResponse> => {
  try {
    const response = await api.post<StudentResponse>(
      "/v1/admin/student",
      studentData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to add student";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to add student");
  }
};

// API to search parents with pagination
export const searchParents = async (
  query: string,
  page: number = 1
): Promise<ParentSearchResponse> => {
  try {
    const response = await api.get<ParentSearchResponse>(
      `/v1/admin/parents?search=${query}&page=${page}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to search parents";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to search parents");
  }
};

export const getStudentById = async (id: string): Promise<StudentResponse> => {
  try {
    const response = await api.get<StudentResponse>(`/v1/admin/student/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch student";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch student");
  }
};

// API to add a new parent
export const addParent = async (
  parentData: ParentPayload
): Promise<ParentResponse> => {
  try {
    const response = await api.post<ParentResponse>(
      "/v1/admin/parents",
      parentData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to add parent";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to add parent");
  }
};

// API to get all parents with pagination
export const getAllParents = async (
  page: number,
  limit: number,
  search?: string,
  filter?: string
): Promise<ParentPaginationResponse> => {
  try {
    const response = await api.get<ParentPaginationResponse>(
      "/v1/admin/parents",
      {
        params: {
          page,
          limit,
          search,
          filter,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch parents";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch parents");
  }
};

export const getParentById = async (parentId: string) => {
  try {
    const response = await api.get(`/v1/admin/parents/${parentId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch parent details";
      console.error("API Error:", {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch parent details");
  }
};

// API to get staffs with pagination
export const getStaffs = async (
  limit: number = 10,
  page: number = 1,
  search: string = ""
): Promise<StaffResponse> => {
  try {
    const response = await api.get<StaffResponse>(`/v1/admin/staffs`, {
      params: {
        limit,
        page,
        search,
      },
    });
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch staffs";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch staffs");
  }
};

// API to add a new staff
export const addStaff = async (staffData: AddStaffPayload) => {
  try {
    const response = await api.post<StaffResponse>(
      "/v1/admin/staffs",
      staffData
    );
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error?.response?.data?.message || "Failed to add staff";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to add staff");
  }
};

export const getStaffById = async (
  staffId: string
): Promise<SingleStaffResponse> => {
  try {
    const response = await api.get<SingleStaffResponse>(
      `/v1/admin/staffs/${staffId}`
    );
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch staff";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch staff");
  }
};

export const updateStaffStatus = async (
  staffId: string,
  isActive: boolean
): Promise<void> => {
  try {
    const response = await api.patch(`/v1/admin/staffs/${staffId}/${isActive}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to update staff status";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to update staff status");
  }
};

// Subject-related API calls
export const createSubject = async (subjectData: any): Promise<any> => {
  try {
    const response = await api.post<ISubjectResponse>(
      "/v1/admin/subject",
      subjectData
    );
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error?.response?.data?.message || "Failed to create subject";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to create subject");
  }
};

export const getClassStats = async () => {
  try {
    const response = await api.get<{
      data: {
        total: number;
        nursery: number;
        primary: number;
        secondary: number;
        tertiary: number;
      };
      message: string;
    }>("/v1/admin/classes/stat");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch class stats";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch class stats");
  }
};

export const getSubjects = async (page: number = 1, search: string = "") => {
  try {
    const response = await api.get(`/v1/admin/subject`, {
      params: { page, search, limit: 100 },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch subjects");
  }
};

export const assignSubjectToClass = async (payload: {
  subjectIds: string[];
  classId: string;
}) => {
  try {
    const response = await api.post(
      "/v1/admin/classes/assign-subject",
      payload
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deAssignSubjectToClass = async (payload: {
  classId: string;
  subjectIds: string[];
}) => {
  try {
    const response = await api.post(
      "/v1/admin/classes/de-assign-subject",
      payload
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const assignTutorToClass = async (
  classId: string,
  payload: { tutor: string; subjects: string[] }
) => {
  try {
    const response = await api.post(
      `/v1/admin/classes/${classId}/tutor`,
      payload
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to assign tutor to class";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to assign tutor to class");
  }
};

export const removeTutorOrSubjectFromClass = async (
  classId: string,
  payload: { tutor: string; subjects: string[] }
) => {
  try {
    const response = await api.patch(
      `/v1/admin/classes/${classId}/tutor`,
      payload
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to remove tutor or subject from class";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to remove tutor or subject from class");
  }
};

export const deleteClassTeacher = async (
  classId: string,
  payload: { teacherId: string }
) => {
  console.log(classId, payload);
  try {
    const response = await api.patch(
      `/v1/admin/classes/${classId}/teacher/remove`,
      payload
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to remove stafffrom class";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to remove staff from class");
  }
};

export const createClassSchedule = async (payload: {
  class: string;
  day: string;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
}) => {
  try {
    const response = await api.post("/v1/admin/class/schedule", payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to create class schedule";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to create class schedule");
  }
};

export const changeClassTeacher = async (
  classId: string,
  payload: { oldTeacher: string; newTeacher: string }
) => {
  try {
    const response = await api.patch(
      `/v1/admin/classes/${classId}/teacher`,
      payload
    );
    return response.data;
  } catch (error) {
    // handle error as in your other API functions
    throw error;
  }
};

// Add this to your API functions
export const getClassSchedule = async (classId: string): Promise<any> => {
  try {
    const response = await api.get(`/v1/admin/class/schedule/${classId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch class schedule";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch class schedule");
  }
};

export const updateClassSchedule = async (
  scheduleId: string,
  data: any
): Promise<any> => {
  try {
    const response = await api.patch(
      `/v1/admin/classes/schedule/${scheduleId}`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to update class schedule";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to update class schedule");
  }
};

export const deleteClassSchedule = async (
  classId: string,
  scheduleId: string
): Promise<any> => {
  try {
    const response = await api.delete(
      `/v1/admin/class/schedule/${classId}/${scheduleId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete class schedule";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to delete class schedule");
  }
};

// Payment-related API calls
export const adminC = async (paymentData: {
  paymentMemo: File | null;
  userId: string;
  paymentDate: string;
  paymentStatus: string;
  amount: string;
}): Promise<any> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();

    // Append the file if it exists
    if (paymentData.paymentMemo) {
      formData.append("paymentMemo", paymentData.paymentMemo);
    }

    // Append other fields
    formData.append("userId", paymentData.userId);
    formData.append("paymentDate", paymentData.paymentDate);
    formData.append("paymentStatus", paymentData.paymentStatus);
    formData.append("amount", paymentData.amount);

    const response = await api.post("/v1/admin/payment", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error?.response?.data?.message || "Failed to create payment";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to create payment");
  }
};

export const getPayments = async (
  page: number = 1,
  limit: number = 10,
  paymentStatus?: string
) => {
  try {
    const response = await api.get("/v1/admin/payment", {
      params: { page, limit, paymentStatus },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch payments");
  }
};

export const getPayment = async (paymentId: string) => {
  try {
    const response = await api.get(`/v1/admin/payment/${paymentId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch payment");
  }
};

export const updatePayment = async (
  paymentId: string,
  paymentData: {
    paymentDate?: string;
    paymentStatus?: string;
    amount?: string;
    userId?: string;
  }
) => {
  try {
    const response = await api.patch(
      `/v1/admin/payment/${paymentId}`,
      paymentData
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update payment");
  }
};

export const getStaffProfile = async (): Promise<StaffProfileResponse> => {
  try {
    const response = await api.get<StaffProfileResponse>("/v1/user/profile");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch staff profile";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch staff profile");
  }
};

// Add this API function
export const createExamination = async (
  formData: FormData
): Promise<CreateExamResponse> => {
  try {
    const response = await api.post<CreateExamResponse>(
      "/v1/staff/examination",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response?.data ?? {};
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error?.response?.data?.message || "Failed to create examination";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to create examination");
  }
};

export const getSessions = async (page: string = "1", limit: string = "10") => {
  try {
    const response = await api.get<SessionsResponse>(
      "/v1/admin/session-and-terms",
      {
        params: {
          page,
          limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch classes";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch classes");
  }
};

export const getSessionsForStaff = async (
  page: string = "1",
  limit: string = "10"
) => {
  try {
    const response = await api.get<SessionsResponse>(
      "/v1/staff/session-and-terms",
      {
        params: {
          page,
          limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch classes";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch classes");
  }
};

export const getClassesForStaff = async (
  page: string = "1",
  limit: string = "10"
) => {
  try {
    const response = await api.get<ClassPaginationResponse>(
      "/v1/staff/classes",
      {
        params: {
          page,
          limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch classes";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch classes");
  }
};

export const getSubjectsForStaff = async (
  page: number = 1,
  search: string = ""
) => {
  try {
    const response = await api.get(`/v1/staff/subject`, {
      params: { page, search, limit: 100 },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch subjects");
  }
};

// Update your getAllExams function to accept page and limit parameters
export const getAllExams = async (
  page: number = 1,
  limit: number = 10
): Promise<ExamsResponse> => {
  try {
    const response = await api.get<ExamsResponse>("/v1/staff/examination", {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch exams";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch exams");
  }
};

export const getExamById = async (
  examId: string
): Promise<{ data: Exam; message: string }> => {
  try {
    const response = await api.get<{ data: Exam; message: string }>(
      `/v1/staff/examination/${examId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch exam";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch exam");
  }
};

// utils/api.ts
export const updateExamination = async (
  examId: string,
  formData: FormData
): Promise<any> => {
  try {
    const response = await api.patch(
      `/v1/staff/examination/${examId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to update exam";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to update exam");
  }
};

export const deleteExam = async (examId: string): Promise<void> => {
  try {
    await api.delete(`/v1/staff/examination/${examId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete exam";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to delete exam");
  }
};

// utils/api.ts
export const getClassScheduleForStaff =
  async (): Promise<TimetableResponse> => {
    try {
      const response = await api.get<TimetableResponse>(
        "/v1/staff/class/schedule"
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to fetch timetable";
        console.error("API Error:", errorMessage);
        throw new Error(errorMessage);
      }
      throw new Error("Failed to fetch timetable");
    }
  };

export const getAllExaminations = async (
  page: number = 1,
  limit: number = 50
) => {
  try {
    const response = await api.get("/v1/admin/examination", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch examinations");
  }
};

export const updateExaminationStatus = async (
  examId: string,
  status: "approve" | "reject" | "scheduled"
) => {
  try {
    const response = await api.patch(
      `/v1/admin/examination/${examId}/approve`,
      {
        status,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to approve examination");
  }
};

// Create a notice
export const createNotice = async (payload: {
  title: string;
  content: string;
  body: string;
  visibility: string;
  resources: string[];
  expirationDate: string;
  notificationDate: string;
}) => {
  try {
    const response = await api.post("/v1/admin/notices", payload);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create notice");
  }
};

// Get all notices with search, filter, and limit
export const getAllNotices = async (
  search: string = '', 
  filter: string = '', 
  page: number = 1, 
  limit: number = 20
) => {
  try {
    const response = await api.get('/v1/admin/notices', {
      params: { 
        search, 
        filter, 
        page,
        limit 
      },
    })
    return response.data
  } catch (error) {
    throw new Error("Failed to fetch notices");
  }
};

// Update a notice
export const updateNotice = async (
  noticeId: string,
  payload: {
    title: string;
    content: string;
    body: string;
    visibility: string;
    resources: string[];
    expirationDate: string;
    notificationDate: string;
  }
) => {
  try {
    const response = await api.patch(`/v1/admin/notices/${noticeId}`, payload);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update notice");
  }
};

// Delete a notice
export const deleteNotice = async (noticeId: string) => {
  try {
    await api.delete(`/v1/admin/notices/${noticeId}`);
  } catch (error) {
    throw new Error("Failed to delete notice");
  }
};

export const getStaffNotices = async (
  search: string = "",
  limit: number = 20,
  startDate: string = format(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    "yyyy-MM-dd"
  ),
  endDate: string = format(new Date(), "yyyy-MM-dd")
):Promise<NoticesResponse> => {
  try {
    const response = await api.get("/v1/staff/notices", {
      params: { search, limit, startDate, endDate },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch staff notices");
  }
};

export const getParentNotices = async (search: string = '', limit: number = 20) => {
  try {
    const response = await api.get('/v1/parent/notices', {
      params: { search, limit },
    })
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch staff notices')
  }
}

export const getParentDashboard = async (): Promise<ParentDashboardResponse> => {
  try {
    const response = await api.get('/v1/parent/dashboard')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch parent dashboard data')
  }
}

// export const getParentDashboard = async (): Promise<ParentDashboardResponse> => {
//     const token = useAuthStore.getState().token;

//   try {
//     // const response = await axios.get('http://194.146.13.57:3000/api/v1/parent/dashboard', {
//     //   headers: {
//     //     'Content-Type': 'application/json',
//     //   },
//     //   timeout: 10000,
//     // });

//      const response = await axios.get('194.146.13.57:3000/v1/parent/dashboard', {
//       headers: {
//         'Content-Type': 'application/json',
//         ...(token && { Authorization: `Bearer ${token}` }), // Add Bearer token if exists
//       },
//       timeout: 10000,
//     });

//     return response.data;
//   } catch (error: any) {
//     console.error('Error fetching parent dashboard:', error);

//     if (error.response) {
//       throw new Error(`Failed to fetch parent dashboard: ${error.response.data?.message || error.response.status}`);
//     } else if (error.request) {
//       throw new Error('Network error: Unable to connect to server');
//     } else {
//       throw new Error('Failed to fetch parent dashboard data');
//     }
//   }
// };

export const getParentKidById = async (id: string) => {
  try {
    const response = await api.get(`/v1/parent/${id}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch student data')
  }
}

export const getStudentSchedule = async (id: string) => {
  try {
    const response = await api.get(`/v1/parent/${id}/schedule`)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch student schedule')
  }
}

// GET - Get all school fees with pagination and filters
export const getSchoolFees = async (params: GetFeesParams = {}): Promise<FeesResponse> => {
  try {
    const queryParams = new URLSearchParams()

    // Add optional parameters
    if (params.search) queryParams.append('search', params.search)
    if (params.filter) queryParams.append('filter', params.filter)
    // if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString())
    if (params.class) queryParams.append('class', params.class)
    if (params.session) queryParams.append('session', params.session)

    const queryString = queryParams.toString()
    const url = `${'/v1/admin/schools/fee'}${queryString ? `?${queryString}` : ''}`

    const response = await api.get(url)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch school fees')
  }
}

// POST - Create a new fee structure
export const createFeeStructure = async (feeData: CreateFeeData): Promise<any> => {
  try {
    const requestData = {
      class: feeData.class,
      session: feeData.session,
      totalAmount: feeData.totalAmount,
      terms: feeData.terms,
      // isActive: feeData.isActive,
    }

    const response = await api.post('/v1/admin/schools/fee', requestData)
    return response.data
  } catch (error) {
    // If API responded with a body, return it so callers can show the server message/payload
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data
      console.error('createFeeStructure API error:', {
        status: error.response?.status,
        data: serverData,
      })
      return serverData ?? { message: error.message, error: true }
    }

    // Non-Axios error fallback
    console.error('createFeeStructure unexpected error:', error)
    return { message: String(error), error: true }
  }
}

// PATCH - Update an existing fee structure
export const updateFeeStructure = async (
  feeId: string,
  updateData: UpdateFeeData,
): Promise<{ data: FeeStructure; message: string }> => {
  try {
    // Transform the data to match API expectations
    const requestData: any = {}

    if (updateData.totalAmount !== undefined) {
      requestData.totalAmount = updateData.totalAmount
    }
    if (updateData.terms !== undefined) {
      requestData.terms = updateData.terms
    }
    if (updateData.isActive !== undefined) {
      requestData.isActive = updateData.isActive
    }

    const response = await api.patch(`${'/v1/admin/schools/fee'}/${feeId}`, requestData)
    return response.data
  } catch (error) {
    throw new Error('Failed to update fee structure')
  }
}

// DELETE - Delete a fee structure (if endpoint exists)
export const deleteFeeStructure = async (feeId: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`${'/v1/admin/schools/fee'}/${feeId}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to delete fee structure')
  }
}

// GET - Get single fee structure by ID
export const getFeeStructureById = async (feeId: string): Promise<{ data: FeeStructure; message: string }> => {
  try {
    const response = await api.get(`${'/v1/admin/schools/fee'}/${feeId}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch fee structure')
  }
}

// Add these to your existing API functions

// Alternative approach with optional chaining
export const getAllSessions = async (): Promise<Session[]> => {
  try {
    const response = await api.get<SessionsResponse>('/v1/admin/session-and-terms', {
      params: {
        page: '1',
        limit: '100',
      },
    })

    // Use optional chaining with fallback
    const sessions = response.data?.data?.result || []

    if (sessions.length === 0) {
      console.warn('No sessions found in response')
    }

    return sessions
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch sessions'
      throw new Error(errorMessage)
    }
    throw new Error('Failed to fetch sessions')
  }
}

export const getAllClasses = async (): Promise<Class[]> => {
  try {
    const response = await api.get<ClassesResponse>('/v1/admin/classes', {
      params: {
        page: '1',
        limit: '100',
      },
    })

    // Use optional chaining with fallback
    const classes = response.data?.data?.result || []

    if (classes.length === 0) {
      console.warn('No classes found in response')
    }

    return classes
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch classes'
      throw new Error(errorMessage)
    }
    throw new Error('Failed to fetch classes')
  }
}

// Publish a fee structure
export const publishFeeStructure = async (feeId: string) => {
  try {
    const response = await api.patch(`/v1/admin/schools/fee/publish/${feeId}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to publish fee structure'
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      })
      throw new Error(errorMessage)
    }
    throw new Error('Failed to publish fee structure')
  }
}

export const getParentFees = async () => {
  try {
    const response = await api.get(`/v1/parent/fees`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch parent details'
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      })
      throw new Error(errorMessage)
    }
    throw new Error('Failed to fetch parent details')
  }
}

export const adminCreatePayment = async (data: FormData) => {
  try {
    const response = await api.post('/v1/admin/payment', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to create payment'
      console.error('API Error:', {
        status: error.response?.status,
        message: errorMessage,
        url: error.config?.url,
      })
      throw new Error(errorMessage)
    }
    throw new Error('Failed to create payment')
  }
}

// utils/api.ts - Add this function
export const getAllPayments = async (page: number, limit: number = 10, paymentStatus?: string): Promise<any> => {
  try {
    const response = await api.get('/v1/admin/payment', {
      params: {
        page,
        limit,
        paymentStatus,
      },
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch payments'
      console.error('API Error:', errorMessage)
      throw new Error(errorMessage)
    }
    throw new Error('Failed to fetch payments')
  }
}

export const getPaymentById = async (paymentId: string): Promise<PaymentResponse> => {
  try {
    const response = await api.get(`/v1/admin/payment/${paymentId}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch payment details'
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      })
      throw new Error(errorMessage)
    }
    throw new Error('Failed to fetch payment details')
  }
}


export const getPaymentStatistics = async () => {
  try {
    const response = await api.get('/v1/admin/payment/stat')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch payment statistics')
  }
}