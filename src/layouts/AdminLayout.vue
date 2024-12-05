<template>
  <div class="wrapper">
    <!-- Navbar -->
    <nav class="main-header navbar navbar-expand navbar-light">
      <div class="container-fluid">
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
          <language-switcher />
          <!-- User Dropdown Menu -->
          <li class="nav-item dropdown">
            <a class="nav-link d-flex align-items-center" data-toggle="dropdown" href="#">
              <div class="user-avatar">
                <i class="fas fa-user-circle fa-lg"></i>
              </div>
              <span class="ml-2">{{ user?.name || 'User' }}</span>
            </a>
            <div class="dropdown-menu dropdown-menu-right">
              <router-link to="/profile" class="dropdown-item">
                <i class="fas fa-user mr-2"></i> {{ $t('auth.profile') }}
              </router-link>
              <router-link to="/settings" class="dropdown-item">
                <i class="fas fa-cog mr-2"></i> {{ $t('auth.settings') }}
              </router-link>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item" @click.prevent="logout">
                <i class="fas fa-sign-out-alt mr-2"></i> {{ $t('auth.logout') }}
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Main Sidebar -->
    <aside class="main-sidebar sidebar-light elevation-1">
      <!-- Brand Logo -->
      <router-link to="/" class="brand-link">
        <span class="brand-text font-weight-light">Admin Panel</span>
      </router-link>

      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Sidebar Menu -->
        <nav class="mt-2">
          <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
            <li class="nav-item">
              <router-link to="/" class="nav-link" exact>
                <i class="nav-icon fas fa-tachometer-alt"></i>
                <p>{{ $t('menu.dashboard') }}</p>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/users" class="nav-link">
                <i class="nav-icon fas fa-users"></i>
                <p>{{ $t('menu.users') }}</p>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/orders" class="nav-link">
                <i class="nav-icon fas fa-shopping-cart"></i>
                <p>{{ $t('menu.orders') }}</p>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/products" class="nav-link">
                <i class="nav-icon fas fa-box"></i>
                <p>{{ $t('menu.products') }}</p>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/categories" class="nav-link">
                <i class="nav-icon fas fa-tags"></i>
                <p>{{ $t('menu.categories') }}</p>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/reports" class="nav-link">
                <i class="nav-icon fas fa-chart-bar"></i>
                <p>{{ $t('menu.reports') }}</p>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/settings" class="nav-link">
                <i class="nav-icon fas fa-cog"></i>
                <p>{{ $t('menu.settings') }}</p>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    <!-- Content Wrapper -->
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <slot name="header"></slot>
        </div>
      </div>

      <div class="content">
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

export default {
  name: 'AdminLayout',
  components: {
    LanguageSwitcher
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    const user = computed(() => store.state.user)

    const logout = async () => {
      await store.dispatch('logout')
      router.push('/auth/login')
    }

    return {
      user,
      logout
    }
  }
}
</script>

<style scoped>
.brand-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
}

.user-avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--primary-gradient);
  color: white;
}

.nav-sidebar {
  padding: 1rem 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-link i {
  font-size: 1.25rem;
}

.content-wrapper {
  background: var(--bg-primary);
  min-height: 100vh;
  padding: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
  }
}
</style>
