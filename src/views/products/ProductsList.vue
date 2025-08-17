<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row mb-2">
        <div class="col-sm-6">
          <h1 class="m-0">{{ $t("products.title") }}</h1>
        </div>
        <div class="col-sm-6">
          <div class="float-sm-right">
            <router-link to="/products/create" class="btn btn-primary">
              <i class="fas fa-plus"></i> {{ $t("products.add_product") }}
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="card">
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex gap-3">
              <button
                class="btn btn-danger d-flex align-items-center gap-2"
                :disabled="!selectedProducts.length || isLoading"
                @click="deleteSelected"
              >
                <i class="fas fa-trash"></i>
                <span>{{ $t("common.delete_selected") }}</span>
              </button>
              <button
                class="btn btn-success d-flex align-items-center gap-2"
                :disabled="isLoading"
                @click="exportProducts"
              >
                <i class="fas fa-file-export"></i>
                <span>{{ $t("common.export") }}</span>
              </button>
            </div>
            <div class="search-box">
              <i class="fas fa-search search-icon"></i>
              <input
                type="text"
                class="form-control search-input"
                :placeholder="$t('products.search_placeholder')"
                v-model="filters.search"
                @input="handleSearch"
                :disabled="isLoading"
              />
            </div>
          </div>
        </div>

        <div class="card-body table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th class="text-center">
                  <input
                    type="checkbox"
                    class="custom-checkbox"
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                    :disabled="isLoading"
                  />
                </th>
                <th>{{ $t("products.image") }}</th>
                <th>{{ $t("products.name") }}</th>
                <th>{{ $t("products.category") }}</th>
                <th>{{ $t("products.price") }}</th>
                <th>{{ $t("products.stock") }}</th>
                <th>{{ $t("common.status") }}</th>
                <th class="text-center">{{ $t("common.actions") }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="isLoading">
                <tr>
                  <td colspan="8">
                    <div class="d-flex justify-content-center py-5">
                      <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="product in products.data" :key="product.id">
                  <td class="text-center">
                    <input
                      type="checkbox"
                      class="custom-checkbox"
                      :value="product.id"
                      v-model="selectedProducts"
                    />
                  </td>
                  <td>
                    <div class="variants-container">
                      <div class="variant-images">
                        <div class="image-container">
                          <img
                            v-if="product.images && product.images.length > 0"
                            :src="product.images[currentImageIndex[product.id]]?.image"
                            :alt="product.name"
                            class="slider-image"
                            @error="handleImageError"
                          />
                          <div class="image-controls">
                            <button class="nav-btn prev" @click="prevImage(product.id)">
                              <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="nav-btn next" @click="nextImage(product.id)">
                              <i class="fas fa-chevron-right"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="fw-medium">
                      <router-link 
                        :to="{ name: 'product-detail', params: { id: product.id }}"
                        class="text-primary"
                      >
                        {{ product.name }}
                      </router-link>
                    </div>
                    <small class="text-muted">{{ $t("common.id") }}: {{ product.id }}</small>
                  </td>
                  <td>
                    <span class="category-badge">{{ product.category?.name || $t("products.uncategorized") }}</span>
                  </td>
                  <td>
                    <div class="price-badge">
                      <template v-if="product.variants?.length">
                        {{ formatPriceRange(product.variants) }}
                      </template>
                      <template v-else>
                        {{ formatCurrency(product.price) }}
                      </template>
                    </div>
                  </td>
                  <td>
                    <div class="stock-badge">
                      <template v-if="product.variants?.length">
                        {{ getTotalStock(product.variants) }}
                      </template>
                      <template v-else>
                        {{ product.stock }}
                      </template>
                    </div>
                  </td>
                  <td>
                    <span 
                      :class="getStatusBadgeClass(product.active)"
                      class="cursor-pointer"
                      :title="$t('products.change_status')"
                      @click="changeStatus(product)"
                    >
                      {{
                        product.active
                          ? $t("common.status.active")
                          : $t("common.status.inactive")
                      }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex justify-content-center gap-2">
                      <button
                        class="btn btn-info btn-sm mr-2"
                        @click="editProduct(product)"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button
                        class="btn btn-sm btn-danger"
                        @click="deleteProduct(product.id)"
                        :disabled="isLoading"
                        :title="$t('common.delete')"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div class="card-footer clearfix">
          <pagination
            v-if="products.total > products.per_page"
            :total="products.total"
            :per-page="products.per_page"
            :current-page="products.current_page"
            :links="products.links"
            @page-changed="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Swal from "sweetalert2";
import Pagination from "@/components/Pagination.vue";

export default {
  name: "ProductsList",
  components: { Pagination },
  setup() {
    const store = useStore();
    const router = useRouter();
    const { t } = useI18n();
    const base_url = import.meta.env.VITE_API_URL || '';
    const selectedProducts = ref([]);
    const filters = ref({
      search: "",
      category: "",
      status: "",
      page: 1,
    });

    const currentImageIndex = ref({});
    const imageIntervals = ref({});

    // Methods
    const loadProducts = async () => {
      try {
        await store.dispatch("products/fetchProducts", filters.value);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      }
    };

    const changeStatus = async (product) => {
      if (isLoading.value) return;
      const newStatus = product.active ? 'inactive' : 'aktiv';
      try {
        const result = await Swal.fire({
          title: newStatus === 'aktiv' ? t('common.confirm_activate') : t('common.confirm_deactivate'),
          text: t('common.are_you_sure'),
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: t('common.yes'),
          cancelButtonText: t('common.cancel')
        });
        if (!result.isConfirmed) return;
        await store.dispatch('products/updateProductStatus', { id: product.id, status: newStatus });
        Swal.fire({ icon: 'success', title: t('common.success'), timer: 1200, showConfirmButton: false });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Failed to update status' });
      }
    };

    const handleSearch = () => {
      filters.value.page = 1;
      loadProducts();
    };

    const handlePageChange = (page) => {
      filters.value.page = page;
      loadProducts();
    };

    const deleteProduct = async (id) => {
      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
          await store.dispatch("products/deleteProduct", id);
          await loadProducts();
          Swal.fire("Deleted!", "Product has been deleted.", "success");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      }
    };

    const deleteSelected = async () => {
      if (!selectedProducts.value.length) return;

      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete them!",
        });

        if (result.isConfirmed) {
          await store.dispatch(
            "products/deleteProducts",
            selectedProducts.value
          );
          selectedProducts.value = [];
          await loadProducts();
          Swal.fire(
            "Deleted!",
            "Selected products have been deleted.",
            "success"
          );
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      }
    };

    const exportProducts = async () => {
      try {
        await store.dispatch("products/exportProducts", filters.value);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      }
    };

    const handleImageError = (e) => {
      e.target.src = "/placeholder-image.jpg";
    };

    const startImageSlider = (productId) => {
      if (imageIntervals.value[productId]) {
        clearInterval(imageIntervals.value[productId]);
      }
      
      if (currentImageIndex.value[productId] === undefined) {
        currentImageIndex.value[productId] = 0;
      }

      imageIntervals.value[productId] = setInterval(() => {
        nextImage(productId);
      }, 3000);
    };

    const nextImage = (productId) => {
      const product = products.value.data.find(p => p.id === productId);
      if (!product || !product.images.length) return;

      currentImageIndex.value[productId] = (currentImageIndex.value[productId] + 1) % product.images.length;
    };

    const prevImage = (productId) => {
      const product = products.value.data.find(p => p.id === productId);
      if (!product || !product.images.length) return;

      currentImageIndex.value[productId] = currentImageIndex.value[productId] === 0 
        ? product.images.length - 1 
        : currentImageIndex.value[productId] - 1;
    };

    const editProduct = (product) => {
      router.push(`/products/${product.id}/edit`);
    };

    // Computed
    const products = computed(() => {
      const productsData = store.getters["products/getProducts"];
      return {
        data: productsData?.data || [],
        total: productsData?.total || 0,
        per_page: productsData?.per_page || 10,
        current_page: productsData?.current_page || 1,
        links: productsData?.links || [],
      };
    });

    const isAllSelected = computed(() => {
      const productsData = products.value?.data || [];
      return (
        productsData.length > 0 &&
        selectedProducts.value.length === productsData.length
      );
    });

    const isLoading = computed(() => store.getters["products/isLoading"]);

    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        selectedProducts.value = [];
      } else {
        selectedProducts.value = products.value.data.map(
          (product) => product.id
        );
      }
    };

    // Formatting functions
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('uz-UZ', {
        style: 'currency',
        currency: 'UZS'
      }).format(value);
    };

    const formatPriceRange = (variants) => {
      const prices = variants.map(variant => parseFloat(variant.price));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice === maxPrice) {
        return formatCurrency(minPrice);
      }
      return `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
    };

    const getTotalStock = (variants) => {
      return variants.reduce((total, variant) => total + variant.stock, 0);
    };

    const getStatusBadgeClass = (active) => {
      return active ? "badge badge-success" : "badge badge-danger";
    };

    // Lifecycle
    onMounted(() => {
      loadProducts().then(() => {
        products.value.data.forEach(product => {
          if (product.images && product.images.length > 0) {
            currentImageIndex.value[product.id] = 0;
            startImageSlider(product.id);
          }
        });
      });
    });

    return {
      base_url,
      products,
      selectedProducts,
      filters,
      isLoading,
      isAllSelected,
      handleSearch,
      handlePageChange,
      deleteProduct,
      deleteSelected,
      exportProducts,
      changeStatus,
      toggleSelectAll,
      formatCurrency,
      formatPriceRange,
      getTotalStock,
      getStatusBadgeClass,
      handleImageError,
      currentImageIndex,
      nextImage,
      prevImage,
      editProduct,
    };
  },
};
</script>

<style scoped>
.product-slider {
  max-width: 80px;
  max-height: 80px;
  margin: 0 auto;
  position: relative;
}

.variants-container {
  width: 150px;
  margin: 0 auto;
}

.variant-images {
  width: 100%;
  position: relative;
}

.image-container {
  position: relative;
  width: 150px;
  height: 150px;
  overflow: hidden;
}

.slider-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.image-controls {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 0 5px;
}

.image-container:hover .image-controls {
  opacity: 1;
  background: rgba(0, 0, 0, 0.2);
}

.nav-btn {
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
}

.nav-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

.nav-btn i {
  font-size: 12px;
}

/* ... other styles ... */
</style>
