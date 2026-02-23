<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <router-link to="/" class="sidebar-logo">
          <span class="logo-icon">▷</span>
          <span class="logo-text">ama<span class="logo-highlight">shop</span></span>
        </router-link>
        <span class="admin-badge">Admin</span>
      </div>
      
      <nav class="sidebar-nav">
        <router-link to="/admin" class="nav-item" exact>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
          </svg>
          <span>Dashboard</span>
        </router-link>
        
        <router-link to="/admin/orders" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          <span>Orders</span>
        </router-link>
        
        <router-link to="/admin/products" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z"/>
          </svg>
          <span>Products</span>
        </router-link>
        
        <router-link to="/admin/categories" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l-5.5 9h11z M17.5 17.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z M3 13.5h8v8H3z"/>
          </svg>
          <span>Categories</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <router-link to="/" class="back-to-store">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          <span>Back to Store</span>
        </router-link>
      </div>
    </aside>

    <main class="admin-main">
      <header class="admin-header">
        <h1>{{ pageTitle }}</h1>
        <div class="admin-user">
          <span>{{ authStore.state.user?.name }}</span>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
      </header>
      <div class="admin-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();

const pageTitle = computed(() => {
  const titles = {
    '/admin': 'Dashboard',
    '/admin/orders': 'Orders',
    '/admin/products': 'Products',
    '/admin/categories': 'Categories'
  };
  return titles[route.path] || 'Admin';
});

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f3f3f3;
}

.admin-sidebar {
  width: 260px;
  background: #232f3e;
  color: #fff;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #37475a;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #fff;
}

.logo-icon {
  font-size: 24px;
  margin-right: 4px;
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
}

.logo-highlight {
  color: #FF9900;
}

.admin-badge {
  background: #FF9900;
  color: #131921;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 3px;
}

.sidebar-nav {
  flex: 1;
  padding: 15px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #ddd;
  text-decoration: none;
  font-size: 14px;
  transition: background 0.2s;
}

.nav-item:hover {
  background: #37475a;
  color: #fff;
}

.nav-item.router-link-active {
  background: #37475a;
  color: #fff;
  border-left: 3px solid #FF9900;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #37475a;
}

.back-to-store {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ddd;
  text-decoration: none;
  font-size: 13px;
  padding: 8px;
  border-radius: 4px;
}

.back-to-store:hover {
  background: #37475a;
  color: #fff;
}

.admin-main {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
}

.admin-header {
  background: #fff;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.admin-header h1 {
  font-size: 24px;
  font-weight: 400;
  color: #131921;
  margin: 0;
}

.admin-user {
  display: flex;
  align-items: center;
  gap: 15px;
}

.admin-user span {
  font-size: 14px;
  color: #555;
}

.logout-btn {
  background: none;
  border: 1px solid #ccc;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.logout-btn:hover {
  background: #f3f3f3;
}

.admin-content {
  flex: 1;
  padding: 30px;
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 60px;
  }
  
  .sidebar-header {
    justify-content: center;
    padding: 15px 10px;
  }
  
  .logo-text,
  .admin-badge {
    display: none;
  }
  
  .nav-item span {
    display: none;
  }
  
  .nav-item {
    justify-content: center;
    padding: 15px;
  }
  
  .back-to-store span {
    display: none;
  }
  
  .back-to-store {
    justify-content: center;
  }
  
  .admin-main {
    margin-left: 60px;
  }
}
</style>
