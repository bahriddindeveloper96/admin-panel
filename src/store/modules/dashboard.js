import axios from 'axios'

export default {
  namespaced: true,
  state: {
    statistics: {
      new_orders: 0,
      new_users: 0,
      active_products: 0,
      pending_reviews: 0
    },
    salesStats: {
      totalSales: 124500,
      salesChange: 12.5,
      totalOrders: 1850,
      ordersChange: 8.2,
      avgOrderValue: 67.30,
      avgOrderChange: 4.3,
      conversionRate: 3.6,
      conversionChange: -1.2
    },
    orderStats: {
      completed: 856,
      pending: 236,
      cancelled: 98,
      completedPercentage: 72,
      pendingPercentage: 20,
      cancelledPercentage: 8,
      total: 1190
    }
  },
  mutations: {
    SET_STATISTICS(state, data) {
      state.statistics = data
    }
  },
  actions: {
    async fetchDashboardStats({ commit }) {
      try {
        const response = await axios.get('/admin/dashboard/stats')
        commit('SET_STATISTICS', response.data)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        throw error
      }
    }
  }
}
