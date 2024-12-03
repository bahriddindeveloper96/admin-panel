<template>
  <div class="content-wrapper">
    <div class="content-header">
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
        <!-- Search and Filter -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <input
                    v-model="search"
                    type="text"
                    class="form-control"
                    placeholder="Search categories..."
                    @input="handleSearch"
                  >
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group">
                  <select
                    v-model="filters.status"
                    class="form-control"
                    @change="loadCategories"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group">
                  <select
                    v-model="filters.parent"
                    class="form-control"
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

        <!-- Categories Table -->
        <div class="card">
          <div class="card-body table-responsive p-0">
            <table class="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Parent</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="loading">
                  <tr>
                    <td colspan="7" class="text-center py-4">
                      <i class="fas fa-spinner fa-spin"></i> Loading...
                    </td>
                  </tr>
                </template>
                <template v-else-if="categories.length === 0">
                  <tr>
                    <td colspan="7" class="text-center py-4">
                      No categories found
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr v-for="category in categories" :key="category.id">
                    <td>{{ category.id }}</td>
                    <td>
                      <img
                        v-if="category.image_url"
                        :src="category.image_url"
                        class="img-thumbnail"
                        alt="Category image"
                        width="50"
                      >
                      <span v-else>No image</span>
                    </td>
                    <td>{{ category.name }}</td>
                    <td>
                      {{ category.parent?.name || 'Root Category' }}
                    </td>
                    <td>
                      {{ category.products_count || 0 }}
                    </td>
                    <td>
                      <span
                        class="badge"
                        :class="{
                          'badge-success': category.status === 'active',
                          'badge-danger': category.status === 'inactive'
                        }"
                      >
                        {{ category.status }}
                      </span>
                    </td>
                    <td>
                      <router-link
                        :to="`/categories/${category.id}/edit`"
                        class="btn btn-sm btn-info mr-1"
                      >
                        <i class="fas fa-edit"></i>
                      </router-link>
                      <button
                        class="btn btn-sm btn-danger"
                        @click="confirmDelete(category)"
                        :disabled="loading"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
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
.img-thumbnail {
  object-fit: cover;
  height: 50px;
}

.badge {
  text-transform: capitalize;
}
</style>
