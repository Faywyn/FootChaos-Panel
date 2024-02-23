import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Analysis from '../views/Analysis.vue'
import Training from '../views/Training.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/analysis',
      component: Analysis,
    },
    {
      path: '/training',
      component: Training,
    }
  ]
})

export default router;
