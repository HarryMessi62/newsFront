import React, { useMemo } from 'react';
import CryptoWidget from './CryptoWidget';
import { processArticleHTML, addArticleStyles, extractCryptoMentions } from '../utils/htmlProcessor';

interface ArticleContentProps {
  content: string;
  showCryptoWidgets?: boolean;
}

const ArticleContent = ({ content, showCryptoWidgets = true }: ArticleContentProps) => {
  // Обрабатываем HTML контент
  const processedContent = useMemo(() => {
    if (!content) return '';
    
    let processedHTML = processArticleHTML(content);
    processedHTML = addArticleStyles(processedHTML);
    
    return processedHTML;
  }, [content]);

  // Извлекаем упоминания криптовалют для отображения виджетов
  const cryptoMentions = useMemo(() => {
    if (!showCryptoWidgets) return [];
    return extractCryptoMentions(content);
  }, [content, showCryptoWidgets]);

  // Функция для обработки HTML и удаления crypto-widget тегов (оставляем только текст)
  const renderHTMLWithoutCryptoWidgets = (html: string) => {
    // Убираем crypto-widget теги, оставляя только их текстовое содержимое
    const cleanedHTML = html.replace(/<crypto-widget[^>]*>(.*?)<\/crypto-widget>/gi, '$1');
    
    return (
      <div dangerouslySetInnerHTML={{ __html: cleanedHTML }} />
    );
  };

  return (
    <div className="prose prose-invert max-w-none">
      <div className="text-gray-300 leading-relaxed space-y-6">
        {/* Основной контент без crypto-widget виджетов */}
        <div className="article-content overflow-hidden">
          {renderHTMLWithoutCryptoWidgets(processedContent)}
        </div>
        
        {/* Упомянутые криптовалюты внизу статьи */}
        {showCryptoWidgets && cryptoMentions.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Упомянутые криптовалюты</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cryptoMentions.slice(0, 6).map((symbol) => (
                <CryptoWidget
                  key={symbol}
                  symbol={symbol.toLowerCase()}
                  inline={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleContent; 