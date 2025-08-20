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
    const currentLocale = i18n.global.locale.value
    const pickLocalized = (entity) => {
      // Prefer backend-provided translated fields
      if (typeof entity?.translated_name === 'string' && entity.translated_name) {
        return {
          name: entity.translated_name,
          description: entity.translated_description || ''
        }
      }

      // If name/description are objects keyed by locale
      if (entity && typeof entity.name === 'object' && entity.name !== null) {
        const nameObj = entity.name || {}
        const descObj = entity.description || {}
        const fallbacks = ['en']
        const name = nameObj[currentLocale] ?? nameObj[fallbacks.find(k => nameObj[k] != null)] ?? ''
        const description = descObj[currentLocale] ?? descObj[fallbacks.find(k => descObj[k] != null)] ?? ''
        return { name, description }
      }

      // Fallback to translations array shape
      const tr = entity?.translations || []
      const current = tr.find(t => t.locale === currentLocale)
      const en = tr.find(t => t.locale === 'en')
      return {
        name: current?.name || en?.name || entity?.name || '',
        description: current?.description || en?.description || entity?.description || ''
      }
    }

    return state.categories.map(category => ({
      ...category,
      ...pickLocalized(category),
      children: Array.isArray(category.children)
        ? category.children.map(child => ({
            ...child,
            ...pickLocalized(child)
          }))
        : []
    }))
  },
  
  getLocalizedCategory: (state) => {
    if (!state.category) return null
    const currentLocale = i18n.global.locale.value
    const c = state.category
    // Prefer translated fields
    if (typeof c?.translated_name === 'string' && c.translated_name) {
      return { ...c, name: c.translated_name, description: c.translated_description || '' }
    }
    // Object map shape
    if (c && typeof c.name === 'object' && c.name !== null) {
      const nameObj = c.name || {}
      const descObj = c.description || {}
      const name = nameObj[currentLocale] ?? nameObj.en ?? ''
      const description = descObj[currentLocale] ?? descObj.en ?? ''
      return { ...c, name, description }
    }
    // Translations array shape
    const tr = c?.translations || []
    const trans = tr.find(t => t.locale === currentLocale) || tr.find(t => t.locale === 'en')
    return { ...c, name: trans?.name || c.name || '', description: trans?.description || c.description || '' }
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
      const created = response.data?.data ?? response.data
      if (created) {
        commit('ADD_CATEGORY', created)
      } else {
        // As a fallback, refresh list
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
      const updated = response.data?.data ?? response.data
      if (updated) {
        commit('UPDATE_CATEGORY', updated)
      } else {
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
      commit('REMOVE_CATEGORY', id)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to delete category')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
  ,
  // Add attributes to a category
  async addCategoryAttributes({ commit }, { id, attributesPayload }) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.post(`/api/admin/categories/${id}/attributes`, attributesPayload)
      const category = response.data?.category || response.data?.data || null
      if (category) {
        commit('UPDATE_CATEGORY', category)
      }
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to add attributes')
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
  ADD_CATEGORY(state, category) {
    // Prepend new category and keep selected category in sync
    state.categories = [category, ...state.categories]
    state.category = category
  },
  UPDATE_CATEGORY(state, updatedCategory) {
    const idx = state.categories.findIndex(c => c.id === updatedCategory.id)
    if (idx !== -1) {
      state.categories.splice(idx, 1, updatedCategory)
    }
    if (state.category?.id === updatedCategory.id) {
      state.category = updatedCategory
    }
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
