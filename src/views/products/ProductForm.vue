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
              <div class="step" :class="{ active: currentStep === 1 }">
                <div class="step-icon">
                  <i class="fas fa-info-circle"></i>
                </div>
                <div class="step-label">{{ $t('products.basic_info') }}</div>
              </div>
              <div class="step" :class="{ active: currentStep === 2 }">
                <div class="step-icon">
                  <i class="fas fa-list"></i>
                </div>
                <div class="step-label">{{ $t('products.attributes') }}</div>
              </div>
              <div class="step" :class="{ active: currentStep === 3 }">
                <div class="step-icon">
                  <i class="fas fa-tags"></i>
                </div>
                <div class="step-label">{{ $t('products.variants') }}</div>
              </div>
            </div>

            <!-- Step 1: Basic Information -->
            <div v-if="currentStep === 1">
              <form @submit.prevent="submitBasicInfo">
                <!-- Category Selection -->
                <div class="form-group animated fadeIn">
                  <label class="form-label">
                    <i class="fas fa-folder text-primary"></i>
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

                <!-- Translations -->
                <div class="translations-container">
                  <div class="translations-tabs">
                    <div 
                      v-for="locale in ['uz', 'ru', 'en']" 
                      :key="locale"
                      class="tab-item"
                      :class="{ active: activeLocale === locale }"
                      @click="activeLocale = locale"
                    >
                      <div class="tab-icon">
                        <i class="fas" :class="getLocaleIcon(locale)"></i>
                      </div>
                      <span class="tab-text">{{ locale.toUpperCase() }}</span>
                    </div>
                  </div>

                  <div class="translations-content">
                    <div 
                      v-for="locale in ['uz', 'ru', 'en']" 
                      :key="locale"
                      class="translation-panel"
                      :class="{ active: activeLocale === locale }"
                    >
                      <div class="form-group animated fadeIn">
                        <label class="form-label">
                          <i class="fas fa-font text-primary"></i>
                          {{ $t('common.name') }}
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

                      <div class="form-group animated fadeIn">
                        <label class="form-label">
                          <i class="fas fa-align-left text-primary"></i>
                          {{ $t('common.description') }}
                        </label>
                        <div class="input-wrapper">
                          <textarea
                            v-model="form.translations[locale].description"
                            class="form-control"
                            :placeholder="$t('products.enter_description')"
                            rows="3"
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

                <div class="form-actions">
                  <button type="submit" class="btn btn-primary">
                    <i class="fas fa-arrow-right"></i>
                    {{ $t('common.next') }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Step 2: Attributes -->
            <div v-else-if="currentStep === 2">
              <form @submit.prevent="submitAttributes">
                <div class="attributes-container">
                  <div v-if="categoryAttributes.length" class="attributes-list">
                    <div v-for="attribute in categoryAttributes" :key="attribute.id" class="attribute-card animated fadeIn">
                      <div class="attribute-header">
                        <label class="form-label">
                          <i class="fas fa-tag text-primary"></i>
                          {{ attribute.name }}
                        </label>
                      </div>
                      <div class="input-wrapper">
                        <input 
                          v-model="attributeForm.attributes[attribute.id]"
                          type="text"
                          class="form-control"
                          :placeholder="$t('products.enter_value')"
                          required
                        >
                        <div class="input-icon">
                          <i class="fas fa-pen"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="no-attributes">
                    {{ $t('products.no_attributes') }}
                  </div>
                </div>

                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" @click="currentStep = 1">
                    <i class="fas fa-arrow-left"></i>
                    {{ $t('common.back') }}
                  </button>
                  <button type="submit" class="btn btn-primary">
                    <i class="fas fa-arrow-right"></i>
                    {{ $t('common.next') }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Step 3: Variants -->
            <div v-else-if="currentStep === 3">
              <form @submit.prevent="submitVariants">
                <div class="variants-container">
                  <div v-for="(variant, index) in variantForm.variants" :key="index" class="variant-card animated fadeIn">
                    <div class="variant-header">
                      <h4>{{ $t('products.variant') }} #{{ index + 1 }}</h4>
                      <button 
                        v-if="variantForm.variants.length > 1"
                        type="button" 
                        class="btn btn-icon btn-danger"
                        @click="removeVariant(index)"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </div>

                    <!-- Price and Stock -->
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">
                            <i class="fas fa-dollar-sign text-success"></i>
                            {{ $t('products.price') }}
                          </label>
                          <div class="input-wrapper">
                            <input 
                              v-model.number="variant.price"
                              type="number"
                              class="form-control"
                              step="0.01"
                              min="0"
                              required
                            >
                            <div class="input-icon">
                              <i class="fas fa-tag"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">
                            <i class="fas fa-boxes text-warning"></i>
                            {{ $t('products.stock') }}
                          </label>
                          <div class="input-wrapper">
                            <input 
                              v-model.number="variant.stock"
                              type="number"
                              class="form-control"
                              min="0"
                              required
                            >
                            <div class="input-icon">
                              <i class="fas fa-warehouse"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Variant Attributes -->
                    <div class="variant-attributes">
                      <div v-for="attribute in categoryAttributes" :key="attribute.id" class="form-group">
                        <label class="form-label">
                          <i class="fas fa-tag text-info"></i>
                          {{ attribute.name }}
                        </label>
                        <div class="input-wrapper">
                          <input 
                            v-model="variant.attribute_values[attribute.id]"
                            type="text"
                            class="form-control"
                            :placeholder="$t('products.enter_value')"
                            required
                          >
                          <div class="input-icon">
                            <i class="fas fa-pen"></i>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Images -->
                    <div class="form-group">
                      <label class="form-label">
                        <i class="fas fa-images text-primary"></i>
                        {{ $t('products.images') }}
                      </label>
                      <div class="input-wrapper">
                        <input 
                          v-model="variant.images"
                          type="text"
                          class="form-control"
                          placeholder="/storage/products/image.jpg"
                          required
                        >
                        <div class="input-icon">
                          <i class="fas fa-camera"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Add Variant Button -->
                  <button 
                    type="button" 
                    class="btn btn-add"
                    @click="addVariant"
                  >
                    <i class="fas fa-plus-circle"></i>
                    {{ $t('products.add_variant') }}
                  </button>
                </div>

                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" @click="currentStep = 2">
                    <i class="fas fa-arrow-left"></i>
                    {{ $t('common.back') }}
                  </button>
                  <button type="submit" class="btn btn-success">
                    <i class="fas fa-save"></i>
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
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'ProductForm',
  setup() {
    const router = useRouter()
    const currentStep = ref(1)
    const createdProductId = ref(null)
    const categories = ref([])
    const categoryAttributes = ref([])
    const activeLocale = ref('uz')

    // Basic information form
    const form = reactive({
      category_id: '',
      translations: {
        uz: { name: '', description: '' },
        ru: { name: '', description: '' },
        en: { name: '', description: '' }
      }
    })

    // Attributes form
    const attributeForm = reactive({
      attributes: {}
    })

    // Variants form
    const variantForm = reactive({
      variants: [
        {
          price: 0,
          stock: 0,
          attribute_values: {},
          images: []
        }
      ]
    })

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/admin/categories')
        categories.value = response.data.data || response.data
      } catch (error) {
        console.error('Error fetching categories:', error)
        alert($t('errors.fetch_categories'))
      }
    }

    // Fetch category attributes
    const fetchCategoryAttributes = async (categoryId) => {
      try {
        const response = await axios.get(`/admin/categories/${categoryId}`)
        if (response.data.data?.attribute_groups) {
          const attributes = []
          response.data.data.attribute_groups.forEach(group => {
            if (group.attributes) {
              attributes.push(...group.attributes)
            }
          })
          categoryAttributes.value = attributes
        }
        
        // Reset attribute forms when category changes
        attributeForm.attributes = {}
        variantForm.variants.forEach(variant => {
          variant.attribute_values = {}
        })
      } catch (error) {
        console.error('Error fetching category attributes:', error)
        alert($t('errors.fetch_attributes'))
      }
    }

    // Handle category change
    const handleCategoryChange = () => {
      if (form.category_id) {
        fetchCategoryAttributes(form.category_id)
      }
    }

    // Submit basic information
    const submitBasicInfo = async () => {
      try {
        const productData = {
          category_id: parseInt(form.category_id),
          translations: form.translations,
          active: true,
          featured: false
        };

        console.log('Sending product data:', productData);

        const response = await axios.post('/admin/products', productData);
        console.log('Server response:', response.data);

        if (response.data.product?.id) {
          createdProductId.value = response.data.product.id;
          currentStep.value = 2;
          alert($t('success.product_basic_info'));
        } else if (response.data.success === true) {
          // If success is true but product is in a different format
          createdProductId.value = response.data.data?.id || response.data.id;
          currentStep.value = 2;
          alert($t('success.product_basic_info'));
        } else {
          throw new Error('Invalid server response format');
        }
      } catch (error) {
        console.error('Error creating product:', error);
        console.log('Error response:', error.response?.data);
        
        if (error.response?.data?.errors) {
          // Handle validation errors
          const errorMessages = Object.values(error.response.data.errors)
            .flat()
            .join('\n');
          alert(`Validation errors:\n${errorMessages}`);
        } else {
          alert(error.response?.data?.message || $t('errors.create_product'));
        }
      }
    };

    // Submit attributes
    const submitAttributes = async () => {
      try {
        await axios.post(`/admin/products/${createdProductId.value}/attributes`, {
          attributes: attributeForm.attributes
        })
        currentStep.value = 3
        alert($t('success.product_attributes'))
      } catch (error) {
        console.error('Error adding attributes:', error)
        alert(error.response?.data?.message || $t('errors.add_attributes'))
      }
    }

    // Submit variants
    const submitVariants = async () => {
      try {
        // Format variants data
        const formattedVariants = variantForm.variants.map(variant => ({
          price: variant.price,
          stock: variant.stock,
          attribute_values: variant.attribute_values,
          images: Array.isArray(variant.images) ? variant.images : [variant.images]
        }))

        await axios.post(`/admin/products/${createdProductId.value}/variants`, {
          variants: formattedVariants
        })
        
        alert($t('success.product_created'))
        router.push('/products')
      } catch (error) {
        console.error('Error adding variants:', error)
        alert(error.response?.data?.message || $t('errors.add_variants'))
      }
    }

    // Variant management
    const addVariant = () => {
      variantForm.variants.push({
        price: 0,
        stock: 0,
        attribute_values: {},
        images: []
      })
    }

    const removeVariant = (index) => {
      variantForm.variants.splice(index, 1)
    }

    // Locale helpers
    const getLocaleIcon = (locale) => {
      switch(locale) {
        case 'uz': return 'fa-flag text-success'
        case 'ru': return 'fa-flag text-danger'
        case 'en': return 'fa-flag text-primary'
        default: return 'fa-flag'
      }
    }

    const getTranslationName = (category) => {
      const translation = category.translations?.find(t => t.locale === 'en')
      return translation ? translation.name : category.name || `Category ${category.id}`
    }

    // Initialize
    fetchCategories()

    return {
      currentStep,
      categories,
      categoryAttributes,
      form,
      attributeForm,
      variantForm,
      activeLocale,
      getLocaleIcon,
      getTranslationName,
      handleCategoryChange,
      submitBasicInfo,
      submitAttributes,
      submitVariants,
      addVariant,
      removeVariant
    }
  }
}
</script>

<style scoped>
.product-form {
  max-width: 1200px;
  margin: 0 auto;
}

.steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
}

.step {
  flex: 1;
  text-align: center;
  padding: 1rem;
  position: relative;
  z-index: 1;
}

.step-icon {
  width: 50px;
  height: 50px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  border: 2px solid #dee2e6;
  transition: all 0.3s ease;
}

.step.active .step-icon {
  background: #007bff;
  border-color: #007bff;
  color: white;
}

.step-label {
  font-size: 0.9rem;
  color: #6c757d;
}

.step.active .step-label {
  color: #007bff;
  font-weight: 500;
}

.variant-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #e9ecef;
}

.variant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.variant-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.btn-add {
  background: #e9ecef;
  color: #495057;
  border: 2px dashed #ced4da;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  width: 100%;
  transition: all 0.3s ease;
}

.btn-add:hover {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.btn-icon {
  width: 38px;
  height: 38px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  opacity: 0.5;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .variant-card {
    background: #2d2d2d;
    border-color: #404040;
  }

  .variant-header h4 {
    color: #fff;
  }

  .step-icon {
    background: #333;
    border-color: #404040;
  }

  .btn-add {
    background: #404040;
    border-color: #495057;
    color: #fff;
  }

  .btn-add:hover {
    background: #007bff;
    border-color: #007bff;
  }
}
</style>
