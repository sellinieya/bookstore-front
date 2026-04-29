import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AdminView from '../views/AdminView.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  auth.hydrate()

  if (to.name === 'login' || to.name === 'register') {
    if (auth.isAuthenticated) return auth.isAdmin ? { name: 'admin' } : { name: 'home' }
    return true
  }

  if (to.meta?.requiresAuth && !auth.isAuthenticated) return { name: 'login' }
  if (to.meta?.requiresAdmin && !auth.isAdmin) return { name: 'home' }

  return true
})

export default router
