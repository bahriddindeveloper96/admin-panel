<template>
  <div class="login-page">
    <div class="login-box">
      <div class="card">
        <div class="card-body login-card-body">
          <p class="login-box-msg">{{ $t('auth.login') }}</p>

          <form @submit.prevent="handleLogin">
            <div class="input-group mb-3">
              <input
                type="email"
                class="form-control"
                :placeholder="$t('auth.email')"
                v-model="form.email"
                required
              >
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-envelope"></span>
                </div>
              </div>
            </div>
            <div class="input-group mb-3">
              <input
                type="password"
                class="form-control"
                :placeholder="$t('auth.password')"
                v-model="form.password"
                required
              >
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-lock"></span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-8">
                <div class="icheck-primary">
                  <input type="checkbox" id="remember" v-model="form.remember">
                  <label for="remember">
                    {{ $t('auth.remember') }}
                  </label>
                </div>
              </div>
              <div class="col-4">
                <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
                  {{ loading ? '...' : $t('auth.login') }}
                </button>
              </div>
            </div>
          </form>

          <p class="mb-1">
            <a href="#" @click.prevent="forgotPassword">
              {{ $t('auth.forgot_password') }}
            </a>
          </p>
        </div>
      </div>
      
      <div class="text-center mt-3">
        <language-switcher />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

export default {
  name: 'Login',
  components: {
    LanguageSwitcher
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const loading = ref(false)
    const form = ref({
      email: '',
      password: '',
      remember: false
    })

    const handleLogin = async () => {
      try {
        loading.value = true
        await store.dispatch('login', form.value)
        router.push('/')
      } catch (error) {
        console.error('Login error:', error)
      } finally {
        loading.value = false
      }
    }

    const forgotPassword = () => {
      router.push('/auth/forgot-password')
    }

    return {
      form,
      loading,
      handleLogin,
      forgotPassword
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 1rem;
}

.card {
  background: var(--bg-secondary);
  border: none;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.card-body {
  padding: 2rem;
}

.login-box-msg {
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 2rem;
}

.form-control {
  height: 3rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1rem;
  transition: var(--transition-all);
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input-group-text {
  background: transparent;
  border: 1px solid var(--border-color);
  border-left: none;
  color: var(--text-secondary);
}

.cursor-pointer {
  cursor: pointer;
}

.btn-primary {
  height: 3rem;
  background: var(--primary-gradient);
  border: none;
  font-weight: 500;
  transition: var(--transition-all);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.custom-control-input:checked ~ .custom-control-label::before {
  background: var(--primary-gradient);
  border-color: var(--primary-color);
}

/* Dark mode adjustments */
[data-theme="dark"] .login-box-msg {
  color: var(--text-light);
}

/* Animation */
.login-box {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 576px) {
  .login-box {
    padding: 0.5rem;
  }
  
  .card-body {
    padding: 1.5rem;
  }
}
</style>
