<template>
  <div class="auth-page">
    <div class="auth-form">
      <h1>Register</h1>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Name</label>
          <input 
            id="name"
            v-model="form.name" 
            type="text" 
            required 
            placeholder="Enter your name"
          />
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="form.email" 
            type="email" 
            required 
            placeholder="Enter your email"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            v-model="form.password" 
            type="password" 
            required 
            placeholder="Enter your password"
            minlength="6"
          />
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>
        
        <button type="submit" :disabled="loading" class="submit-btn">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>

      <p class="auth-link">
        Already have an account? <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '../stores/auth';

const router = useRouter();
const form = reactive({
  name: '',
  email: '',
  password: ''
});
const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;
  
  try {
    await authStore.register(form);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.error || 'Registration failed';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

h1 {
  margin: 0 0 2rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.error-message {
  color: #e53e3e;
  margin-bottom: 1rem;
  text-align: center;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: #3490dc;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.submit-btn:hover:not(:disabled) {
  background: #2b6cb0;
}

.submit-btn:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

.auth-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #718096;
}

.auth-link a {
  color: #3490dc;
  text-decoration: none;
}
</style>
