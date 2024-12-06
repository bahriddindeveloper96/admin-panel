<template>
  <div class="orders-list">
    <!-- Filters -->
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-md-3">
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                v-model="filters.search"
                :placeholder="$t('orders.filters.search')"
                @input="handleSearch"
              >
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <select class="form-control" v-model="filters.status" @change="fetchOrders">
                <option value="">{{ $t('orders.filters.all_status') }}</option>
                <option value="pending">{{ $t('orders.status.pending') }}</option>
                <option value="processing">{{ $t('orders.status.processing') }}</option>
                <option value="shipped">{{ $t('orders.status.shipped') }}</option>
                <option value="delivered">{{ $t('orders.status.delivered') }}</option>
                <option value="cancelled">{{ $t('orders.status.cancelled') }}</option>
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
              <th>{{ $t('orders.table.order_id') }}</th>
              <th>{{ $t('orders.table.customer') }}</th>
              <th>{{ $t('orders.table.status') }}</th>
              <th>{{ $t('orders.table.total_amount') }}</th>
              <th>{{ $t('orders.table.items') }}</th>
              <th>{{ $t('orders.table.date') }}</th>
              <th>{{ $t('orders.table.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>#{{ order.id }}</td>
              <td>{{ order.user?.name }}</td>
              <td>
                <span :class="getStatusBadgeClass(order.status)">
                  {{ $t(`orders.status.${order.status}`) }}
                </span>
              </td>
              <td>${{ formatNumber(order.total_amount) }}</td>
              <td>{{ order.items?.length || 0 }} {{ $t('orders.table.items_count') }}</td>
              <td>{{ formatDate(order.created_at) }}</td>
              <td>
                <button 
                  class="btn btn-sm btn-info mr-1" 
                  @click="viewOrder(order.id)"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button 
                  class="btn btn-sm btn-danger" 
                  @click="deleteOrder(order.id)"
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
            <h5 class="modal-title">{{ $t('orders.modal.update_status') }}</h5>
            <button type="button" class="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateOrderStatus">
              <div class="form-group">
                <label>{{ $t('orders.modal.status') }}</label>
                <select class="form-control" v-model="statusForm.status" required>
                  <option value="pending">{{ $t('orders.status.pending') }}</option>
                  <option value="processing">{{ $t('orders.status.processing') }}</option>
                  <option value="shipped">{{ $t('orders.status.shipped') }}</option>
                  <option value="delivered">{{ $t('orders.status.delivered') }}</option>
                  <option value="cancelled">{{ $t('orders.status.cancelled') }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>{{ $t('orders.modal.tracking_number') }}</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="statusForm.tracking_number"
                >
              </div>
              <div class="form-group">
                <label>{{ $t('orders.modal.notes') }}</label>
                <textarea 
                  class="form-control" 
                  v-model="statusForm.notes"
                  rows="3"
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary">{{ $t('orders.modal.update') }}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'
import Pagination from '../../components/Pagination.vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'OrdersList',
  components: {
    Pagination
  },
  setup() {
    const router = useRouter()
    const orders = ref([])
    const total = ref(0)
    const perPage = ref(15)
    const currentPage = ref(1)
    const filters = ref({
      search: '',
      status: '',
      start_date: '',
      end_date: ''
    })
    const statusForm = ref({
      status: '',
      tracking_number: '',
      notes: ''
    })
    const selectedOrderId = ref(null)
    const orderStatusModal = ref(null)
    const { t } = useI18n()

    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/admin/orders', {
          params: {
            page: currentPage.value,
            per_page: perPage.value,
            search: filters.value.search,
            status: filters.value.status,
            start_date: filters.value.start_date,
            end_date: filters.value.end_date
          }
        })
        orders.value = response.data.data
        total.value = response.data.total
      } catch (error) {
        console.error('Error fetching orders:', error)
        Swal.fire('Error', 'Failed to fetch orders', 'error')
      }
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
        tracking_number: order.tracking_number || '',
        notes: order.notes || ''
      }
      $(orderStatusModal.value).modal('show')
    }

    const updateOrderStatus = async () => {
      try {
        await axios.put(`/api/admin/orders/${selectedOrderId.value}/status`, statusForm.value)
        await fetchOrders()
        $(orderStatusModal.value).modal('hide')
        Swal.fire({
          icon: 'success',
          title: t('orders.messages.update_success'),
          showConfirmButton: false,
          timer: 1500
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: t('messages.error_occurred'),
          text: error.message
        })
      }
    }

    const deleteOrder = async (orderId) => {
      const result = await Swal.fire({
        title: t('orders.messages.confirm_delete'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: t('common.yes'),
        cancelButtonText: t('common.no')
      })

      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/admin/orders/${orderId}`)
          await fetchOrders()
          Swal.fire({
            icon: 'success',
            title: t('orders.messages.delete_success'),
            showConfirmButton: false,
            timer: 1500
          })
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: t('messages.error_occurred'),
            text: error.message
          })
        }
      }
    }

    const exportOrders = async () => {
      try {
        const response = await axios.get('/api/admin/orders-export', {
          params: {
            status: filters.value.status,
            start_date: filters.value.start_date,
            end_date: filters.value.end_date
          },
          responseType: 'blob'
        })
        
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'orders.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        console.error('Error exporting orders:', error)
        Swal.fire('Error', 'Failed to export orders', 'error')
      }
    }

    const getStatusBadgeClass = (status) => {
      const classes = {
        pending: 'badge badge-warning',
        processing: 'badge badge-info',
        shipped: 'badge badge-primary',
        delivered: 'badge badge-success',
        cancelled: 'badge badge-danger'
      }
      return classes[status] || 'badge badge-secondary'
    }

    const formatNumber = (num) => {
      return new Intl.NumberFormat('en-US').format(num)
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString()
    }

    onMounted(() => {
      fetchOrders()
    })

    return {
      orders,
      total,
      perPage,
      currentPage,
      filters,
      statusForm,
      orderStatusModal,
      handleSearch,
      handlePageChange,
      viewOrder,
      showStatusModal,
      updateOrderStatus,
      deleteOrder,
      exportOrders,
      getStatusBadgeClass,
      formatNumber,
      formatDate
    }
  }
}
</script>

<style scoped>
.card-tools {
  margin-top: -6px;
}
.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
