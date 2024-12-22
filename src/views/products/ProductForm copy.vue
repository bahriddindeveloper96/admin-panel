<template>
  <div class="content">
    <div class="container-fluid">
      <div class="card">
        <div class="card-body">
          <form @submit.prevent="handleSubmit">
            <!-- Basic Information -->
            <div class="row">
              <div class="col-md-8">
                <!-- Translations -->
                <div class="card">
                  <div class="card-header">
                    <h4>Product Information</h4>
                    <div class="card-tools">
                      <div class="btn-group">
                        <button
                          v-for="lang in ['en', 'ru', 'uz']"
                          :key="lang"
                          type="button"
                          class="btn btn-sm"
                          :class="
                            currentLang === lang ? 'btn-primary' : 'btn-default'
                          "
                          @click="currentLang = lang"
                        >
                          {{ lang.toUpperCase() }}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="form-group">
                      <label>Product Name</label>
                      <input
                        v-model="form.translations[currentLang].name"
                        type="text"
                        class="form-control"
                        :placeholder="
                          'Enter product name in ' + currentLang.toUpperCase()
                        "
                      />
                    </div>

                    <div class="form-group">
                      <label>Description</label>
                      <textarea
                        v-model="form.translations[currentLang].description"
                        class="form-control"
                        rows="4"
                        :placeholder="
                          'Enter product description in ' +
                          currentLang.toUpperCase()
                        "
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label>Slug</label>
                  <input
                    v-model="form.slug"
                    type="text"
                    class="form-control"
                    placeholder="Enter product slug (e.g. iphone-15-pro)"
                  />
                </div>
              </div>

              <div class="col-md-4">
                <div class="form-group">
                  <label>Category</label>
                  <select v-model="form.category_id" class="form-control">
                    <option value="">Select Category</option>
                    <option
                      v-for="category in categories"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </div>

                <div class="form-check mb-3">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="active"
                    v-model="form.active"
                  />
                  <label class="form-check-label" for="active">Active</label>
                </div>

                <div class="form-check mb-3">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="featured"
                    v-model="form.featured"
                  />
                  <label class="form-check-label" for="featured"
                    >Featured</label
                  >
                </div>
              </div>
            </div>

            <!-- Attributes -->
            <div class="card mt-4">
              <div class="card-header">
                <h4>Product Attributes</h4>
              </div>
              <div class="card-body">
                <!-- Predefined Attributes -->
                <div class="row mb-3">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Brand</label>
                      <input
                        v-model="form.attributes.Brand"
                        type="text"
                        class="form-control"
                        placeholder="e.g. Apple, Samsung"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Display Size</label>
                      <input
                        v-model="form.attributes['Display Size']"
                        type="text"
                        class="form-control"
                        placeholder="e.g. 6.1 inches"
                      />
                    </div>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Display Resolution</label>
                      <input
                        v-model="form.attributes['Display Resolution']"
                        type="text"
                        class="form-control"
                        placeholder="e.g. 2556 x 1179 pixels"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Processor</label>
                      <input
                        v-model="form.attributes.Processor"
                        type="text"
                        class="form-control"
                        placeholder="e.g. A17 Pro chip"
                      />
                    </div>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Main Camera</label>
                      <input
                        v-model="form.attributes['Main Camera']"
                        type="text"
                        class="form-control"
                        placeholder="e.g. 48MP + 12MP + 12MP"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Front Camera</label>
                      <input
                        v-model="form.attributes['Front Camera']"
                        type="text"
                        class="form-control"
                        placeholder="e.g. 12MP TrueDepth"
                      />
                    </div>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Battery Capacity</label>
                      <input
                        v-model="form.attributes['Battery Capacity']"
                        type="text"
                        class="form-control"
                        placeholder="e.g. 3274 mAh"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Water Resistance</label>
                      <input
                        v-model="form.attributes['Water Resistance']"
                        type="text"
                        class="form-control"
                        placeholder="e.g. IP68"
                      />
                    </div>
                  </div>
                </div>

                <!-- Boolean Attributes -->
                <div class="row mb-3">
                  <div class="col-md-3">
                    <div class="form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="fastCharging"
                        v-model="form.attributes['Fast Charging']"
                      />
                      <label class="form-check-label" for="fastCharging"
                        >Fast Charging</label
                      >
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="5gSupport"
                        v-model="form.attributes['5G Support']"
                      />
                      <label class="form-check-label" for="5gSupport"
                        >5G Support</label
                      >
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="nfc"
                        v-model="form.attributes.NFC"
                      />
                      <label class="form-check-label" for="nfc">NFC</label>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="wirelessCharging"
                        v-model="form.attributes['Wireless Charging']"
                      />
                      <label class="form-check-label" for="wirelessCharging"
                        >Wireless Charging</label
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Variants -->
            <div class="card mt-4">
              <div class="card-header">
                <h4>Product Variants</h4>
                <button
                  type="button"
                  class="btn btn-sm btn-primary"
                  @click="addVariant"
                >
                  <i class="fas fa-plus"></i> Add Variant
                </button>
              </div>
              <div class="card-body">
                <div
                  v-for="(variant, index) in form.variants"
                  :key="index"
                  class="card mb-3"
                >
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-4">
                        <div class="form-group">
                          <label>RAM</label>
                          <input
                            v-model="variant.attribute_values.RAM"
                            type="text"
                            class="form-control"
                            placeholder="e.g. 8GB"
                          />
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-group">
                          <label>Storage</label>
                          <input
                            v-model="variant.attribute_values.Storage"
                            type="text"
                            class="form-control"
                            placeholder="e.g. 128GB"
                          />
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-group">
                          <label>Color</label>
                          <input
                            v-model="variant.attribute_values.Color"
                            type="text"
                            class="form-control"
                            placeholder="e.g. Black"
                          />
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-group">
                          <label>Price</label>
                          <input
                            v-model.number="variant.price"
                            type="number"
                            step="0.01"
                            class="form-control"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-group">
                          <label>Stock</label>
                          <input
                            v-model.number="variant.stock"
                            type="number"
                            class="form-control"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-group">
                          <label>Images</label>
                          <input
                            type="file"
                            class="form-control"
                            @change="(event) => handleImageUpload(event, index)"
                            multiple
                            accept="image/*"
                          />
                        </div>
                      </div>
                      <div class="col-md-4 d-flex align-items-end">
                        <button
                          type="button"
                          class="btn btn-danger"
                          @click="removeVariant(index)"
                        >
                          <i class="fas fa-trash"></i> Remove Variant
                        </button>
                      </div>
                    </div>
                    <div class="row">
                      <div
                        v-for="(image, imgIndex) in variant.images"
                        :key="imgIndex"
                        class="col-md-3"
                      >
                        <div class="position-relative">
                          <img :src="image" class="img-fluid mb-2" />
                          <button
                            type="button"
                            class="btn btn-danger btn-sm position-absolute"
                            style="top: 5px; right: 5px"
                            @click="removeImage(index, imgIndex)"
                          >
                            <i class="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row mt-4">
              <div class="col-12">
                <button type="submit" class="btn btn-primary">
                  <i class="fas fa-save"></i> Save Product
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "ProductForm",

  setup() {
    const router = useRouter();
    const currentLang = ref("en");

    // Initialize form with predefined structure
    const form = reactive({
      category_id: "",
      user_id: 1, // Default user_id
      slug: "",
      active: true,
      featured: false,
      images: [],
      attributes: {
        Brand: "",
        "Display Size": "",
        "Display Resolution": "",
        Processor: "",
        "Main Camera": "",
        "Front Camera": "",
        "Battery Capacity": "",
        "Fast Charging": false,
        "5G Support": false,
        NFC: false,
        "Wireless Charging": false,
        "Water Resistance": "",
      },
      translations: {
        en: { name: "", description: "" },
        ru: { name: "", description: "" },
        uz: { name: "", description: "" },
      },
      variants: [],
    });

    const categories = ref([]);

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/admin/categories");
        categories.value = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const handleImageUpload = async (event, variantIndex = null) => {
      const files = event.target.files;
      const formData = new FormData();

      Array.from(files).forEach((file) => {
        formData.append("images[]", file);
      });

      try {
        const response = await axios.post(
          "/admin/products/upload-images",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const relativePaths = response.data.paths;
        const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

        const imagePaths = relativePaths.map((path) =>
          path.startsWith("http") ? path : `${baseURL}${path}`
        );

        if (variantIndex !== null) {
          if (!form.variants[variantIndex].images) {
            form.variants[variantIndex].images = [];
          }
          form.variants[variantIndex].images.push(...imagePaths);
        } else {
          form.images.push(...imagePaths);
        }
      } catch (error) {
        console.error("Error uploading images:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response?.data?.message || "Failed to upload images.",
        });
      }
    };

    const removeImage = (variantIndex, imageIndex) => {
      form.variants[variantIndex].images.splice(imageIndex, 1);
    };

    const addVariant = () => {
      form.variants.push({
        attribute_values: {
          RAM: "",
          Storage: "",
          Color: "",
        },
        price: 0,
        stock: 0,
        images: [], // Initialize images for the new variant
      });
    };

    const removeVariant = (index) => {
      form.variants.splice(index, 1);
    };

    const handleSubmit = async () => {
      try {
        // Validate if at least one variant exists
        if (form.variants.length === 0) {
          form.variants.push({
            attribute_values: {
              RAM: "",
              Storage: "",
              Color: "",
            },
            price: 0,
            stock: 0,
            images: [], // Initialize images for the new variant
          });
        }

        // Ensure all variants have price and stock
        form.variants.forEach((variant) => {
          if (!variant.price) variant.price = 0;
          if (!variant.stock) variant.stock = 0;
        });

        const response = await axios.post("/admin/products", form);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Product has been created successfully.",
        });

        router.push("/admin/products");
      } catch (error) {
        console.error("Error creating product:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response?.data?.message || "Something went wrong!",
        });
      }
    };

    fetchCategories();

    return {
      form,
      categories,
      currentLang,
      handleImageUpload,
      removeImage,
      addVariant,
      removeVariant,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.card-tools {
  position: absolute;
  right: 1rem;
  top: 0.5rem;
}
</style>
