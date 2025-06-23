import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { articlesAPI } from '../services/api';
import { SitemapGenerator } from '../utils/sitemapGenerator';

// Компонент для генерации sitemap.xml
export const SitemapXml = () => {
  const { data: articlesData, isLoading, error } = useQuery({
    queryKey: ['sitemap-articles'],
    queryFn: async () => {
      console.log('Fetching articles for sitemap...');
      const result = await articlesAPI.getAll(1, 10000); // Получаем все статьи
      console.log('API response:', result);
      return result;
    },
    staleTime: 30 * 1000, // Кешируем на 30 секунд
    cacheTime: 60 * 1000, // Храним в кеше 1 минуту
    retry: 3,
    retryDelay: 1000,
  });

  const articles = articlesData?.articles || [];

  useEffect(() => {
    if (!isLoading && !error) {
      const generator = new SitemapGenerator();
      const sitemap = generator.generateSitemap(articles);
      
      console.log('Generating sitemap with', articles.length, 'articles');
      
      // Устанавливаем правильный content-type для браузера
      document.title = 'Sitemap.xml';
      
      // Заменяем содержимое страницы на sitemap
      document.open();
      document.write(`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html>
<head>
    <title>Sitemap.xml</title>
    <meta charset="UTF-8">
    <style>
        body { 
            font-family: monospace; 
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5; 
            white-space: pre-wrap;
            word-wrap: break-word;
        }
    </style>
</head>
<body>${sitemap}</body>
</html>`);
      document.close();
    }
  }, [articles, isLoading, error]);

  if (isLoading) {
    return (
      <div style={{ 
        padding: '20px', 
        fontFamily: 'monospace',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <h1>Sitemap.xml</h1>
        <p>Генерация sitemap.xml...</p>
        <p>Загружаем статьи из API...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        fontFamily: 'monospace',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        color: 'red'
      }}>
        <h1>Ошибка генерации Sitemap.xml</h1>
        <p>Не удалось загрузить статьи из API</p>
        <p>Ошибка: {error?.message || 'Неизвестная ошибка'}</p>
        <p>Проверьте что бэкенд сервер запущен на порту 3000</p>
      </div>
    );
  }

  return null;
};

// Компонент для генерации robots.txt
export const RobotsTxt = () => {
  useEffect(() => {
    const generator = new SitemapGenerator();
    const robotsTxt = generator.generateRobotsTxt();
    
    // Заменяем содержимое страницы на robots.txt
    document.open();
    document.write(`<pre>${robotsTxt}</pre>`);
    document.close();
  }, []);

  return null;
};

// Компонент для создания ссылок на sitemap и robots в <head>
export const SitemapLinks = () => {
  useEffect(() => {
    const baseUrl = window.location.origin;
    
    // Добавляем ссылку на sitemap в head
    const sitemapLink = document.createElement('link');
    sitemapLink.rel = 'sitemap';
    sitemapLink.type = 'application/xml';
    sitemapLink.href = `${baseUrl}/sitemap.xml`;
    document.head.appendChild(sitemapLink);

    // Добавляем robots meta tag
    const robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    robotsMeta.content = 'index, follow';
    document.head.appendChild(robotsMeta);

    return () => {
      // Очищаем при размонтировании
      if (sitemapLink.parentNode) {
        sitemapLink.parentNode.removeChild(sitemapLink);
      }
      if (robotsMeta.parentNode) {
        robotsMeta.parentNode.removeChild(robotsMeta);
      }
    };
  }, []);

  return null;
}; 