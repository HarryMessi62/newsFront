import { cryptoData } from '../data/mockData';

const CryptoTicker = () => {
  return (
    <div className="bg-slate-800 border-b border-gray-700 py-2 overflow-hidden">
      <div className="crypto-ticker whitespace-nowrap">
        {[...cryptoData, ...cryptoData].map((crypto, index) => (
          <div key={`${crypto.symbol}-${index}`} className="flex items-center space-x-2 text-sm">
            <span className="font-bold text-white">{crypto.symbol}</span>
            <span className="text-gray-300">${crypto.price.toLocaleString()}</span>
            <span className={`${crypto.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {crypto.changePercent >= 0 ? '+' : ''}{crypto.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoTicker; 