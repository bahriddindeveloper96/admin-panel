<template>
  <div class="content-wrapper">
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
                  <!-- Basic Information -->
                  <div class="form-group">
                    <label>Category Name</label>
                    <input
                      v-model="form.name"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.name }"
                      placeholder="Enter category name"
                    >
                    <div class="invalid-feedback">{{ errors.name }}</div>
                  </div>

                  <div class="form-group">
                    <label>Description</label>
                    <textarea
                      v-model="form.description"
                      class="form-control"
                      :class="{ 'is-invalid': errors.description }"
                      rows="4"
                      placeholder="Enter category description"
                    ></textarea>
                    <div class="invalid-feedback">{{ errors.description }}</div>
                  </div>
                </div>

                <div class="col-md-4">
                  <!-- Settings -->
                  <div class="form-group">
                    <label>Parent Category</label>
                    <select
                      v-model="form.parent_id"
                      class="form-control"
                      :class="{ 'is-invalid': errors.parent_id }"
                    >
                      <option value="">None (Root Category)</option>
                      <option
                        v-for="category in availableParentCategories"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
                    <div class="invalid-feedback">{{ errors.parent_id }}</div>
                  </div>

                  <div class="form-group">
                    <label>Status</label>
                    <select
                      v-model="form.status"
                      class="form-control"
                      :class="{ 'is-invalid': errors.status }"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <div class="invalid-feedback">{{ errors.status }}</div>
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
                  </div>

                  <div v-if="imagePreview || form.image" class="mt-2">
                    <img
                      :src="imagePreview || form.image"
                      class="img-fluid img-thumbnail"
                      alt="Category image"
                    >
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="row mt-4">
                <div class="col-md-12">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="loading"
                  >
                    <i class="fas fa-spinner fa-spin" v-if="loading"></i>
                    {{ isEdit ? 'Update Category' : 'Create Category' }}
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
    const categories = ref([])

    const isEdit = computed(() => !!route.params.id)

    const form = ref({
      name: '',
      description: '',
      parent_id: '',
      status: 'active',
      image: null
    })

    const imageName = computed(() => {
      return imageFile.value?.name || 'Choose image'
    })

    const availableParentCategories = computed(() => {
      if (!isEdit.value) return categories.value
      // Filter out current category and its descendants to prevent circular references
      return categories.value.filter(category => 
        category.id !== parseInt(route.params.id)
      )
    })

    // Methods
    const loadCategories = async () => {
      try {
        const response = await store.dispatch('categories/fetchCategories')
        categories.value = response
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }

    const loadCategory = async () => {
      if (!isEdit.value) return

      try {
        loading.value = true
        const category = await store.dispatch('categories/fetchCategory', route.params.id)
        form.value = {
          name: category.name,
          description: category.description,
          parent_id: category.parent_id,
          status: category.status,
          image: category.image_url
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

    const handleImageChange = (event) => {
      const file = event.target.files[0]
      if (!file) return

      imageFile.value = file
      imagePreview.value = URL.createObjectURL(file)
    }

    const handleSubmit = async () => {
      try {
        loading.value = true
        errors.value = {}

        const formData = new FormData()
        
        // Append basic fields
        Object.keys(form.value).forEach(key => {
          if (key !== 'image') {
            formData.append(key, form.value[key])
          }
        })

        // Append image if exists
        if (imageFile.value) {
          formData.append('image', imageFile.value)
        }

        if (isEdit.value) {
          await store.dispatch('categories/updateCategory', {
            id: route.params.id,
            categoryData: formData
          })
        } else {
          await store.dispatch('categories/createCategory', formData)
        }

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Category ${isEdit.value ? 'updated' : 'created'} successfully`
        })

        router.push('/categories')
      } catch (error) {
        if (error.response?.status === 422) {
          errors.value = error.response.data.errors
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Failed to ${isEdit.value ? 'update' : 'create'} category`
          })
        }
      } finally {
        loading.value = false
      }
    }

    // Lifecycle hooks
    onMounted(() => {
      loadCategories()
      loadCategory()
    })

    return {
      form,
      loading,
      errors,
      isEdit,
      imagePreview,
      imageName,
      availableParentCategories,
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

.img-thumbnail {
  max-height: 200px;
  object-fit: contain;
}
</style>
