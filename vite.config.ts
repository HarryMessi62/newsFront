import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://news-back-h85g.vercel.app/',
        changeOrigin: true,
        secure: false,
      },
      '/sitemap.xml': {
        target: 'https://news-back-h85g.vercel.app/',
        changeOrigin: true,
        secure: false,
      },
      '/robots.txt': {
        target: 'https://news-back-h85g.vercel.app/',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
