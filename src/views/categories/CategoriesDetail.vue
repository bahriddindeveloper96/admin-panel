<template>
  <div class="category-detail">
    <div v-if="loading" class="loading-spinner text-center p-5">
      <i class="fas fa-spinner fa-spin"></i> {{ $t('common.loading') }}
    </div>
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <div v-else class="category-container">
      <!-- Header Section -->
      <div class="header-section">
        <h1>{{ category.name }}</h1>
        <div class="actions">
          <button class="btn btn-primary me-2" @click="editCategory">
            <i class="fas fa-edit"></i> {{ $t('common.edit') }}
          </button>
          <button class="btn btn-danger" @click="confirmDelete">
            <i class="fas fa-trash"></i> {{ $t('common.delete') }}
          </button>
        </div>

      <!-- Subcategories Section -->
      <div class="subcategories mt-4" v-if="category.children && category.children.length">
        <div class="card">
          <div class="card-header fw-bold">{{ $t('categories.subcategories') || 'Subcategories' }}</div>
          <div class="card-body">
            <ul class="list-group">
              <li v-for="child in category.children" :key="child.id" class="list-group-item d-flex justify-content-between align-items-center">
                <span class="clickable" @click="navigateToDetail(child.id)">{{ child.name || ('#' + child.id) }}</span>
                <span class="badge bg-light text-muted">#{{ child.id }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      </div>

      <!-- Main Info Section -->
      <div class="card">
        <div class="card-body">
          <div class="category-image mb-4 text-center" v-if="category.image">
            <img :src="category.image" :alt="category.name" class="img-fluid">
          </div>
          <div class="info-grid">
            <div class="info-item">
              <label>{{ $t('common.id') }}:</label>
              <span>{{ category.id }}</span>
            </div>
            <div class="info-item">
              <label>{{ $t('common.slug') }}:</label>
              <span>{{ category.slug }}</span>
            </div>
            <div class="info-item">
              <label>{{ $t('common.order') }}:</label>
              <span>{{ category.order }}</span>
            </div>
            <div class="info-item">
              <label>{{ $t('common.status.active') }}:</label>
              <span :class="['badge', category.active ? 'bg-success' : 'bg-danger']">
                {{ category.active ? $t('common.active') : $t('common.inactive') }}
              </span>
            </div>
            <div class="info-item">
              <label>{{ $t('common.featured') }}:</label>
              <span :class="['badge', category.featured ? 'bg-warning' : 'bg-secondary']">
                {{ category.featured ? $t('common.featured') : $t('common.notFeatured') }}
              </span>
            </div>
          </div>
          <div class="description mt-4">
            <label class="fw-bold">{{ $t('common.description') }}:</label>
            <p>{{ category.description }}</p>
          </div>
        </div>
      </div>

      <!-- Attribute Groups Section -->
      <div class="attribute-groups mt-4" v-if="category.attributes && category.attributes.length">
        <div class="card">
          <div class="card-header fw-bold">{{ $t('categories.attributes') || 'Attributes' }}</div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>{{ $t('common.name') }}</th>
                    <th>{{ $t('common.type') }}</th>
                    <th>{{ $t('common.required') }}</th>
                    <th>{{ $t('common.filterable') }}</th>
                    <th>Options</th>
                    <th>Validation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="attr in category.attributes" :key="attr.id">
                    <td>{{ attr.name }}</td>
                    <td>{{ attr.type }}</td>
                    <td>
                      <span :class="['badge', attr.is_required ? 'bg-danger' : 'bg-secondary']">
                        {{ attr.is_required ? ($t('common.yes') || 'Yes') : ($t('common.no') || 'No') }}
                      </span>
                    </td>
                    <td>
                      <span :class="['badge', attr.is_filterable ? 'bg-success' : 'bg-secondary']">
                        {{ attr.is_filterable ? ($t('common.yes') || 'Yes') : ($t('common.no') || 'No') }}
                      </span>
                    </td>
                    <td>
                      <span v-if="parsedOptions(attr).length">{{ parsedOptions(attr).join(', ') }}</span>
                      <span v-else>-</span>
                    </td>
                    <td>
                      <code v-if="attr.validation_rules">{{ prettyValidation(attr.validation_rules) }}</code>
                      <span v-else>-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

export default {
  name: 'CategoriesDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const category = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const fetchCategory = async () => {
      try {
        loading.value = true
        const response = await axios.get(`/api/admin/categories/${route.params.id}`)
        category.value = response.data?.data ?? response.data
      } catch (err) {
        error.value = err.response?.data?.message || 'Error loading category'
        showError(error.value)
      } finally {
        loading.value = false
      }
    }

    const editCategory = () => {
      router.push(`/categories/${route.params.id}/edit`)
    }

    const navigateToDetail = (id) => {
      router.push({ name: 'category-details', params: { id: id.toString() } })
    }

    const confirmDelete = () => {
      const message = t('common.confirm_delete') || 'Are you sure you want to delete?'
      if (window.confirm(message)) deleteCategory()
    }

    const deleteCategory = async () => {
      try {
        await axios.delete(`/api/admin/categories/${route.params.id}`)
        showSuccess(t('common.deleted_successfully') || 'Deleted successfully')
        router.push('/categories')
      } catch (err) {
        showError(err.response?.data?.message || (t('common.delete_failed') || 'Error deleting category'))
      }
    }

    const showSuccess = (message) => {
      // You can implement your own success notification here
      alert(message)
    }

    const showError = (message) => {
      // You can implement your own error notification here
      alert(message)
    }

    const parsedOptions = (attr) => {
      // options may be array or JSON string
      if (!attr || attr.options == null) return []
      if (Array.isArray(attr.options)) return attr.options
      if (typeof attr.options === 'string') {
        try { const arr = JSON.parse(attr.options); return Array.isArray(arr) ? arr : [] } catch { return [] }
      }
      return []
    }

    const prettyValidation = (rules) => {
      try { return JSON.stringify(rules) } catch { return '' }
    }

    onMounted(fetchCategory)

    return {
      category,
      loading,
      error,
      editCategory,
      navigateToDetail,
      confirmDelete,
      parsedOptions,
      prettyValidation
    }
  }
}
</script>

<style scoped>
.category-detail {
  padding: 20px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-section h1 {
  margin: 0;
  font-size: 24px;
}

.category-image img {
  max-width: 300px;
  max-height: 300px;
  object-fit: contain;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item label {
  font-weight: bold;
  color: #666;
}

.description label {
  color: #666;
}

.description p {
  margin: 0;
  line-height: 1.5;
}

.attribute-groups {
  margin-top: 20px;
}

.loading-spinner {
  font-size: 18px;
}

.loading-spinner i {
  margin-right: 10px;
}
</style>
