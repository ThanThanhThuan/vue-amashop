<template>
  <div class="cart-page">
    <div class="cart-container">
      <h1>Shopping Cart</h1>
      
      <div v-if="cartStore.state.loading" class="loading">Loading cart...</div>
      
      <div v-else-if="cartStore.state.items.length === 0" class="empty-cart">
        <div class="empty-cart-content">
          <div class="empty-cart-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="#ddd">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </div>
          <p>Your Amazon Cart is empty</p>
          <router-link to="/products" class="shop-today">Shop today's deals</router-link>
        </div>
      </div>
      
      <div v-else class="cart-content">
        <div class="cart-main">
          <div class="cart-header">
            <h2>{{ cartStore.state.items.length }} items in your cart</h2>
          </div>
          
          <div class="cart-items">
            <div v-for="item in cartStore.state.items" :key="item.id" class="cart-item">
              <div class="item-image">
                <img :src="item.products?.image_url || item.products?.images?.[0]?.image_url || '/placeholder.jpg'" :alt="item.name" />
              </div>
              <div class="item-details">
                <router-link :to="`/products/${item.slug}`" class="item-name">
                  {{ item.name }}
                </router-link>
                <p class="item-price">
                  <span v-if="item.sale_price" class="current-price">${{ item.price }}</span>
                  <span v-if="item.sale_price" class="was-price">${{ item.regular_price }}</span>
                  <span v-if="!item.sale_price">${{ item.price }}</span>
                </p>
                <p class="in-stock">In Stock</p>
                <div class="item-actions">
                  <div class="quantity-selector">
                    <button type="button" @click="(e) => handleQuantityChange(e, item.id, item.quantity - 1)" :disabled="item.quantity <= 1">-</button>
                    <span>{{ item.quantity }}</span>
                    <button type="button" @click="(e) => handleQuantityChange(e, item.id, item.quantity + 1)">+</button>
                  </div>
                  <span class="separator">|</span>
                  <button type="button" @click="(e) => handleRemove(e, item.id)" class="delete-btn">Delete</button>
                </div>
              </div>
              <div class="item-subtotal">
                <p class="subtotal-price">${{ item.subtotal?.toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <div class="summary-card">
            <div class="subtotal-row">
              <span>Subtotal ({{ cartStore.state.count }} items):</span>
              <span class="subtotal-amount">${{ cartStore.state.total?.toFixed(2) }}</span>
            </div>
            <router-link to="/checkout" class="checkout-btn">Proceed to Checkout</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { cartStore } from '../stores/cart';

const handleQuantityChange = async (event, itemId, quantity) => {
  event.preventDefault();
  event.stopPropagation();
  if (quantity > 0) {
    await cartStore.updateQuantity(itemId, quantity);
  }
  return false;
};

const handleRemove = async (event, itemId) => {
  event.preventDefault();
  event.stopPropagation();
  await cartStore.removeItem(itemId);
  return false;
};

onMounted(() => {
  cartStore.fetchCart();
});
</script>

<style scoped>
.cart-page {
  background: #fff;
  padding: 20px;
}

.cart-container {
  max-width: 1400px;
  margin: 0 auto;
}

.cart-container h1 {
  font-size: 28px;
  font-weight: 400;
  color: #0F1111;
  margin: 0 0 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #888;
}

.empty-cart {
  padding: 40px 0;
}

.empty-cart-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.empty-cart-icon {
  margin-bottom: 20px;
}

.empty-cart-content p {
  font-size: 20px;
  color: #0F1111;
  margin: 0 0 15px;
}

.shop-today {
  color: #007185;
  font-size: 14px;
}

.shop-today:hover {
  color: #c7511f;
}

.cart-content {
  display: flex;
  gap: 20px;
}

.cart-main {
  flex: 1;
}

.cart-header h2 {
  font-size: 18px;
  font-weight: 400;
  color: #0F1111;
  margin: 0 0 15px;
}

.cart-items {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
}

.cart-item {
  display: flex;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 14px;
  color: #0F1111;
  text-decoration: none;
  line-height: 1.4;
}

.item-name:hover {
  color: #c7511f;
}

.item-price {
  margin: 5px 0;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #0F1111;
}

.was-price {
  font-size: 13px;
  color: #555;
  text-decoration: line-through;
  margin-left: 8px;
}

.in-stock {
  color: #007600;
  font-size: 13px;
  margin: 5px 0;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #d5d9d9;
  border-radius: 8px;
  overflow: hidden;
}

.quantity-selector button {
  width: 30px;
  height: 30px;
  background: #f0f2f2;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.quantity-selector button:hover {
  background: #e7e9ec;
}

.quantity-selector button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-selector span {
  padding: 0 15px;
  font-size: 14px;
}

.separator {
  color: #ddd;
}

.delete-btn {
  background: none;
  border: none;
  color: #007185;
  cursor: pointer;
  font-size: 13px;
}

.delete-btn:hover {
  color: #c7511f;
  text-decoration: underline;
}

.item-subtotal {
  min-width: 80px;
  text-align: right;
}

.subtotal-price {
  font-size: 18px;
  font-weight: 700;
  color: #0F1111;
}

.cart-summary {
  width: 280px;
}

.summary-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
  position: sticky;
  top: 20px;
}

.subtotal-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.subtotal-row span:first-child {
  font-size: 14px;
  color: #0F1111;
}

.subtotal-amount {
  font-size: 18px;
  font-weight: 700;
  color: #0F1111;
}

.checkout-btn {
  display: block;
  width: 100%;
  padding: 8px 20px;
  background: #f0c14b;
  border: 1px solid #a88734;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  color: #111;
  text-align: center;
}

.checkout-btn:hover {
  background: #e7b000;
}

@media (max-width: 900px) {
  .cart-content {
    flex-direction: column;
  }
  
  .cart-summary {
    width: 100%;
  }
}
</style>
