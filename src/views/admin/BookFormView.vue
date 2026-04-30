<template>
  <section class="panel">
    <div class="toolbar">
      <h1 class="title">{{ isEdit ? 'Edit Book' : 'Add Book' }}</h1>
      <RouterLink class="btn btn--secondary btn--small" to="/admin/books">Back</RouterLink>
    </div>

    <form class="form" @submit.prevent="onSubmit">
      <label class="field">
        <span class="label">Title</span>
        <input v-model.trim="form.title" class="input" required />
      </label>

      <label class="field">
        <span class="label">Editor</span>
        <input v-model.trim="form.editor" class="input" required />
      </label>

      <label class="field">
        <span class="label">Year</span>
        <input v-model.number="form.year" class="input" type="number" min="0" required />
      </label>

      <label class="field">
        <span class="label">Author</span>
        <select v-model.number="form.author" class="input" required>
          <option disabled :value="0">Select author...</option>
          <option v-for="a in authors" :key="a.id" :value="a.id">{{ a.prenom }} {{ a.nom }}</option>
        </select>
      </label>

      <label class="field">
        <span class="label">Image (URL)</span>
        <input v-model.trim="form.image" class="input" placeholder="https://..." required />
      </label>

      <label class="field">
        <span class="label">Summary</span>
        <textarea v-model.trim="form.summary" class="input textarea" rows="3" />
      </label>

      <div class="actions">
        <button class="btn btn--primary" type="submit" :disabled="loading">
          {{ loading ? 'Saving...' : isEdit ? 'Save' : 'Create' }}
        </button>
      </div>

      <p v-if="error" class="msg msg--error">{{ error }}</p>
      <p v-if="success" class="msg msg--success">{{ success }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { getAllAuthors, type Author } from '../../services/authors'
import { createBook, getBookById, updateBook } from '../../services/books'

const route = useRoute()
const router = useRouter()

const id = computed(() => {
  const raw = route.params.id
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
})

const isEdit = computed(() => id.value !== null)

const authors = ref<Author[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

const form = reactive({
  title: '',
  editor: '',
  year: new Date().getFullYear(),
  author: 0,
  image: '',
  summary: '',
})

async function load() {
  error.value = null
  authors.value = await getAllAuthors()

  if (authors.value.length && form.author === 0) form.author = authors.value[0].id

  if (id.value !== null) {
    const b = await getBookById(id.value)
    form.title = b?.title ?? ''
    form.editor = (b as any)?.editor ?? ''
    form.year = Number((b as any)?.year ?? new Date().getFullYear())
    form.image = (b as any)?.image ?? ''
    form.summary = (b as any)?.summary ?? ''
    form.author = Number((b as any)?.author ?? form.author)
  }
}

async function onSubmit() {
  loading.value = true
  error.value = null
  success.value = null

  try {
    const payload = {
      title: form.title,
      editor: form.editor,
      year: Number(form.year),
      image: form.image,
      author: Number(form.author),
      summary: form.summary || null,
    }

    if (id.value !== null) {
      await updateBook(id.value, payload)
      success.value = 'Book updated'
    } else {
      await createBook(payload)
      success.value = 'Book created'
    }

    await router.push('/admin/books')
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Save failed'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.textarea {
  resize: vertical;
}
</style>
