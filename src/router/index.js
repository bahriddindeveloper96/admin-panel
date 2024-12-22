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
import ProductEdit from '../views/products/ProductEdit.vue'
import Reports from '../views/reports/Reports.vue'
import CategoriesList from '../views/categories/CategoriesList.vue'
import CategoriesDetail from '../views/categories/CategoriesDetail.vue'
import CategoryForm from '../views/categories/CategoryForm.vue'
import Settings from '../views/settings/Settings.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
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
        component: ProductEdit
      },
      {
        path: 'categories',
        name: 'categories',
        component: CategoriesList
      },
      {
        path: 'categories/:id',
        name: 'category-details',
        component: CategoriesDetail
      },
      {
        path: 'categories/create',
        name: 'category-create',
        component: CategoryForm
      },
      {
        path: 'categories/:id/edit',
        name: 'category-edit',
        component: CategoryForm
      },
      {
        path: 'reports',
        name: 'reports',
        component: Reports
      },
      {
        path: 'settings',
        name: 'settings',
        component: Settings
      }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: Login,
        meta: { guest: true }
      },
      {
        path: 'logout',
        name: 'logout',
        async beforeEnter(to, from, next) {
          try {
            await store.dispatch('logout')
            next('/auth/login')
          } catch {
            next('/auth/login')
          }
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuest = to.matched.some(record => record.meta.guest)

  if (requiresAuth && !isAuthenticated) {
    next('/auth/login')
  } else if (isGuest && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
