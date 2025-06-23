import { TrendingUp, Star, TrendingDown, Coins, Eye, Clock, ArrowRight, Loader, Cpu } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import CategorySection from '../components/CategorySection';
import { useHomeData, useArticlesByCategory } from '../hooks/useArticles';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const { featured, latest, bitcoin, altcoin, defi, isLoading, hasError } = useHomeData();
  
  // Загружаем статьи из дополнительных категорий
  const { data: tradingArticles } = useArticlesByCategory('trading');
  const { data: regulationArticles } = useArticlesByCategory('regulation');
  const { data: nftArticles } = useArticlesByCategory('nft');
  const { data: miningArticles } = useArticlesByCategory('mining');

  // Helper function to get author name
  const getAuthorName = (author: any): string => {
    if (!author) return "Crypto News Team";
    if (typeof author === 'string') return author;
    if (typeof author === 'object') {
      return author.fullName || author.username || author.name || "Crypto News Team";
    }
    return "Crypto News Team";
  };

  // Function for image processing
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:5000${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleArticleClick = (articleId: string) => {
    navigate(`/article/${articleId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader className="h-8 w-8 animate-spin text-blue-500" />
          <span className="text-white text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Loading Error</div>
          <p className="text-gray-400 mb-4">Failed to load data. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-slate-800 to-purple-900 py-16">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              CryptoNews UK
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              Your premier source for cryptocurrency news, analysis and research in the United Kingdom
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Three-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Left Column - Latest Crypto News */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">Latest News</h2>
              </div>
              
              <div className="space-y-4">
                {latest.data.slice(0, 8).map((article) => (
                  <div 
                    key={article._id} 
                    className="group cursor-pointer"
                    onClick={() => handleArticleClick(article._id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-blue-400 text-xs font-medium">
                            {article.category}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {formatDate(article.createdAt)}
                          </span>
                        </div>
                        <h3 className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Crypto News Spotlight */}
          <div className="lg:col-span-6">
            <div className="bg-slate-800 rounded-lg overflow-hidden">
              <div className="p-6 pb-4">
                <h2 className="text-2xl font-bold text-white mb-4">Spotlight</h2>
              </div>
              
              {latest.data.length > 0 && (
                <div 
                  className="relative cursor-pointer group"
                  onClick={() => handleArticleClick(latest.data[0]._id)}
                >
                  <img
                    src={getImageUrl(latest.data[0].imageUrl)}
                    alt={latest.data[0].title}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {latest.data[0].category}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                      {latest.data[0].title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                      <span>{formatDate(latest.data[0].createdAt)}</span>
                      <span>by {getAuthorName(latest.data[0].author)}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Additional spotlight articles */}
              <div className="p-6 space-y-4">
                {latest.data.slice(1, 6).map((article) => (
                  <div 
                    key={article._id} 
                    className="flex space-x-4 group cursor-pointer"
                    onClick={() => handleArticleClick(article._id)}
                  >
                    <img
                      src={getImageUrl(article.imageUrl)}
                      alt={article.title}
                      className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=200&h=150&fit=crop';
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-blue-400 text-xs font-medium">
                          {article.category}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatDate(article.createdAt)}
                        </span>
                      </div>
                      <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-gray-400 text-sm">by {getAuthorName(article.author)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Featured Articles */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Featured</h2>
              
              <div className="space-y-6">
                {featured.data.slice(0, 4).map((article) => (
                  <div 
                    key={article._id} 
                    className="group cursor-pointer"
                    onClick={() => handleArticleClick(article._id)}
                  >
                    <div className="relative mb-3">
                      <img
                        src={getImageUrl(article.imageUrl)}
                        alt={article.title}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=300&h=200&fit=crop';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                          Featured
                        </span>
                      </div>
                    </div>
                    <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors line-clamp-2 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 text-xs">by {getAuthorName(article.author)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Articles Grid */}
        {featured.data.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Featured Articles</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.data.slice(0, 6).map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Bitcoin News */}
        {bitcoin.data.length > 0 && (
          <CategorySection
            title="Bitcoin News"
            articles={bitcoin.data}
            columns={3}
          />
        )}

        {/* Altcoin News */}
        {altcoin.data.length > 0 && (
          <CategorySection
            title="Altcoin News"
            articles={altcoin.data}
            columns={3}
          />
        )}

        {/* DeFi News */}
        {defi.data.length > 0 && (
          <CategorySection
            title="DeFi News"
            articles={defi.data}
            columns={3}
          />
        )}

        {/* Trading Analysis */}
        {tradingArticles && tradingArticles.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Trading Analysis</h2>
              </div>
              <button 
                className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
                onClick={() => navigate('/articles?category=trading')}
              >
                <span>All Trading Articles</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tradingArticles.slice(0, 4).map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Regulation News */}
        {regulationArticles && regulationArticles.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Regulation News</h2>
              </div>
              <button 
                className="flex items-center space-x-2 text-green-400 hover:text-green-300 font-medium transition-colors"
                onClick={() => navigate('/articles?category=regulation')}
              >
                <span>All Regulation Articles</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regulationArticles.slice(0, 4).map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* NFT & Web3 */}
        {nftArticles && nftArticles.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-pink-600 p-2 rounded-lg">
                  <Coins className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">NFT & Web3</h2>
              </div>
              <button 
                className="flex items-center space-x-2 text-pink-400 hover:text-pink-300 font-medium transition-colors"
                onClick={() => navigate('/articles?category=nft')}
              >
                <span>All NFT Articles</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {nftArticles.slice(0, 4).map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Mining & Hardware */}
        {miningArticles && miningArticles.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-600 p-2 rounded-lg">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Mining & Hardware</h2>
              </div>
              <button 
                className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 font-medium transition-colors"
                onClick={() => navigate('/articles?category=mining')}
              >
                <span>All Mining Articles</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {miningArticles.slice(0, 4).map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home; 