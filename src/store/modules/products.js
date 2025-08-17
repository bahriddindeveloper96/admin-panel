import axios from 'axios'

const state = {
  products: {
    data: [],
    total: 0,
    per_page: 10,
    current_page: 1,
    links: []
  },
  product: null,
  loading: false,
  error: null
}

const getters = {
  getProducts: state => state.products,
  getProduct: state => state.product,
  isLoading: state => state.loading,
  getError: state => state.error
}

const actions = {
  // Fetch products list
  async fetchProducts({ commit }, params = {}) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get('/api/admin/products', { params })
      const paginated = response.data
      const rawData = Array.isArray(paginated?.data) ? paginated.data : []

      // Normalize each product to what UI expects
      const normalized = rawData.map(p => {
        const localeName = p.category?.translated_name ||
          (typeof p.category?.name === 'object' ? (p.category.name.en || Object.values(p.category.name)[0]) : p.category?.name)
        const imgs = Array.isArray(p.images) ? p.images.map(img => ({
          ...img,
          image: img.url || img.image // prefer absolute url if provided
        })) : []
        // map status string to boolean active
        const activeStatuses = ['aktiv', 'active', 'approved']
        const isActive = activeStatuses.includes(String(p.status || '').toLowerCase())
        return {
          ...p,
          name: p.title || p.name,
          active: isActive,
          images: imgs,
          category: p.category ? { ...p.category, name: localeName } : p.category
        }
      })

      const products = {
        data: normalized,
        total: paginated?.total ?? normalized.length,
        per_page: paginated?.per_page ?? (params.per_page || 10),
        current_page: paginated?.current_page ?? (params.page || 1),
        links: paginated?.links || []
      }
      commit('SET_PRODUCTS', products)
      return products
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch products')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Fetch single product
  async fetchProduct({ commit }, id) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get(`/api/admin/products/${id}`)
      const p = response.data?.data ?? response.data
      // Normalize single product similar to list
      const localeName = p?.category?.translated_name ||
        (typeof p?.category?.name === 'object' ? (p.category.name.en || Object.values(p.category.name)[0]) : p?.category?.name)
      const imgs = Array.isArray(p?.images) ? p.images.map(img => ({
        ...img,
        image: img.url || img.image
      })) : []
      const activeStatuses = ['aktiv', 'active', 'approved']
      const isActive = activeStatuses.includes(String(p?.status || '').toLowerCase())
      const normalized = p ? {
        ...p,
        name: p.title || p.name,
        active: isActive,
        images: imgs,
        category: p.category ? { ...p.category, name: localeName } : p?.category
      } : null
      commit('SET_PRODUCT', normalized)
      return normalized
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch product')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Create new product
  async createProduct({ commit }, productData) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.post('/api/admin/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to create product')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Update existing product
  async updateProduct({ commit }, { id, productData }) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.post(`/api/admin/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to update product')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Delete product
  async deleteProduct({ commit }, id) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.delete(`/api/admin/products/${id}`)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to delete product')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Delete multiple products
  async deleteProducts({ commit }, ids) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.post('/api/admin/products/delete', { ids })
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to delete products')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Export products
  async exportProducts({ commit }, params = {}) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get('/api/admin/products/export', {
        params,
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'products.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to export products')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Update product status (e.g., { status: 'aktiv' | 'active' | 'approved' | ... })
  async updateProductStatus({ commit, state }, { id, status }) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.put(`/api/admin/products/${id}/status`, { status })
      const p = response.data?.product || response.data?.data || response.data

      // Normalize like other endpoints
      const localeName = p?.category?.translated_name ||
        (typeof p?.category?.name === 'object' ? (p.category.name.en || Object.values(p.category.name)[0]) : p?.category?.name)
      const imgs = Array.isArray(p?.images) ? p.images.map(img => ({
        ...img,
        image: img.url || img.image
      })) : []
      const activeStatuses = ['aktiv', 'active', 'approved']
      const isActive = activeStatuses.includes(String(p?.status || '').toLowerCase())
      const normalized = p ? {
        ...p,
        name: p.title || p.name,
        active: isActive,
        images: imgs,
        category: p.category ? { ...p.category, name: localeName } : p?.category
      } : null

      if (normalized) {
        commit('UPDATE_PRODUCT_IN_LIST', normalized)
        if (state.product && state.product.id === normalized.id) {
          commit('SET_PRODUCT', normalized)
        }
      }

      return normalized
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to update product status')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products
  },
  SET_PRODUCT(state, product) {
    state.product = product
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  CLEAR_ERROR(state) {
    state.error = null
  },
  UPDATE_PRODUCT_IN_LIST(state, updated) {
    if (!state.products || !Array.isArray(state.products.data)) return
    const idx = state.products.data.findIndex(p => p.id === updated.id)
    if (idx !== -1) {
      state.products.data.splice(idx, 1, { ...state.products.data[idx], ...updated })
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
