<template>
  <div class="admin-page">
    <div class="page-header">
      <button @click="showForm = true" class="btn-primary">Add Category</button>
    </div>
      
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      
      <table v-else-if="categories.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.id }}</td>
            <td>{{ category.name }}</td>
            <td>{{ category.slug }}</td>
            <td>
              <span :class="['status', category.is_active ? 'active' : 'inactive']">
                {{ category.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <button @click="editCategory(category)" class="btn-small">Edit</button>
              <button @click="deleteCategory(category.id)" class="btn-small btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>No categories found</p>
      
      <div v-if="showForm" class="modal">
        <div class="modal-content">
          <h2>{{ editingCategory ? 'Edit' : 'Add' }} Category</h2>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Name *</label>
              <input v-model="form.name" type="text" required />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="form.description" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Sort Order</label>
              <input v-model.number="form.sort_order" type="number" />
            </div>
            <div class="form-group checkbox">
              <label>
                <input v-model="form.is_active" type="checkbox" />
                Active
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
import { admin } from '../../api';

const loading = ref(true);
const saving = ref(false);
const error = ref('');
const categories = ref([]);
const showForm = ref(false);
const editingCategory = ref(null);

const form = reactive({
  name: '',
  description: '',
  sort_order: 0,
  is_active: true
});

const fetchCategories = async () => {
  loading.value = true;
  try {
    const { data } = await admin.getCategories();
    categories.value = data;
  } catch (err) {
    error.value = 'Failed to load categories';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const editCategory = (category) => {
  editingCategory.value = category;
  form.name = category.name;
  form.description = category.description || '';
  form.sort_order = category.sort_order || 0;
  form.is_active = category.is_active;
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  editingCategory.value = null;
  form.name = '';
  form.description = '';
  form.sort_order = 0;
  form.is_active = true;
};

const handleSubmit = async () => {
  saving.value = true;
  try {
    if (editingCategory.value) {
      await admin.updateCategory(editingCategory.value.id, form);
    } else {
      await admin.createCategory(form);
    }
    await fetchCategories();
    closeForm();
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to save category';
  } finally {
    saving.value = false;
  }
};

const deleteCategory = async (id) => {
  if (!confirm('Are you sure you want to delete this category?')) return;
  try {
    await admin.deleteCategory(id);
    await fetchCategories();
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to delete category';
  }
};

onMounted(fetchCategories);
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
  max-width: 500px;
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

.form-group input, .form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.form-group.checkbox label {
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
