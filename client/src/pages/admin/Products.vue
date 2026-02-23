<template>
  <div class="admin-page">
    <div class="page-header">
      <button @click="showForm = true" class="btn-primary">Add Product</button>
    </div>
    
    <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      
      <table v-else-if="products.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.category_name }}</td>
            <td>${{ product.sale_price || product.regular_price }}</td>
            <td>{{ product.stock_quantity }}</td>
            <td>
              <span :class="['status', product.is_active ? 'active' : 'inactive']">
                {{ product.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <button @click="editProduct(product)" class="btn-small">Edit</button>
              <button @click="deleteProduct(product.id)" class="btn-small btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>No products found</p>
      
      <div v-if="showForm" class="modal">
        <div class="modal-content">
          <h2>{{ editingProduct ? 'Edit' : 'Add' }} Product</h2>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Name *</label>
              <input v-model="form.name" type="text" required />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Regular Price *</label>
                <input v-model.number="form.regular_price" type="number" step="0.01" required />
              </div>
              <div class="form-group">
                <label>Sale Price</label>
                <input v-model.number="form.sale_price" type="number" step="0.01" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>SKU</label>
                <input v-model="form.sku" type="text" />
              </div>
              <div class="form-group">
                <label>Stock Quantity</label>
                <input v-model.number="form.stock_quantity" type="number" />
              </div>
            </div>
            <div class="form-group">
              <label>Category</label>
              <select v-model="form.category_id">
                <option value="">Select category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Short Description</label>
              <input v-model="form.short_description" type="text" />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="form.description" rows="4"></textarea>
            </div>
            <div class="form-group checkbox-group">
              <label>
                <input v-model="form.is_active" type="checkbox" />
                Active
              </label>
              <label>
                <input v-model="form.is_featured" type="checkbox" />
                Featured
              </label>
            </div>
            <div class="form-actions">
              <button type="button" @click="closeForm" class="btn-secondary">Cancel</button>
              <button type="submit" class="btn-primary">{{ saving ? 'Saving...' : 'Save' }}</button>
            </div>
          </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { admin, categories as categoryApi } from '../../api';

const loading = ref(true);
const saving = ref(false);
const error = ref('');
const products = ref([]);
const categories = ref([]);
const showForm = ref(false);
const editingProduct = ref(null);

const form = reactive({
  name: '',
  slug: '',
  short_description: '',
  description: '',
  regular_price: 0,
  sale_price: null,
  sku: '',
  stock_quantity: 0,
  category_id: '',
  is_active: true,
  is_featured: false
});

const fetchData = async () => {
  loading.value = true;
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      admin.getProducts(),
      categoryApi.getAll()
    ]);
    products.value = productsRes.data;
    categories.value = categoriesRes.data;
  } catch (err) {
    error.value = 'Failed to load data';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const editProduct = (product) => {
  editingProduct.value = product;
  form.name = product.name;
  form.slug = product.slug;
  form.short_description = product.short_description || '';
  form.description = product.description || '';
  form.regular_price = product.regular_price;
  form.sale_price = product.sale_price;
  form.sku = product.sku || '';
  form.stock_quantity = product.stock_quantity || 0;
  form.category_id = product.category_id || '';
  form.is_active = product.is_active;
  form.is_featured = product.is_featured;
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  editingProduct.value = null;
  form.name = '';
  form.slug = '';
  form.short_description = '';
  form.description = '';
  form.regular_price = 0;
  form.sale_price = null;
  form.sku = '';
  form.stock_quantity = 0;
  form.category_id = '';
  form.is_active = true;
  form.is_featured = false;
};

const handleSubmit = async () => {
  saving.value = true;
  try {
    const data = { ...form, category_id: form.category_id || null };
    if (editingProduct.value) {
      await admin.updateProduct(editingProduct.value.id, data);
    } else {
      await admin.createProduct(data);
    }
    await fetchData();
    closeForm();
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to save product';
  } finally {
    saving.value = false;
  }
};

const deleteProduct = async (id) => {
  if (!confirm('Are you sure you want to delete this product?')) return;
  try {
    await admin.deleteProduct(id);
    await fetchData();
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to delete product';
  }
};

onMounted(fetchData);
</script>

<style scoped>
.admin-page {
  max-width: 1200px;
}

.page-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
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

.status {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.status.active { background: #d1fae5; color: #065f46; }
.status.inactive { background: #fee2e2; color: #991b1b; }

.btn-primary, .btn-secondary, .btn-small, .btn-danger {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-primary { background: #3490dc; color: #fff; }
.btn-secondary { background: #e2e8f0; color: #333; }
.btn-danger { background: #e53e3e; color: #fff; }
.btn-small { padding: 0.25rem 0.5rem; margin-right: 0.5rem; }

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
  margin: 0 0 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.form-group input, .form-group textarea, .form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.checkbox-group {
  display: flex;
  gap: 1.5rem;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}
</style>
