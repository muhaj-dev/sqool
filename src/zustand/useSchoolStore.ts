'use client'
import { create } from 'zustand'

export interface schoolState {
  name: string
  description: string
  schoolAddress: string
  localGovernment: string
  state: string
  schoolType: string
  setSchoolInfo: (data: Partial<schoolState>) => void
}

export const useSchoolStore = create<schoolState>(set => ({
  name: '',
  description: '',
  schoolAddress: '',
  localGovernment: '',
  state: '',
  schoolType: '',
  setSchoolInfo: data => set(state => ({ ...state, ...data })),
}))
