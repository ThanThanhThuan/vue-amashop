<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon orders-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.orders }}</span>
          <span class="stat-label">Orders</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon products-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.products }}</span>
          <span class="stat-label">Products</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon users-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.users }}</span>
          <span class="stat-label">Users</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon revenue-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">${{ stats.revenue?.toFixed(2) }}</span>
          <span class="stat-label">Revenue</span>
        </div>
      </div>
    </div>
    
    <div class="recent-orders-section">
      <h2>Recent Orders</h2>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <table v-else-if="recentOrders.length" class="orders-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in recentOrders" :key="order.id">
            <td class="order-number">{{ order.order_number }}</td>
            <td>{{ new Date(order.created_at).toLocaleDateString() }}</td>
            <td>{{ order.users?.name || 'Guest' }}</td>
            <td class="order-total">${{ order.total }}</td>
            <td>
              <span :class="['status-badge', order.status]">{{ order.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="no-orders">No orders yet</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { admin } from '../../api';

const loading = ref(true);
const error = ref('');
const stats = ref({ orders: 0, products: 0, users: 0, revenue: 0 });
const recentOrders = ref([]);

const fetchDashboard = async () => {
  loading.value = true;
  try {
    const { data } = await admin.getDashboard();
    stats.value = data.stats;
    recentOrders.value = data.recent_orders || [];
  } catch (err) {
    error.value = 'Failed to load dashboard';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDashboard);
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: #888;
}

.error {
  color: #e53e3e;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orders-icon {
  background: #e3f2fd;
  color: #1976d2;
}

.products-icon {
  background: #e8f5e9;
  color: #388e3c;
}

.users-icon {
  background: #fff3e0;
  color: #f57c00;
}

.revenue-icon {
  background: #fce4ec;
  color: #c2185b;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #131921;
}

.stat-label {
  font-size: 13px;
  color: #888;
}

.recent-orders-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.recent-orders-section h2 {
  font-size: 18px;
  font-weight: 400;
  color: #131921;
  margin: 0 0 20px;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th,
.orders-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.orders-table th {
  font-weight: 600;
  color: #555;
  font-size: 12px;
  text-transform: uppercase;
}

.order-number {
  font-weight: 600;
  color: #007185;
}

.order-total {
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.processing {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.shipped {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.delivered {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.no-orders {
  text-align: center;
  color: #888;
  padding: 2rem;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
