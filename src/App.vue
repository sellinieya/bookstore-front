<template>
  <div class="layout">
    <header class="topbar">
      <div class="topbar__inner">
        <RouterLink class="brand" to="/">Book Shop</RouterLink>

        <nav class="topbar__nav">
          <template v-if="auth.isAuthenticated && auth.isAdmin">
            <RouterLink class="topbar__link" to="/">Acceuil</RouterLink>
            <RouterLink class="topbar__link" to="/admin/books">Books</RouterLink>
            <RouterLink class="topbar__link" to="/admin/authors">Authors</RouterLink>
            <button type="button" class="topbar__btn" @click="logout">Logout</button>
          </template>

          <template v-else-if="auth.isAuthenticated">
            <RouterLink class="topbar__link" to="/">Acceuil</RouterLink>
            <RouterLink class="topbar__link" to="/books">All Books</RouterLink>
            <RouterLink class="topbar__link" to="/add">Add</RouterLink>
            <RouterLink class="topbar__link" to="/favorites">Favorites</RouterLink>
            <button type="button" class="topbar__btn" @click="logout">Logout</button>
          </template>

          <template v-else>
            <RouterLink class="topbar__link" to="/">Acceuil</RouterLink>
            <RouterLink class="topbar__link" to="/login">Login</RouterLink>
          </template>
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
