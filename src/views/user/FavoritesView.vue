<template>
  <section class="panel">
    <div class="toolbar">
      <h1 class="title">Favorites</h1>
    </div>

    <div v-if="fav.items.length === 0" class="text center">No favorites yet.</div>

    <div v-else class="book-grid">
      <article v-for="b in fav.items" :key="b.id" class="book-card">
        <div class="book-card__image">
          <img v-if="isProbablyUrl(b.image)" :src="b.image" alt="" />
          <div v-else class="book-card__placeholder">No image</div>
        </div>

        <div class="book-card__body">
          <div class="book-card__title">{{ b.title }}</div>
          <div class="book-card__year">{{ b.year }}</div>
        </div>

        <div class="book-card__actions">
          <button class="btn btn--secondary btn--small" type="button" @click="fav.remove(b.id)">
            Remove
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useFavoritesStore } from '../../stores/favorites'

const fav = useFavoritesStore()
fav.hydrate()

function isProbablyUrl(value: string) {
  return /^https?:\/\//i.test(value)
}
</script>
