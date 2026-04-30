<template>
  <div class="home">
    <section class="home-hero">
      <h1 class="home-hero__title">Découvrez des livres pour tous les goûts</h1>
      <p class="home-hero__subtitle">
        Des classiques intemporels aux best-sellers, trouvez votre prochaine lecture ici.
      </p>
      <div class="home-hero__actions">
        <button class="btn btn--primary" type="button" @click="scrollToPopular">
          Explorer le catalogue
        </button>
      </div>
    </section>

    <section class="home-section" id="popular">
      <h2 class="home-section__title">Livres populaires</h2>

      <p v-if="loading" class="text">Loading...</p>
      <p v-else-if="error" class="msg msg--error">{{ error }}</p>

      <div v-else class="cards">
        <article v-for="b in topBooks" :key="b.id" class="card">
          <div class="card__image">
            <img v-if="isProbablyUrl(b.image)" :src="b.image" alt="" />
            <div v-else class="card__placeholder">No image</div>
          </div>

          <div class="card__body">
            <div class="card__title">{{ b.title }}</div>
            <div class="card__meta">{{ b.editor }} • {{ b.year }}</div>
            <div class="card__summary">{{ b.summary || 'No summary.' }}</div>
          </div>

          <div class="card__actions">
            <button class="btn btn--secondary btn--small" type="button" disabled>Voir plus</button>
          </div>
        </article>
      </div>
    </section>

    <footer class="help-footer">
      <div class="help-footer__inner">
        <div class="help-footer__title">Besoin d'aide ?</div>
        <div class="help-footer__text">
          If you need any help contact the team and they will help you out if you have any question.
        </div>
        <RouterLink class="btn btn--primary btn--small" to="/contact">Contactez-nous</RouterLink>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getAllBooks, type Book } from '../services/books'

const loading = ref(true)
const error = ref<string | null>(null)
const books = ref<Book[]>([])

const topBooks = computed(() => books.value.slice(0, 3))

function isProbablyUrl(value: string) {
  return /^https?:\/\//i.test(value)
}

function scrollToPopular() {
  const el = document.getElementById('popular')
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(async () => {
  loading.value = true
  error.value = null

  try {
    const all = await getAllBooks()
    books.value = all
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Failed to load books'
  } finally {
    loading.value = false
  }
})
</script>
