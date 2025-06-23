# Система Sitemap для Фронтенда

Эта система позволяет автоматически генерировать sitemap.xml и robots.txt для каждого домена отдельно.

## Особенности

- ✅ **Автоматическая генерация** sitemap.xml на основе статей из API
- ✅ **Динамические приоритеты** - автоматический расчет приоритета по категориям и дате публикации  
- ✅ **Кеширование** - sitemap кешируется на 5 минут для производительности
- ✅ **SEO оптимизация** - правильные meta теги и структурированные данные
- ✅ **Управление через UI** - компонент для администрирования sitemap
- ✅ **Поддержка нескольких доменов** - каждый фронтенд генерирует свой sitemap

## Файловая структура

```
crypto_y/src/
├── utils/
│   └── sitemapGenerator.ts      # Класс для генерации sitemap
├── components/
│   ├── SitemapRoutes.tsx        # Компоненты для роутов /sitemap.xml и /robots.txt
│   └── SitemapManager.tsx       # UI для управления sitemap
├── pages/
│   └── TestPage.tsx            # Тестовая страница с SitemapManager
└── App.tsx                     # Добавлены роуты для sitemap

crypto_y/public/
├── sitemap.xml                 # Статический fallback sitemap
└── robots.txt                  # Статический robots.txt
```

## Использование

### 1. Доступ к Sitemap

- **Динамический**: `http://yourdomain.com/sitemap.xml` (генерируется из React)
- **Статический**: `http://yourdomain.com/sitemap.xml` (fallback из public/)
- **Robots.txt**: `http://yourdomain.com/robots.txt`

### 2. Управление через UI

Перейдите в `TestPage` → вкладка "Sitemap Management" для:
- Просмотра текущего sitemap
- Скачивания файлов
- Проверки количества статей
- Предпросмотра содержимого

### 3. Программное использование

```typescript
import { SitemapGenerator } from '../utils/sitemapGenerator';

const generator = new SitemapGenerator('https://yourdomain.com');

// Генерация sitemap
const sitemap = generator.generateSitemap(articles);

// Генерация robots.txt
const robots = generator.generateRobotsTxt();

// Скачивание файлов
generator.downloadSitemap(articles);
generator.downloadRobotsTxt();
```

## Конфигурация

### Приоритеты страниц
- **Главная**: 1.0
- **Статьи**: 0.9
- **Крипто категории** (Crypto, Bitcoin, Ethereum): 0.8
- **Другие категории**: 0.7
- **Статичные страницы**: 0.5-0.6

### Частота обновлений
- **Новые статьи** (≤1 день): hourly
- **Недавние статьи** (≤7 дней): daily  
- **Старые статьи** (≤30 дней): weekly
- **Архивные статьи** (>30 дней): monthly

### Кеширование
- **Статьи для sitemap**: 5 минут
- **HTTP кеш**: 1 час (Cache-Control: max-age=3600)

## Интеграция с поисковыми системами

### Google Search Console
1. Добавьте ваш домен в Search Console
2. Отправьте sitemap: `https://yourdomain.com/sitemap.xml`
3. Мониторьте индексацию в разделе "Sitemaps"

### Robots.txt конфигурация
```
User-agent: *
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
Sitemap: https://yourdomain.com/sitemap.xml

# Crawl-delay для ботов
Crawl-delay: 1
```

## Развертывание для разных доменов

### 1. Настройка базового URL
```typescript
// В production заменить localhost на реальный домен
const generator = new SitemapGenerator('https://yourdomain.com');
```

### 2. Переменные окружения
```typescript
const baseUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
```

### 3. Сборка для production
```bash
npm run build
# Sitemap будет доступен по /sitemap.xml автоматически
```

## Мониторинг и отладка

### Проверка sitemap
1. Откройте `/test` на вашем сайте
2. Перейдите в "Sitemap Management"
3. Нажмите "Перейти к /sitemap.xml"

### Валидация
- Используйте [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- Проверьте в Google Search Console

### Логи
- Ошибки загрузки статей отображаются в консоли браузера
- Статистика доступна в SitemapManager компоненте

## Troubleshooting

### Sitemap не загружается
1. Проверьте что API `/articles` возвращает данные
2. Убедитесь что React Router настроен правильно
3. Проверьте консоль браузера на ошибки

### Статьи не появляются в sitemap
1. Убедитесь что `status === 'published'`
2. Проверьте что `publishedAt` не пустое
3. Убедитесь что дата публикации не в будущем

### SEO не работает
1. Проверьте что meta теги добавляются (SitemapLinks компонент)
2. Убедитесь что robots.txt доступен
3. Проверьте структурированные данные в статьях

## Лицензия

Эта система является частью проекта новостного сайта и следует его лицензии. 