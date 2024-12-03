<template>
  <div class="order-details">
    <div class="row">
      <!-- Order Info -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Order Information</h3>
          </div>
          <div class="card-body">
            <table class="table">
              <tr>
                <th>Order ID:</th>
                <td>#{{ order.id }}</td>
              </tr>
              <tr>
                <th>Status:</th>
                <td>
                  <span :class="getStatusBadgeClass(order.status)">
                    {{ order.status }}
                  </span>
                  <button 
                    class="btn btn-sm btn-outline-primary ml-2"
                    @click="showStatusModal"
                  >
                    Update Status
                  </button>
                </td>
              </tr>
              <tr>
                <th>Date:</th>
                <td>{{ formatDate(order.created_at) }}</td>
              </tr>
              <tr>
                <th>Total Amount:</th>
                <td>${{ formatNumber(order.total_amount) }}</td>
              </tr>
              <tr v-if="order.tracking_number">
                <th>Tracking Number:</th>
                <td>{{ order.tracking_number }}</td>
              </tr>
              <tr v-if="order.notes">
                <th>Notes:</th>
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
            <h3 class="card-title">Customer Information</h3>
          </div>
          <div class="card-body">
            <table class="table">
              <tr>
                <th>Name:</th>
                <td>{{ order.user?.name }}</td>
              </tr>
              <tr>
                <th>Email:</th>
                <td>{{ order.user?.email }}</td>
              </tr>
              <tr>
                <th>Phone:</th>
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
        <h3 class="card-title">Order Items</h3>
      </div>
      <div class="card-body table-responsive p-0">
        <table class="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
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
              <td colspan="4" class="text-right"><strong>Subtotal:</strong></td>
              <td>${{ formatNumber(order.subtotal) }}</td>
            </tr>
            <tr>
              <td colspan="4" class="text-right"><strong>Shipping:</strong></td>
              <td>${{ formatNumber(order.shipping_cost) }}</td>
            </tr>
            <tr>
              <td colspan="4" class="text-right"><strong>Total:</strong></td>
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
            <h5 class="modal-title">Update Order Status</h5>
            <button type="button" class="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateStatus">
              <div class="form-group">
                <label>Status</label>
                <select class="form-control" v-model="statusForm.status" required>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div class="form-group">
                <label>Tracking Number</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="statusForm.tracking_number"
                >
              </div>
              <div class="form-group">
                <label>Notes</label>
                <textarea 
                  class="form-control" 
                  v-model="statusForm.notes"
                  rows="3"
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Update Status</button>
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
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  name: 'OrderDetails',
  setup() {
    const route = useRoute()
    const router = useRouter()
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
        await axios.put(`/api/admin/orders/${order.value.id}`, statusForm.value)
        $(statusModal.value).modal('hide')
        await fetchOrder()
        Swal.fire('Success', 'Order status updated successfully', 'success')
      } catch (error) {
        console.error('Error updating order status:', error)
        Swal.fire('Error', 'Failed to update order status', 'error')
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
