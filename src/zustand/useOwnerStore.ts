import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface OwnerInfoState {
  firstName: string
  lastName: string
  phoneNumber: string
  gender: string
  dob: Date
  nationality: string
  address: string
  idType: string
  idNumber: string
  setOwnerInfo: (data: Partial<OwnerInfoState>) => void
}

export const useOwnerStore = create<OwnerInfoState>()(
  persist(
    set => ({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      gender: '',
      dob: new Date(),
      nationality: '',
      address: '',
      idType: '',
      idNumber: '',
      setOwnerInfo: data => set(state => ({ ...state, ...data })),
    }),
    { name: 'owner-info-storage' },
  ),
)
