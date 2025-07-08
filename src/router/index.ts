import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active-link',
  linkExactActiveClass: 'exact-active-link',
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/people/:page?',
      name: 'people',
      // route level code-splitting for lazy-load.
      component: () => import('@/views/PeopleView.vue'),
    },
    {
      path: '/planets:page?',
      name: 'planets',
      // route level code-splitting for lazy-load.
      component: () => import('@/views/PlanetsView.vue'),
    },
  ],
})

export default router
