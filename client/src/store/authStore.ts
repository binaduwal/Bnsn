// src/store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'

interface User {
    _id: string
    email: string
    firstName: string
    lastName: string
    role: string
    createdAt: string
    updatedAt: string
    __v: number
}

interface AuthState {
    user: User | null
    token: string | null
    setUser: (user: User) => void
    setToken: (token: string) => void
    setAuth: (user: User, token: string) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            setUser: (user) => set({ user }),
            setToken: (token) => {
                set({ token })
                Cookies.set('token', token, { expires: 7 }) // 7 days
            },
            setAuth: (user, token) => {
                console.log('storee', user, token)
                set({ user, token })
                Cookies.set('token', token, { expires: 7 })
            },
            logout: () => {
                set({ user: null, token: null })
                Cookies.remove('token')
            },
        }),
        {
            name: 'auth-storage', // localStorage key
            partialize: (state) => ({ user: state.user, token: state.token }),
        }
    )
)
