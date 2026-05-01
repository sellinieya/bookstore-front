import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import HomeView from "../views/HomeView.vue";
import ContactView from "../views/ContactView.vue";
import AllBooksView from "../views/user/AllBooksView.vue";
import FavoritesView from "../views/user/FavoritesView.vue";
import UserAddView from "../views/user/UserAddView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AdminAuthorsView from "../views/admin/AdminAuthorsView.vue";
import AdminBooksView from "../views/admin/AdminBooksView.vue";
import BookFormView from "../views/admin/BookFormView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/contact", name: "contact", component: ContactView },
    { path: "/books", name: "books.all", component: AllBooksView, meta: { requiresAuth: true } },
    { path: "/add", name: "books.add", component: UserAddView, meta: { requiresAuth: true } },
    { path: "/favorites", name: "favorites", component: FavoritesView, meta: { requiresAuth: true } },
    { path: "/login", name: "login", component: LoginView },
    { path: "/register", name: "register", component: RegisterView },
    {
      path: "/admin",
      meta: { requiresAuth: true, requiresAdmin: true },
      redirect: "/admin/books",
      children: [
        { path: "books", name: "admin.books", component: AdminBooksView },
        { path: "books/new", name: "admin.books.new", component: BookFormView },
        {
          path: "books/:id/edit",
          name: "admin.books.edit",
          component: BookFormView,
        },
        { path: "authors", name: "admin.authors", component: AdminAuthorsView },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  auth.hydrate();

  if (to.name === "login" || to.name === "register") {
    if (auth.isAuthenticated)
      return auth.isAdmin ? { name: "admin.books" } : { name: "books.all" };
    return true;
  }

  if (to.meta?.requiresAuth && !auth.isAuthenticated) return { name: "login" };
  if (to.meta?.requiresAdmin && !auth.isAdmin) return { name: "home" };

  return true;
});

export default router;
