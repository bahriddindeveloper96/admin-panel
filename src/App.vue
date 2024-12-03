<template>
  <router-view></router-view>
</template>

<script>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'

export default {
  name: 'App',
  setup() {
    const store = useStore()

    onMounted(async () => {
      // Set axios defaults
      axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      
      // Check for existing token
      const token = localStorage.getItem('token')
      if (token) {
        store.commit('SET_TOKEN', token)
        try {
          await store.dispatch('getUser')
        } catch (error) {
          store.commit('SET_TOKEN', null)
        }
      }
    })
  }
}
</script>

<style>
@import 'admin-lte/dist/css/adminlte.min.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';

body {
  margin: 0;
  font-family: 'Source Sans Pro', sans-serif;
}
</style>
