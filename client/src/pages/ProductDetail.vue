<template>
  <div class="product-detail">
    <div class="container">
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="product" class="product-content">
        <div class="product-gallery">
          <div class="main-image">
            <img 
              :src="currentImage || product.images?.[0]?.image_url || '/placeholder.jpg'" 
              :alt="product.name"
            />
          </div>
          <div v-if="product.images?.length > 1" class="thumbnails">
            <button 
              v-for="image in product.images" 
              :key="image.id"
              @click="currentImage = image.image_url"
              :class="['thumb', { active: currentImage === image.image_url }]"
            >
              <img :src="image.image_url" :alt="product.name" />
            </button>
          </div>
        </div>

        <div class="product-info">
          <router-link to="/products" class="back-link">← Back to Products</router-link>
          <h1>{{ product.name }}</h1>
          <p class="category">{{ product.category_name }}</p>
          
          <div class="price">
            <span v-if="product.sale_price" class="sale-price">${{ product.sale_price }}</span>
            <span :class="['regular-price', { 'has-sale': product.sale_price }]">
              ${{ product.regular_price }}
            </span>
          </div>

          <p class="description">{{ product.description }}</p>

          <div class="actions">
            <div class="quantity">
              <label>Quantity:</label>
              <input v-model.number="quantity" type="number" min="1" max="99" />
            </div>
            <button @click="handleAddToCart" class="add-to-cart-btn">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div v-if="product?.related_products?.length" class="related-products">
        <h2>Related Products</h2>
        <div class="products-grid">
          <ProductCard 
            v-for="related in product.related_products" 
            :key="related.id" 
            :product="related"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { products } from '../api';
import { cartStore } from '../stores/cart';
import { toastStore } from '../stores/toast';
import ProductCard from '../components/ProductCard.vue';

const route = useRoute();
const product = ref(null);
const loading = ref(true);
const error = ref(null);
const quantity = ref(1);
const currentImage = ref(null);

const fetchProduct = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const { data } = await products.getBySlug(route.params.slug);
    product.value = data;
    currentImage.value = data.images?.[0]?.image_url || null;
  } catch (err) {
    error.value = 'Product not found';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleAddToCart = async () => {
  try {
    await cartStore.addToCart(product.value.id, quantity.value);
    toastStore.success('Product added to cart!');
  } catch (err) {
    toastStore.error('Failed to add to cart');
  }
};

watch(
  () => route.params.slug,
  fetchProduct
);

onMounted(fetchProduct);
</script>

<style scoped>
.product-detail {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  color: #718096;
}

.error {
  color: #e53e3e;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
  }
}

.main-image {
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: #f7fafc;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnails {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.thumb {
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  background: none;
}

.thumb.active {
  border-color: #3490dc;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.back-link {
  color: #3490dc;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 1rem;
}

.product-info h1 {
  margin: 0 0 0.5rem;
  font-size: 2rem;
}

.category {
  color: #718096;
  margin: 0 0 1rem;
}

.price {
  margin: 1.5rem 0;
}

.sale-price {
  color: #e53e3e;
  font-size: 1.75rem;
  font-weight: bold;
}

.regular-price {
  color: #4a5568;
  font-size: 1.25rem;
}

.regular-price.has-sale {
  text-decoration: line-through;
  margin-left: 0.5rem;
}

.description {
  color: #4a5568;
  line-height: 1.6;
  margin: 1.5rem 0;
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  margin-top: 2rem;
}

.quantity {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quantity label {
  font-size: 0.875rem;
  color: #4a5568;
}

.quantity input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
}

.add-to-cart-btn {
  flex: 1;
  padding: 0.75rem 2rem;
  background: #3490dc;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.add-to-cart-btn:hover {
  background: #2b6cb0;
}

.related-products {
  border-top: 1px solid #e2e8f0;
  padding-top: 3rem;
}

.related-products h2 {
  margin: 0 0 2rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}
</style>
