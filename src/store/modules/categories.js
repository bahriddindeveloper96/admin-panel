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
      name: (category.translations?.find(t => t.locale === currentLocale)?.name) ||
            (category.translations?.find(t => t.locale === 'en')?.name) ||
            category.name || '',
      description: (category.translations?.find(t => t.locale === currentLocale)?.description) ||
                   (category.translations?.find(t => t.locale === 'en')?.description) ||
                   category.description || '',
      children: category.children ? category.children.map(child => ({
        ...child,
        name: (child.translations?.find(t => t.locale === currentLocale)?.name) ||
              (child.translations?.find(t => t.locale === 'en')?.name) ||
              child.name || '',
        description: (child.translations?.find(t => t.locale === currentLocale)?.description) ||
                     (child.translations?.find(t => t.locale === 'en')?.description) ||
                     child.description || ''
      })) : []
    }))
  },
  
  getLocalizedCategory: (state) => {
    if (!state.category) return null
    const currentLocale = i18n.global.locale
    const translation = state.category.translations?.find(t => t.locale === currentLocale) ||
                       state.category.translations?.find(t => t.locale === 'en')
    return {
      ...state.category,
      name: translation?.name || state.category.name || '',
      description: translation?.description || state.category.description || ''
    }
  }
}

const actions = {
  // Fetch all categories
  async fetchCategories({ commit }) {
    try {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      const response = await axios.get('/api/admin/categories')
      console.log('Categories API Response:', response.data)
      // Support both raw array and { data: [...] } formats
      const payload = Array.isArray(response.data)
        ? response.data
        : (Array.isArray(response.data?.data) ? response.data.data : null)
      if (Array.isArray(payload)) {
        commit('SET_CATEGORIES', payload)
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
      const response = await axios.get(`/api/admin/categories/${id}`)
      const item = response.data?.data ?? response.data
      if (item) {
        commit('SET_CATEGORY', item)
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
      const response = await axios.post('/api/admin/categories', categoryData)
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
      const response = await axios.put(`/api/admin/categories/${id}`, categoryData)
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
      const response = await axios.delete(`/api/admin/categories/${id}`)
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
