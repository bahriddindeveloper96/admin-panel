import axios from 'axios'
import i18n from '@/i18n'

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
  getError: state => state.error,
  
  // New getters for localized data
  getLocalizedCategories: (state) => {
    const currentLocale = i18n.global.locale
    return state.categories.map(category => ({
      ...category,
      name: category.translations.find(t => t.locale === currentLocale)?.name || 
            category.translations.find(t => t.locale === 'en')?.name || '',
      description: category.translations.find(t => t.locale === currentLocale)?.description ||
                  category.translations.find(t => t.locale === 'en')?.description || '',
      children: category.children ? category.children.map(child => ({
        ...child,
        name: child.translations.find(t => t.locale === currentLocale)?.name ||
              child.translations.find(t => t.locale === 'en')?.name || '',
        description: child.translations.find(t => t.locale === currentLocale)?.description ||
                    child.translations.find(t => t.locale === 'en')?.description || ''
      })) : []
    }))
  },
  
  getLocalizedCategory: (state) => {
    if (!state.category) return null
    const currentLocale = i18n.global.locale
    const translation = state.category.translations.find(t => t.locale === currentLocale) ||
                       state.category.translations.find(t => t.locale === 'en')
    return {
      ...state.category,
      name: translation?.name || '',
      description: translation?.description || ''
    }
  }
}

const actions = {
  // Fetch all categories
  async fetchCategories({ commit }) {
    try {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      const response = await axios.get('/admin/categories')
      console.log('API Response:', response.data)
      if (response.data?.success && Array.isArray(response.data.data)) {
        commit('SET_CATEGORIES', response.data.data)
      } else {
        commit('SET_ERROR', 'Invalid data format received from server')
      }
      return response.data
    } catch (error) {
      console.error('Fetch Categories Error:', error)
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
      const response = await axios.get(`/admin/categories/${id}`)
      if (response.data?.success && response.data.data) {
        commit('SET_CATEGORY', response.data.data)
      }
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch category')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Create new category with translations
  async createCategory({ commit, dispatch }, categoryData) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.post('/admin/categories', categoryData)
      if (response.data?.success) {
        await dispatch('fetchCategories')
      }
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to create category')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Update category with translations
  async updateCategory({ commit, dispatch }, { id, categoryData }) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.put(`/admin/categories/${id}`, categoryData)
      if (response.data?.success) {
        await dispatch('fetchCategories')
      }
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
      const response = await axios.delete(`/admin/categories/${id}`)
      if (response.data?.success) {
        commit('REMOVE_CATEGORY', id)
      }
      return response.data
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
  REMOVE_CATEGORY(state, id) {
    state.categories = state.categories.filter(category => category.id !== id)
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
