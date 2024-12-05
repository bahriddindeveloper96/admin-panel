<template>
  <div class="dashboard fade-in">
    <!-- Stats Cards -->
    <div class="row">
      <div class="col-lg-3 col-6">
        <div class="small-box">
          <div class="inner">
            <h3>{{ statistics?.totalOrders || 0 }}</h3>
            <p>{{ $t('dashboard.total_orders') }}</p>
          </div>
          <div class="icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
        </div>
      </div>
      
      <div class="col-lg-3 col-6">
        <div class="small-box">
          <div class="inner">
            <h3>{{ statistics?.totalProducts || 0 }}</h3>
            <p>{{ $t('dashboard.products') }}</p>
          </div>
          <div class="icon">
            <i class="fas fa-box"></i>
          </div>
        </div>
      </div>
      
      <div class="col-lg-3 col-6">
        <div class="small-box">
          <div class="inner">
            <h3>{{ statistics?.totalUsers || 0 }}</h3>
            <p>{{ $t('dashboard.users') }}</p>
          </div>
          <div class="icon">
            <i class="fas fa-users"></i>
          </div>
        </div>
      </div>
      
      <div class="col-lg-3 col-6">
        <div class="small-box">
          <div class="inner">
            <h3>${{ statistics?.totalRevenue || 0 }}</h3>
            <p>{{ $t('dashboard.revenue') }}</p>
          </div>
          <div class="icon">
            <i class="fas fa-dollar-sign"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="row">
      <div class="col-lg-8">
        <div class="card chart-container">
          <div class="card-header">
            <h3 class="card-title">{{ $t('dashboard.sales_overview') }}</h3>
          </div>
          <div class="card-body">
            <canvas ref="salesChart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4">
        <div class="card chart-container">
          <div class="card-header">
            <h3 class="card-title">{{ $t('dashboard.order_status') }}</h3>
          </div>
          <div class="card-body">
            <canvas ref="orderStatusChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('dashboard.recent_orders') }}</h3>
          </div>
          <div class="card-body table-responsive p-0">
            <table class="table">
              <thead>
                <tr>
                  <th>{{ $t('common.order_id') }}</th>
                  <th>{{ $t('common.customer') }}</th>
                  <th>{{ $t('common.products') }}</th>
                  <th>{{ $t('common.total') }}</th>
                  <th>{{ $t('common.status') }}</th>
                  <th>{{ $t('common.date') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in recentOrders" :key="order.id">
                  <td>#{{ order.id }}</td>
                  <td>{{ order.customer }}</td>
                  <td>{{ order.products }}</td>
                  <td>${{ order.total }}</td>
                  <td>
                    <span :class="getStatusBadgeClass(order.status)">
                      {{ $t(`orders.status.${order.status}`) }}
                    </span>
                  </td>
                  <td>{{ formatDate(order.date) }}</td>
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
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import Chart from 'chart.js/auto'

export default {
  name: 'Dashboard',
  setup() {
    const store = useStore()
    const salesChart = ref(null)
    const orderStatusChart = ref(null)

    const statistics = ref(null)
    const recentOrders = ref([])

    const initCharts = () => {
      // Sales Chart
      new Chart(salesChart.value, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Sales',
            data: [65, 59, 80, 81, 56, 55],
            fill: true,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })

      // Order Status Chart
      new Chart(orderStatusChart.value, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Pending', 'Cancelled'],
          datasets: [{
            data: [65, 25, 10],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })
    }

    const getStatusBadgeClass = (status) => {
      const classes = {
        completed: 'badge badge-success',
        pending: 'badge badge-warning',
        cancelled: 'badge badge-danger'
      }
      return classes[status.toLowerCase()] || 'badge badge-secondary'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString()
    }

    onMounted(async () => {
      try {
        await store.dispatch('fetchDashboardData')
        statistics.value = store.state.statistics
        recentOrders.value = store.state.recentOrders
        initCharts()
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      }
    })

    return {
      statistics,
      recentOrders,
      salesChart,
      orderStatusChart,
      getStatusBadgeClass,
      formatDate
    }
  }
}
</script>

<style scoped>
.dashboard {
  animation: fadeIn 0.3s ease-out;
}

.small-box {
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.small-box .inner {
  position: relative;
  z-index: 2;
}

.small-box h3 {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.small-box p {
  font-size: 1rem;
  margin: 0.5rem 0 0;
  color: var(--text-secondary);
}

.small-box .icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 3rem;
  z-index: 1;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.badge {
  padding: 0.5em 1em;
  font-weight: 500;
  border-radius: var(--radius-sm);
}

.badge-success {
  background: #10b981;
  color: white;
}

.badge-warning {
  background: #f59e0b;
  color: white;
}

.badge-danger {
  background: #ef4444;
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
