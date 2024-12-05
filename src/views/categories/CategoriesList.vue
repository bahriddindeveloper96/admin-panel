<template>
  <div class="content">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row align-items-center mb-4">
          <div class="col-sm-6">
            <h1 class="m-0 text-gradient">Categories</h1>
          </div>
          <div class="col-sm-6">
            <div class="float-sm-right">
              <router-link to="/categories/create" class="btn btn-primary btn-modern">
                <i class="fas fa-plus-circle me-2"></i> Add Category
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="container-fluid">
        <!-- Search and Filter -->
        <div class="card search-card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <div class="search-box">
                  <i class="fas fa-search search-icon"></i>
                  <input
                    v-model="search"
                    type="text"
                    class="form-control modern-input"
                    placeholder="Search categories..."
                    @input="handleSearch"
                  >
                </div>
              </div>
              <div class="col-md-3">
                <div class="select-wrapper">
                  <select
                    v-model="filters.status"
                    class="form-select modern-select"
                    @change="loadCategories"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div class="col-md-3">
                <div class="select-wrapper">
                  <select
                    v-model="filters.parent"
                    class="form-select modern-select"
                    @change="loadCategories"
                  >
                    <option value="">All Categories</option>
                    <option value="root">Root Categories</option>
                    <option
                      v-for="category in parentCategories"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Categories Grid -->
        <div class="categories-grid">
          <template v-if="loading">
            <div class="text-center py-5">
              <div class="spinner">
                <i class="fas fa-spinner fa-spin fa-2x"></i>
                <p class="mt-2">Loading categories...</p>
              </div>
            </div>
          </template>
          <template v-else-if="categories.length === 0">
            <div class="empty-state">
              <i class="fas fa-folder-open fa-3x mb-3"></i>
              <h3>No Categories Found</h3>
              <p>Start by adding your first category</p>
            </div>
          </template>
          <template v-else>
            <div class="row g-4">
              <div v-for="category in categories" :key="category.id" class="col-md-4 col-lg-3">
                <div class="category-card">
                  <div class="category-image">
                    <img
                      v-if="category.image_url"
                      :src="category.image_url"
                      :alt="category.name"
                      class="img-fluid"
                    >
                    <div v-else class="no-image">
                      <i class="fas fa-image"></i>
                    </div>
                  </div>
                  <div class="category-content">
                    <h3 class="category-name">{{ category.name }}</h3>
                    <p class="category-parent">{{ category.parent?.name || 'Root Category' }}</p>
                    <div class="category-meta">
                      <span class="products-count">
                        <i class="fas fa-box me-1"></i>
                        {{ category.products_count || 0 }} Products
                      </span>
                      <span
                        class="status-badge"
                        :class="{
                          'active': category.status === 'active',
                          'inactive': category.status === 'inactive'
                        }"
                      >
                        {{ category.status }}
                      </span>
                    </div>
                    <div class="category-actions">
                      <router-link
                        :to="`/categories/${category.id}/edit`"
                        class="btn btn-icon btn-edit"
                        title="Edit"
                      >
                        <i class="fas fa-edit"></i>
                      </router-link>
                      <button
                        class="btn btn-icon btn-delete"
                        @click="confirmDelete(category)"
                        :disabled="loading"
                        title="Delete"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'
import debounce from 'lodash/debounce'

export default {
  name: 'CategoriesList',

  setup() {
    const store = useStore()
    const loading = ref(false)
    const categories = ref([])
    const parentCategories = ref([])
    const search = ref('')
    const filters = ref({
      status: '',
      parent: ''
    })

    // Methods
    const loadCategories = async () => {
      try {
        loading.value = true
        const response = await store.dispatch('categories/fetchCategories')
        categories.value = response

        // Extract parent categories for filter
        parentCategories.value = response.filter(cat => !cat.parent_id)
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

    const confirmDelete = (category) => {
      Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete the category "${category.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteCategory(category.id)
        }
      })
    }

    const deleteCategory = async (id) => {
      try {
        loading.value = true
        await store.dispatch('categories/deleteCategory', id)
        
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Category deleted successfully'
        })

        loadCategories()
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete category'
        })
      } finally {
        loading.value = false
      }
    }

    // Lifecycle hooks
    onMounted(() => {
      loadCategories()
    })

    return {
      categories,
      parentCategories,
      loading,
      search,
      filters,
      handleSearch,
      confirmDelete
    }
  }
}
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(45deg, #2196F3, #00BCD4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.btn-modern {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.15);
}

.search-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9e9e9e;
}

.modern-input {
  padding-left: 40px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.modern-input:focus {
  border-color: #2196F3;
  box-shadow: 0 0 0 3px rgba(33,150,243,0.1);
}

.modern-select {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.modern-select:focus {
  border-color: #2196F3;
  box-shadow: 0 0 0 3px rgba(33,150,243,0.1);
}

.categories-grid {
  margin-top: 2rem;
}

.category-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0,0,0,0.1);
}

.category-image {
  height: 160px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  color: #bdbdbd;
  font-size: 2rem;
}

.category-content {
  padding: 1.2rem;
}

.category-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: #333;
}

.category-parent {
  font-size: 0.9rem;
  color: #757575;
  margin-bottom: 1rem;
}

.category-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.products-count {
  font-size: 0.9rem;
  color: #616161;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.active {
  background: rgba(76,175,80,0.1);
  color: #4CAF50;
}

.status-badge.inactive {
  background: rgba(244,67,54,0.1);
  color: #F44336;
}

.category-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-edit {
  background: rgba(33,150,243,0.1);
  color: #2196F3;
}

.btn-edit:hover {
  background: #2196F3;
  color: white;
}

.btn-delete {
  background: rgba(244,67,54,0.1);
  color: #F44336;
}

.btn-delete:hover {
  background: #F44336;
  color: white;
}

.spinner {
  color: #2196F3;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #9e9e9e;
}
</style>
