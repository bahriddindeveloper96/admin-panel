<template>
  <div class="categories-wrapper">
    <!-- Header Section -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>{{ $t('categories.title') }}</h1>
          </div>
          <div class="col-sm-6 text-right">
            <button class="btn btn-primary" @click="navigateToCreate">
              <i class="fas fa-plus"></i> {{ $t('common.add') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="content-main">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        {{ error }}
      </div>

      <!-- Categories List -->
      <div v-else class="categories-container">
        <div v-for="category in categories" :key="category.id" class="category-item">
          <!-- Main Category Info -->
          <div class="category-main">
            <!-- <div class="category-image">
              <img :src="category.image" :alt="getTranslationName(category)">
            </div> -->
            <div class="category-info">
              <div class="category-header">
                <h2 @click="navigateToDetail(category.id)" class="category-name">{{ getTranslationName(category) }}</h2>
                <div class="category-status">
                  <span :class="['status-badge', category.active ? 'active' : 'inactive']">
                    {{ category.active ? $t('common.active') : $t('common.inactive') }}
                  </span>
                  <span v-if="category.featured" class="featured-badge">
                    {{ $t('common.featured') }}
                  </span>
                </div>
              </div>
              <p class="category-description">{{ getTranslationDescription(category) }}</p>
              
              <!-- Category Details -->
              <div class="category-details">
                <div class="detail-item">
                  <span class="detail-label">ID:</span>
                  <span class="detail-value">#{{ category.id }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">{{ $t('common.slug') }}:</span>
                  <span class="detail-value">{{ category.slug }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">{{ $t('common.order') }}:</span>
                  <span class="detail-value">{{ category.order }}</span>
                </div>
              </div>

              <!-- Attributes -->
              <div v-if="category.attributes?.length" class="attributes">
                <h4 class="attributes-title">Attributes</h4>
                <ul class="attr-list">
                  <li v-for="attr in category.attributes" :key="attr.id" class="attr-item">
                    <strong class="attr-name">{{ attr.name }}</strong>
                    <span class="attr-type">({{ attr.type }})</span>
                    <span v-if="Array.isArray(attr.options) && attr.options.length" class="options-count">
                      - {{ attr.options.length }} options
                    </span>
                  </li>
                </ul>
              </div>

              <!-- Translations -->
              <div v-if="category.translations?.length" class="translations">
                <div v-for="translation in category.translations" 
                     :key="translation.id" 
                     class="translation-item">
                  <span class="lang-badge" :class="translation.locale">
                    {{ translation.locale.toUpperCase() }}
                  </span>
                  <span class="translation-name">{{ translation.name }}</span>
                </div>
              </div>

              <!-- Timestamps -->
              <div class="timestamps">
                <span class="timestamp">
                  <i class="far fa-calendar"></i>
                  {{ formatDate(category.created_at) }}
                </span>
                <span class="timestamp">
                  <i class="fas fa-pencil-alt"></i>
                  {{ formatDate(category.updated_at) }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="category-actions">
              <button class="btn-edit">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn-delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <!-- Subcategories -->
          <div v-if="category.children?.length" class="subcategories">
            <h3 class="subcategories-title">{{ $t('categories.subcategories') }}</h3>
            <div class="subcategories-list">
              <div v-for="child in category.children" 
                   :key="child.id" 
                   class="subcategory-item">
                <!-- <div class="subcategory-image">
                  <img :src="child.image" :alt="getTranslationName(child)">
                </div> -->
                <div class="subcategory-info">
                  <div class="subcategory-header">
                    <h4>{{ getTranslationName(child) }}</h4>
                    <span class="subcategory-id">#{{ child.id }}</span>
                  </div>
                  <p>{{ getTranslationDescription(child) }}</p>
                  <div class="subcategory-meta">
                    <span :class="['status-badge', child.active ? 'active' : 'inactive']">
                      {{ child.active ? $t('common.active') : $t('common.inactive') }}
                    </span>
                    <span class="order-badge">
                      {{ $t('common.order') }}: {{ child.order }}
                    </span>
                  </div>
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
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'CategoriesList',
  
  setup() {
    const store = useStore()
    const { t, locale } = useI18n()
    const router = useRouter()

    const categories = computed(() => store.getters['categories/getLocalizedCategories'])
    const loading = computed(() => store.getters['categories/isLoading'])
    const error = computed(() => store.getters['categories/getError'])

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleString(locale.value, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getTranslationName = (category) => {
      // After store localization, prefer direct fields
      if (category?.name) return category.name
      if (!category?.translations?.length) return ''
      return category.translations.find(t => t.locale === locale.value)?.name ||
             category.translations.find(t => t.locale === 'en')?.name ||
             category.translations[0]?.name || ''
    }

    const getTranslationDescription = (category) => {
      if (category?.description) return category.description
      if (!category?.translations?.length) return ''
      return category.translations.find(t => t.locale === locale.value)?.description ||
             category.translations.find(t => t.locale === 'en')?.description ||
             category.translations[0]?.description || ''
    }

    const navigateToDetail = (id) => {
      router.push({ name: 'category-details', params: { id: id.toString() } })
    }

    const navigateToCreate = () => {
      router.push({ name: 'category-create' })
    }

    onMounted(() => {
      store.dispatch('categories/fetchCategories')
    })

    return {
      categories,
      loading,
      error,
      formatDate,
      getTranslationName,
      getTranslationDescription,
      navigateToDetail,
      navigateToCreate,
      t
    }
  }
})
</script>

<style scoped>
.categories-wrapper {
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.content-header {
  padding: 15px;
  background-color: #fff;
  margin-bottom: 20px;
}

.text-right {
  text-align: right;
}

.content-main {
  padding: 20px;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  text-align: center;
  color: #e74c3c;
  padding: 20px;
}

.category-item {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

.category-main {
  display: flex;
  padding: 20px;
  gap: 20px;
}

.category-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.category-info {
  flex: 1;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.category-header h2 {
  margin: 0;
  font-size: 20px;
  color: #2c3e50;
}

.category-status {
  display: flex;
  gap: 8px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.status-badge.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.inactive {
  background: #ffebee;
  color: #c62828;
}

.featured-badge {
  background: #fff3e0;
  color: #f57c00;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.category-description {
  color: #666;
  margin: 0 0 15px 0;
  font-size: 14px;
  line-height: 1.5;
}

.category-details {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-label {
  color: #666;
  font-size: 14px;
}

.detail-value {
  color: #2c3e50;
  font-weight: 500;
  font-size: 14px;
}

.translations {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.translation-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  padding: 6px 12px;
  border-radius: 6px;
}

.lang-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.lang-badge.en { background: #e3f2fd; color: #1976d2; }
.lang-badge.ru { background: #f3e5f5; color: #7b1fa2; }
.lang-badge.uz { background: #e8f5e9; color: #2e7d32; }

.translation-name {
  font-size: 14px;
  color: #2c3e50;
}

.timestamps {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 13px;
}

.timestamp {
  display: flex;
  align-items: center;
  gap: 6px;
}

.category-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-edit, .btn-delete {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s;
}

.btn-edit {
  background: #e3f2fd;
  color: #1976d2;
}

.btn-delete {
  background: #ffebee;
  color: #c62828;
}

.btn-edit:hover, .btn-delete:hover {
  opacity: 0.8;
}

.subcategories {
  background: #f8f9fa;
  padding: 20px;
  border-top: 1px solid #eee;
}

.subcategories-title {
  font-size: 16px;
  color: #2c3e50;
  margin: 0 0 15px 0;
}

.subcategories-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.subcategory-item {
  background: white;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  gap: 15px;
}

.subcategory-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.subcategory-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.subcategory-info {
  flex: 1;
}

.subcategory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.subcategory-header h4 {
  margin: 0;
  font-size: 16px;
  color: #2c3e50;
}

.subcategory-id {
  background: #eee;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
}

.subcategory-meta {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.order-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
}

.category-name {
  cursor: pointer;
  color: #409EFF;
  transition: color 0.3s;
}

.category-name:hover {
  color: #66b1ff;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .category-main {
    flex-direction: column;
  }

  .category-image {
    width: 100%;
    height: 200px;
  }

  .category-header {
    flex-direction: column;
    gap: 10px;
  }

  .category-details {
    flex-direction: column;
    gap: 10px;
  }

  .category-actions {
    flex-direction: row;
    justify-content: flex-end;
  }

  .subcategories-list {
    grid-template-columns: 1fr;
  }
}
</style>
