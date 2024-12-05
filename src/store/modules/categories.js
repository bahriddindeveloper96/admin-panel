import axios from 'axios'

const state = {
  categories: [],
  category: null,
  loading: false,
  error: null
}

const getters = {
  getCategories: state => state.categories,
  getCategory: state => state.category,
  isLoading: state => state.loading,
  getError: state => state.error
}

const actions = {
  // Fetch all categories
  async fetchCategories({ commit }) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get('/api/categories')
      commit('SET_CATEGORIES', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch categories')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Fetch single category
  async fetchCategory({ commit }, id) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get(`/api/categories/${id}`)
      commit('SET_CATEGORY', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch category')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Create new category
  async createCategory({ commit }, categoryData) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.post('/api/categories', categoryData)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to create category')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Update existing category
  async updateCategory({ commit }, { id, categoryData }) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.put(`/api/categories/${id}`, categoryData)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to update category')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Delete category
  async deleteCategory({ commit }, id) {
    try {
      commit('SET_LOADING', true)
      await axios.delete(`/api/categories/${id}`)
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to delete category')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const mutations = {
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  SET_CATEGORY(state, category) {
    state.category = category
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  CLEAR_ERROR(state) {
    state.error = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
