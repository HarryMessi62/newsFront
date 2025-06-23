import axios from 'axios';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Функция для задержки
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Функция для повторных запросов при ошибке 429
const retryRequest = async (requestFn: () => Promise<any>, maxRetries = 3, baseDelay = 1000): Promise<any> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error: any) {
      if (error.response?.status === 429 && attempt < maxRetries) {
        console.log(`Request failed with 429, retrying (${attempt}/${maxRetries}) in ${baseDelay * attempt}ms...`);
        await delay(baseDelay * attempt);
        continue;
      }
      throw error;
    }
  }
};

// Интерфейсы для данных
export interface Author {
  _id: string;
  username: string;
  fullName?: string;
  profile?: any;
}

export interface Article {
  _id: string;
  title: string;
  slug?: string;
  content: string;
  excerpt: string;
  author: Author | null;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  media?: {
    featuredImage?: {
      url: string;
      alt?: string;
      caption?: string;
    };
  };
  stats?: {
    views?: {
      total?: number;
    };
    likes?: {
      total?: number;
    };
    comments?: {
      total?: number;
    };
  };
  // Добавляем поле imageUrl для обратной совместимости
  imageUrl?: string;
  // Добавляем поля для обратной совместимости
  featured?: boolean;
  likes?: number;
  comments?: number;
  views?: number;
}

export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

// Utility functions
export const getAuthorName = (author: Author | null): string => {
  if (!author) return 'Anonymous';
  return author.fullName || author.username || 'Anonymous';
};

// API методы для статей
export const articlesAPI = {
  // Получить все статьи
  getAll: async (page = 1, limit = 10): Promise<{ articles: Article[], total: number, totalPages: number }> => {
    return retryRequest(async () => {
      const response = await api.get(`/articles?page=${page}&limit=${limit}`);
      return response.data;
    });
  },

  // Получить статью по ID или slug
  getById: async (idOrSlug: string): Promise<Article> => {
    return retryRequest(async () => {
      // Сначала пробуем как slug
      try {
        const response = await api.get(`/articles/${idOrSlug}`);
        return response.data.data.article;
      } catch (error: any) {
        // Если не найдена как slug, пробуем как ID
        if (error.response?.status === 404) {
          const response = await api.get(`/articles/id/${idOrSlug}`);
          return response.data.data.article;
        }
        throw error;
      }
    });
  },

  // Получить статьи по категории
  getByCategory: async (category: string, page = 1, limit = 10): Promise<{ articles: Article[], total: number, totalPages: number }> => {
    return retryRequest(async () => {
      const response = await api.get(`/articles/category/${category}?page=${page}&limit=${limit}`);
      return response.data;
    });
  },

  // Поиск статей
  search: async (query: string, page = 1, limit = 10): Promise<{ articles: Article[], total: number, totalPages: number }> => {
    return retryRequest(async () => {
      const response = await api.get(`/articles/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
      return response.data;
    });
  },

  // Получить популярные статьи
  getPopular: async (limit = 10): Promise<Article[]> => {
    return retryRequest(async () => {
      const response = await api.get(`/articles/popular?limit=${limit}`);
      return response.data;
    });
  },

  // Получить последние статьи
  getLatest: async (limit = 10): Promise<Article[]> => {
    return retryRequest(async () => {
      const response = await api.get(`/articles/latest?limit=${limit}`);
      return response.data;
    });
  },

  // Получить рекомендуемые статьи
  getFeatured: async (limit = 10): Promise<Article[]> => {
    return retryRequest(async () => {
      const response = await api.get(`/articles/featured?limit=${limit}`);
      return response.data;
    });
  },

  // Увеличить количество просмотров статьи
  incrementViews: async (idOrSlug: string): Promise<void> => {
    return retryRequest(async () => {
      // Пробуем сначала как ID, потом как slug
      try {
        await api.post(`/articles/id/${idOrSlug}/view`);
      } catch (error: any) {
        if (error.response?.status === 404) {
          // Если не найдена по ID, пробуем найти по slug и получить ID
          const article = await api.get(`/articles/${idOrSlug}`);
          await api.post(`/articles/id/${article.data.data.article._id}/view`);
        } else {
          throw error;
        }
      }
    });
  }
};

// API методы для лайков
export const likesAPI = {
  // Получить информацию о лайках статьи
  getArticleLikes: async (articleId: string, fingerprint?: string): Promise<{
    articleId: string;
    totalLikes: number;
    userLiked: boolean;
    stats: any;
  }> => {
    return retryRequest(async () => {
      const params = fingerprint ? `?fingerprint=${fingerprint}` : '';
      const response = await api.get(`/likes/article/${articleId}${params}`);
      return response.data;
    });
  },

  // Переключить лайк статьи
  toggleLike: async (articleId: string, fingerprint: string): Promise<{
    articleId: string;
    liked: boolean;
    totalLikes: number;
    message: string;
  }> => {
    return retryRequest(async () => {
      const response = await api.post(`/likes/article/${articleId}/toggle`, {
        fingerprint
      });
      return response.data;
    });
  },

  // Получить статистику лайков пользователя
  getUserStats: async (fingerprint: string): Promise<{
    total: number;
    articles: Array<{
      articleId: string;
      title: string;
      slug: string;
      likedAt: string;
    }>;
  }> => {
    return retryRequest(async () => {
      const response = await api.get(`/likes/user/${fingerprint}/stats`);
      return response.data;
    });
  },

  // Получить топ статей по лайкам
  getTopArticles: async (limit = 10): Promise<Article[]> => {
    return retryRequest(async () => {
      const response = await api.get(`/likes/top?limit=${limit}`);
      return response.data;
    });
  },

  // Получить общую статистику лайков
  getGeneralStats: async (): Promise<{
    totalLikes: number;
    uniqueUsers: number;
    articlesWithLikes: number;
    likesToday: number;
    likesThisWeek: number;
    averageLikesPerArticle: number;
  }> => {
    return retryRequest(async () => {
      const response = await api.get('/likes/stats');
      return response.data;
    });
  }
};

// API методы для комментариев
export const commentsAPI = {
  // Получить комментарии статьи
  getArticleComments: async (articleId: string, page = 1, limit = 20, userId?: string): Promise<{
    comments: Array<{
      _id: string;
      text: string;
      userEmail: string;
      likes: number;
      createdAt: string;
      likedBy: Array<{ userId: string; timestamp: string }>;
    }>;
    total: number;
    page: number;
    totalPages: number;
    userHasCommented: boolean;
  }> => {
    return retryRequest(async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (userId) {
        params.append('userId', userId);
      }
      
      const response = await api.get(`/comments/article/${articleId}?${params}`);
      return response.data;
    });
  },

  // Добавить комментарий
  addComment: async (articleId: string, userId: string, userEmail: string, text: string): Promise<{
    success: boolean;
    comment: {
      _id: string;
      text: string;
      userEmail: string;
      likes: number;
      createdAt: string;
    };
    message: string;
  }> => {
    return retryRequest(async () => {
      const response = await api.post(`/comments/article/${articleId}`, {
        userId,
        userEmail,
        text
      });
      return response.data;
    });
  },

  // Лайкнуть/убрать лайк с комментария
  toggleCommentLike: async (commentId: string, userId: string): Promise<{
    commentId: string;
    liked: boolean;
    totalLikes: number;
    message: string;
  }> => {
    return retryRequest(async () => {
      const response = await api.post(`/comments/comment/${commentId}/like`, {
        userId
      });
      return response.data;
    });
  },

  // Удалить комментарий пользователя
  deleteComment: async (articleId: string, userId: string): Promise<{
    success: boolean;
    message: string;
  }> => {
    return retryRequest(async () => {
      const response = await api.delete(`/comments/article/${articleId}/user/${userId}`);
      return response.data;
    });
  },

  // Получить статистику комментариев пользователя
  getUserStats: async (userId: string): Promise<{
    total: number;
    articles: Array<{
      articleId: string;
      title: string;
      slug: string;
      text: string;
      likes: number;
      commentedAt: string;
    }>;
  }> => {
    return retryRequest(async () => {
      const response = await api.get(`/comments/user/${userId}/stats`);
      return response.data;
    });
  },

  // Проверить, комментировал ли пользователь статью
  hasUserCommented: async (articleId: string, userId: string): Promise<{
    articleId: string;
    userId: string;
    hasCommented: boolean;
  }> => {
    return retryRequest(async () => {
      const response = await api.get(`/comments/article/${articleId}/user/${userId}/check`);
      return response.data;
    });
  },

  // Получить общую статистику комментариев
  getGeneralStats: async (): Promise<{
    totalComments: number;
    uniqueUsers: number;
    articlesWithComments: number;
    commentsToday: number;
    commentsThisWeek: number;
    averageCommentsPerArticle: number;
  }> => {
    return retryRequest(async () => {
      const response = await api.get('/comments/stats');
      return response.data;
    });
  }
};

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 404) {
      console.error('Ресурс не найден');
    } else if (error.response?.status >= 500) {
      console.error('Ошибка сервера');
    }
    
    return Promise.reject(error);
  }
);

export default api; 