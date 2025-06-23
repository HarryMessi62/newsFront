// Утилиты для работы с комментариями через localStorage

const COMMENTS_KEY = 'articleComments';
const USER_COMMENTS_KEY = 'userComments';

export interface StoredComment {
  id: string;
  articleId: string;
  author: string;
  email: string;
  content: string;
  timestamp: string;
  likes: number;
  likedBy: string[]; // email'ы пользователей, которые лайкнули
}

export interface UserComment {
  articleId: string;
  timestamp: string;
}

// Получить все комментарии для статьи
export const getCommentsForArticle = (articleId: string): StoredComment[] => {
  try {
    const stored = localStorage.getItem(COMMENTS_KEY);
    if (!stored) return [];
    
    const allComments: StoredComment[] = JSON.parse(stored);
    return allComments
      .filter(comment => comment.articleId === articleId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Error reading comments from localStorage:', error);
    return [];
  }
};

// Получить все комментарии
export const getAllComments = (): StoredComment[] => {
  try {
    const stored = localStorage.getItem(COMMENTS_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading all comments from localStorage:', error);
    return [];
  }
};

// Добавить новый комментарий
export const addComment = (
  articleId: string,
  author: string,
  email: string,
  content: string
): StoredComment => {
  try {
    const allComments = getAllComments();
    
    const newComment: StoredComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      articleId,
      author: author.trim(),
      email: email.trim().toLowerCase(),
      content: content.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: []
    };
    
    allComments.push(newComment);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
    
    // Отмечаем, что пользователь написал комментарий к этой статье
    markUserCommented(articleId, email);
    
    return newComment;
  } catch (error) {
    console.error('Error adding comment to localStorage:', error);
    throw error;
  }
};

// Лайкнуть комментарий
export const likeComment = (commentId: string, userEmail: string): boolean => {
  try {
    const allComments = getAllComments();
    const commentIndex = allComments.findIndex(c => c.id === commentId);
    
    if (commentIndex === -1) return false;
    
    const comment = allComments[commentIndex];
    const userEmailLower = userEmail.toLowerCase();
    
    // Проверяем, не лайкал ли уже пользователь
    if (comment.likedBy.includes(userEmailLower)) {
      // Убираем лайк
      comment.likedBy = comment.likedBy.filter(email => email !== userEmailLower);
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      // Добавляем лайк
      comment.likedBy.push(userEmailLower);
      comment.likes += 1;
    }
    
    allComments[commentIndex] = comment;
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
    
    return true;
  } catch (error) {
    console.error('Error liking comment:', error);
    return false;
  }
};

// Проверить, лайкнул ли пользователь комментарий
export const hasUserLikedComment = (commentId: string, userEmail: string): boolean => {
  try {
    const allComments = getAllComments();
    const comment = allComments.find(c => c.id === commentId);
    
    if (!comment) return false;
    
    return comment.likedBy.includes(userEmail.toLowerCase());
  } catch (error) {
    console.error('Error checking comment like:', error);
    return false;
  }
};

// Отметить, что пользователь комментировал статью
export const markUserCommented = (articleId: string, userEmail: string): void => {
  try {
    const stored = localStorage.getItem(USER_COMMENTS_KEY);
    const userComments: Record<string, UserComment[]> = stored ? JSON.parse(stored) : {};
    
    const emailKey = userEmail.toLowerCase();
    if (!userComments[emailKey]) {
      userComments[emailKey] = [];
    }
    
    // Проверяем, не комментировал ли уже эту статью
    const alreadyCommented = userComments[emailKey].some(uc => uc.articleId === articleId);
    
    if (!alreadyCommented) {
      userComments[emailKey].push({
        articleId,
        timestamp: new Date().toISOString()
      });
      
      localStorage.setItem(USER_COMMENTS_KEY, JSON.stringify(userComments));
    }
  } catch (error) {
    console.error('Error marking user comment:', error);
  }
};

// Проверить, комментировал ли пользователь статью
export const hasUserCommented = (articleId: string, userEmail: string): boolean => {
  try {
    const stored = localStorage.getItem(USER_COMMENTS_KEY);
    if (!stored) return false;
    
    const userComments: Record<string, UserComment[]> = JSON.parse(stored);
    const emailKey = userEmail.toLowerCase();
    
    if (!userComments[emailKey]) return false;
    
    return userComments[emailKey].some(uc => uc.articleId === articleId);
  } catch (error) {
    console.error('Error checking user comment:', error);
    return false;
  }
};

// Получить статистику комментариев пользователя
export const getUserCommentStats = (userEmail: string) => {
  try {
    const stored = localStorage.getItem(USER_COMMENTS_KEY);
    if (!stored) return { total: 0, articles: [] };
    
    const userComments: Record<string, UserComment[]> = JSON.parse(stored);
    const emailKey = userEmail.toLowerCase();
    
    if (!userComments[emailKey]) return { total: 0, articles: [] };
    
    return {
      total: userComments[emailKey].length,
      articles: userComments[emailKey].map(uc => uc.articleId)
    };
  } catch (error) {
    console.error('Error getting user comment stats:', error);
    return { total: 0, articles: [] };
  }
};

// Очистить все комментарии
export const clearAllComments = (): void => {
  try {
    localStorage.removeItem(COMMENTS_KEY);
    localStorage.removeItem(USER_COMMENTS_KEY);
  } catch (error) {
    console.error('Error clearing comments:', error);
  }
};

// Получить общую статистику комментариев
export const getCommentsStats = () => {
  try {
    const allComments = getAllComments();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      total: allComments.length,
      today: allComments.filter(c => new Date(c.timestamp) >= today).length,
      thisWeek: allComments.filter(c => new Date(c.timestamp) >= thisWeek).length,
      totalLikes: allComments.reduce((sum, c) => sum + c.likes, 0),
      uniqueUsers: new Set(allComments.map(c => c.email)).size
    };
  } catch (error) {
    console.error('Error getting comments stats:', error);
    return { total: 0, today: 0, thisWeek: 0, totalLikes: 0, uniqueUsers: 0 };
  }
}; 