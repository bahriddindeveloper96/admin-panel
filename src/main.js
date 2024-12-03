import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'admin-lte/dist/js/adminlte.min.js'
import '@fortawesome/fontawesome-free/js/all.min.js'

// Axios interceptors
axios.interceptors.request.use(
  config => {
    const token = store.state.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      store.commit('SET_TOKEN', null)
      router.push('/auth/login')
    }
    return Promise.reject(error)
  }
)

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
