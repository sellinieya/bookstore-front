<template>
  <section class="panel">
    <div class="toolbar">
      <h1 class="title">Authors</h1>
      <button class="btn btn--primary btn--small" type="button" @click="showAdd = !showAdd">
        Add Author
      </button>
    </div>

    <form v-if="showAdd" class="form form--inline" @submit.prevent="onAdd">
      <label class="field">
        <span class="label">Prenom</span>
        <input v-model.trim="prenom" class="input" required />
      </label>

      <label class="field">
        <span class="label">Nom</span>
        <input v-model.trim="nom" class="input" required />
      </label>

      <div class="inline-actions">
        <button class="btn btn--primary btn--small" type="submit" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
        <button class="btn btn--secondary btn--small" type="button" @click="cancelAdd" :disabled="saving">
          Cancel
        </button>
      </div>

      <p v-if="addError" class="msg msg--error">{{ addError }}</p>
      <p v-if="addSuccess" class="msg msg--success">{{ addSuccess }}</p>
    </form>

    <p v-if="loading" class="text">Loading...</p>
    <p v-else-if="error" class="msg msg--error">{{ error }}</p>

    <div v-else class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Prenom</th>
            <th>Nom</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in authors" :key="a.id">
            <td class="mono">{{ a.id }}</td>
            <td>{{ a.prenom }}</td>
            <td>{{ a.nom }}</td>
          </tr>
          <tr v-if="authors.length === 0">
            <td colspan="3" class="text center">No authors yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { addAuthor, getAllAuthors, type Author } from '../../services/authors'

const authors = ref<Author[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const showAdd = ref(false)
const prenom = ref('')
const nom = ref('')
const saving = ref(false)
const addError = ref<string | null>(null)
const addSuccess = ref<string | null>(null)

async function refresh() {
  loading.value = true
  error.value = null
  try {
    authors.value = await getAllAuthors()
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Failed to load authors'
  } finally {
    loading.value = false
  }
}

function cancelAdd() {
  showAdd.value = false
  prenom.value = ''
  nom.value = ''
  addError.value = null
  addSuccess.value = null
}

async function onAdd() {
  saving.value = true
  addError.value = null
  addSuccess.value = null

  try {
    await addAuthor({ prenom: prenom.value, nom: nom.value })
    addSuccess.value = 'Author added'
    await refresh()
    prenom.value = ''
    nom.value = ''
    showAdd.value = false
  } catch (e: any) {
    addError.value = e?.response?.data?.message ?? 'Add failed'
  } finally {
    saving.value = false
  }
}

onMounted(refresh)
</script>

<style scoped>
.form--inline {
  margin-bottom: 12px;
}

.inline-actions {
  display: flex;
  gap: 10px;
  align-items: end;
  justify-content: center;
}
</style>
