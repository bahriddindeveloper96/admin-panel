<template>
  <div class="product-form">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>{{ $t('products.create_product') }}</h1>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="container-fluid">
        <div class="card">
          <div class="card-body">
            <!-- Step Indicator -->
            <div class="steps mb-4">
              <div 
                v-for="(step, index) in steps" 
                :key="index"
                class="step"
                :class="{ 
                  'active': currentStep === index + 1,
                  'completed': currentStep > index + 1
                }"
              >
                <div class="step-icon">
                  <i :class="step.icon"></i>
                </div>
                <div class="step-label">{{ $t(step.label) }}</div>
              </div>
            </div>

            <!-- Step 1: Basic Information -->
            <div v-if="currentStep === 1" class="animated fadeIn">
              <form @submit.prevent="submitBasicInfo">
                <!-- Category Selection -->
                <div class="form-group mb-4">
                  <label class="form-label d-flex align-items-center mb-2">
                    <i class="fas fa-folder text-primary me-2"></i>
                    {{ $t('products.category') }}
                  </label>
                  <div class="select-wrapper">
                    <select 
                      v-model="form.category_id" 
                      class="form-control custom-select"
                      required
                      @change="handleCategoryChange"
                    >
                      <option value="">{{ $t('products.select_category') }}</option>
                      <option 
                        v-for="category in categories" 
                        :key="category.id" 
                        :value="category.id"
                      >
                        {{ getTranslationName(category) }}
                      </option>
                    </select>
                    <div class="select-icon">
                      <i class="fas fa-chevron-down"></i>
                    </div>
                  </div>
                </div>

                <!-- Language Tabs -->
                <div class="translations-container">
                  <div class="translations-tabs">
                    <div 
                      v-for="(lang, locale) in languages" 
                      :key="locale"
                      class="tab-item"
                      :class="{ active: activeLocale === locale }"
                      @click="activeLocale = locale"
                    >
                      <div class="tab-icon">
                        <i :class="lang.icon"></i>
                      </div>
                      <span class="tab-text">{{ lang.label }}</span>
                    </div>
                  </div>

                  <div class="translations-content">
                    <div 
                      v-for="(lang, locale) in languages" 
                      :key="locale"
                      class="translation-panel p-4"
                      :class="{ active: activeLocale === locale }"
                      v-show="activeLocale === locale"
                    >
                      <div class="form-group mb-4">
                        <label class="form-label d-flex align-items-center mb-2">
                          <i class="fas fa-font text-primary me-2"></i>
                          {{ $t('common.name') }} ({{ lang.label }})
                        </label>
                        <div class="input-wrapper">
                          <input 
                            v-model="form.translations[locale].name"
                            type="text"
                            class="form-control"
                            :placeholder="$t('products.enter_name')"
                            required
                          >
                          <div class="input-icon">
                            <i class="fas fa-pen"></i>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <label class="form-label d-flex align-items-center mb-2">
                          <i class="fas fa-align-left text-primary me-2"></i>
                          {{ $t('common.description') }} ({{ lang.label }})
                        </label>
                        <div class="input-wrapper">
                          <textarea
                            v-model="form.translations[locale].description"
                            class="form-control"
                            :placeholder="$t('products.enter_description')"
                            rows="4"
                            required
                          ></textarea>
                          <div class="input-icon textarea-icon">
                            <i class="fas fa-paragraph"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-actions mt-4">
                  <button type="submit" class="btn btn-primary d-flex align-items-center">
                    <i class="fas fa-arrow-right me-2"></i>
                    {{ $t('common.next') }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Step 2: Attributes -->
            <div v-else-if="currentStep === 2" class="animated fadeIn">
              <form @submit.prevent="submitAttributes">
                <div class="attributes-container">
                  <div v-if="categoryAttributes.length" class="attributes-list">
                    <div v-for="attribute in categoryAttributes" :key="attribute.id" class="attribute-card mb-4">
                      <div class="card">
                        <div class="card-body">
                          <div class="form-group">
                            <label class="form-label d-flex align-items-center mb-2">
                              <i class="fas fa-tag text-primary me-2"></i>
                              {{ getAttributeName(attribute) }}
                            </label>
                            <div class="input-wrapper">
                              <input 
                                v-model="attributeForm.attributes[attribute.id]"
                                type="text"
                                class="form-control"
                                :placeholder="$t('products.enter_value')"
                                required
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="no-attributes text-center p-5">
                    <i class="fas fa-exclamation-circle text-warning mb-3" style="font-size: 3rem;"></i>
                    <p class="text-muted">{{ $t('products.no_attributes') }}</p>
                  </div>
                </div>

                <div class="form-actions mt-4">
                  <button type="button" class="btn btn-secondary me-2" @click="currentStep = 1">
                    <i class="fas fa-arrow-left me-1"></i>
                    {{ $t('common.back') }}
                  </button>
                  <button type="submit" class="btn btn-primary" :disabled="!categoryAttributes.length">
                    <i class="fas fa-arrow-right me-1"></i>
                    {{ $t('common.next') }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Step 3: Variants -->
            <div v-else-if="currentStep === 3" class="animated fadeIn">
              <form @submit.prevent="submitVariants">
                <div class="variants-container">
                  <div v-for="(variant, index) in variantForm.variants" :key="index" class="variant-card mb-4">
                    <div class="card">
                      <div class="card-body">
                        <div class="variant-header d-flex justify-content-between align-items-center mb-4">
                          <h4 class="m-0">
                            <i class="fas fa-cube text-primary me-2"></i>
                            {{ $t('products.variant') }} #{{ index + 1 }}
                          </h4>
                          <button 
                            v-if="variantForm.variants.length > 1"
                            type="button" 
                            class="btn btn-danger btn-sm"
                            @click="removeVariant(index)"
                          >
                            <i class="fas fa-times"></i>
                          </button>
                        </div>

                        <div class="row">
                          <!-- Price and Stock -->
                          <div class="col-md-6">
                            <div class="form-group mb-3">
                              <label class="form-label">
                                <i class="fas fa-tag text-primary me-2"></i>
                                {{ $t('products.price') }}
                              </label>
                              <div class="input-group">
                                <span class="input-group-text">$</span>
                                <input 
                                  v-model="variant.price"
                                  type="number"
                                  class="form-control"
                                  step="0.01"
                                  min="0"
                                  required
                                >
                              </div>
                            </div>
                          </div>
                          
                          <div class="col-md-6">
                            <div class="form-group mb-3">
                              <label class="form-label">
                                <i class="fas fa-boxes text-primary me-2"></i>
                                {{ $t('products.stock') }}
                              </label>
                              <input 
                                v-model="variant.stock"
                                type="number"
                                class="form-control"
                                min="0"
                                required
                              >
                            </div>
                          </div>

                          <!-- Attribute Values -->
                          <div class="col-12">
                            <div class="form-group mb-4">
                              <label class="form-label">
                                <i class="fas fa-list text-primary me-2"></i>
                                {{ $t('products.attribute_values') }}
                              </label>
                              <div class="row">
                                <div 
                                  v-for="attr in categoryAttributes" 
                                  :key="attr.id"
                                  class="col-md-6 mb-3"
                                >
                                  <label class="form-label small">{{ getAttributeName(attr) }}</label>
                                  <input 
                                    v-model="variant.attribute_values[attr.id]"
                                    type="text"
                                    class="form-control"
                                    :placeholder="$t('products.enter_value')"
                                  >
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Images -->
                          <div class="col-12">
                            <div class="form-group">
                              <label class="form-label">
                                <i class="fas fa-images text-primary me-2"></i>
                                {{ $t('products.images') }}
                              </label>
                              
                              <!-- Image Preview -->
                              <div class="image-preview-container mb-3" v-if="variant.images.length">
                                <div class="row">
                                  <div 
                                    v-for="(image, imageIndex) in variant.images" 
                                    :key="imageIndex"
                                    class="col-md-3 col-sm-4 col-6 mb-3"
                                  >
                                    <div class="image-preview-wrapper position-relative">
                                      <img 
                                        :src="image"
                                        class="img-fluid rounded"
                                        alt="Product variant image"
                                      >
                                      <button 
                                        type="button"
                                        class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                                        @click="removeImage(index, imageIndex)"
                                      >
                                        <i class="fas fa-times"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <!-- Image Upload -->
                              <div class="image-upload-container">
                                <input
                                  type="file"
                                  :id="'variant-image-' + index"
                                  class="d-none"
                                  accept="image/*"
                                  @change="handleImageUpload($event, index)"
                                >
                                <label 
                                  :for="'variant-image-' + index"
                                  class="image-upload-label d-block text-center p-4 rounded cursor-pointer"
                                >
                                  <i class="fas fa-cloud-upload-alt mb-2" style="font-size: 2rem;"></i>
                                  <div>{{ $t('products.drag_or_click') }}</div>
                                  <small class="text-muted">{{ $t('products.supported_formats') }}</small>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Add Variant Button -->
                  <div class="text-center mb-4">
                    <button 
                      type="button" 
                      class="btn btn-outline-primary"
                      @click="addVariant"
                    >
                      <i class="fas fa-plus me-2"></i>
                      {{ $t('products.add_variant') }}
                    </button>
                  </div>
                </div>

                <div class="form-actions">
                  <button type="button" class="btn btn-secondary me-2" @click="currentStep = 2">
                    <i class="fas fa-arrow-left me-1"></i>
                    {{ $t('common.back') }}
                  </button>
                  <button type="submit" class="btn btn-success">
                    <i class="fas fa-check me-1"></i>
                    {{ $t('common.save') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

export default {
  name: 'ProductForm',
  setup() {
    const router = useRouter()
    const { t } = useI18n()

    const currentStep = ref(1)
    const activeLocale = ref('en')
    const categories = ref([])
    const categoryAttributes = ref([])
    const productId = ref(null)
    const isUploading = ref(false)

    const steps = [
      { label: 'products.basic_info', icon: 'fas fa-info-circle' },
      { label: 'products.attributes', icon: 'fas fa-tags' },
      { label: 'products.variants', icon: 'fas fa-cubes' }
    ]

    const languages = {
      en: { label: 'English', icon: 'flag-icon flag-icon-gb' },
      ru: { label: 'Русский', icon: 'flag-icon flag-icon-ru' },
      uz: { label: 'O\'zbek', icon: 'flag-icon flag-icon-uz' }
    }

    // Form for step 1: Basic Information
    const form = reactive({
      category_id: '',
      translations: {
        en: { name: '', description: '' },
        ru: { name: '', description: '' },
        uz: { name: '', description: '' }
      }
    })

    // Form for step 2: Attributes
    const attributeForm = reactive({
      attributes: {}
    })

    // Form for step 3: Variants
    const variantForm = reactive({
      variants: [{
        price: 0,
        stock: 0,
        attribute_values: {},
        images: []
      }]
    })

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

    // Fetch categories on component mount
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/admin/categories')
        if (response.data && response.data.data) {
          categories.value = response.data.data
        } else {
          showNotification('Invalid response format from categories API', true)
        }
      } catch (error) {
        console.error('Categories fetch error:', error)
        showNotification(t('common.error_loading_categories'), true)
      }
    }

    // Fetch category attributes when category is selected
    const handleCategoryChange = async () => {
      if (!form.category_id) {
        categoryAttributes.value = []
        return
      }
      
      try {
        console.log('Fetching attributes for category:', form.category_id)
        const response = await axios.get(`/admin/categories/${form.category_id}`)
        console.log('Category response:', response.data)
        
        categoryAttributes.value = []
        
        const category = response.data?.category || response.data?.data || response.data
        console.log('Category data:', category)
        
        const attributeGroups = category?.attribute_groups || []
        console.log('Attribute groups:', attributeGroups)
        
        attributeGroups.forEach(group => {
          console.log('Processing group:', group)
          if (group.attributes && Array.isArray(group.attributes)) {
            console.log('Adding attributes from group:', group.attributes)
            categoryAttributes.value.push(...group.attributes)
          }
        })

        console.log('Final loaded attributes:', categoryAttributes.value)

        // Reset attribute form when category changes
        attributeForm.attributes = {}
        
        // Initialize attribute values
        categoryAttributes.value.forEach(attr => {
          console.log('Setting up attribute:', attr)
          attributeForm.attributes[attr.id] = ''
        })

      } catch (error) {
        console.error('Category attributes fetch error:', error)
        console.error('Error details:', error.response?.data)
        showNotification(t('common.error_loading_attributes'), true)
      }
    }

    // Get attribute name based on current locale
    const getAttributeName = (attribute) => {
      if (!attribute || !attribute.translations) return ''
      const translation = attribute.translations.find(t => t.locale === activeLocale.value)
      return translation ? translation.name : attribute.translations[0]?.name || ''
    }

    // Step 1: Submit basic information
    const submitBasicInfo = async () => {
      try {
        const response = await axios.post('/admin/products', form)
        if (response.data && response.data.product && response.data.product.id) {
          productId.value = response.data.product.id
          showNotification(t('products.basic_info_saved'))
          currentStep.value = 2
        } else {
          throw new Error('Invalid response format')
        }
      } catch (error) {
        console.error('Submit basic info error:', error)
        showNotification(error.response?.data?.message || t('common.error_saving'), true)
      }
    }

    // Step 2: Submit attributes
    const submitAttributes = async () => {
      try {
        await axios.post(`/admin/products/${productId.value}/attributes`, attributeForm)
        showNotification(t('products.attributes_saved'))
        currentStep.value = 3
      } catch (error) {
        showNotification(error.response?.data?.message || t('common.error_saving'), true)
      }
    }

    // Step 3: Submit variants
    const submitVariants = async () => {
      try {
        await axios.post(`/admin/products/${productId.value}/variants`, variantForm)
        showNotification(t('products.product_created'))
        router.push('/products')
      } catch (error) {
        showNotification(error.response?.data?.message || t('common.error_saving'), true)
      }
    }

    // Add new variant
    const addVariant = () => {
      variantForm.variants.push({
        price: 0,
        stock: 0,
        attribute_values: {},
        images: []
      })
    }

    // Remove variant
    const removeVariant = (index) => {
      variantForm.variants.splice(index, 1)
    }

    // Handle image upload
    const handleImageUpload = async (event, variantIndex) => {
      const files = event.target.files
      if (!files.length) return

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
      const maxSize = 2 * 1024 * 1024 // 2MB as per backend validation

      // Validate file
      const file = files[0]
      if (!allowedTypes.includes(file.type)) {
        showNotification('Ruxsat etilgan formatlar: JPG, PNG, GIF', true)
        return
      }
      if (file.size > maxSize) {
        showNotification('Rasm hajmi 2MB dan oshmasligi kerak', true)
        return
      }

      try {
        isUploading.value = true
        const formData = new FormData()
        formData.append('images[]', file) // Changed to match backend expectation

        const response = await axios.post('/admin/products/upload-images', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          }
        })

        if (response.data && response.data.success && response.data.paths && response.data.paths.length > 0) {
          variantForm.variants[variantIndex].images.push(response.data.paths[0])
          showNotification('Rasm muvaffaqiyatli yuklandi')
        } else {
          throw new Error('Server javobida xatolik')
        }
      } catch (error) {
        console.error('Image upload error:', error.response || error)
        const errorMessage = error.response?.data?.errors?.images?.[0] || 'Rasmni yuklashda xatolik yuz berdi'
        showNotification(errorMessage, true)
      } finally {
        isUploading.value = false
        // Reset file input
        event.target.value = ''
      }
    }

    // Remove image from variant
    const removeImage = (variantIndex, imageIndex) => {
      variantForm.variants[variantIndex].images.splice(imageIndex, 1)
    }

    // Get translation name helper
    const getTranslationName = (item) => {
      if (!item || !item.translations) return ''
      const translation = item.translations.find(t => t.locale === activeLocale.value)
      return translation ? translation.name : item.translations[0]?.name || ''
    }

    // Initialize component
    fetchCategories()

    return {
      currentStep,
      steps,
      languages,
      activeLocale,
      form,
      attributeForm,
      variantForm,
      categories,
      categoryAttributes,
      isUploading,
      submitBasicInfo,
      submitAttributes,
      submitVariants,
      handleCategoryChange,
      addVariant,
      removeVariant,
      handleImageUpload,
      removeImage,
      getTranslationName,
      getAttributeName
    }
  }
}
</script>

<style scoped>
.product-form {
  background-color: #f4f6f9;
  min-height: 100vh;
}

.steps {
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
  position: relative;
}

.steps::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #dee2e6;
  transform: translateY(-50%);
  z-index: 1;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  background: #fff;
  padding: 0 1rem;
}

.step-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.step-icon i {
  color: #6c757d;
  font-size: 1.2rem;
}

.step.active .step-icon {
  border-color: #007bff;
  background: #007bff;
}

.step.active .step-icon i {
  color: #fff;
}

.step.completed .step-icon {
  border-color: #28a745;
  background: #28a745;
}

.step.completed .step-icon i {
  color: #fff;
}

.step-label {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}

.translations-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #dee2e6;
  padding-bottom: 0.5rem;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-item:hover {
  background: #f8f9fa;
}

.tab-item.active {
  background: #e9ecef;
}

.tab-icon i {
  font-size: 1.2rem;
}

.translations-content {
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.translation-panel {
  display: none;
}

.translation-panel.active {
  display: block;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.textarea-icon {
  top: 1rem;
  transform: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.animated {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fadeIn {
  animation-name: fadeIn;
}

.select-wrapper {
  position: relative;
}

.select-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6c757d;
}

.custom-select {
  appearance: none;
  padding-right: 2.5rem;
}

.attributes-container {
  padding: 2rem;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.attribute-card {
  margin-bottom: 1rem;
}

.no-attributes {
  text-align: center;
  padding: 2rem;
}

.no-attributes i {
  font-size: 3rem;
  color: #ffc107;
}

.no-attributes p {
  color: #6c757d;
}

.image-preview-wrapper {
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
}

.image-preview-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-upload-label {
  border: 2px dashed #dee2e6;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  cursor: pointer;
}

.image-upload-label:hover {
  border-color: #0d6efd;
  background-color: #e9ecef;
}

.cursor-pointer {
  cursor: pointer;
}

.variant-card {
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.variant-card .card-body {
  padding: 1.5rem;
}

.form-actions {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}
</style>
