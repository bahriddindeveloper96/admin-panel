<template>
  <div class="content">
    <div class="content">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">{{ isEdit ? 'Edit Product' : 'Add Product' }}</h1>
          </div>
          <div class="col-sm-6">
            <div class="float-sm-right">
              <router-link to="/products" class="btn btn-default">
                <i class="fas fa-arrow-left"></i> Back to Products
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
              <!-- Basic Information -->
              <div class="row">
                <div class="col-md-8">
                  <div class="form-group">
                    <label>Product Name</label>
                    <input
                      v-model="form.name"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.name }"
                      placeholder="Enter product name"
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
                      placeholder="Enter product description"
                    ></textarea>
                    <div class="invalid-feedback">{{ errors.description }}</div>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="form-group">
                    <label>Category</label>
                    <select
                      v-model="form.category_id"
                      class="form-control"
                      :class="{ 'is-invalid': errors.category_id }"
                    >
                      <option value="">Select Category</option>
                      <option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
                    <div class="invalid-feedback">{{ errors.category_id }}</div>
                  </div>

                  <div class="form-group">
                    <label>Price</label>
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">$</span>
                      </div>
                      <input
                        v-model.number="form.price"
                        type="number"
                        step="0.01"
                        class="form-control"
                        :class="{ 'is-invalid': errors.price }"
                        placeholder="0.00"
                      >
                      <div class="invalid-feedback">{{ errors.price }}</div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Stock</label>
                    <input
                      v-model.number="form.stock"
                      type="number"
                      class="form-control"
                      :class="{ 'is-invalid': errors.stock }"
                      placeholder="Enter stock quantity"
                    >
                    <div class="invalid-feedback">{{ errors.stock }}</div>
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
                </div>
              </div>

              <!-- Images -->
              <div class="row mt-4">
                <div class="col-md-12">
                  <h4>Images</h4>
                  
                  <div class="form-group">
                    <label>Main Image</label>
                    <div class="custom-file">
                      <input
                        type="file"
                        class="custom-file-input"
                        :class="{ 'is-invalid': errors.image }"
                        @change="handleMainImageChange"
                        accept="image/*"
                      >
                      <label class="custom-file-label">
                        {{ mainImageName || 'Choose main image' }}
                      </label>
                      <div class="invalid-feedback">{{ errors.image }}</div>
                    </div>
                  </div>

                  <div v-if="mainImagePreview || form.image" class="mb-3">
                    <img
                      :src="mainImagePreview || form.image"
                      class="img-thumbnail"
                      style="max-height: 200px"
                    >
                  </div>

                  <div class="form-group">
                    <label>Gallery Images</label>
                    <div class="custom-file">
                      <input
                        type="file"
                        class="custom-file-input"
                        :class="{ 'is-invalid': errors.gallery }"
                        @change="handleGalleryChange"
                        accept="image/*"
                        multiple
                      >
                      <label class="custom-file-label">
                        {{ galleryImagesName || 'Choose gallery images' }}
                      </label>
                      <div class="invalid-feedback">{{ errors.gallery }}</div>
                    </div>
                  </div>

                  <div v-if="galleryPreviews.length || form.gallery?.length" class="row">
                    <div
                      v-for="(preview, index) in galleryPreviews"
                      :key="'new-' + index"
                      class="col-md-2 mb-3"
                    >
                      <img
                        :src="preview"
                        class="img-thumbnail"
                        style="max-height: 100px"
                      >
                      <button
                        type="button"
                        class="btn btn-danger btn-sm mt-1"
                        @click="removeGalleryImage(index)"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                    <div
                      v-for="(image, index) in form.gallery"
                      :key="'existing-' + index"
                      class="col-md-2 mb-3"
                    >
                      <img
                        :src="image"
                        class="img-thumbnail"
                        style="max-height: 100px"
                      >
                      <button
                        type="button"
                        class="btn btn-danger btn-sm mt-1"
                        @click="removeExistingGalleryImage(index)"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Specifications -->
              <div class="row mt-4">
                <div class="col-md-12">
                  <h4>Specifications</h4>
                  
                  <div class="table-responsive">
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Value</th>
                          <th width="50">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(spec, index) in form.specifications" :key="index">
                          <td>
                            <input
                              v-model="spec.name"
                              type="text"
                              class="form-control"
                              placeholder="Specification name"
                            >
                          </td>
                          <td>
                            <input
                              v-model="spec.value"
                              type="text"
                              class="form-control"
                              placeholder="Specification value"
                            >
                          </td>
                          <td>
                            <button
                              type="button"
                              class="btn btn-danger btn-sm"
                              @click="removeSpecification(index)"
                            >
                              <i class="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colspan="3">
                            <button
                              type="button"
                              class="btn btn-success btn-sm"
                              @click="addSpecification"
                            >
                              <i class="fas fa-plus"></i> Add Specification
                            </button>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
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
                    {{ isEdit ? 'Update Product' : 'Create Product' }}
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
  name: 'ProductForm',

  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    const loading = ref(false)
    const errors = ref({})
    const categories = ref([])
    const mainImagePreview = ref(null)
    const galleryPreviews = ref([])
    const mainImageFile = ref(null)
    const galleryFiles = ref([])

    const isEdit = computed(() => !!route.params.id)

    const form = ref({
      name: '',
      description: '',
      category_id: '',
      price: '',
      stock: '',
      status: 'active',
      specifications: [],
      gallery: []
    })

    const mainImageName = computed(() => {
      return mainImageFile.value?.name || 'Choose main image'
    })

    const galleryImagesName = computed(() => {
      return galleryFiles.value.length
        ? `${galleryFiles.value.length} files selected`
        : 'Choose gallery images'
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

    const loadProduct = async () => {
      if (!isEdit.value) return

      try {
        loading.value = true
        const product = await store.dispatch('products/fetchProduct', route.params.id)
        form.value = {
          ...product,
          specifications: product.specifications || []
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load product'
        })
        router.push('/products')
      } finally {
        loading.value = false
      }
    }

    const handleMainImageChange = (event) => {
      const file = event.target.files[0]
      if (!file) return

      mainImageFile.value = file
      mainImagePreview.value = URL.createObjectURL(file)
    }

    const handleGalleryChange = (event) => {
      const files = Array.from(event.target.files)
      if (!files.length) return

      galleryFiles.value = files
      galleryPreviews.value = files.map(file => URL.createObjectURL(file))
    }

    const removeGalleryImage = (index) => {
      galleryFiles.value.splice(index, 1)
      galleryPreviews.value.splice(index, 1)
    }

    const removeExistingGalleryImage = (index) => {
      form.value.gallery.splice(index, 1)
    }

    const addSpecification = () => {
      form.value.specifications.push({ name: '', value: '' })
    }

    const removeSpecification = (index) => {
      form.value.specifications.splice(index, 1)
    }

    const handleSubmit = async () => {
      try {
        loading.value = true
        errors.value = {}

        const formData = new FormData()
        
        // Append basic fields
        Object.keys(form.value).forEach(key => {
          if (key !== 'image' && key !== 'gallery' && key !== 'specifications') {
            formData.append(key, form.value[key])
          }
        })

        // Append specifications
        formData.append('specifications', JSON.stringify(form.value.specifications))

        // Append images
        if (mainImageFile.value) {
          formData.append('image', mainImageFile.value)
        }

        galleryFiles.value.forEach(file => {
          formData.append('gallery[]', file)
        })

        if (isEdit.value) {
          await store.dispatch('products/updateProduct', {
            id: route.params.id,
            productData: formData
          })
        } else {
          await store.dispatch('products/createProduct', formData)
        }

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Product ${isEdit.value ? 'updated' : 'created'} successfully`
        })

        router.push('/products')
      } catch (error) {
        if (error.response?.status === 422) {
          errors.value = error.response.data.errors
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Failed to ${isEdit.value ? 'update' : 'create'} product`
          })
        }
      } finally {
        loading.value = false
      }
    }

    // Lifecycle hooks
    onMounted(() => {
      loadCategories()
      loadProduct()
    })

    return {
      form,
      loading,
      errors,
      categories,
      isEdit,
      mainImagePreview,
      galleryPreviews,
      mainImageName,
      galleryImagesName,
      handleMainImageChange,
      handleGalleryChange,
      removeGalleryImage,
      removeExistingGalleryImage,
      addSpecification,
      removeSpecification,
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
  object-fit: cover;
  width: 100%;
}
</style>
