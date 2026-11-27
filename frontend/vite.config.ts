import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// /api ile başlayan istekler backend'e (3002) yönlendirilir, böylece arayüzde adres yazmaya gerek kalmaz
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3002',
    },
  },
})
