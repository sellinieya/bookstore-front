<template>
  <section class="panel">
    <h1 class="title">Register</h1>

    <form class="form" @submit.prevent="onSubmit">
      <label class="field">
        <span class="label">Username</span>
        <input v-model.trim="username" class="input" required />
      </label>

      <label class="field">
        <span class="label">Email</span>
        <input v-model.trim="email" class="input" type="email" autocomplete="email" required />
      </label>

      <label class="field">
        <span class="label">Password</span>
        <input
          v-model="password"
          class="input"
          type="password"
          autocomplete="new-password"
          required
        />
      </label>

      <div class="actions">
        <button class="btn btn--primary" type="submit" :disabled="loading">
          {{ loading ? 'Loading...' : 'Register' }}
        </button>
        <RouterLink class="btn btn--secondary" to="/login">Switch to Login</RouterLink>
      </div>

      <p v-if="success" class="msg msg--success">{{ success }}</p>
      <p v-if="error" class="msg msg--error">{{ error }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { signUp } from '../services/auth'

const router = useRouter()

const email = ref('')
const username = ref('')
const password = ref('')
const loading = ref(false)
const success = ref<string | null>(null)
const error = ref<string | null>(null)

async function onSubmit() {
  loading.value = true
  success.value = null
  error.value = null

  try {
    await signUp({
      email: email.value,
      username: username.value,
      password: password.value,
    })
    success.value = 'Account created. You can login now.'
    await router.push('/login')
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
