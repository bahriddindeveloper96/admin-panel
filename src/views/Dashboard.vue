<template>
  <div class="content-wrapper">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Dashboard</h1>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="container-fluid">
        <!-- Statistics Cards -->
        <div class="row">
          <div class="col-lg-3 col-6">
            <div class="small-box bg-info">
              <div class="inner">
                <h3>{{ formatCurrency(statistics?.total_sales || 0) }}</h3>
                <p>Total Sales</p>
              </div>
              <div class="icon">
                <i class="fas fa-shopping-cart"></i>
              </div>
            </div>
          </div>
          
          <div class="col-lg-3 col-6">
            <div class="small-box bg-success">
              <div class="inner">
                <h3>{{ statistics?.total_orders || 0 }}</h3>
                <p>Total Orders</p>
              </div>
              <div class="icon">
                <i class="fas fa-shopping-bag"></i>
              </div>
            </div>
          </div>
          
          <div class="col-lg-3 col-6">
            <div class="small-box bg-warning">
              <div class="inner">
                <h3>{{ statistics?.total_customers || 0 }}</h3>
                <p>Total Customers</p>
              </div>
              <div class="icon">
                <i class="fas fa-users"></i>
              </div>
            </div>
          </div>
          
          <div class="col-lg-3 col-6">
            <div class="small-box bg-danger">
              <div class="inner">
                <h3>{{ statistics?.total_products || 0 }}</h3>
                <p>Total Products</p>
              </div>
              <div class="icon">
                <i class="fas fa-box"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Sales Chart -->
          <div class="col-lg-8">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Sales Overview</h3>
                <div class="card-tools">
                  <select v-model="selectedDays" class="form-control" @change="loadSalesChart">
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                  </select>
                </div>
              </div>
              <div class="card-body">
                <canvas ref="salesChart"></canvas>
              </div>
            </div>
          </div>

          <!-- Order Status Chart -->
          <div class="col-lg-4">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Order Status</h3>
              </div>
              <div class="card-body">
                <canvas ref="orderStatusChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Recent Orders -->
          <div class="col-lg-8">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Recent Orders</h3>
              </div>
              <div class="card-body table-responsive p-0">
                <table class="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="order in recentOrders" :key="order.id">
                      <td>#{{ order.id }}</td>
                      <td>{{ order.customer }}</td>
                      <td>{{ formatCurrency(order.total) }}</td>
                      <td>
                        <span :class="getStatusBadgeClass(order.status)">
                          {{ order.status }}
                        </span>
                      </td>
                      <td>{{ formatDate(order.date) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Top Products -->
          <div class="col-lg-4">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Top Selling Products</h3>
              </div>
              <div class="card-body p-0">
                <ul class="products-list product-list-in-card pl-2 pr-2">
                  <li class="item" v-for="product in topProducts" :key="product.id">
                    <div class="product-img">
                      <img :src="product.image" alt="Product Image" class="img-size-50">
                    </div>
                    <div class="product-info">
                      <a href="javascript:void(0)" class="product-title">
                        {{ product.name }}
                        <span class="badge badge-info float-right">
                          {{ formatCurrency(product.total_sales) }}
                        </span>
                      </a>
                      <span class="product-description">
                        {{ product.total_quantity }} units sold
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import Chart from 'chart.js/auto'

export default {
  name: 'Dashboard',
  
  setup() {
    const store = useStore()
    const salesChartRef = ref(null)
    const orderStatusChartRef = ref(null)
    const selectedDays = ref(7)
    let salesChart = null
    let orderStatusChart = null

    // Computed properties
    const statistics = computed(() => store.getters.statistics)
    const salesChartData = computed(() => store.getters.salesChart)
    const orderStatusChartData = computed(() => store.getters.orderStatusChart)
    const recentOrders = computed(() => store.getters.recentOrders)
    const topProducts = computed(() => store.getters.topProducts)

    // Methods
    const loadDashboardData = async () => {
      await store.dispatch('fetchDashboardData')
    }

    const loadSalesChart = async () => {
      await store.dispatch('fetchSalesChart', selectedDays.value)
      updateSalesChart()
    }

    const updateSalesChart = () => {
      if (salesChart) {
        salesChart.destroy()
      }

      const ctx = salesChartRef.value.getContext('2d')
      salesChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: salesChartData.value?.labels || [],
          datasets: [{
            label: 'Sales',
            data: salesChartData.value?.data || [],
            fill: false,
            borderColor: '#17a2b8',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      })
    }

    const updateOrderStatusChart = () => {
      if (orderStatusChart) {
        orderStatusChart.destroy()
      }

      const ctx = orderStatusChartRef.value.getContext('2d')
      orderStatusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: orderStatusChartData.value?.labels || [],
          datasets: [{
            data: orderStatusChartData.value?.data || [],
            backgroundColor: [
              '#28a745',
              '#ffc107',
              '#dc3545',
              '#17a2b8'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      })
    }

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value)
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const getStatusBadgeClass = (status) => {
      const classes = {
        pending: 'badge badge-warning',
        processing: 'badge badge-info',
        completed: 'badge badge-success',
        cancelled: 'badge badge-danger'
      }
      return classes[status] || 'badge badge-secondary'
    }

    // Lifecycle hooks
    onMounted(async () => {
      await loadDashboardData()
      updateSalesChart()
      updateOrderStatusChart()
    })

    return {
      statistics,
      recentOrders,
      topProducts,
      salesChartRef,
      orderStatusChartRef,
      selectedDays,
      formatCurrency,
      formatDate,
      getStatusBadgeClass,
      loadSalesChart
    }
  }
}
</script>

<style scoped>
.small-box {
  border-radius: 0.25rem;
  box-shadow: 0 0 1px rgba(0,0,0,.125), 0 1px 3px rgba(0,0,0,.2);
  display: block;
  margin-bottom: 20px;
  position: relative;
}

.small-box > .inner {
  padding: 10px;
}

.small-box h3 {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 10px;
  padding: 0;
  white-space: nowrap;
}

.small-box p {
  font-size: 1rem;
}

.small-box .icon {
  color: rgba(0,0,0,.15);
  z-index: 0;
}

.small-box .icon > i {
  font-size: 90px;
  position: absolute;
  right: 15px;
  top: 15px;
  transition: transform .3s linear;
}

.small-box:hover .icon > i {
  transform: scale(1.1);
}

.products-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.products-list > .item {
  border-radius: 0.25rem;
  padding: 10px;
  background-color: #fff;
}

.products-list > .item:after {
  clear: both;
  content: "";
  display: block;
}

.product-img {
  float: left;
  padding-right: 10px;
  width: 50px;
}

.product-img img {
  border-radius: 0.25rem;
  width: 100%;
}

.product-info {
  margin-left: 60px;
}

.product-title {
  color: #444;
  display: block;
  font-weight: 600;
}

.product-description {
  color: #999;
  display: block;
  font-size: 0.875rem;
}
</style>
