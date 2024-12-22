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
      <div class="attribute-groups mt-4">
        <div class="accordion" id="attributeGroups">
          <div class="accordion-item" v-for="(group, index) in category.attribute_groups" :key="group.id">
            <h2 class="accordion-header" :id="'heading' + group.id">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" 
                      :data-bs-target="'#collapse' + group.id" 
                      :aria-expanded="index === 0" 
                      :aria-controls="'collapse' + group.id">
                {{ group.name }}
              </button>
            </h2>
            <div :id="'collapse' + group.id" class="accordion-collapse collapse" 
                 :class="{ 'show': index === 0 }"
                 :aria-labelledby="'heading' + group.id" 
                 data-bs-parent="#attributeGroups">
              <div class="accordion-body">
                <div class="table-responsive">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th>{{ $t('common.name') }}</th>
                        <th>{{ $t('common.type') }}</th>
                        <th>{{ $t('common.required') }}</th>
                        <th>{{ $t('common.filterable') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="attr in group.attributes" :key="attr.id">
                        <td>{{ getAttributeTranslation(attr) }}</td>
                        <td>{{ attr.type }}</td>
                        <td>
                          <span :class="['badge', attr.required ? 'bg-danger' : 'bg-secondary']">
                            {{ attr.required ? $t('common.yes') : $t('common.no') }}
                          </span>
                        </td>
                        <td>
                          <span :class="['badge', attr.filterable ? 'bg-success' : 'bg-secondary']">
                            {{ attr.filterable ? $t('common.yes') : $t('common.no') }}
                          </span>
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
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'CategoriesDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const category = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const fetchCategory = async () => {
      try {
        loading.value = true
        const response = await axios.get(`/admin/categories/${route.params.id}`)
        category.value = response.data
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

    const confirmDelete = () => {
      if (confirm($t('common.confirm_delete'))) {
        deleteCategory()
      }
    }

    const deleteCategory = async () => {
      try {
        await axios.delete(`/admin/categories/${route.params.id}`)
        showSuccess($t('common.deleted_successfully'))
        router.push('/categories')
      } catch (err) {
        showError(err.response?.data?.message || 'Error deleting category')
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

    const getAttributeTranslation = (attribute) => {
      const locale = 'uz' // You should get this from your i18n setup
      const translation = attribute.translations.find(t => t.locale === locale)
      return translation ? translation.name : attribute.name
    }

    onMounted(fetchCategory)

    return {
      category,
      loading,
      error,
      editCategory,
      confirmDelete,
      getAttributeTranslation
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
