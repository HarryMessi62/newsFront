// Гибридная система комментариев: localStorage для кеширования + API для БД
import { commentsAPI } from '../services/api';
import { getUserId } from './browserFingerprint';

const USER_COMMENTS_KEY = 'userComments';

// Интерфейс для кешированных комментариев пользователя
interface UserComment {
  articleId: string;
  commentId: string;
  text: string;
  userEmail: string;
  timestamp: string;
}

// Получить список комментариев пользователя из localStorage
export const getUserComments = (): UserComment[] => {
  try {
    const stored = localStorage.getItem(USER_COMMENTS_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    
    // Убеждаемся, что возвращаем массив
    if (!Array.isArray(parsed)) {
      console.warn('User comments data is not an array, resetting to empty array');
      localStorage.removeItem(USER_COMMENTS_KEY);
      return [];
    }
    
    return parsed;
  } catch (error) {
    console.error('Error reading user comments from localStorage:', error);
    localStorage.removeItem(USER_COMMENTS_KEY);
    return [];
  }
};

// Сохранить список комментариев пользователя в localStorage
const saveUserComments = (comments: UserComment[]): void => {
  try {
    localStorage.setItem(USER_COMMENTS_KEY, JSON.stringify(comments));
  } catch (error) {
    console.error('Error saving user comments to localStorage:', error);
  }
};

// Проверить, комментировал ли пользователь статью (локально)
export const hasUserCommentedLocally = (articleId: string): boolean => {
  const userComments = getUserComments();
  return userComments.some(comment => comment.articleId === articleId);
};

// Добавить комментарий в localStorage
const addUserCommentLocally = (articleId: string, commentId: string, text: string, userEmail: string): void => {
  const userComments = getUserComments();
  
  // Проверяем, нет ли уже комментария к этой статье
  if (!userComments.some(comment => comment.articleId === articleId)) {
    userComments.push({
      articleId,
      commentId,
      text,
      userEmail,
      timestamp: new Date().toISOString()
    });
    saveUserComments(userComments);
  }
};

// Удалить комментарий из localStorage
const removeUserCommentLocally = (articleId: string): void => {
  const userComments = getUserComments();
  const filteredComments = userComments.filter(comment => comment.articleId !== articleId);
  saveUserComments(filteredComments);
};

// Получить комментарии статьи с проверкой статуса пользователя
export const getArticleComments = async (articleId: string, page = 1, limit = 20): Promise<{
  comments: any[];
  total: number;
  page: number;
  totalPages: number;
  userHasCommented: boolean;
  error?: string;
}> => {
  try {
    const userId = getUserId();
    const result = await commentsAPI.getArticleComments(articleId, page, limit, userId);
    
    // Синхронизируем localStorage с данными сервера
    const hasCommentedLocally = hasUserCommentedLocally(articleId);
    
    if (result.userHasCommented && !hasCommentedLocally) {
      // Сервер говорит, что пользователь комментировал, но локально нет - нужно синхронизировать
      console.log('User has commented according to server, syncing localStorage');
      // Здесь можно добавить логику синхронизации, если нужно
    } else if (!result.userHasCommented && hasCommentedLocally) {
      // Локально есть, но на сервере нет - удаляем из localStorage
      removeUserCommentLocally(articleId);
    }
    
    return result;
  } catch (error: any) {
    console.error('Error getting article comments:', error);
    
    return {
      comments: [],
      total: 0,
      page,
      totalPages: 0,
      userHasCommented: hasUserCommentedLocally(articleId),
      error: error.message || 'Failed to get comments'
    };
  }
};

// Добавить комментарий
export const addComment = async (articleId: string, userEmail: string, text: string): Promise<{
  success: boolean;
  comment?: any;
  message: string;
  error?: string;
}> => {
  try {
    const userId = getUserId();
    
    console.log('Adding comment for user:', userId, 'article:', articleId);
    
    // Отправляем запрос на сервер
    const result = await commentsAPI.addComment(articleId, userId, userEmail, text);
    
    // Добавляем в localStorage при успехе
    if (result.success) {
      addUserCommentLocally(articleId, result.comment._id, text, userEmail);
    }
    
    return {
      success: result.success,
      comment: result.comment,
      message: result.message
    };
  } catch (error: any) {
    console.error('Error adding comment:', error);
    
    return {
      success: false,
      message: 'Failed to add comment',
      error: error.response?.data?.error || error.message || 'Unknown error'
    };
  }
};

// Удалить комментарий пользователя
export const deleteUserComment = async (articleId: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> => {
  try {
    const userId = getUserId();
    
    // Отправляем запрос на сервер
    const result = await commentsAPI.deleteComment(articleId, userId);
    
    // Удаляем из localStorage при успехе
    if (result.success) {
      removeUserCommentLocally(articleId);
    }
    
    return result;
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    
    return {
      success: false,
      message: 'Failed to delete comment',
      error: error.response?.data?.error || error.message || 'Unknown error'
    };
  }
};

// Лайкнуть/убрать лайк с комментария
export const toggleCommentLike = async (commentId: string): Promise<{
  liked: boolean;
  totalLikes: number;
  error?: string;
}> => {
  try {
    const userId = getUserId();
    const result = await commentsAPI.toggleCommentLike(commentId, userId);
    
    return {
      liked: result.liked,
      totalLikes: result.totalLikes
    };
  } catch (error: any) {
    console.error('Error toggling comment like:', error);
    
    return {
      liked: false,
      totalLikes: 0,
      error: error.message || 'Failed to toggle comment like'
    };
  }
};

// Синхронизировать localStorage с сервером
export const syncCommentsWithServer = async (): Promise<void> => {
  try {
    const userId = getUserId();
    const userStats = await commentsAPI.getUserStats(userId);
    
    // Создаем новый список на основе данных сервера
    const serverComments: UserComment[] = userStats.articles.map(article => ({
      articleId: article.articleId,
      commentId: '', // ID комментария не возвращается в статистике
      text: article.text,
      userEmail: '', // Email не возвращается в статистике
      timestamp: article.commentedAt
    }));
    
    // Сохраняем в localStorage
    saveUserComments(serverComments);
    
    console.log('Comments synced with server:', serverComments.length, 'comments');
  } catch (error) {
    console.error('Error syncing comments with server:', error);
  }
};

// Очистить все комментарии (для отладки)
export const clearAllComments = (): void => {
  try {
    localStorage.removeItem(USER_COMMENTS_KEY);
    console.log('All comments cleared from localStorage');
  } catch (error) {
    console.error('Error clearing comments:', error);
  }
};

// Получить статистику комментариев пользователя
export const getUserCommentStats = () => {
  const userComments = getUserComments();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const todayComments = userComments.filter(comment => 
    new Date(comment.timestamp) >= today
  ).length;
  
  const thisWeekComments = userComments.filter(comment => 
    new Date(comment.timestamp) >= thisWeek
  ).length;
  
  return {
    total: userComments.length,
    today: todayComments,
    thisWeek: thisWeekComments,
    articles: userComments.map(comment => comment.articleId)
  };
}; 