<template>
  <div class="login-page">
    <div class="login-box">
      <div class="card card-outline card-primary">
        <div class="card-header text-center">
          <h1 class="h1">TechMarket Admin</h1>
        </div>
        <div class="card-body">
          <p class="login-box-msg">Sign in to start your session</p>

          <form @submit.prevent="handleLogin">
            <div class="input-group mb-3">
              <input 
                type="email" 
                class="form-control" 
                placeholder="Email"
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
                placeholder="Password"
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
                  <input 
                    type="checkbox" 
                    id="remember"
                    v-model="form.remember"
                  >
                  <label for="remember">
                    Remember Me
                  </label>
                </div>
              </div>
              <div class="col-4">
                <button 
                  type="submit" 
                  class="btn btn-primary btn-block"
                  :disabled="loading"
                >
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
    const loading = ref(false)
    const form = ref({
      email: '',
      password: '',
      remember: false
    })

    const handleLogin = async () => {
      loading.value = true
      try {
        await store.dispatch('login', {
          email: form.value.email,
          password: form.value.password
        })
        
        if (store.getters.isAdmin) {
          router.push('/')
        } else {
          throw new Error('Unauthorized. Admin access required.')
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.response?.data?.message || error.message || 'Invalid credentials'
        })
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f6f9;
}

.login-box {
  width: 360px;
}

.card {
  margin-bottom: 0;
}
</style>
