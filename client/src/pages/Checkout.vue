<template>
  <div class="checkout-page">
    <div class="container">
      <h1>Checkout</h1>
      
      <div v-if="cartStore.state.items.length === 0" class="empty-cart">
        <p>Your cart is empty</p>
        <router-link to="/products" class="shop-link">Continue Shopping</router-link>
      </div>
      
      <div v-else class="checkout-content">
        <form @submit.prevent="handleSubmit" class="checkout-form">
          <h2>Shipping Information</h2>
          
          <div class="form-group">
            <label for="name">Full Name *</label>
            <input id="name" v-model="form.name" type="text" required />
          </div>
          
          <div class="form-group">
            <label for="email">Email *</label>
            <input id="email" v-model="form.email" type="email" required />
          </div>
          
          <div class="form-group">
            <label for="phone">Phone *</label>
            <input id="phone" v-model="form.phone" type="tel" required />
          </div>
          
          <div class="form-group">
            <label for="address">Address *</label>
            <input id="address" v-model="form.address" type="text" required />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="city">City *</label>
              <input id="city" v-model="form.city" type="text" required />
            </div>
            <div class="form-group">
              <label for="state">State *</label>
              <input id="state" v-model="form.state" type="text" required />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="zip">ZIP Code *</label>
              <input id="zip" v-model="form.zip" type="text" required />
            </div>
            <div class="form-group">
              <label for="country">Country *</label>
              <input id="country" v-model="form.country" type="text" required />
            </div>
          </div>
          
          <div class="form-group">
            <label for="notes">Order Notes</label>
            <textarea id="notes" v-model="form.notes" rows="3"></textarea>
          </div>

          <div v-if="error" class="error-message">{{ error }}</div>
          
          <button type="submit" :disabled="loading" class="place-order-btn">
            {{ loading ? 'Processing...' : `Place Order - $${cartStore.state.total}` }}
          </button>
        </form>
        
        <div class="order-summary">
          <h3>Order Summary</h3>
          <div v-for="item in cartStore.state.items" :key="item.id" class="summary-item">
            <span>{{ item.name }} x{{ item.quantity }}</span>
            <span>${{ item.subtotal }}</span>
          </div>
          <div class="summary-total">
            <span>Total</span>
            <span>${{ cartStore.state.total }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { cartStore } from '../stores/cart';
import { authStore } from '../stores/auth';
import { toastStore } from '../stores/toast';
import { orders } from '../api';

const router = useRouter();
const loading = ref(false);
const error = ref('');

const form = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  notes: ''
});

onMounted(async () => {
  if (cartStore.state.items.length === 0) {
    await cartStore.fetchCart();
  }
  if (authStore.state.user) {
    form.name = authStore.state.user.name || '';
    form.email = authStore.state.user.email || '';
  }
});

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;
  
  try {
    const { data } = await orders.create({
      shipping_name: form.name,
      shipping_email: form.email,
      shipping_phone: form.phone,
      shipping_address: form.address,
      shipping_city: form.city,
      shipping_state: form.state,
      shipping_zip: form.zip,
      shipping_country: form.country,
      notes: form.notes
    });
    
    await cartStore.fetchCart();
    toastStore.success(`Order placed! Order number: ${data.order_number}`);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to place order';
    toastStore.error(error.value);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.checkout-page {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

h1 {
  margin: 0 0 2rem;
}

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-cart p {
  font-size: 1.25rem;
  color: #718096;
  margin: 0 0 1.5rem;
}

.shop-link {
  display: inline-block;
  background: #3490dc;
  color: #fff;
  padding: 0.75rem 2rem;
  text-decoration: none;
  border-radius: 4px;
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

@media (max-width: 768px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
}

.checkout-form h2 {
  margin: 0 0 1.5rem;
  font-size: 1.25rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-size: 0.875rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.error-message {
  color: #e53e3e;
  margin-bottom: 1rem;
}

.place-order-btn {
  width: 100%;
  padding: 1rem;
  background: #38a169;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

.place-order-btn:hover:not(:disabled) {
  background: #2f855a;
}

.place-order-btn:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

.order-summary {
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 8px;
  height: fit-content;
}

.order-summary h3 {
  margin: 0 0 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: #4a5568;
  font-size: 0.875rem;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  margin-top: 0.5rem;
  border-top: 1px solid #e2e8f0;
  font-weight: bold;
  font-size: 1.125rem;
}
</style>
