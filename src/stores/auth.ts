import { defineStore } from 'pinia'

type Role = 'admin' | 'user'

type AuthUser = {
  id: number
  email: string
  username: string
  role: Role
}

type AuthState = {
  token: string | null
  user: AuthUser | null
}

const STORAGE_KEY = 'eya.auth'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    isAdmin: (state) => state.user?.role === 'admin',
  },
  actions: {
    hydrate() {
      if (this.token) return
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      try {
        const parsed = JSON.parse(raw) as AuthState
        this.token = parsed.token
        this.user = parsed.user
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    },
    setSession(token: string, user: AuthUser) {
      this.token = token
      this.user = user
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }))
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem(STORAGE_KEY)
    },
  },
})
