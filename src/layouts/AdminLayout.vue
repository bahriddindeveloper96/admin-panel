<template>
  <div class="wrapper">
    <!-- Navbar -->
    <nav class="main-header navbar navbar-expand navbar-white navbar-light">
      <!-- Left navbar links -->
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" data-widget="pushmenu" href="#" role="button">
            <i class="fas fa-bars"></i>
          </a>
        </li>
      </ul>

      <!-- Right navbar links -->
      <ul class="navbar-nav ml-auto">
        <li class="nav-item dropdown">
          <a class="nav-link" data-toggle="dropdown" href="#">
            <i class="fas fa-user"></i>
            {{ user?.name }}
          </a>
          <div class="dropdown-menu dropdown-menu-right">
            <a href="#" class="dropdown-item" @click="logout">
              <i class="fas fa-sign-out-alt mr-2"></i> Logout
            </a>
          </div>
        </li>
      </ul>
    </nav>

    <!-- Main Sidebar Container -->
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
      <!-- Brand Logo -->
      <router-link to="/" class="brand-link">
        <span class="brand-text font-weight-light">TechMarket Admin</span>
      </router-link>

      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Sidebar Menu -->
        <nav class="mt-2">
          <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
            <li class="nav-item">
              <router-link to="/" class="nav-link" :class="{ active: $route.name === 'dashboard' }">
                <i class="nav-icon fas fa-tachometer-alt"></i>
                <p>Dashboard</p>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/users" class="nav-link" :class="{ active: $route.name === 'users' }">
                <i class="nav-icon fas fa-users"></i>
                <p>Users</p>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/orders" class="nav-link" :class="{ active: $route.name === 'orders' }">
                <i class="nav-icon fas fa-shopping-cart"></i>
                <p>Orders</p>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/products" class="nav-link" :class="{ active: $route.name === 'products' }">
                <i class="nav-icon fas fa-box"></i>
                <p>Products</p>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/categories" class="nav-link" :class="{ active: $route.name === 'categories' }">
                <i class="nav-icon fas fa-tags"></i>
                <p>Categories</p>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/reports" class="nav-link" :class="{ active: $route.name === 'reports' }">
                <i class="nav-icon fas fa-chart-bar"></i>
                <p>Reports</p>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/settings" class="nav-link" active-class="active">
                <i class="nav-icon fas fa-cog"></i>
                <p>Settings</p>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    <!-- Content Wrapper -->
    <div class="content-wrapper">
      <!-- Content Header -->
      <section class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1>{{ pageTitle }}</h1>
            </div>
          </div>
        </div>
      </section>

      <!-- Main content -->
      <section class="content">
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </section>
    </div>

    <!-- Footer -->
    <footer class="main-footer">
      <div class="float-right d-none d-sm-block">
        <b>Version</b> 1.0.0
      </div>
      <strong>Copyright &copy; {{ new Date().getFullYear() }} TechMarket.</strong>
      All rights reserved.
    </footer>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'AdminLayout',
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const user = computed(() => store.getters.getUser)
    const pageTitle = computed(() => {
      switch (route.name) {
        case 'dashboard':
          return 'Dashboard'
        case 'users':
          return 'Users Management'
        case 'orders':
          return 'Orders Management'
        case 'products':
          return 'Products Management'
        case 'categories':
          return 'Categories Management'
        case 'reports':
          return 'Reports'
        case 'settings':
          return 'Settings'
        default:
          return ''
      }
    })

    const logout = async () => {
      try {
        await store.dispatch('logout')
        router.push({ name: 'login' })
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }

    return {
      user,
      pageTitle,
      logout
    }
  }
}
</script>

<style>
@import 'admin-lte/dist/css/adminlte.min.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';
</style>
