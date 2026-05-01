<template>
  <section class="panel">
    <div class="toolbar">
      <h1 class="title">Add Book</h1>
      <RouterLink class="btn btn--secondary btn--small" to="/books">Back</RouterLink>
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
        <button class="btn btn--primary" type="submit" :disabled="loading || authors.length === 0">
          {{ loading ? 'Saving...' : 'Create' }}
        </button>
      </div>

      <p v-if="error" class="msg msg--error">{{ error }}</p>
      <p v-if="success" class="msg msg--success">{{ success }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { getAllAuthors, type Author } from '../../services/authors'
import { createBook } from '../../services/books'

const router = useRouter()

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

async function loadAuthors() {
  authors.value = await getAllAuthors()
  if (authors.value.length && form.author === 0) form.author = authors.value[0].id
}

async function onSubmit() {
  loading.value = true
  error.value = null
  success.value = null

  try {
    await createBook({
      title: form.title,
      editor: form.editor,
      year: Number(form.year),
      image: form.image,
      author: Number(form.author),
      summary: form.summary || null,
    })
    success.value = 'Book created'
    await router.push('/books')
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Create failed'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await loadAuthors()
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Failed to load authors'
  }
})
</script>

<style scoped>
.textarea {
  resize: vertical;
}
</style>
