<template>
  <div class="product-card">
    <router-link :to="`/products/${product.slug}`" class="product-link">
      <div class="product-image">
        <img 
          :src="product.images?.[0]?.image_url || product.image_url || '/placeholder.jpg'" 
          :alt="product.name"
        />
      </div>
      <div class="product-info">
        <h3 class="product-name">{{ product.name }}</h3>
        <div class="rating">
          <div class="stars">
            <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= 4 }">★</span>
          </div>
          <span class="review-count">{{ Math.floor(Math.random() * 500) + 10 }}</span>
        </div>
        <div class="product-price">
          <span v-if="product.sale_price" class="current-price">${{ product.sale_price }}</span>
          <span v-if="product.sale_price" class="was-price">${{ product.regular_price }}</span>
          <span v-if="!product.sale_price" class="current-price">${{ product.regular_price }}</span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.product-card {
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  cursor: pointer;
  transition: box-shadow 0.2s;
  position: relative;
}

.product-card:hover {
  box-shadow: 0 0 3px 2px rgba(0,0,0,0.1);
}

.product-link {
  text-decoration: none;
  color: inherit;
  display: block;
  padding: 10px;
}

.product-image {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-info {
  padding: 0;
}

.product-name {
  font-size: 13px;
  font-weight: 400;
  color: #0F1111;
  margin: 0 0 5px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 36px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 5px;
}

.stars {
  display: flex;
}

.star {
  color: #ccc;
  font-size: 12px;
}

.star.filled {
  color: #FF9900;
}

.review-count {
  font-size: 12px;
  color: #007185;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 5px;
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
}
</style>
