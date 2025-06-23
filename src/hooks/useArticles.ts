import { useQuery } from '@tanstack/react-query';
import { articlesAPI, type Article } from '../services/api';

// Хук для получения всех статей
export const useArticles = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['articles', page, limit],
    queryFn: () => articlesAPI.getAll(page, limit),
  });
};

// Хук для получения статьи по ID
export const useArticle = (id: string) => {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => articlesAPI.getById(id),
    enabled: !!id, // Запрос выполнится только если id существует
  });
};

// Хук для получения статей по категории
export const useArticlesByCategory = (category: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['articles', 'category', category, page, limit],
    queryFn: () => articlesAPI.getByCategory(category, page, limit),
    enabled: !!category,
  });
};

// Хук для поиска статей
export const useSearchArticles = (query: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['articles', 'search', query, page, limit],
    queryFn: () => articlesAPI.search(query, page, limit),
    enabled: !!query && query.length > 0,
  });
};

// Хук для получения последних статей
export const useLatestArticles = (limit = 10) => {
  return useQuery({
    queryKey: ['articles', 'latest', limit],
    queryFn: () => articlesAPI.getLatest(limit),
  });
};

// Хук для получения рекомендуемых статей
export const useFeaturedArticles = (limit = 10) => {
  return useQuery({
    queryKey: ['articles', 'featured', limit],
    queryFn: () => articlesAPI.getFeatured(limit),
  });
};

// Хук для получения популярных статей
export const usePopularArticles = (limit = 10) => {
  return useQuery({
    queryKey: ['articles', 'popular', limit],
    queryFn: () => articlesAPI.getPopular(limit),
  });
};

// Составной хук для главной страницы
export const useHomeData = () => {
  const featuredQuery = useFeaturedArticles(6);
  const latestQuery = useLatestArticles(12);
  const bitcoinQuery = useArticlesByCategory('Bitcoin News', 1, 6);
  const altcoinQuery = useArticlesByCategory('Altcoin News', 1, 6);
  const defiQuery = useArticlesByCategory('DeFi News', 1, 6);

  return {
    featured: {
      data: featuredQuery.data || [],
      isLoading: featuredQuery.isLoading,
      error: featuredQuery.error,
    },
    latest: {
      data: latestQuery.data || [],
      isLoading: latestQuery.isLoading,
      error: latestQuery.error,
    },
    bitcoin: {
      data: bitcoinQuery.data?.articles || [],
      isLoading: bitcoinQuery.isLoading,
      error: bitcoinQuery.error,
    },
    altcoin: {
      data: altcoinQuery.data?.articles || [],
      isLoading: altcoinQuery.isLoading,
      error: altcoinQuery.error,
    },
    defi: {
      data: defiQuery.data?.articles || [],
      isLoading: defiQuery.isLoading,
      error: defiQuery.error,
    },
    isLoading: featuredQuery.isLoading || latestQuery.isLoading || bitcoinQuery.isLoading || altcoinQuery.isLoading || defiQuery.isLoading,
    hasError: !!(featuredQuery.error || latestQuery.error || bitcoinQuery.error || altcoinQuery.error || defiQuery.error),
  };
}; 