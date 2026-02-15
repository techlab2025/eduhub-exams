import { createRouter, createWebHistory } from 'vue-router'
import { sharedRoutes } from './routes/shared'
import { addSuffix } from './helpers'
import { dashboardRoutes } from './routes/modules'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      name: 'Organization App',
      component: () => import('../views/AppLayout.vue'),
      children: [
        ...dashboardRoutes,
        ...addSuffix(sharedRoutes, 'Shared'),
      ],

    },
  ],
})

// router.beforeEach(authGuard)
export default router
