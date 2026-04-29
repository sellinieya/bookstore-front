<template>
  <section class="panel">
    <h1 class="title">Admin</h1>
    <p v-if="auth.user" class="text">Welcome, {{ auth.user.username }}.</p>
  </section>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
</script>
