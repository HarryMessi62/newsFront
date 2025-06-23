import { Clock, Eye, ThumbsUp, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Article {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  media?: {
    featuredImage?: {
      url?: string;
      alt?: string;
      caption?: string;
    };
  };
  category: string;
  tags: string[];
  createdAt: string;
  views?: number;
  likes?: number;
  stats?: {
    views?: { total?: number; real?: number; fake?: number };
    likes?: { total?: number; real?: number; fake?: number };
  };
  author?: any;
}

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const navigate = useNavigate();

  // Helper function to get image URL
  const getImageUrl = (article: Article): string | undefined => {
    if (article.media?.featuredImage?.url) {
      return article.media.featuredImage.url;
    }
    if (article.imageUrl) {
      return article.imageUrl;
    }
    return undefined;
  };

  // Helper function to get views count
  const getViewsCount = (article: Article): number => {
    if (article.stats?.views?.total !== undefined) {
      return article.stats.views.total;
    }
    if (article.views !== undefined) {
      return article.views;
    }
    return 0;
  };

  // Helper function to get likes count
  const getLikesCount = (article: Article): number => {
    if (article.stats?.likes?.total !== undefined) {
      return article.stats.likes.total;
    }
    if (article.likes !== undefined) {
      return article.likes;
    }
    return 0;
  };

  // Helper function to get author name
  const getAuthorName = (author: any): string => {
    if (!author) return "Crypto News Team";
    if (typeof author === 'string') return author;
    if (typeof author === 'object') {
      return author.fullName || author.username || author.name || "Crypto News Team";
    }
    return "Crypto News Team";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPreviewText = (article: Article, maxLength: number = 150) => {
    // First try to use excerpt if available
    if (article.excerpt && article.excerpt.trim()) {
      const excerpt = article.excerpt.trim();
      if (excerpt.length <= maxLength) return excerpt;
      return excerpt.substring(0, maxLength) + '...';
    }
    
    // Fallback to content
    if (!article.content) {
      console.log('No content or excerpt provided for article:', article.title);
      return 'Click to read more...';
    }
    
    // Remove HTML tags and decode HTML entities
    let textContent = article.content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .trim(); // Remove whitespace
    
    if (!textContent || textContent.length === 0) {
      console.log('Content after HTML removal is empty for article:', article.title);
      return 'Click to read more...';
    }
    
    if (textContent.length <= maxLength) return textContent;
    return textContent.substring(0, maxLength) + '...';
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    return getPreviewText(article, maxLength);
  };

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to articles page with search for this tag
    navigate(`/articles?search=${encodeURIComponent(tag)}`);
  };

  const handleCategoryClick = (category: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to articles page with category filter
    navigate(`/articles?category=${encodeURIComponent(category)}`);
  };

  // Structured data for individual article card
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title || "",
    "description": truncateContent(article.content || ""),
    "image": getImageUrl(article),
    "author": {
      "@type": "Person",
      "name": getAuthorName(article.author)
    },
    "datePublished": article.createdAt,
    "url": `${window.location.origin}/article/${article._id}`,
    "keywords": (article.tags || []).join(", "),
    "articleSection": article.category || "",
    "interactionStatistic": [
      {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/LikeAction",
        "userInteractionCount": getLikesCount(article)
      },
      {
        "@type": "InteractionCounter", 
        "interactionType": "https://schema.org/ViewAction",
        "userInteractionCount": getViewsCount(article)
      }
    ]
  };

  return (
    <article 
      className="bg-slate-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
      itemScope 
      itemType="https://schema.org/BlogPosting"
    >
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Image */}
      {getImageUrl(article) && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={getImageUrl(article)}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            itemProp="image"
          />
          <div className="absolute top-4 left-4">
            <button
              onClick={(e) => handleCategoryClick(article.category, e)}
              className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
              itemProp="articleSection"
            >
              {article.category}
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <Link
          to={`/article/${article._id}`}
          className="block mb-3 hover:text-blue-400 transition-colors"
          itemProp="url"
        >
          <h3 className="text-xl font-bold text-white line-clamp-2" itemProp="headline">
            {article.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-400 mb-4 line-clamp-3" itemProp="description">
          {getPreviewText(article)}
        </p>

        {/* Tags */}
        {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag, index) => (
              <button
                key={index}
                onClick={(e) => handleTagClick(tag, e)}
                className="inline-flex items-center bg-slate-700 text-gray-300 px-2 py-1 rounded-md text-xs hover:bg-slate-600 transition-colors"
                itemProp="keywords"
                title={`Search for articles about ${tag}`}
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </button>
            ))}
            {article.tags.length > 3 && (
              <span className="text-gray-500 text-xs">
                +{article.tags.length - 3} more tags
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-4 text-gray-400 text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <time dateTime={article.createdAt} itemProp="datePublished">
                {formatDate(article.createdAt)}
              </time>
            </div>
            <div className="flex items-center" itemProp="interactionStatistic" itemScope itemType="https://schema.org/InteractionCounter">
              <Eye className="h-4 w-4 mr-1" />
              <span itemProp="userInteractionCount">{getViewsCount(article)}</span>
              <meta itemProp="interactionType" content="https://schema.org/ViewAction" />
            </div>
            <div className="flex items-center" itemProp="interactionStatistic" itemScope itemType="https://schema.org/InteractionCounter">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span itemProp="userInteractionCount">{getLikesCount(article)}</span>
              <meta itemProp="interactionType" content="https://schema.org/LikeAction" />
            </div>
          </div>
        </div>

        {/* Hidden SEO elements */}
        <div className="sr-only">
          <span itemProp="author" itemScope itemType="https://schema.org/Person">
            <span itemProp="name">{getAuthorName(article.author)}</span>
          </span>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard; 