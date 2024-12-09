<template>
  <div class="order-details">
    <!-- Loading -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Main Content -->
    <template v-if="!loading && !error">
      <div class="row">
        <!-- Order Info -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{{ $t('order_details.order_info.title') }}</h3>
            </div>
            <div class="card-body">
              <table class="table">
                <tr>
                  <th>{{ $t('order_details.order_info.order_number') }}:</th>
                  <td>#{{ order.order_number }}</td>
                </tr>
                <tr>
                  <th>{{ $t('order_details.order_info.status') }}:</th>
                  <td>
                    <span :class="getStatusBadgeClass(order.status)">
                      {{ order.status }}
                    </span>
                    <button 
                      class="btn btn-sm btn-outline-primary ml-2"
                      @click="showStatusModal"
                    >
                      {{ $t('order_details.order_info.update_status') }}
                    </button>
                  </td>
                </tr>
                <tr>
                  <th>{{ $t('order_details.order_info.payment_status') }}:</th>
                  <td>
                    <span :class="getPaymentStatusBadgeClass(order.payment_status)">
                      {{ order.payment_status }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>{{ $t('order_details.order_info.created_at') }}:</th>
                  <td>{{ formatDate(order.created_at) }}</td>
                </tr>
                <tr>
                  <th>{{ $t('order_details.order_info.total_amount') }}:</th>
                  <td>${{ formatNumber(order.total_amount) }}</td>
                </tr>
                <tr>
                  <th>{{ $t('order_details.order_info.delivery_cost') }}:</th>
                  <td>${{ formatNumber(order.delivery_cost) }}</td>
                </tr>
                <tr>
                  <th>{{ $t('order_details.order_info.total_discount') }}:</th>
                  <td>${{ formatNumber(order.total_discount) }}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{{ $t('order_details.customer_info.title') }}</h3>
            </div>
            <div class="card-body">
              <table class="table">
                <tr>
                  <th>{{ $t('order_details.customer_info.name') }}:</th>
                  <td>{{ order.user?.name }}</td>
                </tr>
                <tr>
                  <th>{{ $t('order_details.customer_info.email') }}:</th>
                  <td>{{ order.user?.email }}</td>
                </tr>
                <tr>
                  <th>{{ $t('order_details.customer_info.phone') }}:</th>
                  <td>{{ order.user?.phone }}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Delivery Info -->
          <div class="card mt-4">
            <div class="card-header">
              <h3 class="card-title">{{ $t('order_details.delivery_info.title') }}</h3>
            </div>
            <div class="card-body">
              <table class="table">
                <tr>
                  <th>{{ $t('order_details.delivery_info.name') }}:</th>
                  <td>{{ order.delivery_name }}</td>
                </tr>
                <tr>
                  <th>{{ $t('order_details.delivery_info.phone') }}:</th>
                  <td>{{ order.delivery_phone }}</td>
                </tr>
                <tr>
                  <th>{{ $t('order_details.delivery_info.address') }}:</th>
                  <td>{{ order.delivery_address }}</td>
                </tr>
                <tr>
                  <th>{{ $t('order_details.delivery_info.method') }}:</th>
                  <td>{{ order.delivery_method?.translations[0].name }}</td>
                </tr>
                <tr v-if="order.delivery_comment">
                  <th>{{ $t('order_details.delivery_info.comment') }}:</th>
                  <td>{{ order.delivery_comment }}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div class="card mt-4">
        <div class="card-header">
          <h3 class="card-title">{{ $t('order_details.order_items.title') }}</h3>
        </div>
        <div class="card-body table-responsive p-0">
          <table class="table">
            <thead>
              <tr>
                <th>{{ $t('order_details.order_items.product') }}</th>
                <th>{{ $t('order_details.order_items.price') }}</th>
                <th>{{ $t('order_details.order_items.quantity') }}</th>
                <th>{{ $t('order_details.order_items.total') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.items" :key="item.id">
                <td>
                  <div class="d-flex align-items-center">
                    <img 
                      :src="getProductImage(item.product)" 
                      alt="Product" 
                      class="product-image mr-2"
                    >
                    {{ item.product.name }}
                  </div>
                </td>
                <td>${{ formatNumber(item.price) }}</td>
                <td>{{ item.quantity }}</td>
                <td>${{ formatNumber(item.price * item.quantity) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="text-right"><strong>{{ $t('order_details.order_items.subtotal') }}:</strong></td>
                <td>${{ formatNumber(order.total_amount) }}</td>
              </tr>
              <tr>
                <td colspan="3" class="text-right"><strong>{{ $t('order_details.order_items.delivery_cost') }}:</strong></td>
                <td>${{ formatNumber(order.delivery_cost) }}</td>
              </tr>
              <tr>
                <td colspan="3" class="text-right"><strong>{{ $t('order_details.order_items.discount') }}:</strong></td>
                <td>${{ formatNumber(order.total_discount) }}</td>
              </tr>
              <tr>
                <td colspan="3" class="text-right"><strong>{{ $t('order_details.order_items.total') }}:</strong></td>
                <td>${{ formatNumber(parseFloat(order.total_amount) + parseFloat(order.delivery_cost) - parseFloat(order.total_discount)) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Status History -->
      <div class="card mt-4">
        <div class="card-header">
          <h3 class="card-title">{{ $t('order_details.status_history.title') }}</h3>
        </div>
        <div class="card-body">
          <table class="table">
            <thead>
              <tr>
                <th>{{ $t('order_details.status_history.date') }}</th>
                <th>{{ $t('order_details.status_history.from') }}</th>
                <th>{{ $t('order_details.status_history.to') }}</th>
                <th>{{ $t('order_details.status_history.comment') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(history, index) in order.status_history" :key="index">
                <td>{{ formatDate(history.timestamp) }}</td>
                <td><span :class="getStatusBadgeClass(history.from)">{{ history.from }}</span></td>
                <td><span :class="getStatusBadgeClass(history.to)">{{ history.to }}</span></td>
                <td>{{ history.comment || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Status Modal -->
      <div class="modal fade" id="statusModal" tabindex="-1" ref="statusModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ $t('order_details.modal.title') }}</h5>
              <button type="button" class="close" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="updateStatus">
                <div class="form-group">
                  <label>{{ $t('order_details.modal.status') }}</label>
                  <select class="form-control" v-model="statusForm.status" required>
                    <option value="pending">{{ $t('orders.statuses.pending') }}</option>
                    <option value="processing">{{ $t('orders.statuses.processing') }}</option>
                    <option value="shipped">{{ $t('orders.statuses.shipped') }}</option>
                    <option value="delivered">{{ $t('orders.statuses.delivered') }}</option>
                    <option value="cancelled">{{ $t('orders.statuses.cancelled') }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>{{ $t('order_details.modal.tracking_number') }}</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="statusForm.tracking_number"
                  >
                </div>
                <div class="form-group">
                  <label>{{ $t('order_details.modal.notes') }}</label>
                  <textarea 
                    class="form-control" 
                    v-model="statusForm.notes"
                    rows="3"
                  ></textarea>
                </div>
                <button type="submit" class="btn btn-primary">{{ $t('order_details.modal.update') }}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  name: 'OrderDetails',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const order = ref({})
    const loading = ref(true)
    const error = ref(null)
    const statusModal = ref(null)
    const statusForm = ref({
      status: '',
      tracking_number: '',
      notes: ''
    })

    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/admin/orders/${route.params.id}`)
       
        
        order.value = response.data.order
        statusForm.value = {
          status: response.data.order.status,
          tracking_number: response.data.order.tracking_number || '',
          notes: ''
        }
      } catch (error) {
        console.error('Error fetching order:', error)
        Swal.fire('Error', 'Failed to fetch order details', 'error')
        router.push('/orders')
      } finally {
        loading.value = false
      }
    }

    const showStatusModal = () => {
      $(statusModal.value).modal('show')
    }

    const updateStatus = async () => {
      try {
        await axios.put(`/admin/orders/${order.value.id}/status`, statusForm.value)
        $(statusModal.value).modal('hide')
        await fetchOrder()
        Swal.fire({
          icon: 'success',
          title: t('order_details.messages.update_success'),
          showConfirmButton: false,
          timer: 1500
        })
      } catch (error) {
        console.error('Error updating status:', error)
        Swal.fire('Error', 'Failed to update order status', 'error')
      }
    }

    const getProductImage = (product) => {
      return product.images && product.images.length > 0 
        ? `/storage/products/${product.images[0]}` 
        : '/images/no-image.png'
    }

    const getStatusBadgeClass = (status) => {
      const classes = {
        pending: 'badge badge-warning',
        processing: 'badge badge-info',
        shipped: 'badge badge-primary',
        delivered: 'badge badge-success',
        cancelled: 'badge badge-danger',
        new: 'badge badge-secondary'
      }
      return classes[status] || 'badge badge-secondary'
    }

    const getPaymentStatusBadgeClass = (status) => {
      const classes = {
        pending: 'badge badge-warning',
        paid: 'badge badge-success',
        failed: 'badge badge-danger'
      }
      return classes[status] || 'badge badge-secondary'
    }

    const formatNumber = (num) => {
      return new Intl.NumberFormat('en-US').format(parseFloat(num) || 0)
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleString()
    }

    onMounted(() => {
      fetchOrder()
    })

    return {
      order,
      loading,
      error,
      statusModal,
      statusForm,
      showStatusModal,
      updateStatus,
      getProductImage,
      getStatusBadgeClass,
      getPaymentStatusBadgeClass,
      formatNumber,
      formatDate
    }
  }
}
</script>

<style scoped>
.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}
.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}
.badge {
  padding: 8px 12px;
  font-size: 0.9em;
}
.card {
  margin-bottom: 1rem;
  box-shadow: 0 0 1px rgba(0,0,0,.125), 0 1px 3px rgba(0,0,0,.2);
}
.card-header {
  background-color: rgba(0,0,0,.03);
}
.table td, .table th {
  vertical-align: middle;
}
</style>