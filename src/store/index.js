import { createStore } from 'vuex'
import axios from 'axios'
import products from './modules/products'
import categories from './modules/categories'
import dashboard from './modules/dashboard'

export default createStore({
  state: {
    // Auth
    user: null,
    token: localStorage.getItem('token'),
    
    // Dashboard
    statistics: null,
    salesChart: null,
    orderStatusChart: null,
    recentOrders: [],
    topProducts: [],

    // Users
    users: [],
    totalUsers: 0
  },
  
  mutations: {
    // Auth mutations
    SET_USER(state, user) {
      state.user = user
    },
    
    SET_TOKEN(state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },

    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },

    // Dashboard mutations
    SET_STATISTICS(state, stats) {
      state.statistics = stats
    },

    SET_SALES_CHART(state, data) {
      state.salesChart = data
    },

    SET_ORDER_STATUS_CHART(state, data) {
      state.orderStatusChart = data
    },

    SET_RECENT_ORDERS(state, orders) {
      state.recentOrders = orders
    },

    SET_TOP_PRODUCTS(state, products) {
      state.topProducts = products
    },

    // Users mutations
    SET_USERS(state, users) {
      state.users = users
    },

    SET_TOTAL_USERS(state, total) {
      state.totalUsers = total
    },

    ADD_USER(state, user) {
      state.users.unshift(user)
    },

    UPDATE_USER(state, updatedUser) {
      const index = state.users.findIndex(user => user.id === updatedUser.id)
      if (index !== -1) {
        state.users.splice(index, 1, updatedUser)
      }
    },

    DELETE_USER(state, userId) {
      state.users = state.users.filter(user => user.id !== userId)
    }
  },
  
  actions: {
    // Auth actions
    async login({ commit }, credentials) {
      try {
        const { data } = await axios.post('/auth/login', credentials)
        commit('SET_TOKEN', data.token)
        commit('SET_USER', data.user)
        // Set token in axios default headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        return data
      } catch (error) {
        throw error
      }
    },

    async logout({ commit }) {
      try {
        // API call to logout
        await axios.post('/auth/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        // Clear auth state regardless of API call success
        commit('CLEAR_AUTH')
        // Remove token from localStorage
        localStorage.removeItem('token')
        // Clear axios default header
        delete axios.defaults.headers.common['Authorization']
      }
    },

    async getUser({ commit }) {
      try {
        const { data } = await axios.get('/admin/auth/user')
        commit('SET_USER', data)
        return data
      } catch (error) {
        commit('CLEAR_AUTH')
        throw error
      }
    },

    // Dashboard actions
    async fetchDashboardData({ dispatch }) {
      await Promise.all([
        dispatch('fetchStatistics'),
        dispatch('fetchSalesChart'),
        dispatch('fetchOrderStatusChart'),
        dispatch('fetchRecentOrders'),
        dispatch('fetchTopProducts')
      ])
    },

    async fetchStatistics({ commit }) {
      try {
        const { data } = await axios.get('/admin/dashboard/stats')
        commit('SET_STATISTICS', data)
        return data
      } catch (error) {
        throw error
      }
    },

    async fetchSalesChart({ commit }, days = 7) {
      try {
        const { data } = await axios.get('/admin/dashboard/chart-data', { params: { days } })
        commit('SET_SALES_CHART', data)
        return data
      } catch (error) {
        throw error
      }
    },

    async fetchOrderStatusChart({ commit }) {
      try {
        const { data } = await axios.get('/admin/dashboard/order-status')
        commit('SET_ORDER_STATUS_CHART', data)
        return data
      } catch (error) {
        throw error
      }
    },

    async fetchRecentOrders({ commit }) {
      try {
        const { data } = await axios.get('/admin/orders?limit=5')
        commit('SET_RECENT_ORDERS', data.data)
        return data
      } catch (error) {
        throw error
      }
    },

    async fetchTopProducts({ commit }) {
      try {
        const { data } = await axios.get('/admin/products?sort=-sales&limit=5')
        commit('SET_TOP_PRODUCTS', data.data)
        return data
      } catch (error) {
        throw error
      }
    },

    // Users actions
    async fetchUsers({ commit }, params = {}) {
      try {
        const { data } = await axios.get('/admin/users', { params })
        commit('SET_USERS', data.data)
        commit('SET_TOTAL_USERS', data.total)
        return data
      } catch (error) {
        throw error
      }
    },

    async createUser({ commit }, userData) {
      try {
        const { data } = await axios.post('/admin/users', userData)
        commit('ADD_USER', data.user)
        return data
      } catch (error) {
        throw error
      }
    },

    async updateUser({ commit }, { id, userData }) {
      try {
        const { data } = await axios.put(`/admin/users/${id}`, userData)
        commit('UPDATE_USER', data.user)
        return data
      } catch (error) {
        throw error
      }
    },

    async deleteUser({ commit }, id) {
      try {
        await axios.delete(`/admin/users/${id}`)
        commit('DELETE_USER', id)
      } catch (error) {
        throw error
      }
    },

    async updateProfile({ commit }, profileData) {
      try {
        const { data } = await axios.put('/admin/profile', profileData)
        commit('SET_USER', data.user)
        return data
      } catch (error) {
        throw error
      }
    }
  },
  
  getters: {
    isAuthenticated: state => !!state.token,
    isAdmin: state => state.user?.role === 'admin',
    user: state => state.user,
    statistics: state => state.statistics,
    salesChart: state => state.salesChart,
    orderStatusChart: state => state.orderStatusChart,
    recentOrders: state => state.recentOrders,
    topProducts: state => state.topProducts,
    users: state => state.users,
    totalUsers: state => state.totalUsers
  },
  modules: {
    products,
    categories,
    dashboard
  }
})
