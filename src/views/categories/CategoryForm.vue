<template>
  <div class="content">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">{{ isEdit ? 'Edit Category' : 'Add Category' }}</h1>
          </div>
          <div class="col-sm-6">
            <div class="float-sm-right">
              <router-link to="/categories" class="btn btn-default">
                <i class="fas fa-arrow-left"></i> Back to Categories
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="container-fluid">
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="row">
                <div class="col-md-8">
                  <!-- Slug -->
                  <div class="form-group">
                    <label>Slug</label>
                    <input
                      v-model="form.slug"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.slug }"
                      placeholder="Enter category slug"
                    >
                    <div class="invalid-feedback">{{ errors.slug }}</div>
                  </div>

                  <!-- Translations -->
                  <div class="form-group" v-for="locale in ['en', 'ru', 'uz']" :key="locale">
                    <label>Name ({{ locale }})</label>
                    <input
                      v-model="form.translations[locale].name"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors[`translations.${locale}.name`] }"
                      placeholder="Enter category name in {{ locale }}"
                    >
                    <div class="invalid-feedback">{{ errors[`translations.${locale}.name`] }}</div>

                    <label>Description ({{ locale }})</label>
                    <textarea
                      v-model="form.translations[locale].description"
                      class="form-control"
                      :class="{ 'is-invalid': errors[`translations.${locale}.description`] }"
                      rows="3"
                      placeholder="Enter category description in {{ locale }}"
                    ></textarea>
                    <div class="invalid-feedback">{{ errors[`translations.${locale}.description`] }}</div>
                  </div>
                </div>
                
                <div class="col-md-4">
                  <!-- Settings -->
                  <div class="form-group">
                    <label>Status</label>
                    <div class="custom-control custom-switch">
                      <input
                        type="checkbox"
                        class="custom-control-input"
                        id="activeSwitch"
                        v-model="form.active"
                      >
                      <label class="custom-control-label" for="activeSwitch">
                        {{ form.active ? 'Active' : 'Inactive' }}
                      </label>
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Featured</label>
                    <div class="custom-control custom-switch">
                      <input
                        type="checkbox"
                        class="custom-control-input"
                        id="featuredSwitch"
                        v-model="form.featured"
                      >
                      <label class="custom-control-label" for="featuredSwitch">
                        {{ form.featured ? 'Featured' : 'Not Featured' }}
                      </label>
                    </div>
                  </div>
                  <!-- Parent Category -->
                <!-- Parent Category -->
                <div class="form-group">
                  <label>Parent Category</label>
                  <select 
                    v-model="form.parent_id" 
                    class="form-control"
                    @change="console.log('Selected parent:', form.parent_id)"
                  >
                    <option value="">Select Parent Category</option>
                    <option
                      v-for="category in categories"
                      :key="category.id"
                      :value="category.id"
                      :disabled="isEdit && category.id === parseInt(route.params.id)"
                    >
                      {{ category.translations?.en?.name || category.name || `Category ${category.id}` }}
                    </option>
                  </select>
                  <div v-if="categories.length === 0" class="text-muted mt-1">
                    Loading categories...
                  </div>
                </div>
                  <!-- Image Upload -->
                  <div class="form-group">
                    <label>Category Image</label>
                    <div class="custom-file">
                      <input
                        type="file"
                        class="custom-file-input"
                        :class="{ 'is-invalid': errors.image }"
                        @change="handleImageChange"
                        accept="image/*"
                      >
                      <label class="custom-file-label">
                        {{ imageName || 'Choose image' }}
                      </label>
                      <div class="invalid-feedback">{{ errors.image }}</div>
                    </div>
                    <img 
                      v-if="imagePreview" 
                      :src="imagePreview" 
                      class="mt-2 img-fluid"
                      style="max-height: 200px"
                    >
                  </div>
                </div>

                <div class="col-12 mt-4">
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    :disabled="loading"
                  >
                    <i class="fas fa-spinner fa-spin mr-2" v-if="loading"></i>
                    {{ isEdit ? 'Update' : 'Create' }} Category
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import axios from 'axios'

export default {
  name: 'CategoryForm',

  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    const loading = ref(false)
    const errors = ref({})
    const imageFile = ref(null)
    const imagePreview = ref(null)

    const isEdit = computed(() => !!route.params.id)

    const form = ref({
      slug: '',
      active: true,
      featured: false,
      parent_id: '', // Make sure parent_id is initialized
      translations: {
        en: { name: '', description: '' },
        ru: { name: '', description: '' },
        uz: { name: '', description: '' }
      }
    })

    const categories = ref([])

    const fetchCategories = async () => {
      try {
        console.log('Fetching categories...')
        const response = await axios.get("/admin/categories")
        console.log('Raw response:', response)
        console.log('Response data:', response.data)
        
        // API response strukturasiga qarab ma'lumotlarni olish
        let fetchedCategories = []
        if (response.data.data) {
          fetchedCategories = response.data.data
        } else if (Array.isArray(response.data)) {
          fetchedCategories = response.data
        }
        
        console.log('Processed categories:', fetchedCategories)
        categories.value = fetchedCategories.filter(cat => 
          cat && cat.id && (!isEdit.value || cat.id !== parseInt(route.params.id))
        )
        console.log('Final categories state:', categories.value)
      } catch (error) {
        console.error("Error fetching categories:", error)
        if (error.response) {
          console.error("Error response:", error.response.data)
        }
      }
    }

    watchEffect(() => {
      console.log('Current categories:', categories.value)
    })

    onMounted(async () => {
      await fetchCategories()
      if (isEdit.value) {
        await loadCategory()
      }
    })

    const imageName = computed(() => {
      return imageFile.value?.name || 'Choose image'
    })

    const handleImageChange = (event) => {
      const file = event.target.files[0]
      if (!file) return

      // Faqat rasm fayllarini qabul qilish
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please select an image file'
        })
        return
      }

      imageFile.value = file
      imagePreview.value = URL.createObjectURL(file)
    }

    const loadCategory = async () => {
      if (!isEdit.value) return

      try {
        loading.value = true
        const response = await axios.get(`/admin/categories/${route.params.id}`)
        const category = response.data.data

        form.value = {
          slug: category.slug,
          active: category.active,
          featured: category.featured,
          parent_id: category.parent_id, // Update parent_id
          translations: category.translations
        }

        if (category.image_url) {
          imagePreview.value = category.image_url
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load category'
        })
        router.push('/categories')
      } finally {
        loading.value = false
      }
    }

    const handleSubmit = async () => {
      try {
        loading.value = true;
        errors.value = {};

        // Format translations data
        const translations = {};
        Object.entries(form.value.translations).forEach(([locale, data]) => {
          translations[locale] = {
            name: data.name || '',
            description: data.description || ''
          };
        });

        // Create request data
        const requestData = {
          slug: form.value.slug,
          active: form.value.active ? 1 : 0,
          featured: form.value.featured ? 1 : 0,
          translations: translations
        };

        // Only add parent_id if it has a value
        if (form.value.parent_id) {
          requestData.parent_id = parseInt(form.value.parent_id);
        }

        console.log('Request data:', requestData);

        const url = isEdit.value 
          ? `/admin/categories/${route.params.id}`
          : `/admin/categories`;

        let response;
        
        // If we have an image, use FormData
        if (imageFile.value) {
          const formData = new FormData();
          
          // Append each field separately
          formData.append('slug', requestData.slug);
          formData.append('active', requestData.active);
          formData.append('featured', requestData.featured);
          
          // Append translations
          Object.entries(translations).forEach(([locale, data]) => {
            formData.append(`translations[${locale}][name]`, data.name);
            formData.append(`translations[${locale}][description]`, data.description);
          });

          // Append parent_id if exists
          if (requestData.parent_id) {
            formData.append('parent_id', requestData.parent_id);
          }
          
          // Append image
          formData.append('image', imageFile.value);

          response = await axios[isEdit.value ? 'put' : 'post'](url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json'
            }
          });
        } else {
          // If no image, send JSON directly
          response = await axios[isEdit.value ? 'put' : 'post'](url, requestData, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
        }

        console.log('Response:', response.data);

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Category has been saved successfully'
        });

        router.push('/categories');
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          requestData: error.config?.data
        });
        
        if (error.response?.status === 422) {
          errors.value = error.response.data.errors;
          const errorMessages = Object.values(error.response.data.errors).flat();
          Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: errorMessages[0]
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Failed to save category'
          });
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      errors,
      isEdit,
      categories, 
      imagePreview,
      imageName,
      handleImageChange,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.custom-file-input:lang(en)~.custom-file-label::after {
  content: "Browse";
}
.img-preview {
  max-width: 100%;
  height: auto;
  margin-top: 1rem;
}
</style>