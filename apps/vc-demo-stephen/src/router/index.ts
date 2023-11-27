import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import SignupView from '../views/SignupView.vue'
// import LoginView from '../views/LoginView.vue'
// import ResetPasswordView from '../views/ResetPasswordView.vue'
// import UserProfileView from '../views/UserProfileView.vue'
// import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/reset',
      name: 'reset',
      component: () => import('../views/ResetPasswordView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/UserProfileView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/private',
      name: 'private',
      // route level code-splitting
      // this generates a separate chunk (Private.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/PrivateView.vue')
    }
  ]
})

export default router
