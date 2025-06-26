import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Heart, 
  MessageCircle,
  Eye, 
  Share2, 
  Twitter, 
  Linkedin, 
  Send, 
  Mail, 
  Copy,
  ChevronRight,
  Calendar,
  TrendingUp,
  Users,
  FileText,
  ExternalLink,
  Check,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { useArticle, useArticlesByCategory } from '../hooks/useArticles';
import { getAuthorName, articlesAPI } from '../services/api';
import { isArticleViewed, markArticleAsViewed } from '../utils/viewTracker';
import { toggleArticleLike, getArticleLikeInfo, isArticleLikedLocally } from '../utils/hybridLikeStorage';
import ArticleContent from '../components/ArticleContent';
import CryptoWidget from '../components/CryptoWidget';
import CommentSection from '../components/CommentSection';

const ArticleDetail = () => {
  const { id } = useParams();
  const { data: article, isLoading, error } = useArticle(id || '');
  const { data: relatedData } = useArticlesByCategory(article?.category || '', 1, 4);
  
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [copied, setCopied] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);

  // Helper functions
  const getAuthorNameSafe = (author: any): string => {
    if (!author) return "Crypto News Team";
    if (typeof author === 'string') return author;
    if (typeof author === 'object') {
      return author.fullName || author.username || author.name || "Crypto News Team";
    }
    return "Crypto News Team";
  };

  const getImageUrlSafe = (article: any): string | undefined => {
    if (article?.media?.featuredImage?.url) {
      return getImageUrl(article.media.featuredImage.url);
    }
    if (article?.imageUrl) {
      return getImageUrl(article.imageUrl);
    }
    return undefined;
  };

  const getArticleDescription = () => {
    if (!article) return "Loading article...";
    if (article.excerpt) return article.excerpt;
    if (article.content) return article.content.replace(/<[^>]*>/g, '').substring(0, 160);
    return "";
  };

  // Generate structured data for SEO
  const getStructuredData = () => {
    if (!article) return {};
    
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title || "",
      "description": article.excerpt || (article.content ? article.content.replace(/<[^>]*>/g, '').substring(0, 160) : ""),
      "image": getImageUrlSafe(article),
      "author": {
        "@type": "Person",
        "name": getAuthorNameSafe(article.author)
      },
      "publisher": {
        "@type": "Organization",
        "name": "Crypto News",
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/logo.png`
        }
      },
      "datePublished": article.createdAt,
      "dateModified": article.publishedAt || article.createdAt,
      "articleSection": article.category || "",
      "keywords": (article.tags || []).join(", "),
      "url": window.location.href,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      }
    };
  };

  // Image processing - add base URL if needed
  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return '/placeholder-image.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:5000${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

  // Обновляем title через useEffect когда статья загружена
  useEffect(() => {
    if (article) {
      document.title = `${article.title} | Crypto News`;
    }
  }, [article]);

  // Загружаем информацию о лайках когда статья загружена
  useEffect(() => {
    if (article) {
      // Сначала проверяем локально для мгновенной подсветки
      const isLikedLocally = isArticleLikedLocally(article._id);
      setLiked(isLikedLocally);
      
      // Затем загружаем актуальные данные с сервера
      const loadLikes = async () => {
        try {
          const likesInfo = await getArticleLikeInfo(article._id);
          setLikes(likesInfo.totalLikes);
          setLiked(likesInfo.userLiked);
          
          if (likesInfo.error) {
            setLikeError(likesInfo.error);
          } else {
            setLikeError(null);
          }
        } catch (error) {
          console.error('Failed to load likes:', error);
          // Fallback к статистике из статьи
          const initialLikes = article.stats?.likes?.total || article.likes || 0;
          setLikes(initialLikes);
          setLikeError('Failed to load like information');
        }
      };
      
      loadLikes();
    }
  }, [article]);

  // Отслеживаем просмотры статьи
  useEffect(() => {
    if (article && id) {
      // Проверяем, была ли статья уже просмотрена
      if (!isArticleViewed(id)) {
        // Помечаем статью как просмотренную в localStorage
        markArticleAsViewed(id);
        
        // Увеличиваем счетчик просмотров на сервере
        articlesAPI.incrementViews(id).catch(error => {
          console.error('Failed to increment views:', error);
        });
      }
    }
  }, [article, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading article...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Article Not Found | Crypto News</title>
          <meta name="description" content="Article not found or failed to load" />
        </Helmet>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Error Loading Article</h2>
            <p className="text-gray-400 mb-4">Failed to load the article. Please try again later.</p>
            <Link to="/articles" className="text-blue-400 hover:text-blue-300">
              ← Back to Articles
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Helmet>
          <title>Article Not Found | Crypto News</title>
          <meta name="description" content="The article you're looking for doesn't exist" />
        </Helmet>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
            <p className="text-gray-400 mb-4">The article you're looking for doesn't exist.</p>
            <Link to="/articles" className="text-blue-400 hover:text-blue-300">
              ← Back to Articles
            </Link>
          </div>
        </div>
      </>
    );
  }

  const handleLike = async () => {
    if (article) {
      try {
        // Сначала обновляем UI мгновенно для лучшего UX
        const currentLiked = liked;
        setLiked(!currentLiked);
        setLikes(prev => currentLiked ? prev - 1 : prev + 1);
        setLikeError(null);
        
        // Затем отправляем запрос на сервер
        const result = await toggleArticleLike(article._id);
        
        // Обновляем UI с реальными данными
        setLikes(result.totalLikes);
        setLiked(result.liked);
        
        if (result.error) {
          setLikeError(result.error);
          // Откатываем изменения UI в случае ошибки
          setLiked(currentLiked);
          setLikes(prev => currentLiked ? prev + 1 : prev - 1);
        }
      } catch (error) {
        console.error('Failed to toggle like:', error);
        setLikeError('Failed to toggle like');
        // Откатываем изменения UI
        setLiked(!liked);
        setLikes(prev => liked ? prev + 1 : prev - 1);
      }
    }
  };

  const shareUrl = window.location.href;
  const shareTitle = article.title;

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Check out this article: ${shareTitle}`);
    const body = encodeURIComponent(`I thought you might be interested in this article:\n\n${shareTitle}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const relatedArticles = relatedData?.articles || [];

  return (
    <>
      <Helmet>
        <meta name="description" content={getArticleDescription()} />
        <meta name="keywords" content={(article.tags || []).join(', ')} />
        <meta name="author" content={getAuthorNameSafe(article.author)} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={window.location.href} />
        
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={getArticleDescription()} />
        <meta property="og:image" content={getImageUrlSafe(article) || ""} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Crypto News" />
        <meta property="article:published_time" content={article.createdAt} />
        <meta property="article:author" content={getAuthorNameSafe(article.author)} />
        <meta property="article:section" content={article.category || ""} />
        {(article.tags || []).map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title || ""} />
        <meta name="twitter:description" content={getArticleDescription()} />
        <meta name="twitter:image" content={getImageUrlSafe(article) || ""} />
        
        <script type="application/ld+json">
          {JSON.stringify(getStructuredData())}
        </script>
      </Helmet>

      <div className="min-h-screen bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Back Button */}
          <Link
            to="/articles"
            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-6 group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>

          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="text-blue-400 hover:text-blue-300">Cryptonews</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-blue-400">{article.category}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Share Buttons */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="lg:sticky lg:top-24">
                <h3 className="text-white font-medium mb-4">Share</h3>
                <div className="flex lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3">
                  <button 
                    onClick={handleTwitterShare}
                    className="w-12 h-12 bg-slate-800 hover:bg-blue-600 rounded-lg transition-colors flex items-center justify-center group"
                    title="Share on Twitter"
                  >
                    <Twitter className="h-5 w-5 text-gray-400 group-hover:text-white" />
                  </button>
                  <button 
                    onClick={handleLinkedInShare}
                    className="w-12 h-12 bg-slate-800 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center group"
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-white" />
                  </button>
                  <button 
                    onClick={handleTelegramShare}
                    className="w-12 h-12 bg-slate-800 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center group"
                    title="Share on Telegram"
                  >
                    <Send className="h-5 w-5 text-gray-400 group-hover:text-white" />
                  </button>
                  <button 
                    onClick={handleEmailShare}
                    className="w-12 h-12 bg-slate-800 hover:bg-green-600 rounded-lg transition-colors flex items-center justify-center group"
                    title="Share via Email"
                  >
                    <Mail className="h-5 w-5 text-gray-400 group-hover:text-white" />
                  </button>
                  <button 
                    onClick={handleCopyLink}
                    className="w-12 h-12 bg-slate-800 hover:bg-purple-600 rounded-lg transition-colors flex items-center justify-center group relative"
                    title="Copy Link"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-400" />
                    ) : (
                      <Copy className="h-5 w-5 text-gray-400 group-hover:text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 order-1 lg:order-2 min-w-0 overflow-hidden">
              
              {/* Article Header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  {article.title}
                </h1>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Author and Date */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {getAuthorName(article.author).split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Journalist</p>
                      <p className="text-blue-400 font-semibold">{getAuthorName(article.author)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Last updated:</p>
                    <p className="text-white font-medium">
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center space-x-6 mb-8 py-4 border-t border-b border-gray-700">
                  <button 
                    onClick={handleLike}
                    className={`flex items-center space-x-2 ${liked ? 'text-red-500' : 'text-gray-400'} hover:text-red-400 transition-colors`}
                  >
                    <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                    <span>{likes.toLocaleString()}</span>
                  </button>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <MessageCircle className="h-5 w-5" />
                    <span>Comments</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Eye className="h-5 w-5" />
                    <span>{(article.stats?.views?.total || article.views || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </div>
                </div>
              </div>

              {/* Article Image */}
              {(article.media?.featuredImage?.url || article.imageUrl) && (
                <div className="mb-8">
                  <img
                    src={getImageUrl(article.media?.featuredImage?.url || article.imageUrl)}
                    alt={article.media?.featuredImage?.alt || article.title}
                    className="w-full h-96 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop';
                    }}
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="mb-12">
                {/* Excerpt */}
                {article.excerpt && (
                  <div className="text-lg text-gray-300 mb-6 p-4 bg-slate-800/50 rounded-lg border-l-4 border-blue-500">
                    {article.excerpt}
                  </div>
                )}
                
                {/* Main Content */}
                <ArticleContent content={article.content} showCryptoWidgets={true} />
              </div>

              {/* Comments Section */}
              <CommentSection 
                articleId={article._id} 
                className="border-t border-gray-700 pt-8 mb-12"
              />

              {/* Related Articles */}
              <div className="border-t border-gray-700 pt-8">
                <h3 className="text-2xl font-bold text-white mb-6">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.filter(relatedArticle => relatedArticle._id !== article._id).slice(0, 3).map((relatedArticle) => (
                    <Link
                      key={relatedArticle._id}
                      to={`/article/${relatedArticle._id}`}
                      className="group"
                    >
                      <div className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-700 transition-colors">
                        {(relatedArticle.media?.featuredImage?.url || relatedArticle.imageUrl) && (
                          <img
                            src={getImageUrl(relatedArticle.media?.featuredImage?.url || relatedArticle.imageUrl)}
                            alt={relatedArticle.media?.featuredImage?.alt || relatedArticle.title}
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop';
                            }}
                          />
                        )}
                        <div className="p-4">
                          <h4 className="text-white font-semibold line-clamp-2 group-hover:text-blue-400 transition-colors">
                            {relatedArticle.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-3 order-3">
              <div className="lg:sticky lg:top-24 space-y-6">
                
                {/* Why Trust Cryptonews */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">C</span>
                    </div>
                    <h3 className="text-white font-semibold">Why Trust Cryptonews</h3>
                  </div>
                  <p className="text-gray-400 text-sm">
                    We provide accurate, unbiased crypto news and analysis from industry experts and verified sources.
                  </p>
                </div>

                {/* In the Article */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">In the Article</h3>
                  <CryptoWidget symbol="btc" inline={false} />
                </div>

                {/* Follow Cryptonews */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Follow Cryptonews</h3>
                  <div className="flex space-x-3 mb-6">
                    <button 
                      onClick={handleTwitterShare}
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <Twitter className="h-5 w-5 text-gray-400" />
                    </button>
                    <button 
                      onClick={handleLinkedInShare}
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <Linkedin className="h-5 w-5 text-gray-400" />
                    </button>
                    <button 
                      onClick={handleTelegramShare}
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <Send className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-2xl font-bold text-white">2M+</div>
                      <div className="text-gray-400 text-sm">Active Monthly Users Around the World</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">250+</div>
                      <div className="text-gray-400 text-sm">Guides and Reviews Articles</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">8</div>
                      <div className="text-gray-400 text-sm">Years on the Market</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">70</div>
                      <div className="text-gray-400 text-sm">International Team Authors</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-slate-800"></div>
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full border-2 border-slate-800"></div>
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-2 border-slate-800"></div>
                    </div>
                    <span className="text-blue-400 text-sm">+ 66 More</span>
                    <button className="text-purple-400 text-sm hover:text-purple-300">Authors List</button>
                  </div>
                </div>

                {/* Best Crypto ICOs */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Best Crypto ICOs</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      <span className="text-white">Solaxy (SOLX)</span>
                    </div>
                    <button className="text-purple-400 hover:text-purple-300 flex items-center space-x-1">
                      <span className="text-sm">Visit Site</span>
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetail; 