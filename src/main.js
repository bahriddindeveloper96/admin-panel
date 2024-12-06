import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import axios from 'axios'
import { watch } from 'vue'

// Bootstrap va AdminLTE
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'admin-lte/dist/css/adminlte.min.css'
import 'admin-lte/dist/js/adminlte.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'

// Set axios defaults
axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true

// Add request interceptor
axios.interceptors.request.use(config => {
  const token = store.state.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // Add Accept-Language header based on current locale
  config.headers['Accept-Language'] = i18n.global.locale.value
  
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

// Use plugins
app.use(router)
app.use(store)
app.use(i18n)

// Watch for language changes
watch(
  () => i18n.global.locale.value,
  (newLocale) => {
    localStorage.setItem('locale', newLocale)
    // Update axios Accept-Language header when language changes
    axios.defaults.headers['Accept-Language'] = newLocale
  }
)

app.mount('#app')
