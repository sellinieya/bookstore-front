<template>
  <section class="panel">
    <div class="toolbar">
      <h1 class="title">All Books</h1>
    </div>

    <form class="searchbar" @submit.prevent="onSearch">
      <label class="searchbar__field">
        <span class="label">Start Year</span>
        <input v-model.number="startYear" class="input" type="number" placeholder="e.g. 1900" />
      </label>

      <label class="searchbar__field">
        <span class="label">End Year</span>
        <input v-model.number="endYear" class="input" type="number" placeholder="e.g. 2026" />
      </label>

      <button class="btn btn--primary btn--small searchbar__btn" type="submit" :disabled="loading">
        {{ loading ? '...' : 'Search' }}
      </button>
    </form>

    <p v-if="loading" class="text">Loading...</p>
    <p v-else-if="error" class="msg msg--error">{{ error }}</p>

    <div v-else class="book-grid">
      <article v-for="b in books" :key="b.id" class="book-card">
        <div class="book-card__image">
          <img v-if="isProbablyUrl(b.image)" :src="b.image" alt="" />
          <div v-else class="book-card__placeholder">No image</div>
        </div>

        <div class="book-card__body">
          <div class="book-card__title">{{ b.title }}</div>
          <div class="book-card__year">{{ b.year }}</div>
          <div class="book-card__author">{{ authorLabel(b.author) }}</div>
        </div>

        <div class="book-card__actions">
          <button class="btn btn--secondary btn--small" type="button" @click="toggleFav(b)">
            {{ fav.isFavorite(b.id) ? 'Remove Favorite' : 'Add To Favorites' }}
          </button>
        </div>
      </article>

      <div v-if="books.length === 0" class="text center" style="grid-column: 1 / -1">
        No books found.
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getAllAuthors } from '../../services/authors'
import { filterBooksByYear, getAllBooks, type Book } from '../../services/books'
import { useFavoritesStore } from '../../stores/favorites'

type AuthorMap = Record<number, string>

const fav = useFavoritesStore()
fav.hydrate()

const loading = ref(true)
const error = ref<string | null>(null)
const books = ref<Book[]>([])
const startYear = ref<number | null>(null)
const endYear = ref<number | null>(null)
const authorMap = ref<AuthorMap>({})

const authorLabel = computed(() => {
  return (authorId?: number | null) => {
    if (!authorId) return ''
    return authorMap.value[authorId] ?? ''
  }
})

function isProbablyUrl(value: string) {
  return /^https?:\/\//i.test(value)
}

function toggleFav(b: Book) {
  fav.toggle({ id: b.id, title: b.title, year: b.year, image: b.image })
}

async function loadAuthors() {
  const a = await getAllAuthors()
  authorMap.value = Object.fromEntries(a.map((x) => [x.id, `${x.prenom} ${x.nom}`]))
}

async function loadAll() {
  loading.value = true
  error.value = null
  try {
    await loadAuthors()
    books.value = await getAllBooks()
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Failed to load books'
  } finally {
    loading.value = false
  }
}

async function onSearch() {
  loading.value = true
  error.value = null
  try {
    await loadAuthors()
    const s = typeof startYear.value === 'number' ? startYear.value : undefined
    const e = typeof endYear.value === 'number' ? endYear.value : undefined
    books.value = await filterBooksByYear(s, e)
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Search failed'
  } finally {
    loading.value = false
  }
}

onMounted(loadAll)
</script>
