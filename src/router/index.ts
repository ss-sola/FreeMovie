import { createRouter, createWebHistory, createWebHashHistory } from '@ionic/vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/Index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/searchRes',
      name: 'searchRes',
      component: () => import('@/views/SearchRes.vue')
    },
    {
      path: '/play',
      name: 'play',
      component: () => import('@/views/Play.vue')
    },
    {
      path: '/plugin',
      name: 'plugin',
      component: () => import('@/views/PluginManger.vue')
    },
    {
      path: '/mine',
      name: 'mine',
      component: () => import('@/views/Mine.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/Test.vue')
    },
    {
      path: '/sqtest',
      name: 'sqtest',
      component: () => import('@/views/SqlTest.vue')
    }
  ]
})

export default router
