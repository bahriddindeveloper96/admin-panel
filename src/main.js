import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'admin-lte/dist/js/adminlte.min.js'
import '@fortawesome/fontawesome-free/js/all.min.js'

// Set axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
axios.defaults.withCredentials = true

// Add request interceptor
axios.interceptors.request.use(config => {
  const token = store.state.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      store.commit('CLEAR_AUTH')
      router.push('/auth/login')
    }
    return Promise.reject(error)
  }
)

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
