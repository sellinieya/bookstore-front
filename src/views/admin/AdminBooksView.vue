<template>
  <section class="panel">
    <div class="toolbar">
      <h1 class="title">Books</h1>
      <RouterLink class="btn btn--primary btn--small" to="/admin/books/new">Add Book</RouterLink>
    </div>

    <p v-if="loading" class="text">Loading...</p>
    <p v-else-if="error" class="msg msg--error">{{ error }}</p>

    <div v-else class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Editor</th>
            <th>Year</th>
            <th>Author</th>
            <th>Image</th>
            <th>Summary</th>
            <th class="table__actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in books" :key="b.id">
            <td class="mono">{{ b.id }}</td>
            <td>{{ b.title }}</td>
            <td>{{ b.editor }}</td>
            <td class="mono">{{ b.year }}</td>
            <td>{{ authorLabel(b.author) }}</td>
            <td class="table__image">
              <div class="img-cell">
                <img v-if="isProbablyUrl(b.image)" :src="b.image" alt="" />
                <span v-else class="text">{{ b.image || '-' }}</span>
              </div>
            </td>
            <td class="table__summary">{{ b.summary || '-' }}</td>
            <td class="table__actions">
              <button class="icon-btn" type="button" title="Edit" @click="goEdit(b.id)">✎</button>
              <button class="icon-btn icon-btn--danger" type="button" title="Delete" @click="onDelete(b.id)">
                🗑
              </button>
            </td>
          </tr>

          <tr v-if="books.length === 0">
            <td colspan="8" class="text center">No books yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { getAllAuthors } from '../../services/authors'
import { deleteBook, getAllBooks, type Book } from '../../services/books'

type AuthorMap = Record<number, string>

const router = useRouter()

const loading = ref(true)
const error = ref<string | null>(null)
const books = ref<Book[]>([])
const authorMap = ref<AuthorMap>({})

const authorLabel = computed(() => {
  return (authorId?: number | null) => {
    if (!authorId) return '-'
    return authorMap.value[authorId] ?? `#${authorId}`
  }
})

function isProbablyUrl(value: string) {
  return /^https?:\/\//i.test(value)
}

function goEdit(id: number) {
  router.push(`/admin/books/${id}/edit`)
}

async function refresh() {
  loading.value = true
  error.value = null

  try {
    const [b, a] = await Promise.all([getAllBooks(), getAllAuthors()])
    books.value = b
    authorMap.value = Object.fromEntries(a.map((x) => [x.id, `${x.prenom} ${x.nom}`]))
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Failed to load books'
  } finally {
    loading.value = false
  }
}

async function onDelete(id: number) {
  const ok = window.confirm('Delete this book?')
  if (!ok) return

  try {
    await deleteBook(id)
    await refresh()
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Delete failed'
  }
}

onMounted(refresh)
</script>
