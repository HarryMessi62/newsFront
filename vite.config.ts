import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://45.150.34.200', // Убрать /api отсюда
        changeOrigin: true,
        secure: true, // Для HTTPS лучше true
        rewrite: (path) => path, // Оставляем путь как есть
      },
      '/sitemap.xml': {
        target: 'http://45.150.34.200',
        changeOrigin: true,
        secure: true,
      },
      '/robots.txt': {
        target: 'http://45.150.34.200',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})