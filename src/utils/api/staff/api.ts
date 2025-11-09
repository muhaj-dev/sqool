import { StudentPaginationResponse, StudentResponse } from "@/types"
import axios from "axios"
import { api } from "@/utils/api"
import { StaffStudentResponse } from "./types"
import qs from "qs";

const buildStaffQueryUrl = (
  filters: any,
  extendUrl?: string
) => {
  const queryString = qs.stringify(filters, {
    skipNulls: true,
    arrayFormat: "repeat",
  });

  return `/v1/staff${extendUrl ?? ""}${queryString ? `?${queryString}` : ""}`;
};


export const getAllStudents = async (
  page: number,
  limit: number = 10,
  search?: string,
  filter?: string,
  hasAttendance?:boolean
): Promise<StudentPaginationResponse> => {
  try {
    const url = buildStaffQueryUrl(filter,`/student${hasAttendance?"?include=Attendance":""}`)
    const response = await api.get<StudentPaginationResponse>(url, {
      params: {
        page,
        limit,
        search,
        filter,
      },
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch students'
      console.error('API Error:', errorMessage)
      throw new Error(errorMessage)
    }
    throw new Error('Failed to fetch students')
  }
}




export const getStudentById = async (id: string): Promise<StaffStudentResponse> => {
  try {
    const response = await api.get<StaffStudentResponse>(`/v1/staff/student/${id}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch student'
      console.error('API Error:', errorMessage)
      throw new Error(errorMessage)
    }
    throw new Error('Failed to fetch student')
  }
}