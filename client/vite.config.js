import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api-supabase-seven.vercel.app',
        changeOrigin: true
      },
      '/uploads': {
        target: 'https://api-supabase-seven.vercel.app',
        changeOrigin: true
      }
    }
  }
})
