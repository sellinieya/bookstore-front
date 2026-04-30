<template>
  <section class="panel">
    <h1 class="title">Contact</h1>
    <p class="text">
      If you need any help, contact the team and they will help you out if you have any question.
    </p>

    <div class="actions" style="padding-top: 14px">
      <a class="btn btn--primary" href="mailto:team@bookshop.local">Contact us</a>
      <RouterLink class="btn btn--secondary" to="/">Back to home</RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
