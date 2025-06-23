// Гибридная система лайков: localStorage для кеширования + API для БД
import { likesAPI } from '../services/api';
import { getUserId } from './browserFingerprint';

const LIKED_ARTICLES_KEY = 'likedArticles';

// Интерфейс для кешированных лайков
interface LikedArticle {
  articleId: string;
  timestamp: string;
}

// Получить список лайкнутых статей из localStorage
export const getLikedArticles = (): LikedArticle[] => {
  try {
    const stored = localStorage.getItem(LIKED_ARTICLES_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    
    // Убеждаемся, что возвращаем массив
    if (!Array.isArray(parsed)) {
      console.warn('Liked articles data is not an array, resetting to empty array');
      localStorage.removeItem(LIKED_ARTICLES_KEY);
      return [];
    }
    
    return parsed;
  } catch (error) {
    console.error('Error reading liked articles from localStorage:', error);
    localStorage.removeItem(LIKED_ARTICLES_KEY);
    return [];
  }
};

// Сохранить список лайкнутых статей в localStorage
const saveLikedArticles = (articles: LikedArticle[]): void => {
  try {
    localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(articles));
  } catch (error) {
    console.error('Error saving liked articles to localStorage:', error);
  }
};

// Проверить, лайкнута ли статья (локально)
export const isArticleLikedLocally = (articleId: string): boolean => {
  const likedArticles = getLikedArticles();
  return likedArticles.some(article => article.articleId === articleId);
};

// Добавить статью в список лайкнутых (локально)
const addLikedArticleLocally = (articleId: string): void => {
  const likedArticles = getLikedArticles();
  
  // Проверяем, нет ли уже такой статьи
  if (!likedArticles.some(article => article.articleId === articleId)) {
    likedArticles.push({
      articleId,
      timestamp: new Date().toISOString()
    });
    saveLikedArticles(likedArticles);
  }
};

// Удалить статью из списка лайкнутых (локально)
const removeLikedArticleLocally = (articleId: string): void => {
  const likedArticles = getLikedArticles();
  const filteredArticles = likedArticles.filter(article => article.articleId !== articleId);
  saveLikedArticles(filteredArticles);
};

// Главная функция для переключения лайка
export const toggleArticleLike = async (articleId: string): Promise<{
  liked: boolean;
  totalLikes: number;
  error?: string;
}> => {
  try {
    const userId = getUserId();
    const wasLikedLocally = isArticleLikedLocally(articleId);
    
    console.log('Toggling like for user:', userId, 'article:', articleId);
    
    // Отправляем запрос на сервер
    const result = await likesAPI.toggleLike(articleId, userId);
    
    // Обновляем localStorage в соответствии с результатом
    if (result.liked) {
      addLikedArticleLocally(articleId);
    } else {
      removeLikedArticleLocally(articleId);
    }
    
    return {
      liked: result.liked,
      totalLikes: result.totalLikes
    };
  } catch (error: any) {
    console.error('Error toggling like:', error);
    
    // В случае ошибки возвращаем текущее состояние
    const isLiked = isArticleLikedLocally(articleId);
    
    return {
      liked: isLiked,
      totalLikes: 0, // Не знаем точное количество при ошибке
      error: error.message || 'Failed to toggle like'
    };
  }
};

// Получить информацию о лайках статьи
export const getArticleLikeInfo = async (articleId: string): Promise<{
  totalLikes: number;
  userLiked: boolean;
  error?: string;
}> => {
  try {
    const userId = getUserId();
    const isLikedLocally = isArticleLikedLocally(articleId);
    
    console.log('Getting like info - User ID:', userId, 'Article:', articleId, 'Liked locally:', isLikedLocally);
    
    const result = await likesAPI.getArticleLikes(articleId, userId);
    
    console.log('Server response - User liked:', result.userLiked, 'Total likes:', result.totalLikes);
    
    // Синхронизируем localStorage с данными сервера
    if (result.userLiked && !isLikedLocally) {
      // Сервер говорит, что лайкнуто, но локально нет - добавляем
      console.log('Adding like locally (server says liked)');
      addLikedArticleLocally(articleId);
    } else if (!result.userLiked && isLikedLocally) {
      // Сервер говорит, что не лайкнуто, но локально есть - удаляем
      console.log('Removing like locally (server says not liked)');
      removeLikedArticleLocally(articleId);
    }
    
    return {
      totalLikes: result.totalLikes,
      userLiked: result.userLiked
    };
  } catch (error: any) {
    console.error('Error getting article like info:', error);
    
    // В случае ошибки возвращаем локальное состояние
    return {
      totalLikes: 0,
      userLiked: isArticleLikedLocally(articleId),
      error: error.message || 'Failed to get like info'
    };
  }
};

// Синхронизировать localStorage с сервером
export const syncLikesWithServer = async (): Promise<void> => {
  try {
    const userId = getUserId();
    const userStats = await likesAPI.getUserStats(userId);
    
    // Создаем новый список на основе данных сервера
    const serverLikedArticles: LikedArticle[] = userStats.articles.map(article => ({
      articleId: article.articleId,
      timestamp: article.likedAt
    }));
    
    // Сохраняем в localStorage
    saveLikedArticles(serverLikedArticles);
    
    console.log('Likes synced with server:', serverLikedArticles.length, 'articles');
  } catch (error) {
    console.error('Error syncing likes with server:', error);
  }
};

// Очистить все лайки (для отладки)
export const clearAllLikes = (): void => {
  try {
    localStorage.removeItem(LIKED_ARTICLES_KEY);
    console.log('All likes cleared from localStorage');
  } catch (error) {
    console.error('Error clearing likes:', error);
  }
};

// Получить статистику лайков пользователя
export const getUserLikeStats = () => {
  const likedArticles = getLikedArticles();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const todayLikes = likedArticles.filter(article => 
    new Date(article.timestamp) >= today
  ).length;
  
  const thisWeekLikes = likedArticles.filter(article => 
    new Date(article.timestamp) >= thisWeek
  ).length;
  
  return {
    total: likedArticles.length,
    today: todayLikes,
    thisWeek: thisWeekLikes,
    articles: likedArticles.map(article => article.articleId)
  };
}; 