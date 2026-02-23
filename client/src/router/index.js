import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Products from '../pages/Products.vue';
import ProductDetail from '../pages/ProductDetail.vue';
import Cart from '../pages/Cart.vue';
import Checkout from '../pages/Checkout.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import AdminDashboard from '../pages/admin/Dashboard.vue';
import AdminCategories from '../pages/admin/Categories.vue';
import AdminProducts from '../pages/admin/Products.vue';
import AdminOrders from '../pages/admin/Orders.vue';
import AdminLayout from '../components/AdminLayout.vue';

const adminRoutes = [
  { path: '', name: 'AdminDashboard', component: AdminDashboard },
  { path: 'orders', name: 'AdminOrders', component: AdminOrders },
  { path: 'products', name: 'AdminProducts', component: AdminProducts },
  { path: 'categories', name: 'AdminCategories', component: AdminCategories }
];

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/products', name: 'Products', component: Products },
  { path: '/products/:slug', name: 'ProductDetail', component: ProductDetail },
  { path: '/category/:slug', name: 'CategoryProducts', component: Products },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/checkout', name: 'Checkout', component: Checkout },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { 
    path: '/admin', 
    component: AdminLayout,
    children: adminRoutes
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
