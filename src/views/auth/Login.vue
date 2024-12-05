<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-logo">
        <h1>Admin Panel</h1>
      </div>
      <div class="card">
        <div class="card-body">
          <p class="login-box-msg">Sign in to start your session</p>
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <div class="input-group">
                <input
                  type="email"
                  class="form-control"
                  placeholder="Email"
                  v-model="email"
                  required
                >
                <div class="input-group-append">
                  <div class="input-group-text">
                    <i class="fas fa-envelope"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="input-group">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="Password"
                  v-model="password"
                  required
                >
                <div class="input-group-append">
                  <div class="input-group-text cursor-pointer" @click="togglePassword">
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-8">
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" class="custom-control-input" id="remember" v-model="remember">
                  <label class="custom-control-label" for="remember">Remember Me</label>
                </div>
              </div>
              <div class="col-4">
                <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm mr-2"></span>
                  Sign In
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const email = ref('')
    const password = ref('')
    const remember = ref(false)
    const loading = ref(false)
    const showPassword = ref(false)

    const handleLogin = async () => {
      loading.value = true
      try {
        await store.dispatch('login', {
          email: email.value,
          password: password.value,
          remember: remember.value
        })
        router.push('/')
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.response?.data?.message || 'Something went wrong',
          confirmButtonText: 'Try Again'
        })
      } finally {
        loading.value = false
      }
    }

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    return {
      email,
      password,
      remember,
      loading,
      showPassword,
      handleLogin,
      togglePassword
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

.login-logo {
  text-align: center;
  margin-bottom: 2rem;
}

.login-logo h1 {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 2rem;
  margin: 0;
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
