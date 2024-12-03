<template>
  <div class="content-wrapper">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Products</h1>
          </div>
          <div class="col-sm-6">
            <div class="float-sm-right">
              <router-link to="/products/create" class="btn btn-primary">
                <i class="fas fa-plus"></i> Add Product
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="container-fluid">
        <div class="card">
          <div class="card-header">
            <div class="row">
              <div class="col-md-3">
                <div class="input-group">
                  <input
                    v-model="filters.search"
                    type="text"
                    class="form-control"
                    placeholder="Search products..."
                    @input="handleSearch"
                  >
                  <div class="input-group-append">
                    <button class="btn btn-default">
                      <i class="fas fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="col-md-2">
                <select v-model="filters.category" class="form-control" @change="loadProducts">
                  <option value="">All Categories</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-2">
                <select v-model="filters.status" class="form-control" @change="loadProducts">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div class="col-md-5">
                <div class="float-right">
                  <button class="btn btn-default mr-2" @click="exportProducts">
                    <i class="fas fa-download"></i> Export
                  </button>
                  <button class="btn btn-danger" @click="deleteSelected" :disabled="!selectedProducts.length">
                    <i class="fas fa-trash"></i> Delete Selected
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="card-body table-responsive p-0">
            <table class="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th width="40">
                    <input
                      type="checkbox"
                      :checked="isAllSelected"
                      @change="toggleSelectAll"
                    >
                  </th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in products" :key="product.id">
                  <td>
                    <input
                      type="checkbox"
                      :value="product.id"
                      v-model="selectedProducts"
                    >
                  </td>
                  <td>
                    <img
                      :src="product.image"
                      :alt="product.name"
                      class="product-image"
                    >
                  </td>
                  <td>{{ product.name }}</td>
                  <td>{{ product.category?.name }}</td>
                  <td>{{ formatCurrency(product.price) }}</td>
                  <td>
                    <span :class="getStockBadgeClass(product.stock)">
                      {{ product.stock }}
                    </span>
                  </td>
                  <td>
                    <span :class="getStatusBadgeClass(product.status)">
                      {{ product.status }}
                    </span>
                  </td>
                  <td>
                    <router-link
                      :to="`/products/${product.id}/edit`"
                      class="btn btn-sm btn-info mr-1"
                    >
                      <i class="fas fa-edit"></i>
                    </router-link>
                    <button
                      class="btn btn-sm btn-danger"
                      @click="deleteProduct(product.id)"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="card-footer clearfix">
            <pagination
              :total="pagination.total"
              :per-page="pagination.per_page"
              :current-page="pagination.current_page"
              @page-changed="handlePageChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import Pagination from '@/components/Pagination.vue'
import Swal from 'sweetalert2'
import debounce from 'lodash/debounce'

export default {
  name: 'ProductsList',
  
  components: {
    Pagination
  },
  
  setup() {
    const store = useStore()
    const products = ref([])
    const categories = ref([])
    const selectedProducts = ref([])
    const filters = ref({
      search: '',
      category: '',
      status: '',
      page: 1
    })
    const pagination = ref({
      current_page: 1,
      per_page: 10,
      total: 0
    })

    // Methods
    const loadProducts = async () => {
      try {
        const response = await store.dispatch('products/fetchProducts', filters.value)
        products.value = response.data
        pagination.value = response.meta
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load products'
        })
      }
    }

    const loadCategories = async () => {
      try {
        const response = await store.dispatch('categories/fetchCategories')
        categories.value = response
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }

    const handleSearch = debounce(() => {
      filters.value.page = 1
      loadProducts()
    }, 300)

    const handlePageChange = (page) => {
      filters.value.page = page
      loadProducts()
    }

    const deleteProduct = async (id) => {
      try {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        })

        if (result.isConfirmed) {
          await store.dispatch('products/deleteProduct', id)
          await loadProducts()
          Swal.fire(
            'Deleted!',
            'Product has been deleted.',
            'success'
          )
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete product'
        })
      }
    }

    const deleteSelected = async () => {
      try {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete them!'
        })

        if (result.isConfirmed) {
          await store.dispatch('products/deleteProducts', selectedProducts.value)
          selectedProducts.value = []
          await loadProducts()
          Swal.fire(
            'Deleted!',
            'Selected products have been deleted.',
            'success'
          )
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete products'
        })
      }
    }

    const exportProducts = async () => {
      try {
        await store.dispatch('products/exportProducts', filters.value)
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Products exported successfully'
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to export products'
        })
      }
    }

    // Computed
    const isAllSelected = computed(() => {
      return products.value.length > 0 && selectedProducts.value.length === products.value.length
    })

    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        selectedProducts.value = []
      } else {
        selectedProducts.value = products.value.map(product => product.id)
      }
    }

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value)
    }

    const getStockBadgeClass = (stock) => {
      if (stock > 10) return 'badge badge-success'
      if (stock > 0) return 'badge badge-warning'
      return 'badge badge-danger'
    }

    const getStatusBadgeClass = (status) => {
      return status === 'active' ? 'badge badge-success' : 'badge badge-danger'
    }

    // Lifecycle
    onMounted(() => {
      loadProducts()
      loadCategories()
    })

    return {
      products,
      categories,
      selectedProducts,
      filters,
      pagination,
      isAllSelected,
      handleSearch,
      handlePageChange,
      deleteProduct,
      deleteSelected,
      exportProducts,
      toggleSelectAll,
      formatCurrency,
      getStockBadgeClass,
      getStatusBadgeClass
    }
  }
}
</script>

<style scoped>
.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.badge {
  font-size: 0.9em;
  padding: 0.4em 0.6em;
}
</style>
