<template>
  <div class="content">
    <div class="content">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Categories</h1>
          </div>
          <div class="col-sm-6">
            <div class="float-sm-right">
              <router-link to="/categories/create" class="btn btn-primary">
                <i class="fas fa-plus"></i> Add Category
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
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex gap-3">
                <button 
                  class="btn btn-danger d-flex align-items-center gap-2" 
                  :disabled="!selectedCategories.length || loading"
                  @click="deleteSelected"
                >
                  <i class="fas fa-trash"></i>
                  <span>Delete Selected</span>
                </button>
                <button 
                  class="btn btn-success d-flex align-items-center gap-2" 
                  :disabled="loading"
                  @click="exportCategories"
                >
                  <i class="fas fa-file-export"></i>
                  <span>Export</span>
                </button>
              </div>
              <div class="search-box">
                <i class="fas fa-search search-icon"></i>
                <input
                  type="text"
                  class="form-control search-input"
                  placeholder="Search categories..."
                  v-model="search"
                  @input="handleSearch"
                  :disabled="loading"
                >
              </div>
            </div>
          </div>

          <div class="card-body table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th class="text-center">
                    <input
                      type="checkbox"
                      class="custom-checkbox"
                      :checked="isAllSelected"
                      @change="toggleSelectAll"
                      :disabled="loading"
                    >
                  </th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Parent Category</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="loading">
                  <tr>
                    <td colspan="7">
                      <div class="d-flex justify-content-center align-items-center py-5">
                        <div class="spinner-border" role="status">
                          <span class="sr-only">Loading...</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
                <template v-else-if="!categories.length">
                  <tr>
                    <td colspan="7">
                      <div class="empty-state">
                        <i class="fas fa-folder-open"></i>
                        <p class="mb-0">No categories found</p>
                      </div>
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr v-for="category in categories" :key="category.id">
                    <td class="text-center">
                      <input
                        type="checkbox"
                        class="custom-checkbox"
                        :value="category.id"
                        v-model="selectedCategories"
                      >
                    </td>
                    <td>
                      <img
                        v-if="category.image_url"
                        :src="category.image_url"
                        :alt="category.name"
                        class="category-image"
                      >
                      <div v-else class="no-image">
                        <i class="fas fa-image"></i>
                      </div>
                    </td>
                    <td>
                      <div class="fw-medium">{{ category.name }}</div>
                      <small class="text-muted">ID: {{ category.id }}</small>
                    </td>
                    <td>
                      <span class="parent-badge">{{ category.parent?.name || 'Root Category' }}</span>
                    </td>
                    <td>
                      <span class="products-badge">{{ category.products_count || 0 }}</span>
                    </td>
                    <td>
                      <span :class="getStatusBadgeClass(category.status)">
                        {{ category.status }}
                      </span>
                    </td>
                    <td>
                      <div class="d-flex justify-content-center gap-2">
                        <router-link
                          :to="`/categories/${category.id}/edit`"
                          class="btn btn-sm btn-info"
                          title="Edit"
                        >
                          <i class="fas fa-edit"></i>
                        </router-link>
                        <button
                          class="btn btn-sm btn-danger"
                          @click="confirmDelete(category)"
                          :disabled="loading"
                          title="Delete"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <div class="card-footer clearfix" v-if="pagination">
            <pagination
              :total="pagination.total"
              :per-page="pagination.per_page"
              :current-page="pagination.current_page"
              :links="pagination.links"
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
import Swal from 'sweetalert2'
import debounce from 'lodash/debounce'
import Pagination from '@/components/Pagination.vue'

export default {
  name: 'CategoriesList',
  components: { Pagination },
  
  setup() {
    const store = useStore()
    const loading = ref(false)
    const categories = ref([])
    const selectedCategories = ref([])
    const search = ref('')
    const pagination = ref(null)

    const isAllSelected = computed(() => {
      return categories.value.length > 0 && selectedCategories.value.length === categories.value.length
    })

    const getStatusBadgeClass = (status) => {
      return {
        'badge': true,
        'bg-success': status === 'active',
        'bg-danger': status === 'inactive'
      }
    }

    const loadCategories = async () => {
      try {
        loading.value = true
        const response = await store.dispatch('categories/fetchCategories', {
          search: search.value
        })
        categories.value = response.data || response
        if (response.meta) {
          pagination.value = {
            total: response.meta.total,
            per_page: response.meta.per_page,
            current_page: response.meta.current_page,
            links: response.meta.links
          }
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load categories'
        })
      } finally {
        loading.value = false
      }
    }

    const handleSearch = debounce(() => {
      loadCategories()
    }, 300)

    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        selectedCategories.value = []
      } else {
        selectedCategories.value = categories.value.map(cat => cat.id)
      }
    }

    const deleteSelected = async () => {
      if (!selectedCategories.value.length) return

      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete ${selectedCategories.value.length} selected categories?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete them',
        cancelButtonText: 'Cancel'
      })

      if (result.isConfirmed) {
        try {
          await store.dispatch('categories/deleteCategories', selectedCategories.value)
          selectedCategories.value = []
          await loadCategories()
          
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Categories deleted successfully'
          })
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete categories'
          })
        }
      }
    }

    const confirmDelete = async (category) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete the category "${category.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel'
      })

      if (result.isConfirmed) {
        try {
          await store.dispatch('categories/deleteCategory', category.id)
          await loadCategories()
          
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Category deleted successfully'
          })
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete category'
          })
        }
      }
    }

    const exportCategories = () => {
      // TODO: Implement export functionality
      Swal.fire({
        icon: 'info',
        title: 'Coming Soon',
        text: 'Export functionality will be available soon'
      })
    }

    const handlePageChange = (page) => {
      // TODO: Implement pagination
      loadCategories()
    }

    onMounted(() => {
      loadCategories()
    })

    return {
      loading,
      categories,
      selectedCategories,
      search,
      pagination,
      isAllSelected,
      getStatusBadgeClass,
      handleSearch,
      toggleSelectAll,
      deleteSelected,
      confirmDelete,
      exportCategories,
      handlePageChange
    }
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 0 1px rgba(0,0,0,.125), 0 1px 3px rgba(0,0,0,.2);
  margin-bottom: 1rem;
}

.card-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(0,0,0,.125);
}

.search-box {
  position: relative;
  width: 300px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-input {
  padding-left: 35px;
}

.category-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.no-image {
  width: 50px;
  height: 50px;
  background-color: #f8f9fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.parent-badge {
  background-color: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
}

.products-badge {
  background-color: #e3f2fd;
  color: #0d6efd;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
}

.badge {
  padding: 6px 10px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.875rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 1rem;
}
</style>
