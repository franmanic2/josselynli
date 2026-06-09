import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('@/components/layout/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
        },
        {
          path: 'postres',
          name: 'postres',
          component: () => import('@/views/PostresView.vue'),
        },
        {
          path: 'ventas',
          name: 'ventas',
          component: () => import('@/views/VentasView.vue'),
        },
        {
          path: 'resumen',
          name: 'resumen',
          component: () => import('@/views/ResumenView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.user) {
    return { name: 'login' }
  }
  if (to.name === 'login' && authStore.user) {
    return { name: 'dashboard' }
  }
})

export default router
