import type { Article } from '../services/api';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

export class SitemapGenerator {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    // Используем переданный URL или автоматически определяем
    this.baseUrl = (baseUrl || window.location.origin).replace(/\/$/, ''); // Убираем слеш в конце
  }

  // Генерация sitemap.xml
  generateSitemap(articles: Article[]): string {
    const now = new Date().toISOString();
    const urls: SitemapUrl[] = [];

    // Главная страница
    urls.push({
      loc: `${this.baseUrl}/`,
      lastmod: now,
      changefreq: 'daily',
      priority: '1.0'
    });

    // Страница статей
    urls.push({
      loc: `${this.baseUrl}/articles`,
      lastmod: now,
      changefreq: 'daily',
      priority: '0.9'
    });

    // Категории
    const categories = ['Crypto', 'Bitcoin', 'Ethereum', 'Technology', 'Economy', 'Business'];
    categories.forEach(category => {
      urls.push({
        loc: `${this.baseUrl}/articles?category=${encodeURIComponent(category)}`,
        lastmod: now,
        changefreq: category.includes('Crypto') || category.includes('Bitcoin') || category.includes('Ethereum') ? 'daily' : 'weekly',
        priority: category.includes('Crypto') || category.includes('Bitcoin') || category.includes('Ethereum') ? '0.8' : '0.7'
      });
    });

    // Статичные страницы
    const staticPages = [
      { path: '/about', priority: '0.6', changefreq: 'monthly' as const },
      { path: '/contacts', priority: '0.6', changefreq: 'monthly' as const },
      { path: '/privacy', priority: '0.5', changefreq: 'monthly' as const },
    ];

    staticPages.forEach(page => {
      urls.push({
        loc: `${this.baseUrl}${page.path}`,
        lastmod: now,
        changefreq: page.changefreq,
        priority: page.priority
      });
    });

    // Статьи
    articles.forEach(article => {
      // Фильтруем только опубликованные статьи с датой публикации
      const isPublished = article.publishedAt && new Date(article.publishedAt) <= new Date();
      
      if (isPublished) {
        const lastmod = article.updatedAt || article.publishedAt;
        const priority = this.calculateArticlePriority(article);
        const changefreq = this.getChangefreq(article);

        urls.push({
          loc: `${this.baseUrl}/article/${article.slug || article._id}`,
          lastmod: new Date(lastmod).toISOString(),
          changefreq,
          priority
        });
      }
    });

    // Генерируем XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    urls.forEach(url => {
      sitemap += `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    return sitemap;
  }

  // Генерация robots.txt
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

# Основные страницы
Allow: /articles
Allow: /article/*
Allow: /about
Allow: /contacts

# Запрещаем административные разделы  
Disallow: /admin
Disallow: /login
Disallow: /api

# Sitemap
Sitemap: ${this.baseUrl}/sitemap.xml

# Crawl-delay для ботов
Crawl-delay: 1`;
  }

  // Вычисление приоритета статьи
  private calculateArticlePriority(article: Article): string {
    const now = new Date();
    const publishedAt = new Date(article.publishedAt!);
    const daysSincePublished = (now.getTime() - publishedAt.getTime()) / (1000 * 60 * 60 * 24);
    
    // Базовый приоритет по категории
    let priority = 0.7;
    
    if (['Crypto', 'Bitcoin', 'Ethereum'].includes(article.category)) {
      priority = 0.9;
    } else if (['Technology', 'Economy', 'Business'].includes(article.category)) {
      priority = 0.8;
    }
    
    // Уменьшаем приоритет для старых статей
    if (daysSincePublished > 30) {
      priority *= 0.8;
    } else if (daysSincePublished > 7) {
      priority *= 0.9;
    }
    
    return Math.max(0.3, Math.min(0.9, priority)).toFixed(1);
  }

  // Частота изменений
  private getChangefreq(article: Article): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
    const now = new Date();
    const publishedAt = new Date(article.publishedAt!);
    const daysSincePublished = (now.getTime() - publishedAt.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSincePublished <= 1) return 'hourly';
    if (daysSincePublished <= 7) return 'daily';
    if (daysSincePublished <= 30) return 'weekly';
    return 'monthly';
  }

  // Метод для скачивания sitemap как файла (для тестирования)
  downloadSitemap(articles: Article[], filename: string = 'sitemap.xml'): void {
    const sitemap = this.generateSitemap(articles);
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Метод для скачивания robots.txt
  downloadRobotsTxt(filename: string = 'robots.txt'): void {
    const robotsTxt = this.generateRobotsTxt();
    const blob = new Blob([robotsTxt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
} 