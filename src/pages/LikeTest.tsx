import React, { useState, useEffect } from 'react';
import { Heart, User, RefreshCw, Trash2 } from 'lucide-react';
import { getUserId } from '../utils/browserFingerprint';
import { toggleArticleLike, getArticleLikeInfo, clearAllLikes, syncLikesWithServer } from '../utils/hybridLikeStorage';
import { likesAPI } from '../services/api';

const LikeTest = () => {
  const [userId] = useState(() => getUserId());
  const [testArticleId] = useState('test_article_123');
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [serverStats, setServerStats] = useState<any>(null);

  // Загружаем информацию о лайках при загрузке
  useEffect(() => {
    loadLikeInfo();
    loadServerStats();
  }, []);

  const loadLikeInfo = async () => {
    try {
      const info = await getArticleLikeInfo(testArticleId);
      setLiked(info.userLiked);
      setTotalLikes(info.totalLikes);
    } catch (error) {
      console.error('Failed to load like info:', error);
    }
  };

  const loadServerStats = async () => {
    try {
      const stats = await likesAPI.getGeneralStats();
      setServerStats(stats);
    } catch (error) {
      console.error('Failed to load server stats:', error);
    }
  };

  const handleLike = async () => {
    setLoading(true);
    try {
      const result = await toggleArticleLike(testArticleId);
      setLiked(result.liked);
      setTotalLikes(result.totalLikes);
      
      // Обновляем статистику сервера
      await loadServerStats();
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLikes = () => {
    if (confirm('Очистить все лайки из localStorage?')) {
      clearAllLikes();
      setLiked(false);
      alert('Лайки очищены из localStorage');
    }
  };

  const handleSyncWithServer = async () => {
    try {
      await syncLikesWithServer();
      await loadLikeInfo();
      alert('Синхронизация с сервером завершена');
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Ошибка синхронизации');
    }
  };

  const generateNewUserId = () => {
    if (confirm('Сгенерировать новый ID пользователя? Это симулирует нового пользователя.')) {
      localStorage.removeItem('userId');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Тест системы лайков</h1>
        
        {/* Информация о пользователе */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <User className="h-6 w-6 mr-2" />
            Информация о пользователе
          </h2>
          <div className="space-y-2 text-gray-300">
            <p><strong>User ID:</strong> {userId}</p>
            <p className="text-sm text-gray-400">
              Каждый браузер/устройство получает уникальный ID. 
              Откройте эту страницу в разных браузерах или инкогнито-режиме для тестирования.
            </p>
          </div>
          <button
            onClick={generateNewUserId}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
          >
            Сгенерировать новый User ID
          </button>
        </div>

        {/* Тест лайков */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Тестовая статья</h2>
          
          <div className="bg-slate-700 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              Тестовая статья о криптовалютах
            </h3>
            <p className="text-gray-300 mb-4">
              Это тестовая статья для проверки системы лайков. 
              Bitcoin и Ethereum продолжают расти!
            </p>
            
            {/* Кнопка лайка */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                disabled={loading}
                className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                  liked
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                )}
                <span>{liked ? 'Убрать лайк' : 'Поставить лайк'}</span>
                <span className="bg-slate-800 px-2 py-1 rounded text-sm">
                  {totalLikes}
                </span>
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            <p>Article ID: {testArticleId}</p>
            <p>Статус: {liked ? 'Лайкнуто' : 'Не лайкнуто'}</p>
            <p>Всего лайков: {totalLikes}</p>
          </div>
        </div>

        {/* Статистика сервера */}
        {serverStats && (
          <div className="bg-slate-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Статистика сервера</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-slate-700 rounded p-3">
                <div className="text-2xl font-bold text-blue-400">{serverStats.totalLikes}</div>
                <div className="text-sm text-gray-400">Всего лайков</div>
              </div>
              <div className="bg-slate-700 rounded p-3">
                <div className="text-2xl font-bold text-green-400">{serverStats.uniqueUsers}</div>
                <div className="text-sm text-gray-400">Уникальных пользователей</div>
              </div>
              <div className="bg-slate-700 rounded p-3">
                <div className="text-2xl font-bold text-purple-400">{serverStats.articlesWithLikes}</div>
                <div className="text-sm text-gray-400">Статей с лайками</div>
              </div>
              <div className="bg-slate-700 rounded p-3">
                <div className="text-2xl font-bold text-yellow-400">{serverStats.likesToday}</div>
                <div className="text-sm text-gray-400">Лайков сегодня</div>
              </div>
              <div className="bg-slate-700 rounded p-3">
                <div className="text-2xl font-bold text-red-400">{serverStats.likesThisWeek}</div>
                <div className="text-sm text-gray-400">Лайков за неделю</div>
              </div>
              <div className="bg-slate-700 rounded p-3">
                <div className="text-2xl font-bold text-indigo-400">{serverStats.averageLikesPerArticle}</div>
                <div className="text-sm text-gray-400">Среднее на статью</div>
              </div>
            </div>
          </div>
        )}

        {/* Управление */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Управление</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={loadLikeInfo}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Обновить данные</span>
            </button>
            
            <button
              onClick={handleSyncWithServer}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Синхронизация с сервером
            </button>
            
            <button
              onClick={handleClearLikes}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Очистить localStorage</span>
            </button>
          </div>
          
          <div className="mt-4 p-4 bg-slate-700 rounded text-sm text-gray-300">
            <p><strong>Инструкции для тестирования:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Откройте эту страницу в разных браузерах</li>
              <li>Или используйте инкогнито-режим</li>
              <li>Каждый браузер получит свой уникальный User ID</li>
              <li>Лайки сохраняются в БД и привязаны к User ID</li>
              <li>localStorage используется только для кеширования</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikeTest; 