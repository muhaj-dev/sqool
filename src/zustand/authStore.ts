import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import axios from 'axios'
import { School, LoginSecondResponse } from '@/types'

export const ROLES = ['superAdmin', 'admin', 'teacher', 'parent', 'student'] as const
export type Role = (typeof ROLES)[number]

export function isRole(role: string): role is Role {
  return ROLES.includes(role as Role)
}

export function ToValidSchool(school: { schoolId: { _id: string; name: string }; roles: string[] }): School | null {
  const validRoles = school.roles.filter(isRole)
  return validRoles.length
    ? {
        schoolId: school.schoolId,
        roles: validRoles,
      }
    : null
}

export interface AuthUser {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  phoneId: {
    phoneNumber?: string;
  };
  verificationCode?: string;
  role?: Role;
  school?: {
    _id: string;
    name: string;
  };
}

interface LoginResponse {
  accessToken: string
  user?: {
    _id: string
    firstName: string
    lastName: string
    email: string
    phoneId: {
      phoneNumber?: string
    }
    isVerify: boolean
    isBlock: boolean
    schools: {
      schoolId: {
        _id: string
        name: string
      }
      roles: string[]
    }[]
  }
  schools?: {
    schoolId: {
      _id: string
      name: string
    }
    roles: string[]
  }[]
}

interface LoginResult {
  success: boolean
  requiresOnboarding?: boolean
  requiresSecondStep?: boolean
  accessToken?: string
  schoolId?: string
  role?: Role
  schools?: School[]
  user?: AuthUser
  error?: string
}

interface CompleteLoginResult {
  success: boolean
  role?: Role
  error?: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  tempPhone: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  setTempPhone: (phone: string) => void
  clearTempPhone: () => void
  setUserData: (userData: Partial<AuthUser>) => void
  sendOtp: (phoneNumber: string) => Promise<boolean>
  verifyOtpAndRegister: (otp: string) => Promise<boolean>
  login: (email: string, password: string) => Promise<LoginResult>
  completeLogin: (email: string, password: string, schoolId: string, role: Role) => Promise<CompleteLoginResult>
  logout: () => void
  clearAuth: () => void
  saveTokenOnly: (token: string) => void
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      tempPhone: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      setTempPhone: phone => set({ tempPhone: phone }),
      clearTempPhone: () => set({ tempPhone: null }),

      setUserData: userData => {
        if (get().user) {
          set({ user: { ...get().user!, ...userData } })
        } else {
          set({ user: { ...userData } as AuthUser })
        }
      },

      saveTokenOnly: token => {
        console.log('Saving token:', token)
        if (typeof window !== 'undefined') {
          console.log('Window available, setting cookie')
          document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; Secure; SameSite=Strict`
        }
        set({
          token,
          isAuthenticated: true,
          user: null,
          error: null,
        })
      },

      sendOtp: async phoneNumber => {
        set({ isLoading: true, error: null })
        try {
          await api.post('/v1/auth/send-otp', { phoneNumber })
          set({ tempPhone: phoneNumber })
          return true
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to send OTP'
          set({ error: errorMessage })
          return false
        } finally {
          set({ isLoading: false })
        }
      },

      verifyOtpAndRegister: async otp => {
        set({ isLoading: true, error: null })
        try {
          const { user, tempPhone } = get()
          if (!user || !tempPhone) {
            throw new Error('User data missing')
          }

          const completeUser = {
            ...user,
            phoneId: {
              phoneNumber: tempPhone,
            },
            verificationCode: otp,
          }

          const response = await api.post('/v1/auth/register', completeUser)
          const data = response.data

          if (!data.data?.accessToken) {
            throw new Error('No access token received')
          }

          if (typeof window !== 'undefined') {
            document.cookie = `auth-token=${
              data.data.accessToken
            }; path=/; max-age=${60 * 60 * 24 * 7}; Secure; SameSite=Strict`
          }

          set({
            user: completeUser,
            token: data.data.accessToken,
            tempPhone: null,
            isAuthenticated: true,
          })
          return true
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Registration failed'
          set({ error: errorMessage })
          return false
        } finally {
          set({ isLoading: false })
        }
      },

      login: async (email, password): Promise<LoginResult> => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post<{ data: LoginResponse }>('/v1/auth/login', { email, password })
          const { accessToken, user, schools } = response.data.data

          if (!accessToken) {
            throw new Error('No access token received')
          }

          get().saveTokenOnly(accessToken)

          // Save user data to cookies if available
          if (user && typeof window !== 'undefined') {
            const userData = {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phoneId: user.phoneId,
              isVerify: user.isVerify,
              isBlock: user.isBlock,
              schools: user.schools,
            }

            document.cookie = `user-data=${JSON.stringify(userData)}; path=/; max-age=${60 * 60 * 24 * 7}; Secure; SameSite=Strict`
          }

          // Case 1: New response format with user data
          if (user && user.schools?.length) {
            const validSchools = user.schools.map(ToValidSchool).filter(Boolean) as School[]
            if (!validSchools.length) {
              throw new Error('No valid schools found')
            }

            const userSchool = validSchools[0]
            const userRole = userSchool.roles[0]

            const authUser: AuthUser = {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phoneId: user.phoneId,
              role: userRole,
              school: userSchool.schoolId,
            }

            set({
              user: authUser,
              token: accessToken,
              isAuthenticated: true,
              error: null,
            })

            return {
              success: true,
              requiresSecondStep: false,
              user: authUser,
              role: userRole,
              schoolId: userSchool.schoolId._id,
              accessToken,
            }
          }

          // Case 2: No schools - onboarding required
          if (!schools || schools.length === 0) {
            return {
              success: true,
              requiresOnboarding: true,
              accessToken,
            }
          }

          const validSchools = schools.map(ToValidSchool).filter(Boolean) as School[]
          if (!validSchools.length) {
            throw new Error('No valid schools found')
          }

          // Case 3: Single school with single role
          if (validSchools.length === 1 && validSchools[0].roles.length === 1) {
            const minimalUser: AuthUser = {
              _id: user?._id,
              email: email,
              role: validSchools[0].roles[0],
              firstName: '',
              lastName: '',
              phoneId: { phoneNumber: '' },
              school: validSchools[0].schoolId,
            }

            set({
              user: minimalUser,
              token: accessToken,
              isAuthenticated: true,
              error: null,
            })

            return {
              success: true,
              requiresSecondStep: false,
              schoolId: validSchools[0].schoolId._id,
              role: validSchools[0].roles[0],
              accessToken,
            }
          }

          // Case 4: Needs selection
          return {
            success: true,
            requiresSecondStep: true,
            schoolId: validSchools[0].schoolId._id,
            schools: validSchools,
            accessToken,
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Login failed'
          set({ error: errorMessage })
          return { success: false, error: errorMessage }
        } finally {
          set({ isLoading: false })
        }
      },

      completeLogin: async (email, password, schoolId, role): Promise<CompleteLoginResult> => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post<{ data: LoginSecondResponse }>('/v1/auth/login', {
            email,
            password,
            schoolId,
            role,
          })

          const { accessToken, user } = response.data.data

          if (!accessToken) {
            throw new Error('No access token received')
          }

          if (typeof window !== 'undefined') {
            document.cookie = `auth-token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; Secure; SameSite=Strict`
          }

          // Save user data to cookies if available
          if (user && typeof window !== 'undefined') {
            const userData = {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phoneId: user.phoneId,
              isVerify: user.isVerify,
              isBlock: user.isBlock,
              schools: user.schools,
            }

            document.cookie = `user-data=${JSON.stringify(userData)}; path=/; max-age=${60 * 60 * 24 * 7}; Secure; SameSite=Strict`
          }

          const authUser: AuthUser = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneId: user.phoneId,
            role: role,
            school: user.schools?.find(s => s.schoolId._id === schoolId)?.schoolId,
          }

          set({
            user: authUser,
            token: accessToken,
            isAuthenticated: true,
            error: null,
          })

          return { success: true, role }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed'
          set({ error: errorMessage })
          return { success: false, error: errorMessage }
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          document.cookie = 'user-data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
        set({
          user: null,
          token: null,
          tempPhone: null,
          error: null,
          isAuthenticated: false,
        })
      },

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          document.cookie = 'user-data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
        set({
          user: null,
          token: null,
          tempPhone: null,
          error: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
