import React, { useState, useEffect } from 'react';
import { getUserId } from '../utils/browserFingerprint';
import { clearAllLikes } from '../utils/hybridLikeStorage';
import { clearAllComments } from '../utils/hybridCommentStorage';
import { toggleArticleLike, getArticleLikeInfo, getUserLikeStats } from '../utils/hybridLikeStorage';
import { addComment, getArticleComments, getUserCommentStats } from '../utils/hybridCommentStorage';
import { SitemapManager } from '../components/SitemapManager';

const TestPage: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [testArticleId, setTestArticleId] = useState('684e8ccf36df4535825c5b4a');
  const [likeInfo, setLikeInfo] = useState<any>(null);
  const [likeStats, setLikeStats] = useState<any>(null);
  const [commentStats, setCommentStats] = useState<any>(null);
  const [comments, setComments] = useState<any>(null);
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testComment, setTestComment] = useState('This is a test comment');
  const [activeTab, setActiveTab] = useState<'likes' | 'sitemap'>('likes');

  useEffect(() => {
    const id = getUserId();
    setUserId(id);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Загружаем информацию о лайках
      const likeData = await getArticleLikeInfo(testArticleId);
      setLikeInfo(likeData);

      // Загружаем статистику лайков пользователя
      const userLikes = getUserLikeStats();
      setLikeStats(userLikes);

      // Загружаем статистику комментариев пользователя
      const userComments = getUserCommentStats();
      setCommentStats(userComments);

      // Загружаем комментарии статьи
      const articleComments = await getArticleComments(testArticleId);
      setComments(articleComments);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleToggleLike = async () => {
    try {
      const result = await toggleArticleLike(testArticleId);
      console.log('Like toggle result:', result);
      await loadData(); // Перезагружаем данные
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async () => {
    try {
      const result = await addComment(testArticleId, testEmail, testComment);
      console.log('Add comment result:', result);
      await loadData(); // Перезагружаем данные
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleClearAll = () => {
    try {
      clearAllLikes();
      clearAllComments();
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Page - System Testing</h1>
        
        {/* Tab Navigation */}
        <div className="flex mb-6 bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('likes')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'likes' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Likes & Comments
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'sitemap' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sitemap Management
          </button>
        </div>

        {activeTab === 'likes' && (
          <>
            {/* User Info */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">User Information</h2>
              <p className="mb-2">
                <strong>User ID:</strong> 
                <span className="font-mono text-sm bg-slate-700 px-2 py-1 rounded ml-2">
                  {userId}
                </span>
              </p>
              <p className="mb-4">
                <strong>Test Article ID:</strong>
                <input
                  type="text"
                  value={testArticleId}
                  onChange={(e) => setTestArticleId(e.target.value)}
                  className="font-mono text-sm bg-slate-700 px-2 py-1 rounded ml-2 w-64"
                />
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={loadData}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
                >
                  Reload Data
                </button>
                <button
                  onClick={handleClearAll}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
                >
                  Clear All Data
                </button>
              </div>
            </div>

            {/* Likes Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Likes Test</h2>
              
              {likeInfo && (
                <div className="mb-4">
                  <p><strong>Total Likes:</strong> {likeInfo.totalLikes}</p>
                  <p><strong>User Liked:</strong> {likeInfo.userLiked ? 'Yes' : 'No'}</p>
                  {likeInfo.error && (
                    <p className="text-red-400"><strong>Error:</strong> {likeInfo.error}</p>
                  )}
                </div>
              )}

              <button
                onClick={handleToggleLike}
                className={`px-6 py-3 rounded transition-colors ${
                  likeInfo?.userLiked 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {likeInfo?.userLiked ? 'Unlike' : 'Like'} Article
              </button>

              {likeStats && (
                <div className="mt-4 p-4 bg-slate-700 rounded">
                  <h3 className="font-semibold mb-2">User Like Stats</h3>
                  <p>Total: {likeStats.total}</p>
                  <p>Today: {likeStats.today}</p>
                  <p>This Week: {likeStats.thisWeek}</p>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Comments Test</h2>
              
              <div className="mb-4 space-y-2">
                <input
                  type="email"
                  placeholder="Test email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 rounded"
                />
                <textarea
                  placeholder="Test comment"
                  value={testComment}
                  onChange={(e) => setTestComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 rounded resize-none"
                />
              </div>

              <button
                onClick={handleAddComment}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded transition-colors"
              >
                Add Comment
              </button>

              {comments && (
                <div className="mt-4 p-4 bg-slate-700 rounded">
                  <h3 className="font-semibold mb-2">Article Comments</h3>
                  <p>Total: {comments.total}</p>
                  <p>User Has Commented: {comments.userHasCommented ? 'Yes' : 'No'}</p>
                  {comments.error && (
                    <p className="text-red-400">Error: {comments.error}</p>
                  )}
                  {comments.comments.length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-medium">Comments:</h4>
                      {comments.comments.slice(0, 3).map((comment: any, index: number) => (
                        <div key={index} className="text-sm mt-1 p-2 bg-slate-600 rounded">
                          <p><strong>{comment.userEmail}:</strong> {comment.text}</p>
                          <p className="text-slate-400">Likes: {comment.likes}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {commentStats && (
                <div className="mt-4 p-4 bg-slate-700 rounded">
                  <h3 className="font-semibold mb-2">User Comment Stats</h3>
                  <p>Total: {commentStats.total}</p>
                  <p>Today: {commentStats.today}</p>
                  <p>This Week: {commentStats.thisWeek}</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'sitemap' && (
          <div className="mb-6">
            <SitemapManager />
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage; 