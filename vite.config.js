import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Adjust or remove if your backend runs elsewhere / you set VITE_API_BASE_URL instead
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
