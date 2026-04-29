<template>
  <section class="panel">
    <h1 class="title">Home</h1>
    <p v-if="auth.user" class="text">Logged in as: {{ auth.user.username }} ({{ auth.user.role }})</p>
  </section>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
</script>
