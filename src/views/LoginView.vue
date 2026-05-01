<template>
  <section class="panel">
    <h1 class="title">Login</h1>

    <form class="form" @submit.prevent="onSubmit">
      <label class="field">
        <span class="label">Username</span>
        <input
          v-model.trim="identifiant"
          class="input"
          placeholder="username or email"
          required
        />
      </label>

      <label class="field">
        <span class="label">Password</span>
        <input
          v-model="password"
          class="input"
          type="password"
          autocomplete="current-password"
          required
        />
      </label>

      <div class="actions">
        <button class="btn btn--primary" type="submit" :disabled="loading">
          {{ loading ? 'Loading...' : 'Login' }}
        </button>
        <RouterLink class="btn btn--secondary" to="/register">Switch to Register</RouterLink>
      </div>

      <p v-if="error" class="msg msg--error">{{ error }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { signIn } from '../services/auth'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const identifiant = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function onSubmit() {
  loading.value = true
  error.value = null

  try {
    const data = await signIn({ identifiant: identifiant.value, password: password.value })
    auth.setSession(data.access_token, {
      id: data.id,
      email: data.email,
      username: data.username,
      role: data.role,
    })

    await router.push(auth.isAdmin ? '/admin/books' : '/books')
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
