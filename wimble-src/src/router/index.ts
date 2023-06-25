import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import DeviceView from '../views/Device.vue'
import Map from '../views/Widgets/Modules/Map.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/device',
      name: 'device',
      component: DeviceView
    },
    {
      path: '/map',
      name: 'map',
      component: Map
    }
  ]
})

export default router
