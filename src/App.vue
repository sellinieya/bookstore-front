<template>
  <div class="layout">
    <header class="topbar">
      <div class="topbar__inner">
        <div class="brand">Bookstore</div>

        <nav class="topbar__nav">
          <RouterLink class="topbar__link" to="/">Home</RouterLink>
          <RouterLink v-if="!auth.isAuthenticated" class="topbar__link" to="/login">
            Login
          </RouterLink>
          <RouterLink v-if="!auth.isAuthenticated" class="topbar__link" to="/register">
            Register
          </RouterLink>
          <button v-if="auth.isAuthenticated" type="button" class="topbar__btn" @click="logout">
            Logout
          </button>
        </nav>
      </div>
    </header>

    <main class="page">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const auth = useAuthStore()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>
