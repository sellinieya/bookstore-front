import { defineStore } from 'pinia'

export type FavoriteBook = {
  id: number
  title: string
  year: number
  image: string
}

const STORAGE_KEY = 'eya.favorites'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    items: [] as FavoriteBook[],
  }),
  actions: {
    hydrate() {
      if (this.items.length) return
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      try {
        this.items = JSON.parse(raw) as FavoriteBook[]
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    },
    isFavorite(id: number) {
      return this.items.some((x) => x.id === id)
    },
    toggle(book: FavoriteBook) {
      const i = this.items.findIndex((x) => x.id === book.id)
      if (i >= 0) this.items.splice(i, 1)
      else this.items.push(book)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
    },
    remove(id: number) {
      const i = this.items.findIndex((x) => x.id === id)
      if (i >= 0) this.items.splice(i, 1)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
    },
  },
})
