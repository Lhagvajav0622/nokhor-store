'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Lightweight demo auth. Shopping/checkout/tracking work WITHOUT logging in;
// an account only unlocks loyalty points & perks. This is a demo gate (one
// built-in test account), not real authentication — wire Firebase Auth here
// for production accounts.

export type User = {
  name: string
  phone: string
  points: number
  since: string
}

// Built-in test account. Login: phone 9911-2233 · password 123456
const TEST_USERS: (User & { password: string })[] = [
  { name: 'Болормаа Б.', phone: '99112233', password: '123456', points: 1240, since: '2024' },
]

export const digits = (s: string) => s.replace(/\D/g, '')

type AuthState = {
  user: User | null
  login: (phone: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (phone, password) => {
        const p = digits(phone)
        const match = TEST_USERS.find((u) => u.phone === p && u.password === password)
        if (!match) return { ok: false, error: 'Утас эсвэл нууц үг буруу байна.' }
        const { password: _pw, ...user } = match
        set({ user })
        return { ok: true }
      },
      logout: () => set({ user: null }),
    }),
    { name: 'nokhor-auth' }
  )
)
