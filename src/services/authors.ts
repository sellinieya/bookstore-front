import { api } from './api'

export type Author = {
  id: number
  prenom: string
  nom: string
}

export type CreateAuthorPayload = {
  prenom: string
  nom: string
}

export async function getAllAuthors() {
  const { data } = await api.get<Author[]>('/author/all')
  return data
}

export async function addAuthor(payload: CreateAuthorPayload) {
  const { data } = await api.post('/author/add', payload)
  return data
}
