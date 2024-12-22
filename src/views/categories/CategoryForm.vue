<template>
  <div class="category-form">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>{{ isEdit ? $t('categories.edit_category') : $t('categories.add_category') }}</h1>
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
                1. {{ $t('categories.basic_info') }}
              </div>
              <div class="step" :class="{ active: currentStep === 2 }">
                2. {{ $t('categories.attributes') }}
              </div>
            </div>

            <!-- Step 1: Basic Information -->
            <div v-if="currentStep === 1">
              <form @submit.prevent="submitBasicInfo">
                <!-- Parent Category -->
                <div class="form-group animated fadeIn">
                  <label class="form-label">
                    <i class="fas fa-sitemap text-primary"></i>
                    {{ $t('categories.parent_category') }}
                  </label>
                  <div class="select-wrapper">
                    <select 
                      v-model="form.parent_id" 
                      class="form-control custom-select"
                    >
                      <option :value="null">
                        <i class="fas fa-folder"></i>
                        {{ $t('categories.root_category') }}
                      </option>
                      <option 
                        v-for="category in categories" 
                        :key="category.id" 
                        :value="category.id"
                        :style="{ paddingLeft: getPaddingLeft(category.level) }"
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
                      <div class="panel-header">
                        <h4 class="locale-title">
                          <i class="fas" :class="getLocaleIcon(locale)"></i>
                          {{ getLocaleName(locale) }}
                        </h4>
                      </div>
                      
                      <div class="panel-body">
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
                              :placeholder="$t('categories.enter_name')"
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
                              :placeholder="$t('categories.enter_description')"
                              rows="3"
                            ></textarea>
                            <div class="input-icon textarea-icon">
                              <i class="fas fa-paragraph"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Image Upload -->
                <div class="form-group">
                  <label>{{ $t('common.image') }}</label>
                  <input 
                    v-model="form.image"
                    type="text"
                    class="form-control"
                    :placeholder="$t('categories.image_path')"
                  >
                </div>

                <!-- Status and Order -->
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>{{ $t('common.status.active') }}</label>
                      <div class="custom-control custom-switch">
                        <input 
                          type="checkbox"
                          class="custom-control-input"
                          id="activeSwitch"
                          v-model="form.active"
                        >
                        <label class="custom-control-label" for="activeSwitch">
                          {{ form.active ? $t('common.active') : $t('common.inactive') }}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>{{ $t('common.featured') }}</label>
                      <div class="custom-control custom-switch">
                        <input 
                          type="checkbox"
                          class="custom-control-input"
                          id="featuredSwitch"
                          v-model="form.featured"
                        >
                        <label class="custom-control-label" for="featuredSwitch">
                          {{ form.featured ? $t('common.featured') : $t('common.notFeatured') }}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>{{ $t('common.order') }}</label>
                      <input 
                        v-model.number="form.order"
                        type="number"
                        class="form-control"
                        min="0"
                      >
                    </div>
                  </div>
                </div>

                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" @click="cancel">
                    {{ $t('common.cancel') }}
                  </button>
                  <button type="submit" class="btn btn-primary">
                    {{ $t('common.next') }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Step 2: Attributes -->
            <div v-else-if="currentStep === 2">
              <form @submit.prevent="submitAttributes" class="attributes-form">
                <!-- Attribute Groups -->
                <div class="attribute-groups">
                  <div v-for="(group, groupIndex) in attributeForm.attribute_groups" 
                       :key="groupIndex" 
                       class="attribute-group-card animated fadeIn"
                  >
                    <!-- Group Header -->
                    <div class="group-header">
                      <div class="form-group mb-3">
                        <label class="form-label">
                          <i class="fas fa-layer-group text-primary"></i>
                          {{ $t('categories.group_name') }}
                        </label>
                        <div class="input-wrapper">
                          <input 
                            v-model="group.name"
                            type="text"
                            class="form-control"
                            required
                          >
                          <div class="input-icon">
                            <i class="fas fa-tag"></i>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        type="button" 
                        class="btn btn-icon btn-danger"
                        @click="removeGroup(groupIndex)"
                        title="Remove Group"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>

                    <!-- Attributes List -->
                    <div class="attributes-list">
                      <div v-for="(attribute, attrIndex) in group.attributes" 
                           :key="attrIndex" 
                           class="attribute-card animated fadeIn"
                      >
                        <div class="attribute-header">
                          <div class="form-group mb-3">
                            <label class="form-label">
                              <i class="fas fa-cube text-info"></i>
                              {{ $t('common.name') }}
                            </label>
                            <div class="input-wrapper">
                              <input 
                                v-model="attribute.name"
                                type="text"
                                class="form-control"
                                required
                              >
                              <div class="input-icon">
                                <i class="fas fa-signature"></i>
                              </div>
                            </div>
                          </div>

                          <button 
                            type="button" 
                            class="btn btn-icon btn-danger"
                            @click="removeAttribute(groupIndex, attrIndex)"
                            title="Remove Attribute"
                          >
                            <i class="fas fa-times"></i>
                          </button>
                        </div>

                        <!-- Attribute Translations -->
                        <div class="translations-tabs">
                          <div 
                            v-for="locale in ['uz', 'ru', 'en']" 
                            :key="locale"
                            class="tab-item"
                            :class="{ active: activeLocales[groupIndex]?.[attrIndex] === locale }"
                            @click="setActiveLocale(groupIndex, attrIndex, locale)"
                          >
                            <i class="fas" :class="getLocaleIcon(locale)"></i>
                            <span>{{ locale.toUpperCase() }}</span>
                          </div>
                        </div>

                        <div class="translations-content">
                          <div 
                            v-for="locale in ['uz', 'ru', 'en']" 
                            :key="locale"
                            class="translation-panel"
                            :class="{ active: activeLocales[groupIndex]?.[attrIndex] === locale }"
                          >
                            <div class="form-group">
                              <label class="form-label">
                                <i class="fas fa-language text-primary"></i>
                                {{ $t('common.name') }} ({{ locale }})
                              </label>
                              <div class="input-wrapper">
                                <input 
                                  v-model="attribute.translations[locale].name"
                                  type="text"
                                  class="form-control"
                                  required
                                >
                                <div class="input-icon">
                                  <i class="fas fa-pen"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Add Attribute Button -->
                      <button 
                        type="button" 
                        class="btn btn-add"
                        @click="addAttribute(groupIndex)"
                      >
                        <i class="fas fa-plus-circle"></i>
                        {{ $t('categories.add_attribute') }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Add Group Button -->
                <button 
                  type="button" 
                  class="btn btn-add btn-lg mb-4"
                  @click="addGroup"
                >
                  <i class="fas fa-plus-circle"></i>
                  {{ $t('categories.add_group') }}
                </button>

                <!-- Form Actions -->
                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" @click="currentStep = 1">
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'

export default {
  name: 'CategoryForm',
  setup() {
    const router = useRouter()
    const store = useStore()
    const currentStep = ref(1)
    const isEdit = ref(false)
    const createdCategoryId = ref(null)

    // Form for basic information
    const form = reactive({
      translations: {
        uz: { name: '', description: '' },
        ru: { name: '', description: '' },
        en: { name: '', description: '' }
      },
      parent_id: null,
      image: '',
      active: true,
      featured: false,
      order: 0
    })

    // Form for attributes
    const attributeForm = reactive({
      attribute_groups: [
        {
          name: '',
          attributes: [
            {
              name: '',
              translations: {
                uz: { name: '' },
                ru: { name: '' },
                en: { name: '' }
              }
            }
          ]
        }
      ]
    })

    const categories = ref([])

    const activeLocale = ref('uz')
    const activeLocales = ref({})

    const fetchCategories = async () => {
      try {
        const response = await axios.get('/admin/categories')
        if (Array.isArray(response.data)) {
          categories.value = response.data
        } else if (response.data.data) {
          categories.value = response.data.data
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    const submitBasicInfo = async () => {
      try {
        const response = await axios.post('/admin/categories', form)
        createdCategoryId.value = response.data.category.id
        currentStep.value = 2
      } catch (error) {
        console.error('Error creating category:', error)
        alert(error.response?.data?.message || 'Error creating category')
      }
    }

    const submitAttributes = async () => {
      try {
        // Format the data to match the API requirements
        const formattedData = {
          attribute_groups: attributeForm.attribute_groups.map(group => ({
            name: group.name,
            attributes: group.attributes.map(attr => ({
              name: attr.name,
              translations: attr.translations
            }))
          }))
        }

        // Send the formatted data to the API
        await axios.post(`/admin/categories/${createdCategoryId.value}/attributes`, formattedData)
        
        // Show success message
        store.dispatch('showMessage', {
          type: 'success',
          text: 'Category attributes saved successfully'
        })
        
        // Redirect to categories list
        router.push('/categories')
      } catch (error) {
        console.error('Error adding attributes:', error)
        // Show error message
        store.dispatch('showMessage', {
          type: 'error',
          text: error.response?.data?.message || 'Error adding attributes'
        })
      }
    }

    const addGroup = () => {
      attributeForm.attribute_groups.push({
        name: '',
        attributes: [
          {
            name: '',
            translations: {
              uz: { name: '' },
              ru: { name: '' },
              en: { name: '' }
            }
          }
        ]
      })
    }

    const removeGroup = (groupIndex) => {
      attributeForm.attribute_groups.splice(groupIndex, 1)
    }

    const addAttribute = (groupIndex) => {
      attributeForm.attribute_groups[groupIndex].attributes.push({
        name: '',
        translations: {
          uz: { name: '' },
          ru: { name: '' },
          en: { name: '' }
        }
      })
    }

    const removeAttribute = (groupIndex, attrIndex) => {
      attributeForm.attribute_groups[groupIndex].attributes.splice(attrIndex, 1)
    }

    const cancel = () => {
      router.push('/categories')
    }

    const getTranslationName = (category) => {
      if (!category.translations) return category.name || `Category ${category.id}`
      const translation = category.translations.find(t => t.locale === 'uz') || 
                         category.translations.find(t => t.locale === 'en') ||
                         category.translations.find(t => t.locale === 'ru')
      return translation ? translation.name : category.name || `Category ${category.id}`
    }

    const getLocaleIcon = (locale) => {
      switch(locale) {
        case 'uz': return 'fa-flag text-success'
        case 'ru': return 'fa-flag text-danger'
        case 'en': return 'fa-flag text-primary'
        default: return 'fa-flag'
      }
    }

    const getLocaleName = (locale) => {
      switch(locale) {
        case 'uz': return 'O\'zbekcha'
        case 'ru': return 'Русский'
        case 'en': return 'English'
        default: return locale
      }
    }

    const getPaddingLeft = (level) => {
      return `${level * 20}px`
    }

    const setActiveLocale = (groupIndex, attrIndex, locale) => {
      if (!activeLocales.value[groupIndex]) {
        activeLocales.value[groupIndex] = {}
      }
      activeLocales.value[groupIndex][attrIndex] = locale
    }

    onMounted(fetchCategories)

    return {
      currentStep,
      isEdit,
      form,
      attributeForm,
      categories,
      submitBasicInfo,
      submitAttributes,
      addGroup,
      removeGroup,
      addAttribute,
      removeAttribute,
      cancel,
      getTranslationName,
      activeLocale,
      getLocaleIcon,
      getLocaleName,
      getPaddingLeft,
      activeLocales,
      setActiveLocale
    }
  }
}
</script>

<style scoped>
.category-form {
  padding: 20px;
}

.steps {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.step {
  padding: 10px 20px;
  border-radius: 4px;
  background: #f8f9fa;
  color: #6c757d;
}

.step.active {
  background: #007bff;
  color: white;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.translations-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  overflow: hidden;
}

.translations-tabs {
  display: flex;
  background: #f8f9fa;
  padding: 0.5rem;
  gap: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.tab-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  border: 1px solid #e9ecef;
}

.tab-item:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
}

.tab-item.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,123,255,0.2);
}

.tab-icon {
  margin-right: 0.5rem;
  font-size: 1.1em;
}

.tab-text {
  font-weight: 500;
}

.translation-panel {
  display: none;
  padding: 1.5rem;
}

.translation-panel.active {
  display: block;
  animation: slideIn 0.3s ease-out;
}

.panel-header {
  margin-bottom: 1.5rem;
}

.locale-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  transition: all 0.3s ease;
}

.textarea-icon {
  top: 1.2rem;
  transform: none;
}

.form-control {
  padding-right: 2.5rem;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.1);
}

.form-control:focus + .input-icon {
  color: #007bff;
  opacity: 1;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
}

.select-wrapper {
  position: relative;
}

.select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  pointer-events: none;
  transition: all 0.3s ease;
}

.custom-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 2.5rem;
  cursor: pointer;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.custom-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.1);
}

.custom-select:focus + .select-icon {
  color: #007bff;
  transform: translateY(-50%) rotate(180deg);
}

.custom-select option {
  padding: 10px;
  background: #fff;
  color: #2c3e50;
}

.attributes-form {
  max-width: 1200px;
  margin: 0 auto;
}

.attribute-group-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #e9ecef;
}

.group-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.attribute-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.attribute-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.attribute-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
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

.btn-icon:hover {
  transform: translateY(-2px);
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

.btn-add i {
  margin-right: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.form-actions .btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .translations-container {
    background: #2d2d2d;
  }

  .translations-tabs {
    background: #1a1a1a;
    border-bottom-color: #404040;
  }

  .tab-item {
    background: #333;
    border-color: #404040;
    color: #fff;
  }

  .tab-item:hover {
    background: #404040;
  }

  .locale-title {
    color: #fff;
  }

  .form-control {
    background-color: #333;
    border-color: #404040;
    color: #fff;
  }

  .form-control:focus {
    border-color: #007bff;
    background-color: #404040;
  }

  .form-label {
    color: #e9ecef;
  }

  .custom-select {
    background: #333;
    border-color: #404040;
    color: #fff;
  }

  .custom-select option {
    background: #333;
    color: #fff;
  }

  .select-icon {
    color: #adb5bd;
  }

  .attribute-group-card {
    background: #2d2d2d;
    border-color: #404040;
  }

  .attribute-card {
    background: #333;
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

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animated {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

.fadeIn {
  animation-name: fadeIn;
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
</style>