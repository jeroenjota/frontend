import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  server: {
    proxy: {
      // API (JSON)
      '/api': {
        target: 'http://localhost:3456',
        changeOrigin: true
      },
      // Static uploads (images)
      '/uploads': {
        target: 'http://localhost:3456',
        changeOrigin: true
      }
    }
  }
})