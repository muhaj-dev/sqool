import { create } from 'zustand'

interface UserPhoneState {
  phoneNumber: string
  setPhoneNumber: (phone: string) => void
}

export const useUserPhoneStore = create<UserPhoneState>(set => ({
  phoneNumber: '',
  setPhoneNumber: phone => set({ phoneNumber: phone }),
}))
