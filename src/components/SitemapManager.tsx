import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Globe, FileText, RefreshCw } from 'lucide-react';
import { articlesAPI } from '../services/api';
import { SitemapGenerator } from '../utils/sitemapGenerator';

export const SitemapManager = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewType, setPreviewType] = useState<'sitemap' | 'robots'>('sitemap');

  const { data: articlesData, isLoading, refetch } = useQuery({
    queryKey: ['articles-for-sitemap'],
    queryFn: async () => {
      return await articlesAPI.getAll(1, 10000); // Получаем все статьи
    },
    staleTime: 30 * 1000, // Кешируем только на 30 секунд
    cacheTime: 60 * 1000, // Храним в кеше 1 минуту
  });

  const articles = articlesData?.articles || [];
  const generator = new SitemapGenerator();
  const sitemap = generator.generateSitemap(articles);
  const robotsTxt = generator.generateRobotsTxt();
  
  // Подсчитываем только опубликованные статьи
  const publishedArticles = articles.filter(article => 
    article.publishedAt && new Date(article.publishedAt) <= new Date()
  );

  const handleDownloadSitemap = () => {
    generator.downloadSitemap(articles);
  };

  const handleDownloadRobots = () => {
    generator.downloadRobotsTxt();
  };

  const handleOpenSitemap = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Sitemap.xml</title>
            <style>
              body { font-family: monospace; margin: 20px; background: #f5f5f5; }
              pre { background: white; padding: 20px; border-radius: 8px; overflow-x: auto; }
            </style>
          </head>
          <body>
            <h1>Sitemap.xml</h1>
            <pre>${sitemap.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const handleOpenRobots = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Robots.txt</title>
            <style>
              body { font-family: monospace; margin: 20px; background: #f5f5f5; }
              pre { background: white; padding: 20px; border-radius: 8px; }
            </style>
          </head>
          <body>
            <h1>Robots.txt</h1>
            <pre>${robotsTxt}</pre>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const handleGoToSitemap = async () => {
    // Открываем sitemap в новой вкладке
    window.open('/sitemap.xml', '_blank');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mr-2" />
          <span className="text-gray-600">Загрузка статей...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Globe className="w-6 h-6 mr-2 text-blue-500" />
          Управление Sitemap
        </h2>
        <button
          onClick={() => refetch()}
          className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Обновить
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sitemap.xml */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-green-500" />
              Sitemap.xml
            </h3>
            <span className="text-sm text-gray-500">
              {publishedArticles.length} статей
            </span>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={handleDownloadSitemap}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Скачать sitemap.xml
            </button>
            
            <button
              onClick={handleOpenSitemap}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Globe className="w-4 h-4 mr-2" />
              Открыть в новой вкладке
            </button>

            <button
              onClick={handleGoToSitemap}
              className="w-full flex items-center justify-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Globe className="w-4 h-4 mr-2" />
              Перейти к /sitemap.xml
            </button>
          </div>
        </div>

        {/* Robots.txt */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-orange-500" />
              Robots.txt
            </h3>
            <span className="text-sm text-gray-500">
              SEO правила
            </span>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={handleDownloadRobots}
              className="w-full flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Скачать robots.txt
            </button>
            
            <button
              onClick={handleOpenRobots}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Globe className="w-4 h-4 mr-2" />
              Открыть в новой вкладке
            </button>

            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Globe className="w-4 h-4 mr-2" />
              Перейти к /robots.txt
            </a>
          </div>
        </div>
      </div>

      {/* Информация */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Информация о SEO</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Sitemap обновляется автоматически при изменении статей</p>
          <p>• В sitemap включено {publishedArticles.length} из {articles.length} статей (только опубликованные)</p>
          <p>• Доступен по адресу: <code className="bg-blue-100 px-1 rounded">{window.location.origin}/sitemap.xml</code></p>
          <p>• Robots.txt доступен по адресу: <code className="bg-blue-100 px-1 rounded">{window.location.origin}/robots.txt</code></p>
          <p>• Приоритет страниц рассчитывается автоматически по категориям и дате публикации</p>
          <p>• Кеш обновляется каждые 30 секунд, принудительное обновление доступно кнопкой "Обновить"</p>
        </div>
      </div>

      {/* Предпросмотр */}
      {showPreview && (
        <div className="mt-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setPreviewType('sitemap')}
              className={`px-4 py-2 rounded-lg ${
                previewType === 'sitemap' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Sitemap
            </button>
            <button
              onClick={() => setPreviewType('robots')}
              className={`px-4 py-2 rounded-lg ${
                previewType === 'robots' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Robots
            </button>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
              {previewType === 'sitemap' 
                ? sitemap 
                : robotsTxt
              }
            </pre>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {showPreview ? 'Скрыть' : 'Показать'} предпросмотр
        </button>
      </div>
    </div>
  );
}; 