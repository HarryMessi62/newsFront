import { ArrowRight } from 'lucide-react';
import ArticleCard from './ArticleCard';
import type { Article } from '../services/api';

interface CategorySectionProps {
  title: string;
  articles: Article[];
  showViewAll?: boolean;
  columns?: number;
}

const CategorySection = ({ title, articles, showViewAll = true, columns = 3 }: CategorySectionProps) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        {showViewAll && (
          <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-medium transition-colors">
            <span>Все статьи</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-8`}>
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection; 