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
import { ref, computed, onMounted } from 'vue'
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
      translations: {
        en: { name: '', description: '' },
        ru: { name: '', description: '' },
        uz: { name: '', description: '' }
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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/categories/${route.params.id}`)
        const category = response.data.data

        form.value = {
          slug: category.slug,
          active: category.active,
          featured: category.featured,
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

        const formData = new FormData();
        
        // Append basic fields
        formData.append('slug', form.value.slug);
        formData.append('active', form.value.active ? 1 : 0);
        formData.append('featured', form.value.featured ? 1 : 0);
        
        // Append translations
        Object.entries(form.value.translations).forEach(([locale, translation]) => {
          formData.append(`translations[${locale}][name]`, translation.name);
          formData.append(`translations[${locale}][description]`, translation.description);
        });

        // Append image if exists
        if (imageFile.value) {
          formData.append('image', imageFile.value);
        }

        const url = isEdit.value 
          ? `/admin/categories/${route.params.id}`
          : `/admin/categories`;

        const method = isEdit.value ? 'put' : 'post';

        const response = await axios[method](url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          }
        });

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message
        });

        router.push('/categories');
      } catch (error) {
        console.log('Error:', error.response?.data); // Xatolikni to'liqroq ko'rish
        if (error.response?.status === 422) {
          errors.value = error.response.data.errors;
          // Validation xatoliklarini ko'rsatish
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
            text: `Failed to ${isEdit.value ? 'update' : 'create'} category`
          });
        }
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadCategory()
    })

    return {
      form,
      loading,
      errors,
      isEdit,
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