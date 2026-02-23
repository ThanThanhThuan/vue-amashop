<template>
  <div class="products-page">
    <div class="page-header">
      <h1>{{ categoryName || 'All Products' }}</h1>
    </div>

    <div class="products-content">
      <div class="filters-sidebar">
        <div class="filter-section">
          <h3>Search</h3>
          <input 
            v-model="searchQuery" 
            @input="handleSearch"
            type="text" 
            placeholder="Search Amazon"
            class="search-input"
          />
        </div>
      </div>

      <div class="products-main">
        <div class="results-info">
          <span>{{ products.length }} results</span>
        </div>

        <div v-if="loading" class="loading">Loading products...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="products.length === 0" class="empty">No products found</div>
        <div v-else class="products-grid">
          <ProductCard 
            v-for="product in products" 
            :key="product.id" 
            :product="product"
          />
        </div>

        <div v-if="totalPages > 1" class="pagination">
          <button 
            @click="changePage(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="page-btn"
          >
            ‹ Previous
          </button>
          <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
          <button 
            @click="changePage(currentPage + 1)" 
            :disabled="currentPage === totalPages"
            class="page-btn"
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { products } from '../api';
import ProductCard from '../components/ProductCard.vue';

const route = useRoute();
const productsList = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const totalItems = ref(0);
const limit = 20;
const searchQuery = ref('');
const categorySlug = ref('');

const categoryName = computed(() => {
  if (route.params.slug) {
    return route.params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return '';
});

const totalPages = computed(() => Math.ceil(totalItems.value / limit));

const fetchProducts = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const params = {
      page: currentPage.value,
      limit
    };
    
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    
    if (categorySlug.value) {
      params.category = categorySlug.value;
    }
    
    const { data } = await products.getAll(params);
    productsList.value = data;
  } catch (err) {
    error.value = 'Failed to load products';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchProducts();
};

const changePage = (page) => {
  currentPage.value = page;
  fetchProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

watch(
  () => route.params.slug,
  (newSlug) => {
    categorySlug.value = newSlug || '';
    currentPage.value = 1;
    fetchProducts();
  },
  { immediate: true }
);

onMounted(() => {
  categorySlug.value = route.params.slug || '';
  fetchProducts();
});
</script>

<style scoped>
.products-page {
  background: #fff;
  padding: 20px;
}

.page-header {
  max-width: 1500px;
  margin: 0 auto 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 400;
  color: #0F1111;
  margin: 0;
  text-transform: capitalize;
}

.products-content {
  display: flex;
  max-width: 1500px;
  margin: 0 auto;
  gap: 20px;
}

.filters-sidebar {
  width: 200px;
  flex-shrink: 0;
}

.filter-section {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.filter-section h3 {
  font-size: 14px;
  font-weight: 700;
  color: #0F1111;
  margin: 0 0 10px;
}

.search-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
}

.products-main {
  flex: 1;
}

.results-info {
  font-size: 14px;
  color: #0F1111;
  margin-bottom: 15px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.loading, .error, .empty {
  text-align: center;
  padding: 40px;
  color: #888;
}

.error {
  color: #e53e3e;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.page-btn {
  padding: 8px 16px;
  background: #f0f2f2;
  border: 1px solid #d5d9d9;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  color: #0F1111;
}

.page-btn:hover:not(:disabled) {
  background: #e7e9ec;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 13px;
  color: #0F1111;
}

@media (max-width: 768px) {
  .filters-sidebar {
    display: none;
  }
}
</style>
