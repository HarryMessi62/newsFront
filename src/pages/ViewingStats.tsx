import { useState, useEffect } from 'react';
import { Eye, Calendar, TrendingUp, BarChart3, Trash2 } from 'lucide-react';
import { getViewingStats, getViewedArticles, clearViewedArticles } from '../utils/viewTracker';

const ViewingStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });
  const [viewedArticles, setViewedArticles] = useState<Array<{id: string, timestamp: number}>>([]);

  const loadStats = () => {
    const currentStats = getViewingStats();
    const articles = getViewedArticles();
    setStats(currentStats);
    setViewedArticles(articles);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all viewing history?')) {
      clearViewedArticles();
      loadStats();
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diffInHours = (now - timestamp) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    const diffInDays = diffInHours / 24;
    if (diffInDays < 7) return `${Math.floor(diffInDays)}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Viewing Statistics</h1>
          <p className="text-gray-400">Track your article reading activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Articles</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-blue-600 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Today</p>
                <p className="text-2xl font-bold text-white">{stats.today}</p>
              </div>
              <div className="bg-green-600 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">This Week</p>
                <p className="text-2xl font-bold text-white">{stats.thisWeek}</p>
              </div>
              <div className="bg-purple-600 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">This Month</p>
                <p className="text-2xl font-bold text-white">{stats.thisMonth}</p>
              </div>
              <div className="bg-orange-600 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Views */}
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Views</h2>
            <button
              onClick={handleClearHistory}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear History</span>
            </button>
          </div>

          {viewedArticles.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No articles viewed yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {viewedArticles
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 20)
                .map((article, index) => (
                  <div key={`${article.id}-${index}`} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Article ID: {article.id}</p>
                        <p className="text-gray-400 text-sm">{formatDate(article.timestamp)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">{getTimeAgo(article.timestamp)}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 bg-blue-900/20 border border-blue-700 rounded-lg p-4">
          <h3 className="text-blue-400 font-semibold mb-2">How it works</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Articles are marked as viewed when you open them</li>
            <li>• View counts are only incremented once per article per 24 hours</li>
            <li>• History is stored locally and automatically cleaned after 24 hours</li>
            <li>• Green checkmark appears on viewed articles</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ViewingStats; 