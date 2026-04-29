import { api } from './api'

type Role = 'admin' | 'user'

export type SignUpPayload = {
  email: string
  username: string
  password: string
  role?: Role
}

export type SignInPayload = {
  identifiant: string
  password: string
}

type SignInResponse = {
  id: number
  email: string
  username: string
  role: Role
  access_token: string
}

export async function signUp(payload: SignUpPayload) {
  const { data } = await api.post('/auth/signup', payload)
  return data
}

export async function signIn(payload: SignInPayload) {
  const { data } = await api.post<SignInResponse>('/auth/signin', payload)
  return data
}
