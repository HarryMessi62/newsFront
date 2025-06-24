export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://news-back-h85g.vercel.app', // Убрать /api отсюда
        changeOrigin: true,
        secure: true, // Для HTTPS лучше true
        rewrite: (path) => path, // Оставляем путь как есть
      },
      '/sitemap.xml': {
        target: 'https://news-back-h85g.vercel.app',
        changeOrigin: true,
        secure: true,
      },
      '/robots.txt': {
        target: 'https://news-back-h85g.vercel.app',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})