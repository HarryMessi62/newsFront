// Утилиты для работы с лайками через localStorage

const LIKES_KEY = 'articleLikes';
const USER_LIKES_KEY = 'userLikes';

export interface ArticleLike {
  articleId: string;
  likes: number;
  likedBy: string[]; // fingerprint'ы пользователей, которые лайкнули
}

export interface UserLike {
  articleId: string;
  timestamp: string;
}

// Получить лайки для статьи
export const getArticleLikes = (articleId: string): ArticleLike | null => {
  try {
    const stored = localStorage.getItem(LIKES_KEY);
    if (!stored) return null;
    
    const allLikes: ArticleLike[] = JSON.parse(stored);
    return allLikes.find(like => like.articleId === articleId) || null;
  } catch (error) {
    console.error('Error reading likes from localStorage:', error);
    return null;
  }
};

// Получить все лайки
export const getAllLikes = (): ArticleLike[] => {
  try {
    const stored = localStorage.getItem(LIKES_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading all likes from localStorage:', error);
    return [];
  }
};

// Лайкнуть/убрать лайк со статьи
export const toggleArticleLike = (articleId: string, userFingerprint: string, initialLikes: number = 0): { likes: number; liked: boolean } => {
  try {
    const allLikes = getAllLikes();
    
    let articleLike = allLikes.find(like => like.articleId === articleId);
    
    if (!articleLike) {
      // Создаем новую запись для статьи
      articleLike = {
        articleId,
        likes: initialLikes,
        likedBy: []
      };
      allLikes.push(articleLike);
    }
    
    const userHasLiked = articleLike.likedBy.includes(userFingerprint);
    
    if (userHasLiked) {
      // Убираем лайк
      articleLike.likedBy = articleLike.likedBy.filter(fp => fp !== userFingerprint);
      articleLike.likes = Math.max(0, articleLike.likes - 1);
    } else {
      // Добавляем лайк
      articleLike.likedBy.push(userFingerprint);
      articleLike.likes += 1;
    }
    
    // Обновляем запись в массиве
    const index = allLikes.findIndex(like => like.articleId === articleId);
    if (index !== -1) {
      allLikes[index] = articleLike;
    }
    
    localStorage.setItem(LIKES_KEY, JSON.stringify(allLikes));
    
    // Отмечаем действие пользователя
    markUserLiked(articleId, userFingerprint, !userHasLiked);
    
    return {
      likes: articleLike.likes,
      liked: !userHasLiked
    };
  } catch (error) {
    console.error('Error toggling article like:', error);
    return { likes: initialLikes, liked: false };
  }
};

// Проверить, лайкнул ли пользователь статью
export const hasUserLikedArticle = (articleId: string, userFingerprint: string): boolean => {
  try {
    const articleLike = getArticleLikes(articleId);
    if (!articleLike) return false;
    
    return articleLike.likedBy.includes(userFingerprint);
  } catch (error) {
    console.error('Error checking user like:', error);
    return false;
  }
};

// Отметить, что пользователь лайкнул/убрал лайк со статьи
export const markUserLiked = (articleId: string, userFingerprint: string, liked: boolean): void => {
  try {
    const stored = localStorage.getItem(USER_LIKES_KEY);
    const userLikes: Record<string, UserLike[]> = stored ? JSON.parse(stored) : {};
    
    if (!userLikes[userFingerprint]) {
      userLikes[userFingerprint] = [];
    }
    
    if (liked) {
      // Добавляем лайк, если его еще нет
      const alreadyLiked = userLikes[userFingerprint].some(ul => ul.articleId === articleId);
      if (!alreadyLiked) {
        userLikes[userFingerprint].push({
          articleId,
          timestamp: new Date().toISOString()
        });
      }
    } else {
      // Убираем лайк
      userLikes[userFingerprint] = userLikes[userFingerprint].filter(ul => ul.articleId !== articleId);
    }
    
    localStorage.setItem(USER_LIKES_KEY, JSON.stringify(userLikes));
  } catch (error) {
    console.error('Error marking user like:', error);
  }
};

// Получить статистику лайков пользователя
export const getUserLikeStats = (userFingerprint: string) => {
  try {
    const stored = localStorage.getItem(USER_LIKES_KEY);
    if (!stored) return { total: 0, articles: [] };
    
    const userLikes: Record<string, UserLike[]> = JSON.parse(stored);
    
    if (!userLikes[userFingerprint]) return { total: 0, articles: [] };
    
    return {
      total: userLikes[userFingerprint].length,
      articles: userLikes[userFingerprint].map(ul => ul.articleId)
    };
  } catch (error) {
    console.error('Error getting user like stats:', error);
    return { total: 0, articles: [] };
  }
};

// Очистить все лайки
export const clearAllLikes = (): void => {
  try {
    localStorage.removeItem(LIKES_KEY);
    localStorage.removeItem(USER_LIKES_KEY);
  } catch (error) {
    console.error('Error clearing likes:', error);
  }
};

// Получить общую статистику лайков
export const getLikesStats = () => {
  try {
    const allLikes = getAllLikes();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const totalLikes = allLikes.reduce((sum, like) => sum + like.likes, 0);
    const totalArticles = allLikes.length;
    const uniqueUsers = new Set(allLikes.flatMap(like => like.likedBy)).size;
    
    return {
      totalLikes,
      totalArticles,
      uniqueUsers,
      averageLikesPerArticle: totalArticles > 0 ? Math.round(totalLikes / totalArticles) : 0
    };
  } catch (error) {
    console.error('Error getting likes stats:', error);
    return { totalLikes: 0, totalArticles: 0, uniqueUsers: 0, averageLikesPerArticle: 0 };
  }
}; 