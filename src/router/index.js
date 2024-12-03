import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

// Layouts
import AdminLayout from '../layouts/AdminLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'

// Views
import Login from '../views/auth/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import UsersList from '../views/users/UsersList.vue'
import OrdersList from '../views/orders/OrdersList.vue'
import OrderDetails from '../views/orders/OrderDetails.vue'
import ProductsList from '../views/products/ProductsList.vue'
import ProductForm from '../views/products/ProductForm.vue'
import Reports from '../views/reports/Reports.vue'
import CategoriesList from '../views/categories/CategoriesList.vue'

const routes = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: Login
      }
    ]
  },
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard
      },
      {
        path: 'users',
        name: 'users',
        component: UsersList
      },
      {
        path: 'orders',
        name: 'orders',
        component: OrdersList
      },
      {
        path: 'orders/:id',
        name: 'order-details',
        component: OrderDetails
      },
      {
        path: 'products',
        name: 'products',
        component: ProductsList
      },
      {
        path: 'products/create',
        name: 'product-create',
        component: ProductForm
      },
      {
        path: 'products/:id/edit',
        name: 'product-edit',
        component: ProductForm
      },
      {
        path: 'reports',
        name: 'reports',
        component: Reports
      },
      // Products routes
      {
        path: 'products',
        name: 'products',
        component: () => import('@/views/products/ProductsList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'products/create',
        name: 'products.create',
        component: () => import('@/views/products/ProductForm.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'products/:id/edit',
        name: 'products.edit',
        component: () => import('@/views/products/ProductForm.vue'),
        meta: { requiresAuth: true }
      },
      // Categories routes
      {
        path: 'categories',
        name: 'categories',
        component: () => import('@/views/categories/CategoriesList.vue'),
        meta: { requiresAuth: true }
      },
      // Reports route
      {
        path: '/reports',
        name: 'reports',
        component: () => import('@/views/reports/Reports.vue'),
        meta: { requiresAuth: true }
      },
      // Settings route
      {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/settings/Settings.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !isAuthenticated) {
    next('/auth/login')
  } else if (to.path === '/auth/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
