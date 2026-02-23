<template>
  <div class="admin-page">
      
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      
      <table v-else-if="orders.length">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.order_number }}</td>
            <td>{{ order.user_name || 'Guest' }}</td>
            <td>${{ order.total }}</td>
            <td>
              <select 
                :value="order.status" 
                @change="updateStatus(order.id, $event.target.value)"
                :class="['status-select', order.status]"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>
            <td>{{ new Date(order.created_at).toLocaleDateString() }}</td>
            <td>
              <button @click="viewOrder(order)" class="btn-small">View</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>No orders found</p>
      
      <div v-if="selectedOrder" class="modal">
        <div class="modal-content">
          <h2>Order #{{ selectedOrder.order_number }}</h2>
          <div class="order-details">
            <div class="detail-row">
              <strong>Customer:</strong> {{ selectedOrder.user_name || 'Guest' }}
            </div>
            <div class="detail-row">
              <strong>Email:</strong> {{ selectedOrder.shipping_email }}
            </div>
            <div class="detail-row">
              <strong>Phone:</strong> {{ selectedOrder.shipping_phone }}
            </div>
            <div class="detail-row">
              <strong>Address:</strong> 
              {{ selectedOrder.shipping_address }}, {{ selectedOrder.shipping_city }}, 
              {{ selectedOrder.shipping_state }} {{ selectedOrder.shipping_zip }}
            </div>
            <div class="detail-row">
              <strong>Status:</strong> {{ selectedOrder.status }}
            </div>
          </div>
          
          <h3>Order Items</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in selectedOrder.items" :key="item.id">
                <td>{{ item.product_name }}</td>
                <td>${{ item.price }}</td>
                <td>{{ item.quantity }}</td>
                <td>${{ item.subtotal }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3"><strong>Total</strong></td>
                <td><strong>${{ selectedOrder.total }}</strong></td>
              </tr>
            </tfoot>
          </table>
          
          <div class="form-actions">
            <button @click="selectedOrder = null" class="btn-secondary">Close</button>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { admin } from '../../api';

const loading = ref(true);
const error = ref('');
const orders = ref([]);
const selectedOrder = ref(null);

const fetchOrders = async () => {
  loading.value = true;
  try {
    const { data } = await admin.getOrders();
    orders.value = data;
  } catch (err) {
    error.value = 'Failed to load orders';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (id, status) => {
  try {
    await admin.updateOrderStatus(id, status);
    await fetchOrders();
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to update status';
  }
};

const viewOrder = async (order) => {
  try {
    const { data } = await admin.getOrder(order.id);
    selectedOrder.value = data;
  } catch (err) {
    error.value = 'Failed to load order details';
  }
};

onMounted(fetchOrders);
</script>

<style scoped>
.admin-page {
  max-width: 1200px;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: #718096;
}

.error {
  color: #e53e3e;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background: #f7fafc;
  font-weight: 600;
}

.status-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
}

.status-select.pending { background: #fef3c7; }
.status-select.processing { background: #dbeafe; }
.status-select.shipped { background: #d1fae5; }
.status-select.delivered { background: #d1fae5; }
.status-select.cancelled { background: #fee2e2; }

.btn-small {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  background: #3490dc;
  color: #fff;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin: 0 0 1rem;
}

.modal-content h3 {
  margin: 1.5rem 0 1rem;
}

.order-details {
  background: #f7fafc;
  padding: 1rem;
  border-radius: 4px;
}

.detail-row {
  margin-bottom: 0.5rem;
}

.items-table {
  width: 100%;
}

.items-table th, .items-table td {
  padding: 0.5rem;
}

.items-table tfoot td {
  border-top: 2px solid #e2e8f0;
}

.form-actions {
  margin-top: 1.5rem;
  text-align: right;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #e2e8f0;
  color: #333;
}
</style>
