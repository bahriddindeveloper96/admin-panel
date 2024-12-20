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
      const response = await axios.get('/admin/products', { params })
      const products = {
        data: response.data?.products || [],
        total: response.data?.products?.length || 0,
        per_page: 10,
        current_page: params.page || 1
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
      const response = await axios.get(`/admin/products/${id}`)
      commit('SET_PRODUCT', response.data)
      return response.data
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
      const response = await axios.post('/admin/products', productData, {
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
      const response = await axios.post(`/admin/products/${id}`, productData, {
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
      const response = await axios.delete(`/admin/products/${id}`)
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
      const response = await axios.post('/admin/products/delete', { ids })
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
      const response = await axios.get('/admin/products/export', {
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
