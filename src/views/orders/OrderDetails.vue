<template>
  <div class="order-details">
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
                <th>{{ $t('order_details.order_info.order_id') }}:</th>
                <td>#{{ order.id }}</td>
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
                <th>{{ $t('order_details.order_info.date') }}:</th>
                <td>{{ formatDate(order.created_at) }}</td>
              </tr>
              <tr>
                <th>{{ $t('order_details.order_info.total_amount') }}:</th>
                <td>${{ formatNumber(order.total_amount) }}</td>
              </tr>
              <tr v-if="order.tracking_number">
                <th>{{ $t('order_details.order_info.tracking_number') }}:</th>
                <td>{{ order.tracking_number }}</td>
              </tr>
              <tr v-if="order.notes">
                <th>{{ $t('order_details.order_info.notes') }}:</th>
                <td>{{ order.notes }}</td>
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
      </div>
    </div>

    <!-- Order Items -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ $t('order_details.order_items.title') }}</h3>
      </div>
      <div class="card-body table-responsive p-0">
        <table class="table">
          <thead>
            <tr>
              <th>{{ $t('order_details.order_items.product') }}</th>
              <th>{{ $t('order_details.order_items.sku') }}</th>
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
                    :src="item.product.image_url" 
                    alt="Product" 
                    class="product-image mr-2"
                  >
                  {{ item.product.name }}
                </div>
              </td>
              <td>{{ item.product.sku }}</td>
              <td>${{ formatNumber(item.price) }}</td>
              <td>{{ item.quantity }}</td>
              <td>${{ formatNumber(item.price * item.quantity) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="text-right"><strong>{{ $t('order_details.order_items.subtotal') }}:</strong></td>
              <td>${{ formatNumber(order.subtotal) }}</td>
            </tr>
            <tr>
              <td colspan="4" class="text-right"><strong>{{ $t('order_details.order_items.shipping') }}:</strong></td>
              <td>${{ formatNumber(order.shipping_cost) }}</td>
            </tr>
            <tr>
              <td colspan="4" class="text-right"><strong>{{ $t('order_details.order_items.total') }}:</strong></td>
              <td>${{ formatNumber(order.total_amount) }}</td>
            </tr>
          </tfoot>
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
    const statusModal = ref(null)
    const statusForm = ref({
      status: '',
      tracking_number: '',
      notes: ''
    })

    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/admin/orders/${route.params.id}`)
        order.value = response.data
        statusForm.value = {
          status: response.data.status,
          tracking_number: response.data.tracking_number || '',
          notes: response.data.notes || ''
        }
      } catch (error) {
        console.error('Error fetching order:', error)
        Swal.fire('Error', 'Failed to fetch order details', 'error')
        router.push('/orders')
      }
    }

    const showStatusModal = () => {
      $(statusModal.value).modal('show')
    }

    const updateStatus = async () => {
      try {
        await axios.put(`/api/admin/orders/${order.value.id}/status`, statusForm.value)
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
      fetchOrder()
    })

    return {
      order,
      statusModal,
      statusForm,
      showStatusModal,
      updateStatus,
      getStatusBadgeClass,
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
</style>
