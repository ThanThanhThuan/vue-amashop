import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

if (!localStorage.getItem('session_id')) {
  localStorage.setItem('session_id', 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
}

const app = createApp(App)
app.use(router)
app.mount('#app')
