import { api } from './api'

export type Book = {
  id: number
  title: string
  editor: string
  year: number
  image: string
  summary?: string | null
  author?: number | null
}

export type Author = {
  id: number
  prenom: string
  nom: string
}

export type CreateBookPayload = {
  title: string
  editor: string
  year: number
  image: string
  summary?: string | null
  author: number
}

export async function getAllBooks() {
  const { data } = await api.get<{ listeBooks: Book[] }>('/books/all')
  return data.listeBooks
}

export async function filterBooksByYear(startYear?: number, endYear?: number) {
  const params = new URLSearchParams()
  if (typeof startYear === 'number') params.set('startYear', String(startYear))
  if (typeof endYear === 'number') params.set('endYear', String(endYear))

  const { data } = await api.get<{ listeBooks: Book[] }>(`/books/filter?${params.toString()}`)
  return data.listeBooks
}

export async function getBookById(id: number) {
  const { data } = await api.get<Book[] | Book>(`/books/search/${id}`)
  if (Array.isArray(data)) return data[0]
  return data
}

export async function createBook(payload: CreateBookPayload) {
  const { data } = await api.post('/books/new', payload)
  return data
}

export async function updateBook(id: number, payload: Partial<CreateBookPayload>) {
  const { data } = await api.put(`/books/edit/${id}`, payload)
  return data
}

export async function deleteBook(id: number) {
  const { data } = await api.delete(`/books/delete/${id}`)
  return data
}
