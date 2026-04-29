import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('eya.auth')
  if (!raw) return config

  try {
    const parsed = JSON.parse(raw) as { token?: string | null }
    if (parsed.token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${parsed.token}`
    }
  } catch {}

  return config
})
