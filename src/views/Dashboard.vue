<template>
  <div class="dashboard fade-in">
    <!-- Stats Cards -->
    <div class="row g-4">
      <div class="col-lg-3 col-6">
        <div class="stat-card orders">
          <div class="stat-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="stat-content">
            <h3>{{ statistics.new_orders }}</h3>
            <p>{{ $t('dashboard.new_orders') }}</p>
          </div>
          <div class="stat-chart">
            <div class="sparkline"></div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-3 col-6">
        <div class="stat-card products">
          <div class="stat-icon">
            <i class="fas fa-box"></i>
          </div>
          <div class="stat-content">
            <h3>{{ statistics.active_products }}</h3>
            <p>{{ $t('dashboard.products') }}</p>
          </div>
          <div class="stat-chart">
            <div class="sparkline"></div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-3 col-6">
        <div class="stat-card users">
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <h3>{{ statistics.new_users }}</h3>
            <p>{{ $t('dashboard.new_users') }}</p>
          </div>
          <div class="stat-chart">
            <div class="sparkline"></div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-3 col-6">
        <div class="stat-card reviews">
          <div class="stat-icon">
            <i class="fas fa-comments"></i>
          </div>
          <div class="stat-content">
            <h3>{{ statistics.pending_reviews }}</h3>
            <p>{{ $t('dashboard.pending_reviews') }}</p>
          </div>
          <div class="stat-chart">
            <div class="sparkline"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="row g-4 mt-4">
      <div class="col-lg-8">
        <div class="card modern-card">
          <div class="card-header">
            <h3 class="card-title text-gradient">{{ $t('dashboard.sales_overview') }}</h3>
          </div>
          <div class="card-body p-4">
            <!-- Quick Stats -->
            <div class="row g-4">
              <div class="col-md-3">
                <div class="quick-stat">
                  <div class="stat-label">Total Sales</div>
                  <div class="stat-value">
                    <i class="fas fa-dollar-sign text-success me-1"></i>
                    {{ formatCurrency(salesStats.totalSales) }}
                  </div>
                  <div class="stat-change" :class="salesStats.salesChange >= 0 ? 'positive' : 'negative'">
                    <i :class="salesStats.salesChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                    {{ Math.abs(salesStats.salesChange) }}%
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="quick-stat">
                  <div class="stat-label">Orders</div>
                  <div class="stat-value">
                    <i class="fas fa-shopping-cart text-primary me-1"></i>
                    {{ salesStats.totalOrders }}
                  </div>
                  <div class="stat-change" :class="salesStats.ordersChange >= 0 ? 'positive' : 'negative'">
                    <i :class="salesStats.ordersChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                    {{ Math.abs(salesStats.ordersChange) }}%
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="quick-stat">
                  <div class="stat-label">Average Order</div>
                  <div class="stat-value">
                    <i class="fas fa-chart-line text-info me-1"></i>
                    {{ formatCurrency(salesStats.avgOrderValue) }}
                  </div>
                  <div class="stat-change" :class="salesStats.avgOrderChange >= 0 ? 'positive' : 'negative'">
                    <i :class="salesStats.avgOrderChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                    {{ Math.abs(salesStats.avgOrderChange) }}%
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="quick-stat">
                  <div class="stat-label">Conversion Rate</div>
                  <div class="stat-value">
                    <i class="fas fa-percent text-warning me-1"></i>
                    {{ salesStats.conversionRate }}%
                  </div>
                  <div class="stat-change" :class="salesStats.conversionChange >= 0 ? 'positive' : 'negative'">
                    <i :class="salesStats.conversionChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                    {{ Math.abs(salesStats.conversionChange) }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card modern-card">
          <div class="card-header">
            <h3 class="card-title text-gradient">{{ $t('dashboard.recent_orders') }}</h3>
            <div class="card-tools">
              <button class="btn btn-modern">
                <i class="fas fa-sync-alt me-2"></i> Refresh
              </button>
            </div>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table modern-table">
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
                  <tr v-for="order in recentOrders" :key="order.id" class="table-row">
                    <td>
                      <span class="order-id">#{{ order.id }}</span>
                    </td>
                    <td>
                      <div class="customer-info">
                        <div class="customer-avatar">{{ order.customer.charAt(0) }}</div>
                        <span>{{ order.customer }}</span>
                      </div>
                    </td>
                    <td>{{ order.products }}</td>
                    <td>
                      <span class="price-tag">${{ order.total }}</span>
                    </td>
                    <td>
                      <span :class="['status-badge', order.status.toLowerCase()]">
                        {{ $t(`orders.status.${order.status}`) }}
                      </span>
                    </td>
                    <td>
                      <span class="date-info">
                        <i class="far fa-calendar-alt me-1"></i>
                        {{ formatDate(order.date) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Dashboard',
  setup() {
    const store = useStore()

    onMounted(() => {
      store.dispatch('dashboard/fetchDashboardStats')
    })

    // API dan keladigan statistika
    const statistics = computed(() => store.state.dashboard.statistics)
    const salesStats = computed(() => store.state.dashboard.salesStats)
    const orderStats = computed(() => store.state.dashboard.orderStats)

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value)
    }

    return {
      statistics,
      salesStats,
      orderStats,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.dashboard {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.stat-card {
  position: relative;
  padding: 1.5rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0,0,0,0.1);
}

.stat-icon {
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  font-size: 2rem;
  opacity: 0.8;
}

.stat-content {
  position: relative;
  z-index: 1;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(45deg, #2196F3, #00BCD4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-content p {
  margin: 0.5rem 0 0;
  color: #757575;
  font-size: 0.9rem;
}

.stat-chart {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  opacity: 0.1;
}

.stat-card.orders { background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%); }
.stat-card.products { background: linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%); }
.stat-card.users { background: linear-gradient(135deg, #ffffff 0%, #fff3e0 100%); }
.stat-card.reviews { background: linear-gradient(135deg, #ffffff 0%, #f3e5f5 100%); }

.modern-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow: hidden;
}

.modern-card .card-header {
  background: white;
  border-bottom: 1px solid #f0f0f0;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.text-gradient {
  background: linear-gradient(45deg, #2196F3, #00BCD4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
  font-size: 1.1rem;
}

.period-select {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 0.4rem 2rem 0.4rem 1rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-modern {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  background: rgba(33,150,243,0.1);
  color: #2196F3;
  border: none;
}

.btn-modern:hover {
  background: #2196F3;
  color: white;
  transform: translateY(-2px);
}

.modern-table {
  margin: 0;
}

.modern-table thead th {
  background: #f8f9fa;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  padding: 1rem;
  border: none;
}

.modern-table tbody td {
  padding: 1rem;
  border: none;
  vertical-align: middle;
}

.table-row {
  transition: all 0.2s ease;
}

.table-row:hover {
  background: #f8f9fa;
}

.order-id {
  font-weight: 600;
  color: #2196F3;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.customer-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(45deg, #2196F3, #00BCD4);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.price-tag {
  font-weight: 600;
  color: #2196F3;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.completed {
  background: rgba(76,175,80,0.1);
  color: #4CAF50;
}

.status-badge.pending {
  background: rgba(255,152,0,0.1);
  color: #FF9800;
}

.status-badge.cancelled {
  background: rgba(244,67,54,0.1);
  color: #F44336;
}

.date-info {
  color: #757575;
  font-size: 0.9rem;
}

.quick-stat {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.quick-stat:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.stat-label {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

.stat-change i {
  font-size: 0.75rem;
}

.order-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-dot.completed { background: #10b981; }
.status-dot.pending { background: #f59e0b; }
.status-dot.cancelled { background: #ef4444; }

.status-label {
  font-size: 0.875rem;
  color: #64748b;
}

.status-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-value .value {
  font-weight: 600;
  color: #1e293b;
}

.status-value .percentage {
  font-size: 0.875rem;
  color: #64748b;
}

.total-orders {
  margin-top: 1.5rem;
}

.total-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.total-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.progress-bar {
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
  display: flex;
}

.progress {
  height: 100%;
  transition: width 0.3s ease;
}

.progress.completed { background: #10b981; }
.progress.pending { background: #f59e0b; }
.progress.cancelled { background: #ef4444; }
</style>
