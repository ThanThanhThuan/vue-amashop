<template>
  <div class="home-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1>Welcome to Than Thanh Thuan's AmaShop</h1>
        <p>Login as admin2@amashop.com, password: admin123 to access admin dashboard</p>
        <p>Millions of products at your fingertips</p>
      </div>
    </div>

    <div class="content-section">
      <div class="products-section">
        <section class="featured-products">
          <div class="section-header">
            <h2>Featured Products</h2>
            <router-link to="/products" class="see-more">See more ›</router-link>
          </div>
          
          <div v-if="loading" class="loading">Loading...</div>
          <div v-else-if="error" class="error">{{ error }}</div>
          <div v-else class="products-grid">
            <ProductCard 
              v-for="product in featuredProducts" 
              :key="product.id" 
              :product="product"
            />
          </div>
        </section>

        <section class="categories-section">
          <div class="section-header">
            <h2>Shop by Category</h2>
          </div>
          
          <div class="categories-grid">
            <router-link 
              v-for="category in categories" 
              :key="category.id"
              :to="`/category/${category.slug}`"
              class="category-card"
            >
              <div class="category-image">
                <img :src="getCategoryImage(category.slug)" :alt="category.name" />
              </div>
              <h3>{{ category.name }}</h3>
            </router-link>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { products, categories as categoryApi } from '../api';
import ProductCard from '../components/ProductCard.vue';

const featuredProducts = ref([]);
const categories = ref([]);
const loading = ref(true);
const error = ref(null);

const categoryImages = {
  'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300',
  'clothing': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300',
  'home-garden': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300',
  'books': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300',
  'sports': 'https://images.unsplash.com/photo-1461896836934- voices-bb?w=300'
};

const getCategoryImage = (slug) => {
  return categoryImages[slug] || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300';
};

const fetchData = async () => {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      products.getFeatured(),
      categoryApi.getAll()
    ]);
    featuredProducts.value = productsRes.data;
    categories.value = categoriesRes.data;
  } catch (err) {
    error.value = 'Failed to load data';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>

<style scoped>
.home-page {
  background: #f3f3f3;
}

.hero-section {
  background: linear-gradient(to bottom, #232f3e, #131921);
  padding: 20px;
  text-align: center;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content h1 {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px;
}

.hero-content p {
  font-size: 18px;
  color: #ddd;
  margin: 0;
}

.content-section {
  max-width: 1500px;
  margin: 0 auto;
  padding: 20px;
  margin-top: -30px;
}

.products-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.featured-products,
.categories-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #131921;
  margin: 0;
}

.see-more {
  font-size: 13px;
  color: #007185;
  text-decoration: none;
}

.see-more:hover {
  color: #c7511f;
  text-decoration: underline;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
}

.category-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}

.category-card:hover {
  opacity: 0.9;
}

.category-image {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
  background: #f3f3f3;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-card h3 {
  font-size: 14px;
  font-weight: 500;
  color: #131921;
  margin: 0;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: #888;
}

.error {
  color: #e53e3e;
}
</style>
