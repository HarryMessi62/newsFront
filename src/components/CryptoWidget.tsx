import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getCryptoPrice, formatPrice, formatPriceChange, type CryptoPrice } from '../services/cryptoAPI';

interface CryptoWidgetProps {
  symbol: string;
  inline?: boolean;
}

const CryptoWidget = ({ symbol, inline = false }: CryptoWidgetProps) => {
  const [cryptoData, setCryptoData] = useState<CryptoPrice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCryptoData = async () => {
      setLoading(true);
      const data = await getCryptoPrice(symbol);
      setCryptoData(data);
      setLoading(false);
    };

    fetchCryptoData();
  }, [symbol]);

  if (loading) {
    return (
      <div className={`${inline ? 'inline-flex' : 'flex'} items-center space-x-2 bg-slate-700 rounded px-2 py-1 animate-pulse`}>
        <div className="w-4 h-4 bg-slate-600 rounded"></div>
        <div className="w-16 h-4 bg-slate-600 rounded"></div>
      </div>
    );
  }

  if (!cryptoData) {
    return (
      <span className="text-gray-400 bg-slate-700 rounded px-2 py-1">
        {symbol.toUpperCase()} (Price unavailable)
      </span>
    );
  }

  const isPositive = cryptoData.changePercent24h >= 0;

  if (inline) {
    return (
      <span className="inline-flex items-center space-x-1 bg-slate-700 rounded px-2 py-1 text-sm">
        <span className="font-semibold text-white">{cryptoData.symbol}</span>
        <span className="text-white">{formatPrice(cryptoData.price)}</span>
        <span className={`flex items-center space-x-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{formatPriceChange(cryptoData.changePercent24h, true)}</span>
        </span>
      </span>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 my-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">{cryptoData.symbol}</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">{cryptoData.name}</h3>
            <p className="text-gray-400 text-sm">{cryptoData.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white font-bold text-lg">{formatPrice(cryptoData.price)}</div>
          <div className={`flex items-center justify-end space-x-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{formatPriceChange(cryptoData.changePercent24h, true)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoWidget; 