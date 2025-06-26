import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://infocryptox.com', // Убрать /api отсюда
        changeOrigin: true,
        secure: true, // Для HTTPS лучше true
        rewrite: (path) => path, // Оставляем путь как есть
      },
      '/sitemap.xml': {
        target: 'https://infocryptox.com',
        changeOrigin: true,
        secure: true,
      },
      '/robots.txt': {
        target: 'https://infocryptox.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})