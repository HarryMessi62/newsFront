// Утилита для создания уникального ID пользователя
// Каждый браузер/пользователь получает свой уникальный ID

const USER_ID_KEY = 'userId';

// Генерировать уникальный ID пользователя
const generateUserId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);
  return `user_${timestamp}_${randomPart}_${randomPart2}`;
};

// Получить уникальный ID пользователя (создать если не существует)
export const getUserId = (): string => {
  try {
    let userId = localStorage.getItem(USER_ID_KEY);
    
    if (!userId) {
      userId = generateUserId();
      localStorage.setItem(USER_ID_KEY, userId);
      console.log('Generated new user ID:', userId);
    } else {
      console.log('Using existing user ID:', userId);
    }
    
    return userId;
  } catch (error) {
    console.error('Error getting user ID:', error);
    // Fallback - генерируем временный ID
    const fallbackId = generateUserId();
    console.log('Using fallback user ID:', fallbackId);
    return fallbackId;
  }
};

// Для обратной совместимости
export const getBrowserFingerprint = getUserId; 