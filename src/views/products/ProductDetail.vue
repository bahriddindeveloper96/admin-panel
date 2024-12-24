<template>
  <div class="product-detail">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>{{ product.name }}</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item">
                <router-link to="/products">{{ $t('products.products') }}</router-link>
              </li>
              <li class="breadcrumb-item active">{{ product.name }}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <!-- Product Info -->
          <div class="col-md-8">
            <div class="card">
              <div class="card-body">
                <!-- Basic Info -->
                <div class="basic-info mb-4">
                  <h5 class="card-title mb-3">
                    <i class="fas fa-info-circle text-primary me-2"></i>
                    {{ $t('products.basic_info') }}
                  </h5>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="info-item mb-3">
                        <label class="text-muted">{{ $t('common.name') }}:</label>
                        <div class="fw-bold">{{ product.name }}</div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-item mb-3">
                        <label class="text-muted">{{ $t('products.category') }}:</label>
                        <div class="fw-bold">{{ product.category?.name }}</div>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="info-item mb-3">
                        <label class="text-muted">{{ $t('common.description') }}:</label>
                        <div>{{ product.description }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Variants -->
                <div class="variants-info">
                  <h5 class="card-title mb-3">
                    <i class="fas fa-cubes text-primary me-2"></i>
                    {{ $t('products.variants') }}
                  </h5>
                  <div class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>SKU</th>
                          <th>{{ $t('products.price') }}</th>
                          <th>{{ $t('products.stock') }}</th>
                          <th>{{ $t('products.attributes') }}</th>
                          <th>{{ $t('common.status') }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="variant in product.variants" :key="variant.id">
                          <td>{{ variant.sku }}</td>
                          <td>{{ formatPrice(variant.price) }}</td>
                          <td>{{ variant.stock }}</td>
                          <td>
                            <span 
                              v-for="(value, index) in variant.attribute_values" 
                              :key="index"
                              class="badge bg-info me-1"
                            >
                              {{ value }}
                            </span>
                          </td>
                          <td>
                            <span 
                              class="badge"
                              :class="variant.active ? 'bg-success' : 'bg-danger'"
                            >
                              {{ variant.active ? $t('common.active') : $t('common.inactive') }}
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

          <!-- Sidebar -->
          <div class="col-md-4">
            <!-- Status Card -->
            <div class="card mb-4">
              <div class="card-body">
                <h5 class="card-title mb-3">
                  <i class="fas fa-chart-line text-primary me-2"></i>
                  {{ $t('common.status') }}
                </h5>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span>{{ $t('common.status') }}:</span>
                  <span 
                    class="badge"
                    :class="product.active ? 'bg-success' : 'bg-danger'"
                  >
                    {{ product.active ? $t('common.active') : $t('common.inactive') }}
                  </span>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span>{{ $t('products.featured') }}:</span>
                  <span 
                    class="badge"
                    :class="product.featured ? 'bg-warning' : 'bg-secondary'"
                  >
                    {{ product.featured ? $t('common.yes') : $t('common.no') }}
                  </span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span>{{ $t('products.rating') }}:</span>
                  <div class="rating">
                    <i class="fas fa-star text-warning"></i>
                    <span class="ms-1">{{ product.average_rating }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Images Card -->
            <div class="card">
              <div class="card-body">
                <h5 class="card-title mb-3">
                  <i class="fas fa-images text-primary me-2"></i>
                  {{ $t('products.images') }}
                </h5>
                <div class="row g-2">
                  <div 
                    v-for="(image, index) in product.images" 
                    :key="index"
                    class="col-6"
                  >
                    <img 
                      :src="image.image"
                      class="img-fluid rounded"
                      :alt="product.name"
                    >
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import axios from 'axios'

// Create axios instance with base URL and auth header
const createApi = (token) => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export default {
  name: 'ProductDetail',
  
  setup() {
    const route = useRoute()
    const store = useStore()
    const { t } = useI18n()
    const product = ref({})
    const loading = ref(true)

    // Get API instance with current token
    const api = createApi(store.state.token)

    // Format price with currency
    const formatPrice = (price) => {
      return new Intl.NumberFormat('uz-UZ', {
        style: 'currency',
        currency: 'UZS'
      }).format(price)
    }

    // Show notification helper
    const showNotification = (message, isError = false) => {
      const alertClass = isError ? 'alert-danger' : 'alert-success'
      const alertDiv = document.createElement('div')
      alertDiv.className = `alert ${alertClass} alert-dismissible fade show`
      alertDiv.role = 'alert'
      alertDiv.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      `
      document.querySelector('.content').insertAdjacentElement('afterbegin', alertDiv)
      setTimeout(() => alertDiv.remove(), 5000)
    }

    // Fetch product details
    const fetchProduct = async () => {
      try {
        loading.value = true
        const response = await api.get(`/admin/products/${route.params.id}`)
        if (response.data && response.data.data) {
          product.value = response.data.data
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        showNotification(t('common.error_loading'), true)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchProduct()
    })

    return {
      product,
      loading,
      formatPrice,
      t
    }
  }
}
</script>

<style scoped>
.product-detail {
  /* Light theme colors */
  --primary-color: #4f46e5;
  --primary-hover: #4338ca;
  --secondary-color: #64748b;
  --danger-color: #ef4444;
  --success-color: #22c55e;
  --warning-color: #f59e0b;
  --info-color: #3b82f6;
  --surface-color: #ffffff;
  --border-color: #e2e8f0;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --background-color: #f1f5f9;
  --card-background: #ffffff;
  --table-header-bg: #f8fafc;
  --status-item-bg: #f8fafc;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

/* Base styles */
.product-detail {
  background-color: var(--background-color);
  color: var(--text-primary);
  min-height: 100vh;
}

/* Header */
.product-detail .content-header {
  background: var(--card-background);
  padding: 1.5rem 0;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.product-detail .content-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.product-detail .content-header .btn-link {
  transition: all 0.2s;
  color: var(--text-secondary);
}

.product-detail .content-header .btn-link:hover {
  transform: translateX(-2px);
  color: var(--primary-color);
}

.product-detail .content-header .btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all 0.2s;
}

.product-detail .content-header .btn-primary {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.product-detail .content-header .btn-primary:hover {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
  transform: translateY(-1px);
}

.product-detail .content-header .btn-outline-danger {
  color: var(--danger-color);
  border-color: var(--danger-color);
  background: transparent;
}

.product-detail .content-header .btn-outline-danger:hover {
  background: var(--danger-color);
  color: white;
  transform: translateY(-1px);
}

.product-detail .content-header .btn i {
  font-size: 0.875rem;
}

/* Cards */
.product-detail .card {
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all 0.3s;
  margin-bottom: 1.5rem;
}

.product-detail .card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.product-detail .card-header {
  padding: 1.25rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--card-background);
}

.product-detail .card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.product-detail .card-title i {
  opacity: 0.9;
  color: var(--primary-color);
}

.product-detail .card-body {
  padding: 1.25rem;
  background: var(--card-background);
}

/* Gallery */
.product-detail .product-gallery .main-image {
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  background: var(--card-background);
}

.product-detail .product-gallery .main-image img {
  transition: transform 0.3s;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-detail .product-gallery .main-image img:hover {
  transform: scale(1.02);
}

.product-detail .product-gallery .thumbnail {
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  opacity: 0.7;
  transition: all 0.2s;
  background: var(--card-background);
  cursor: pointer;
}

.product-detail .product-gallery .thumbnail:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.product-detail .product-gallery .thumbnail.active {
  opacity: 1;
  border: 2px solid var(--primary-color);
}

/* Info Groups */
.product-detail .info-group {
  margin-bottom: 1.5rem;
}

.product-detail .info-group label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  display: block;
}

.product-detail .info-group .fw-medium {
  color: var(--text-primary);
  font-weight: 500;
}

/* Table */
.product-detail .table {
  background: var(--card-background);
  margin-bottom: 0;
}

.product-detail .table th {
  background: var(--table-header-bg);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  padding: 1rem;
  border-bottom: 2px solid var(--border-color);
}

.product-detail .table td {
  color: var(--text-primary);
  font-size: 0.875rem;
  padding: 1rem;
  vertical-align: middle;
  border-bottom: 1px solid var(--border-color);
}

.product-detail .table .badge {
  padding: 0.5em 0.75em;
  font-weight: 500;
  letter-spacing: 0.025em;
  border-radius: var(--radius-md);
}

.product-detail .table .badge.bg-success {
  background: var(--success-color) !important;
  color: white;
}

.product-detail .table .badge.bg-danger {
  background: var(--danger-color) !important;
  color: white;
}

.product-detail .table .badge.bg-warning {
  background: var(--warning-color) !important;
  color: white;
}

.product-detail .table .badge.bg-info {
  background: var(--info-color) !important;
  color: white;
}

/* Status and Info Items */
.product-detail .status-item,
.product-detail .info-item {
  padding: 1rem;
  background: var(--status-item-bg);
  border-radius: var(--radius-md);
  margin-bottom: 0.75rem;
}

.product-detail .status-item .label,
.product-detail .info-item .label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.product-detail .status-item .badge {
  font-weight: 500;
  padding: 0.5em 0.75em;
  border-radius: var(--radius-md);
}

.product-detail .status-item .rating,
.product-detail .status-item .favorites {
  color: var(--text-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
}

.product-detail .status-item .rating i,
.product-detail .status-item .favorites i {
  font-size: 0.875rem;
  margin-right: 0.5rem;
}

.product-detail .status-item .rating i {
  color: var(--warning-color);
}

.product-detail .status-item .favorites i {
  color: var(--danger-color);
}

/* Loading Spinner */
.product-detail .spinner-border {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--primary-color);
}

/* Responsive */
@media (max-width: 768px) {
  .product-detail .content-header {
    padding: 1rem 0;
  }
  
  .product-detail .content-header h1 {
    font-size: 1.25rem;
  }

  .product-detail .card {
    margin-bottom: 1rem;
  }

  .product-detail .card-header {
    padding: 1rem;
  }

  .product-detail .card-body {
    padding: 1rem;
  }

  .product-detail .product-gallery .main-image {
    height: 300px;
  }

  .product-detail .product-gallery .thumbnail {
    width: 60px;
    height: 60px;
  }
}
</style>
