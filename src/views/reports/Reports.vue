<template>
  <div class="reports">
    <!-- Header -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Reports</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="content">
      <div class="container-fluid">
        <!-- Date Range Filter -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label>Date Range</label>
                  <select class="form-control" v-model="dateRange" @change="updateReports">
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last7days">Last 7 Days</option>
                    <option value="last30days">Last 30 Days</option>
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
              </div>
              <div class="col-md-8" v-if="dateRange === 'custom'">
                <div class="row">
                  <div class="col-md-5">
                    <div class="form-group">
                      <label>Start Date</label>
                      <input 
                        type="date" 
                        class="form-control" 
                        v-model="customRange.start"
                        @change="updateReports"
                      >
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="form-group">
                      <label>End Date</label>
                      <input 
                        type="date" 
                        class="form-control" 
                        v-model="customRange.end"
                        @change="updateReports"
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sales Overview -->
        <div class="row">
          <div class="col-lg-3 col-6">
            <div class="small-box bg-info">
              <div class="inner">
                <h3>${{ formatNumber(summary.totalSales) }}</h3>
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
                <h3>{{ summary.totalOrders }}</h3>
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
                <h3>${{ formatNumber(summary.averageOrderValue) }}</h3>
                <p>Average Order Value</p>
              </div>
              <div class="icon">
                <i class="fas fa-chart-line"></i>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-6">
            <div class="small-box bg-danger">
              <div class="inner">
                <h3>{{ summary.totalProducts }}</h3>
                <p>Products Sold</p>
              </div>
              <div class="icon">
                <i class="fas fa-box"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Sales Chart -->
          <div class="col-md-8">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Sales Overview</h3>
              </div>
              <div class="card-body">
                <canvas ref="salesChart"></canvas>
              </div>
            </div>
          </div>

          <!-- Top Products -->
          <div class="col-md-4">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Top Products</h3>
              </div>
              <div class="card-body p-0">
                <ul class="products-list product-list-in-card pl-2 pr-2">
                  <li class="item" v-for="product in topProducts" :key="product.id">
                    <div class="product-img">
                      <img 
                        :src="product.image_url" 
                        :alt="product.name"
                        class="img-size-50"
                      >
                    </div>
                    <div class="product-info">
                      <a href="javascript:void(0)" class="product-title">
                        {{ product.name }}
                        <span class="badge badge-info float-right">
                          {{ product.total_sales }} sold
                        </span>
                      </a>
                      <span class="product-description">
                        Revenue: ${{ formatNumber(product.revenue) }}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Sales by Category -->
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Sales by Category</h3>
              </div>
              <div class="card-body">
                <canvas ref="categoryChart"></canvas>
              </div>
            </div>
          </div>

          <!-- Order Status -->
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Order Status Distribution</h3>
              </div>
              <div class="card-body">
                <canvas ref="statusChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Orders</h3>
            <div class="card-tools">
              <button 
                type="button" 
                class="btn btn-tool" 
                @click="exportOrders"
              >
                <i class="fas fa-download"></i> Export
              </button>
            </div>
          </div>
          <div class="card-body table-responsive p-0">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Products</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in recentOrders" :key="order.id">
                  <td>#{{ order.id }}</td>
                  <td>{{ order.customer_name }}</td>
                  <td>{{ order.products_count }} items</td>
                  <td>${{ formatNumber(order.total) }}</td>
                  <td>
                    <span :class="getStatusBadgeClass(order.status)">
                      {{ order.status }}
                    </span>
                  </td>
                  <td>{{ formatDate(order.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import Chart from 'chart.js/auto'
import Swal from 'sweetalert2'

export default {
  name: 'Reports',
  setup() {
    const dateRange = ref('last7days')
    const customRange = ref({
      start: '',
      end: ''
    })
    
    const summary = ref({
      totalSales: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      totalProducts: 0
    })
    
    const topProducts = ref([])
    const recentOrders = ref([])
    
    const salesChart = ref(null)
    const categoryChart = ref(null)
    const statusChart = ref(null)
    
    let salesChartInstance = null
    let categoryChartInstance = null
    let statusChartInstance = null

    // Load all report data
    const loadReports = async () => {
      try {
        const params = getDateParams()
        const response = await axios.get('/api/admin/reports', { params })
        
        // Update summary
        summary.value = response.data.summary
        
        // Update top products
        topProducts.value = response.data.topProducts
        
        // Update recent orders
        recentOrders.value = response.data.recentOrders
        
        // Update charts
        updateSalesChart(response.data.salesChart)
        updateCategoryChart(response.data.categoryChart)
        updateStatusChart(response.data.statusChart)
      } catch (error) {
        console.error('Error loading reports:', error)
        Swal.fire('Error', 'Failed to load reports', 'error')
      }
    }

    // Get date parameters based on selected range
    const getDateParams = () => {
      if (dateRange.value === 'custom') {
        return {
          start_date: customRange.value.start,
          end_date: customRange.value.end
        }
      }
      
      return { range: dateRange.value }
    }

    // Update sales chart
    const updateSalesChart = (data) => {
      if (salesChartInstance) {
        salesChartInstance.destroy()
      }

      const ctx = salesChart.value.getContext('2d')
      salesChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [{
            label: 'Sales',
            data: data.values,
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

    // Update category chart
    const updateCategoryChart = (data) => {
      if (categoryChartInstance) {
        categoryChartInstance.destroy()
      }

      const ctx = categoryChart.value.getContext('2d')
      categoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: data.labels,
          datasets: [{
            data: data.values,
            backgroundColor: [
              '#f56954', '#00a65a', '#f39c12', '#00c0ef', '#3c8dbc'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      })
    }

    // Update status chart
    const updateStatusChart = (data) => {
      if (statusChartInstance) {
        statusChartInstance.destroy()
      }

      const ctx = statusChart.value.getContext('2d')
      statusChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: data.labels,
          datasets: [{
            data: data.values,
            backgroundColor: [
              '#00a65a', '#f39c12', '#00c0ef', '#f56954'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      })
    }

    // Export orders report
    const exportOrders = async () => {
      try {
        const params = getDateParams()
        const response = await axios.get('/api/admin/reports/export', {
          params,
          responseType: 'blob'
        })
        
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'orders-report.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        console.error('Error exporting report:', error)
        Swal.fire('Error', 'Failed to export report', 'error')
      }
    }

    // Format number with commas
    const formatNumber = (num) => {
      return new Intl.NumberFormat('en-US').format(num)
    }

    // Format date
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString()
    }

    // Get status badge class
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

    // Watch for date range changes
    watch([dateRange, customRange], () => {
      loadReports()
    })

    onMounted(() => {
      loadReports()
    })

    return {
      dateRange,
      customRange,
      summary,
      topProducts,
      recentOrders,
      salesChart,
      categoryChart,
      statusChart,
      exportOrders,
      formatNumber,
      formatDate,
      getStatusBadgeClass
    }
  }
}
</script>

<style scoped>
.products-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.products-list > .item {
  border-radius: 3px;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  background: #fff;
}

.products-list > .item:after {
  clear: both;
}

.products-list .product-img {
  float: left;
}

.products-list .product-img img {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

.products-list .product-info {
  margin-left: 60px;
}

.products-list .product-title {
  font-weight: 600;
}

.products-list .product-description {
  display: block;
  color: #999;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
