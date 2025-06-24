import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Loader } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import { useArticles, useArticlesByCategory, useSearchArticles } from '../hooks/useArticles';

const Articles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [allLoadedArticles, setAllLoadedArticles] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Helper function to get author name
  const getAuthorName = (author: any): string => {
    if (!author) return "Crypto News Team";
    if (typeof author === 'string') return author;
    if (typeof author === 'object') {
      return author.fullName || author.username || author.name || "Crypto News Team";
    }
    return "Crypto News Team";
  };

  // Initialize from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
    
    if (searchParam && searchParam !== searchTerm) {
      setSearchTerm(searchParam);
      setDebouncedSearch(searchParam);
    }
  }, [searchParams]);

  // Choose appropriate hook based on filters
  const allArticlesQuery = useArticles(currentPage, 12);
  const categoryQuery = useArticlesByCategory(selectedCategory, currentPage, 12);
  const searchQuery = useSearchArticles(debouncedSearch, currentPage, 12);
  
  // Determine active query
  const activeQuery = debouncedSearch 
    ? searchQuery 
    : selectedCategory !== 'All' 
      ? categoryQuery 
      : allArticlesQuery;
  
  const { data, isLoading, error } = activeQuery;
  const newArticles = data?.articles || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 0;

  // Накапливаем статьи при загрузке новых страниц
  useEffect(() => {
    if (newArticles.length > 0) {
      if (currentPage === 1) {
        setAllLoadedArticles(newArticles);
      } else {
        setAllLoadedArticles(prev => {
          const existingIds = new Set(prev.map(article => article._id));
          const uniqueNewArticles = newArticles.filter(article => !existingIds.has(article._id));
          return [...prev, ...uniqueNewArticles];
        });
      }
      setIsLoadingMore(false);
    }
  }, [newArticles, currentPage]);

  const articles = allLoadedArticles;

  // Debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (selectedCategory !== 'All') {
      params.set('category', selectedCategory);
    }
    
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    }
    
    // Only update URL if params actually changed
    const newParamsString = params.toString();
    const currentParamsString = searchParams.toString();
    
    if (newParamsString !== currentParamsString) {
      setSearchParams(params);
    }
  }, [selectedCategory, debouncedSearch, setSearchParams, searchParams]);

  // Reset page when filters change
  // useEffect(() => {
  //   setCurrentPage(1);
  //   setAllLoadedArticles([]);
  //   setIsLoadingMore(false);
  //   console.log('reset');
  // }, [selectedCategory, debouncedSearch]);

  // Load next page
  const loadMore = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      setIsLoadingMore(true);
      setCurrentPage(prev => prev + 1);
    }
  };

  const categories = [
    'All', 
    'Price Analysis', 
    'Ethereum News', 
    'Bitcoin News',
    'DeFi News', 
    'Regulation', 
    'NFT News',
    'Altcoin News'
  ];

  // Generate SEO content based on current state
  const generateSEOContent = () => {
    let title = 'Crypto Articles | Latest Cryptocurrency News & Analysis';
    let description = 'Stay updated with the latest cryptocurrency news, market analysis, and blockchain insights. Expert articles on Bitcoin, Ethereum, DeFi, NFTs, and more.';
    let keywords = 'cryptocurrency news, bitcoin news, ethereum news, blockchain analysis, crypto market, DeFi news, NFT news, altcoin news, crypto trading, blockchain technology';

    if (selectedCategory !== 'All') {
      title = `${selectedCategory} | Crypto News & Analysis`;
      description = `Latest ${selectedCategory.toLowerCase()} articles and analysis. Expert insights and market updates on ${selectedCategory.toLowerCase()}.`;
      keywords = `${selectedCategory.toLowerCase()}, ${keywords}`;
    }

    if (debouncedSearch) {
      title = `Search: ${debouncedSearch} | Crypto Articles`;
      description = `Search results for "${debouncedSearch}" in cryptocurrency articles. Find relevant crypto news and analysis.`;
      keywords = `${debouncedSearch}, ${keywords}`;
    }

    return { title, description, keywords };
  };

  const seoContent = generateSEOContent();

  // Generate structured data for articles listing
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Crypto News Blog",
    "description": seoContent.description,
    "url": window.location.href,
    "publisher": {
      "@type": "Organization",
      "name": "Crypto News",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/logo.png`
      }
    },
    ...(articles.length > 0 && {
      "blogPost": articles.slice(0, 10).map(article => ({
        "@type": "BlogPosting",
        "headline": article.title || "",
        "description": article.content ? article.content.replace(/<[^>]*>/g, '').substring(0, 160) : "",
        "image": article.imageUrl,
        "author": {
          "@type": "Person",
          "name": getAuthorName(article.author)
        },
        "datePublished": article.createdAt,
        "url": `${window.location.origin}/article/${article._id}`,
        "keywords": (article.tags || []).join(", ")
      }))
    })
  };

  return (
    <>
      {/* Basic Meta Tags - React 19 Native Support */}
      <title>{seoContent.title}</title>
      <meta name="description" content={seoContent.description} />
      <meta name="keywords" content={seoContent.keywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={window.location.href} />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seoContent.title} />
      <meta property="og:description" content={seoContent.description} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:site_name" content="Crypto News" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={seoContent.title} />
      <meta name="twitter:description" content={seoContent.description} />
      
      {/* Category-specific tags */}
      {selectedCategory !== 'All' && (
        <meta name="article:section" content={selectedCategory} />
      )}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              {selectedCategory === 'All' ? 'Crypto Articles' : selectedCategory}
              {debouncedSearch && (
                <span className="text-blue-400"> - "{debouncedSearch}"</span>
              )}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {debouncedSearch 
                ? `Search results for "${debouncedSearch}" in crypto articles`
                : selectedCategory === 'All' 
                  ? 'Latest cryptocurrency news, analysis and insights from the crypto world'
                  : `Latest ${selectedCategory.toLowerCase()} and expert analysis`
              }
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search crypto articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Filter Button for Mobile */}
              <button className="md:hidden flex items-center justify-center space-x-2 bg-slate-800 border border-gray-600 rounded-lg px-4 py-3 text-white">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  {category === 'All' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && articles.length === 0 && (
            <div className="flex justify-center items-center py-16">
              <Loader className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-3 text-gray-400">Loading articles...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <div className="text-red-400 text-lg mb-4">
                Loading Error
              </div>
              <p className="text-gray-500 mb-4">
                Failed to load articles. Please try again.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Articles Grid */}
          {articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && !error && articles.length === 0 && data && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-lg mb-4">
                No Articles Found
              </div>
              <p className="text-gray-500">
                {debouncedSearch 
                  ? `No articles found for "${debouncedSearch}". Try different keywords.`
                  : 'Try changing your search criteria or selecting a different category'
                }
              </p>
            </div>
          )}

          {/* Load More Button */}
          {articles.length > 0 && currentPage < totalPages && (
            <div className="text-center mt-12">
              <button 
                onClick={loadMore}
                disabled={isLoadingMore}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
                {isLoadingMore ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  'Load More Articles'
                )}
              </button>
            </div>
          )}

          {/* Articles Count */}
          {articles.length > 0 && (
            <div className="text-center mt-8 text-gray-400">
              Showing {articles.length} of {total} articles
              {debouncedSearch && (
                <span className="ml-2 text-blue-400">
                  for "{debouncedSearch}"
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Articles; 