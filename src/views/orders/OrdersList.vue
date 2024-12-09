<template>
  <div class="orders-list">
    <!-- Loading spinner -->
    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border" role="status">
        <span class="sr-only">Yuklanmoqda...</span>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Filters -->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row">
          <div class="col-md-3">
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                v-model="filters.search"
                placeholder="Qidirish..."
                @input="handleSearch"
              >
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <select class="form-control" v-model="filters.status" @change="fetchOrders">
                <option value="">Barcha holatlar</option>
                <option value="new">Yangi</option>
                <option value="pending">Kutilmoqda</option>
                <option value="processing">Jarayonda</option>
                <option value="shipped">Yuborilgan</option>
                <option value="delivered">Yetkazilgan</option>
                <option value="cancelled">Bekor qilingan</option>
              </select>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <input
                type="date"
                class="form-control"
                v-model="filters.start_date"
                @change="fetchOrders"
              >
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <input
                type="date"
                class="form-control"
                v-model="filters.end_date"
                @change="fetchOrders"
              >
            </div>
          </div>
          <div class="col-md-1">
            <button class="btn btn-primary" @click="exportOrders">
              <i class="fas fa-download"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="card">
      <div class="card-body table-responsive p-0">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Buyurtma №</th>
              <th>Mijoz</th>
              <th>Holati</th>
              <th>To'lov holati</th>
              <th>Summa</th>
              <th>Mahsulotlar</th>
              <th>Sana</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>#{{ order.order_number }}</td>
              <td>
                {{ order.user?.name || order.delivery_name }}
                <br>
                <small>{{ order.user?.phone || order.delivery_phone }}</small>
                <br>
                <small class="text-muted">{{ order.delivery_address }}</small>
              </td>
              <td>
                <span :class="getStatusBadgeClass(order.status)">
                  {{ getStatusText(order.status) }}
                </span>
              </td>
              <td>
                <span :class="getPaymentStatusBadgeClass(order.payment_status)">
                  {{ getPaymentStatusText(order.payment_status) }}
                </span>
                <br>
                <small>{{ order.payment_method?.translations.find(t => t.locale === 'uz')?.name }}</small>
              </td>
              <td>
                {{ formatPrice(order.total_amount) }} so'm
                <br>
                <small class="text-muted">
                  Yetkazib berish: {{ formatPrice(order.delivery_cost) }} so'm
                </small>
                <br>
                <small class="text-muted" v-if="order.total_discount > 0">
                  Chegirma: {{ formatPrice(order.total_discount) }} so'm
                </small>
              </td>
              <td>
                <div v-for="item in order.items" :key="item.id" class="mb-1">
                  {{ item.product.name }} x {{ item.quantity }}
                  <br>
                  <small class="text-muted">{{ formatPrice(item.price) }} so'm</small>
                </div>
              </td>
              <td>{{ formatDate(order.created_at) }}</td>
              <td>
                <button 
                  class="btn btn-sm btn-info mr-1" 
                  @click="viewOrder(order.id)"
                  title="Ko'rish"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button 
                  class="btn btn-sm btn-primary mr-1"
                  @click="showStatusModal(order)"
                  title="Holatni o'zgartirish"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  class="btn btn-sm btn-danger" 
                  @click="deleteOrder(order.id)"
                  title="O'chirish"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer clearfix">
        <pagination
          :total="total"
          :per-page="perPage"
          :current-page="currentPage"
          @page-changed="handlePageChange"
        />
      </div>
    </div>

    <!-- Order Status Modal -->
    <div class="modal fade" id="orderStatusModal" tabindex="-1" ref="orderStatusModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Buyurtma holatini yangilash</h5>
            <button type="button" class="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateOrderStatus">
              <div class="form-group">
                <label>Holat</label>
                <select class="form-control" v-model="statusForm.status" required>
                  <option value="new">Yangi</option>
                  <option value="pending">Kutilmoqda</option>
                  <option value="processing">Jarayonda</option>
                  <option value="shipped">Yuborilgan</option>
                  <option value="delivered">Yetkazilgan</option>
                  <option value="cancelled">Bekor qilingan</option>
                </select>
              </div>
              <div class="form-group">
                <label>Izoh</label>
                <textarea 
                  class="form-control" 
                  v-model="statusForm.notes"
                  rows="3"
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Yangilash</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useI18n } from 'vue-i18n'
import Pagination from '../../components/Pagination.vue'

export default {
  name: 'OrdersList',
  components: {
    Pagination
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const { t } = useI18n()

    const filters = ref({
      search: '',
      status: '',
      start_date: '',
      end_date: ''
    })
    const statusForm = ref({
      status: '',
      notes: ''
    })
    const selectedOrderId = ref(null)
    const orderStatusModal = ref(null)

    const orders = ref([]); // To store fetched orders
    const loading = ref(true); // Loading state
    const error = ref(null); // Error state

    const fetchOrderDetails = async (orderId) => {
      try {
        const response = await axios.get(`/admin/orders/${orderId}`); // Fetch order details
        return response.data.order; // Return order data
      } catch (err) {
        error.value = 'Xato: ' + err.message; // Handle error
      }
    };

    const fetchOrders = async () => {
      loading.value = true;
      error.value = null;
      try {
        const response = await axios.get('/admin/orders'); // Fetch orders from API
        orders.value = await Promise.all(response.data.orders.data.map(async (order) => {
          const orderDetails = await fetchOrderDetails(order.id); // Fetch each order details
          return {
            ...order,
            ...orderDetails
          };
        })); // Store orders with details
      } catch (err) {
        error.value = 'Xato: ' + err.message; // Handle error
      } finally {
        loading.value = false; // Set loading to false
      }
    };

    // Store getters
    const total = computed(() => store.getters['orders/getTotal'])
    const currentPage = computed(() => store.getters['orders/getCurrentPage'])
    const perPage = computed(() => store.getters['orders/getPerPage'])

    const getStatusText = (status) => {
      const statuses = {
        new: 'Yangi',
        pending: 'Kutilmoqda',
        processing: 'Jarayonda',
        shipped: 'Yuborilgan',
        delivered: 'Yetkazilgan',
        cancelled: 'Bekor qilingan'
      }
      return statuses[status] || status
    }

    const getPaymentStatusText = (status) => {
      const statuses = {
        pending: 'Kutilmoqda',
        paid: "To'langan",
        failed: 'Xatolik',
        refunded: 'Qaytarilgan'
      }
      return statuses[status] || status
    }

    const getStatusBadgeClass = (status) => {
      const classes = {
        new: 'badge badge-info',
        pending: 'badge badge-warning',
        processing: 'badge badge-primary',
        shipped: 'badge badge-info',
        delivered: 'badge badge-success',
        cancelled: 'badge badge-danger'
      }
      return classes[status] || 'badge badge-secondary'
    }

    const getPaymentStatusBadgeClass = (status) => {
      const classes = {
        pending: 'badge badge-warning',
        paid: 'badge badge-success',
        failed: 'badge badge-danger',
        refunded: 'badge badge-info'
      }
      return classes[status] || 'badge badge-secondary'
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat('uz-UZ').format(parseFloat(price || 0))
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const handleSearch = () => {
      currentPage.value = 1
      fetchOrders()
    }

    const handlePageChange = (page) => {
      currentPage.value = page
      fetchOrders()
    }

    const viewOrder = (orderId) => {
      router.push(`/orders/${orderId}`)
    }

    const showStatusModal = (order) => {
      selectedOrderId.value = order.id
      statusForm.value = {
        status: order.status,
        notes: ''
      }
      $(orderStatusModal.value).modal('show')
    }

    const updateOrderStatus = async () => {
      try {
        await store.dispatch('orders/updateOrderStatus', {
          id: selectedOrderId.value,
          statusData: statusForm.value
        })
        await fetchOrders()
        $(orderStatusModal.value).modal('hide')
        Swal.fire({
          icon: 'success',
          title: 'Buyurtma holati yangilandi',
          showConfirmButton: false,
          timer: 1500
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Xatolik yuz berdi',
          text: error.message
        })
      }
    }

    const deleteOrder = async (orderId) => {
      const result = await Swal.fire({
        title: 'Buyurtmani o\'chirmoqchimisiz?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ha',
        cancelButtonText: 'Yo\'q'
      })

      if (result.isConfirmed) {
        try {
          await store.dispatch('orders/deleteOrder', orderId)
          await fetchOrders()
          Swal.fire({
            icon: 'success',
            title: 'Buyurtma o\'chirildi',
            showConfirmButton: false,
            timer: 1500
          })
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Xatolik yuz berdi',
            text: error.message
          })
        }
      }
    }

    const exportOrders = async () => {
      try {
        const blob = await store.dispatch('orders/exportOrders', {
          status: filters.value.status,
          start_date: filters.value.start_date,
          end_date: filters.value.end_date
        })
        
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `orders-${new Date().toISOString()}.xlsx`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Xatolik yuz berdi',
          text: error.message
        })
      }
    }

    onMounted(() => {
      fetchOrders()
    })

    return {
      filters,
      statusForm,
      orderStatusModal,
      orders,
      loading,
      error,
      total,
      currentPage,
      perPage,
      getStatusText,
      getPaymentStatusText,
      getStatusBadgeClass,
      getPaymentStatusBadgeClass,
      formatPrice,
      formatDate,
      handleSearch,
      handlePageChange,
      viewOrder,
      showStatusModal,
      updateOrderStatus,
      deleteOrder,
      exportOrders
    }
  }
}
</script>

<style scoped>
.badge {
  font-size: 0.9em;
  padding: 0.5em 0.75em;
}
.btn {
  margin-right: 0.25rem;
}
.btn:last-child {
  margin-right: 0;
}
.table td {
  vertical-align: middle;
}
</style>
