// Утилиты для обработки HTML контента статей

// Список криптовалют для автоматической замены
const CRYPTO_SYMBOLS = [
  'BTC', 'BITCOIN',
  'ETH', 'ETHEREUM', 
  'ADA', 'CARDANO',
  'SOL', 'SOLANA',
  'DOT', 'POLKADOT',
  'BNB', 'BINANCE',
  'XRP', 'RIPPLE',
  'DOGE', 'DOGECOIN',
  'LTC', 'LITECOIN',
  'LINK', 'CHAINLINK',
  'MATIC', 'POLYGON',
  'AVAX', 'AVALANCHE'
];

// Функция для очистки HTML от потенциально опасных элементов
export const sanitizeHTML = (html: string): string => {
  // Простая очистка - в реальном проекте лучше использовать DOMPurify
  const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'div', 'span'];
  const allowedAttributes = ['href', 'src', 'alt', 'title', 'class', 'id'];
  
  // Удаляем script и style теги
  let cleanHTML = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  cleanHTML = cleanHTML.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Удаляем потенциально опасные атрибуты
  cleanHTML = cleanHTML.replace(/on\w+="[^"]*"/gi, '');
  cleanHTML = cleanHTML.replace(/javascript:/gi, '');
  
  return cleanHTML;
};

// Мапинг названий криптовалют к их символам
const CRYPTO_MAPPING: Record<string, string> = {
  'BITCOIN': 'btc',
  'BTC': 'btc',
  'ETHEREUM': 'eth',
  'ETH': 'eth',
  'CARDANO': 'ada',
  'ADA': 'ada',
  'SOLANA': 'sol',
  'SOL': 'sol',
  'POLKADOT': 'dot',
  'DOT': 'dot',
  'BINANCE': 'bnb',
  'BNB': 'bnb',
  'RIPPLE': 'xrp',
  'XRP': 'xrp',
  'DOGECOIN': 'doge',
  'DOGE': 'doge',
  'LITECOIN': 'ltc',
  'LTC': 'ltc',
  'CHAINLINK': 'link',
  'LINK': 'link',
  'POLYGON': 'matic',
  'MATIC': 'matic',
  'AVALANCHE': 'avax',
  'AVAX': 'avax'
};

// Функция для замены упоминаний криптовалют на специальные маркеры
export const replaceCryptoMentions = (html: string): string => {
  let processedHTML = html;
  
  // Обрабатываем каждую криптовалюту
  Object.entries(CRYPTO_MAPPING).forEach(([name, symbol]) => {
    // Ищем упоминания без знака доллара
    // Используем более простой подход без lookbehind для совместимости
    const regex1 = new RegExp(`\\b${name}\\b`, 'gi');
    processedHTML = processedHTML.replace(regex1, (match, offset, string) => {
      // Проверяем, не находится ли совпадение уже внутри crypto-widget тега
      const beforeMatch = string.substring(Math.max(0, offset - 100), offset);
      const afterMatch = string.substring(offset + match.length, Math.min(string.length, offset + match.length + 100));
      
      // Если уже внутри crypto-widget тега, не заменяем
      if (beforeMatch.includes('<crypto-widget') && afterMatch.includes('</crypto-widget>')) {
        return match;
      }
      
      return `<crypto-widget symbol="${symbol}" inline="true">${match}</crypto-widget>`;
    });
    
    // Ищем упоминания со знаком доллара
    const regex2 = new RegExp(`\\$${name}\\b`, 'gi');
    processedHTML = processedHTML.replace(regex2, (match, offset, string) => {
      // Проверяем, не находится ли совпадение уже внутри crypto-widget тега
      const beforeMatch = string.substring(Math.max(0, offset - 100), offset);
      const afterMatch = string.substring(offset + match.length, Math.min(string.length, offset + match.length + 100));
      
      // Если уже внутри crypto-widget тега, не заменяем
      if (beforeMatch.includes('<crypto-widget') && afterMatch.includes('</crypto-widget>')) {
        return match;
      }
      
      return `<crypto-widget symbol="${symbol}" inline="true">${match}</crypto-widget>`;
    });
  });
  
  return processedHTML;
};

// Функция для обработки полного HTML контента
export const processArticleHTML = (html: string): string => {
  if (!html) return '';
  
  // Сначала очищаем HTML
  let processedHTML = sanitizeHTML(html);
  
  // НЕ заменяем упоминания криптовалют на виджеты в тексте
  // processedHTML = replaceCryptoMentions(processedHTML);
  
  return processedHTML;
};

// Функция для извлечения упоминаний криптовалют из текста
export const extractCryptoMentions = (text: string): string[] => {
  const mentions: string[] = [];
  const cleanText = text.replace(/<[^>]*>/g, ''); // Удаляем HTML теги
  
  Object.entries(CRYPTO_MAPPING).forEach(([name, symbol]) => {
    const regex = new RegExp(`\\b${name}\\b|\\$${name}\\b`, 'gi');
    if (regex.test(cleanText)) {
      mentions.push(symbol);
    }
  });
  
  return [...new Set(mentions)]; // Убираем дубликаты
};

// Функция для добавления стилей к HTML контенту
export const addArticleStyles = (html: string): string => {
  // Добавляем классы Tailwind к HTML элементам
  let styledHTML = html;
  
  // Стили для параграфов
  styledHTML = styledHTML.replace(/<p>/gi, '<p class="text-gray-300 leading-relaxed mb-4 break-words">');
  
  // Стили для заголовков
  styledHTML = styledHTML.replace(/<h1>/gi, '<h1 class="text-3xl font-bold text-white mb-6 mt-8 break-words">');
  styledHTML = styledHTML.replace(/<h2>/gi, '<h2 class="text-2xl font-bold text-white mb-4 mt-6 break-words">');
  styledHTML = styledHTML.replace(/<h3>/gi, '<h3 class="text-xl font-bold text-white mb-3 mt-5 break-words">');
  styledHTML = styledHTML.replace(/<h4>/gi, '<h4 class="text-lg font-bold text-white mb-2 mt-4 break-words">');
  
  // Стили для ссылок
  styledHTML = styledHTML.replace(/<a /gi, '<a class="text-blue-400 hover:text-blue-300 underline" ');
  
  // Стили для списков
  styledHTML = styledHTML.replace(/<ul>/gi, '<ul class="list-disc list-inside text-gray-300 mb-4 space-y-2 break-words">');
  styledHTML = styledHTML.replace(/<ol>/gi, '<ol class="list-decimal list-inside text-gray-300 mb-4 space-y-2 break-words">');
  styledHTML = styledHTML.replace(/<li>/gi, '<li class="text-gray-300 break-words">');
  
  // Стили для блокквотов
  styledHTML = styledHTML.replace(/<blockquote>/gi, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-4 break-words">');
  
  // Стили для жирного текста
  styledHTML = styledHTML.replace(/<strong>/gi, '<strong class="font-bold text-white break-words">');
  styledHTML = styledHTML.replace(/<b>/gi, '<b class="font-bold text-white break-words">');
  
  // Стили для курсива
  styledHTML = styledHTML.replace(/<em>/gi, '<em class="italic text-gray-300 break-words">');
  styledHTML = styledHTML.replace(/<i>/gi, '<i class="italic text-gray-300 break-words">');
  
  return styledHTML;
}; 