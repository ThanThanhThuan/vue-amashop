<template>
  <header class="amazon-header">
    <div class="header-main">
      <div class="header-left">
        <router-link to="/" class="logo">
          <span class="logo-icon">▷</span>
          <span class="logo-text">ama<span class="logo-highlight">shop</span></span>
        </router-link>
        <div class="deliver-to">
          <div class="deliver-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div class="deliver-text">
            <span class="deliver-label">Deliver to</span>
            <span class="deliver-location">Worldwide</span>
          </div>
        </div>
      </div>

      <div class="header-search">
        <div class="search-dropdown">
          <span class="search-dropdown-text">All</span>
          <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </div>
        <input 
          type="text" 
          class="search-input" 
          placeholder="Search Amazon"
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        />
        <button class="search-button" @click="handleSearch">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#131921">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
      </div>

      <div class="header-right">
        <div class="header-flag">
          <span class="flag-icon">🇺🇸</span>
          <span class="flag-text">EN</span>
          <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </div>

        <router-link to="/login" class="header-link account-link" v-if="!authStore.isAuthenticated">
          <span class="line-1">Hello, sign in</span>
          <span class="line-2">Account & Lists</span>
          <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </router-link>

        <div class="header-link account-link" v-else @click="handleLogout">
          <span class="line-1">Hello, {{ authStore.state.user?.name }}</span>
          <span class="line-2">Account & Lists</span>
          <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </div>

        <router-link v-if="authStore.isAdmin" to="/admin" class="header-link returns-link">
          <span class="line-1">Admin</span>
          <span class="line-2">Dashboard</span>
        </router-link>
        
        <router-link to="/orders" class="header-link returns-link">
          <span class="line-1">Returns</span>
          <span class="line-2">& Orders</span>
        </router-link>

        <router-link to="/cart" class="header-link cart-link">
          <div class="cart-icon-wrapper">
            <span class="cart-count">{{ cartStore.state.count }}</span>
            <svg width="35" height="35" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            <span class="cart-text">Cart</span>
          </div>
        </router-link>
      </div>
    </div>

    <div class="header-nav">
      <div class="nav-left">
        <button class="nav-menu-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
          <span>All</span>
        </button>
        <router-link to="/products" class="nav-link">Fresh</router-link>
        <router-link to="/products" class="nav-link">Today's Deals</router-link>
        <router-link to="/products" class="nav-link">Customer Service</router-link>
        <router-link to="/products" class="nav-link">Registry</router-link>
        <router-link to="/products" class="nav-link">Gift Cards</router-link>
        <router-link to="/products" class="nav-link">Sell</router-link>
      </div>
      <div class="nav-right">
        <router-link to="/products" class="nav-link shop-link">Shop great deals now</router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { cartStore } from '../stores/cart';
import { authStore } from '../stores/auth';

const router = useRouter();
const searchQuery = ref('');

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/products', query: { search: searchQuery.value } });
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<style scoped>
.amazon-header {
  background: #131921;
  color: #fff;
  font-family: 'Amazon Ember', Arial, sans-serif;
}

.header-main {
  display: flex;
  align-items: center;
  padding: 8px 20px;
  gap: 15px;
  max-width: 1500px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  border: 1px solid transparent;
  padding: 8px 6px;
  margin-left: -8px;
}

.logo:hover {
  border: 1px solid #fff;
  border-radius: 3px;
}

.logo-icon {
  font-size: 20px;
  color: #fff;
  margin-right: 2px;
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.5px;
}

.logo-highlight {
  color: #FF9900;
}

.deliver-to {
  display: flex;
  align-items: flex-start;
  padding: 8px 6px;
  cursor: pointer;
  border: 1px solid transparent;
}

.deliver-to:hover {
  border: 1px solid #fff;
  border-radius: 3px;
}

.deliver-icon {
  margin-right: 4px;
  margin-top: 2px;
}

.deliver-text {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  line-height: 14px;
}

.deliver-label {
  color: #ccc;
}

.deliver-location {
  font-weight: 700;
}

.header-search {
  display: flex;
  flex: 1;
  max-width: 900px;
  height: 42px;
}

.search-dropdown {
  display: flex;
  align-items: center;
  padding: 0 10px;
  background: #f3f3f3;
  border-radius: 4px 0 0 4px;
  cursor: pointer;
  border-right: 1px solid #ccc;
}

.search-dropdown:hover {
  background: #dadada;
}

.search-dropdown-text {
  font-size: 12px;
  color: #555;
}

.dropdown-arrow {
  margin-left: 4px;
  margin-top: 4px;
}

.search-input {
  flex: 1;
  border: none;
  padding: 0 10px;
  font-size: 16px;
  outline: none;
}

.search-button {
  width: 45px;
  background: #febd69;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button:hover {
  background: #f3a847;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-flag {
  display: flex;
  align-items: center;
  padding: 8px 6px;
  cursor: pointer;
  border: 1px solid transparent;
}

.header-flag:hover {
  border: 1px solid #fff;
  border-radius: 3px;
}

.flag-icon {
  font-size: 18px;
}

.flag-text {
  font-size: 13px;
  font-weight: 700;
  margin-left: 4px;
}

.header-link {
  display: flex;
  flex-direction: column;
  padding: 8px 6px;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
  color: #fff;
}

.header-link:hover {
  border: 1px solid #fff;
  border-radius: 3px;
}

.account-link .line-1,
.returns-link .line-1 {
  font-size: 11px;
  color: #ccc;
}

.account-link .line-2,
.returns-link .line-2 {
  font-size: 14px;
  font-weight: 700;
}

.cart-link {
  display: flex;
  align-items: flex-end;
  padding: 8px 6px;
}

.cart-icon-wrapper {
  position: relative;
  display: flex;
  align-items: flex-end;
}

.cart-count {
  position: absolute;
  top: -2px;
  left: 18px;
  font-size: 16px;
  font-weight: 700;
  color: #f08804;
}

.cart-text {
  font-size: 14px;
  font-weight: 700;
  margin-left: 4px;
}

.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #232f3e;
  padding: 0 20px;
  max-width: 1500px;
  margin: 0 auto;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-menu-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: 1px solid transparent;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 6px 8px;
  cursor: pointer;
}

.nav-menu-btn:hover {
  border: 1px solid #fff;
  border-radius: 3px;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  padding: 8px 10px;
  border: 1px solid transparent;
  white-space: nowrap;
}

.nav-link:hover {
  border: 1px solid #fff;
  border-radius: 3px;
}

.shop-link {
  font-weight: 700;
  font-size: 14px;
}

@media (max-width: 1024px) {
  .header-search {
    display: none;
  }
  
  .deliver-to,
  .header-flag {
    display: none;
  }
  
  .header-nav {
    display: none;
  }
}

@media (max-width: 768px) {
  .account-link,
  .returns-link {
    display: none;
  }
}
</style>
