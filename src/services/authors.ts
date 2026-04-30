import { api } from './api'

export type Author = {
  id: number
  prenom: string
  nom: string
}

export async function getAllAuthors() {
  const { data } = await api.get<Author[]>('/author/all')
  return data
}
