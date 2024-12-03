import { createStore } from 'vuex'
import axios from 'axios'

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
    topProducts: []
  },
  
  mutations: {
    // Auth mutations
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
    
    // Dashboard mutations
    SET_STATISTICS(state, data) {
      state.statistics = data
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
    }
  },
  
  actions: {
    // Auth actions
    async login({ commit }, credentials) {
      try {
        const { data } = await axios.post('/api/admin/login', credentials)
        commit('SET_USER', data.user)
        commit('SET_TOKEN', data.token)
        return data
      } catch (error) {
        throw error
      }
    },
    
    async logout({ commit }) {
      try {
        await axios.post('/api/admin/logout')
        commit('CLEAR_AUTH')
      } catch (error) {
        throw error
      }
    },
    
    async getUser({ commit }) {
      try {
        const { data } = await axios.get('/api/admin/user')
        commit('SET_USER', data.user)
        return data.user
      } catch (error) {
        throw error
      }
    },
    
    async updateProfile({ commit }, profileData) {
      try {
        const { data } = await axios.put('/api/admin/profile', profileData)
        commit('SET_USER', data.user)
        return data
      } catch (error) {
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
        const { data } = await axios.get('/api/admin/dashboard/statistics')
        commit('SET_STATISTICS', data)
        return data
      } catch (error) {
        throw error
      }
    },
    
    async fetchSalesChart({ commit }, days = 7) {
      try {
        const { data } = await axios.get('/api/admin/dashboard/sales-chart', {
          params: { days }
        })
        commit('SET_SALES_CHART', data)
        return data
      } catch (error) {
        throw error
      }
    },
    
    async fetchOrderStatusChart({ commit }) {
      try {
        const { data } = await axios.get('/api/admin/dashboard/order-status-chart')
        commit('SET_ORDER_STATUS_CHART', data)
        return data
      } catch (error) {
        throw error
      }
    },
    
    async fetchRecentOrders({ commit }) {
      try {
        const { data } = await axios.get('/api/admin/dashboard/recent-orders')
        commit('SET_RECENT_ORDERS', data)
        return data
      } catch (error) {
        throw error
      }
    },
    
    async fetchTopProducts({ commit }) {
      try {
        const { data } = await axios.get('/api/admin/dashboard/top-products')
        commit('SET_TOP_PRODUCTS', data)
        return data
      } catch (error) {
        throw error
      }
    }
  },
  
  getters: {
    isAuthenticated: state => !!state.token,
    user: state => state.user,
    statistics: state => state.statistics,
    salesChart: state => state.salesChart,
    orderStatusChart: state => state.orderStatusChart,
    recentOrders: state => state.recentOrders,
    topProducts: state => state.topProducts
  }
})
