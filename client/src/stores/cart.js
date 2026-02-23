import { reactive, computed } from 'vue';
import { cart as cartApi } from '../api';

const state = reactive({
  items: [],
  total: 0,
  count: 0,
  loading: false
});

export const cartStore = {
  state,
  
  async fetchCart() {
    state.loading = true;
    try {
      const { data } = await cartApi.get();
      state.items = data.items || [];
      state.total = data.total || 0;
      state.count = state.items.reduce((sum, item) => sum + item.quantity, 0);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      state.loading = false;
    }
  },

  async addToCart(productId, quantity = 1) {
    try {
      await cartApi.add(productId, quantity);
      await this.fetchCart();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  },

  async updateQuantity(itemId, quantity) {
    try {
      await cartApi.update(itemId, quantity);
      const item = state.items.find(i => i.id === itemId);
      if (item) {
        item.quantity = quantity;
        item.subtotal = item.price * quantity;
        state.total = state.items.reduce((sum, i) => sum + i.subtotal, 0);
        state.count = state.items.reduce((sum, i) => sum + i.quantity, 0);
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    }
  },

  async removeItem(itemId) {
    try {
      await cartApi.remove(itemId);
      const index = state.items.findIndex(i => i.id === itemId);
      if (index > -1) {
        state.items.splice(index, 1);
        state.total = state.items.reduce((sum, i) => sum + i.subtotal, 0);
        state.count = state.items.reduce((sum, i) => sum + i.quantity, 0);
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
      throw error;
    }
  },

  async clearCart() {
    try {
      await cartApi.clear();
      state.items = [];
      state.total = 0;
      state.count = 0;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  }
};
