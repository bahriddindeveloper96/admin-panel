<template>
  <div class="content">
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
    </div>

    <div class="content">
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
                  <th>{{ $t("products.table.image") }}</th>
                  <th>{{ $t("products.table.name") }}</th>
                  <th>{{ $t("products.table.category") }}</th>
                  <th>{{ $t("products.table.price") }}</th>
                  <th>{{ $t("products.table.stock") }}</th>
                  <th>{{ $t("products.table.status") }}</th>
                  <th class="text-center">{{ $t("common.actions") }}</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="isLoading">
                  <tr>
                    <td colspan="8">
                      <div
                        class="d-flex justify-content-center align-items-center py-5"
                      >
                        <div class="spinner-border" role="status">
                          <span class="sr-only">{{
                            $t("common.loading")
                          }}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
                <template v-else-if="!products.data.length">
                  <tr>
                    <td colspan="8">
                      <div class="empty-state">
                        <i class="fas fa-box-open"></i>
                        <p class="mb-0">{{ $t("products.no_products") }}</p>
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
                      <vue-carousel
                        :autoplay="true"
                        :loop="true"
                        class="product-slider"
                      >
                        <img
                          v-for="(image, index) in product.images"
                          :key="index"
                          :src="image"
                          :alt="`${product.name} - Image ${index + 1}`"
                          class="slider-image"
                        />
                      </vue-carousel>
                    </td>
                    <td>
                      <div class="fw-medium">{{ product.name }}</div>
                      <small class="text-muted"
                        >{{ $t("common.id") }}: {{ product.id }}</small
                      >
                    </td>
                    <td>
                      <span class="category-badge">{{
                        product.category?.name || $t("products.uncategorized")
                      }}</span>
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
                      <span :class="getStatusBadgeClass(product.active)">
                        {{
                          product.active
                            ? $t("common.status.active")
                            : $t("common.status.inactive")
                        }}
                      </span>
                    </td>
                    <td>
                      <div class="d-flex justify-content-center gap-2">
                        <router-link
                          :to="`/products/${product.id}/edit`"
                          class="btn btn-sm btn-info"
                          :title="$t('common.edit')"
                        >
                          <i class="fas fa-edit"></i>
                        </router-link>
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
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import Swal from "sweetalert2";
import VueCarousel from "@chenfengyuan/vue-carousel";
import Pagination from "@/components/Pagination.vue";

export default {
  name: "ProductsList",
  components: { Pagination, VueCarousel },

  setup() {
    const store = useStore();
    const selectedProducts = ref([]);
    const filters = ref({
      search: "",
      category: "",
      status: "",
      page: 1,
    });

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
      return new Intl.NumberFormat("uz-UZ", {
        style: "currency",
        currency: "UZS",
      }).format(value);
    };

    const formatPriceRange = (variants) => {
      const prices = variants.map((variant) => variant.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
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
      loadProducts();
    });

    return {
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
      toggleSelectAll,
      formatCurrency,
      formatPriceRange,
      getTotalStock,
      getStatusBadgeClass,
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

.slider-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.2s;
}

.slider-image:hover {
  transform: scale(1.05);
}
.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

.card-header {
  background: white;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 15px 15px 0 0 !important;
  padding: 1.5rem;
}

.card-body {
  padding: 0;
}

.table {
  margin-bottom: 0;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  font-size: 0.8rem;
  padding: 1.2rem 1rem;
  background: #f8f9fa;
}

.table td {
  padding: 1rem;
  vertical-align: middle;
  border-top: 1px solid #f0f0f0;
}

.table tbody tr {
  transition: all 0.2s;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.product-image:hover {
  transform: scale(1.1);
}

.badge {
  font-size: 0.75rem;
  padding: 0.5em 0.8em;
  border-radius: 50px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.badge-success {
  background-color: #28a745;
  color: white;
}

.badge-danger {
  background-color: #dc3545;
  color: white;
}

.btn {
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-info {
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 0.6rem 1rem;
  transition: all 0.2s;
}

.form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.15);
}

.search-box {
  position: relative;
}

.search-box .form-control {
  padding-left: 2.5rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.card-footer {
  background: white;
  border-top: 1px solid #f0f0f0;
  padding: 1rem 1.5rem;
  border-radius: 0 0 15px 15px !important;
}

/* Loading spinner */
.spinner-border {
  width: 2rem;
  height: 2rem;
  color: #007bff;
}

/* Empty state */
.empty-state {
  padding: 3rem 1rem;
  text-align: center;
  color: #666;
}

.empty-state i {
  font-size: 3rem;
  color: #ddd;
  margin-bottom: 1rem;
}

/* Checkbox styling */
.custom-checkbox {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid #ddd;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
}

.custom-checkbox:checked {
  background-color: #007bff;
  border-color: #007bff;
}

/* Price and stock badges */
.price-badge {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  font-weight: 500;
}

.stock-badge {
  background: #fff3e0;
  color: #ef6c00;
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  font-weight: 500;
}

.category-badge {
  background: #e2e3e5;
  color: #6c757d;
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  font-weight: 500;
}
</style>
