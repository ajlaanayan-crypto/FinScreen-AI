import React from 'react';
import { StockData, StockMetric } from '../types';
import { Download, Share2, Bell, Star } from 'lucide-react';

interface StockHeaderProps {
  data: StockData;
}

const StockHeader: React.FC<StockHeaderProps> = ({ data }) => {
  const metrics: StockMetric[] = [
    { label: 'Market Cap', value: data.marketCap.toLocaleString(), suffix: 'Cr' },
    { label: 'Current Price', value: data.currentPrice, prefix: '₹' },
    { label: 'High / Low', value: data.highLow, prefix: '₹' },
    { label: 'Stock P/E', value: data.stockPE },
    { label: 'Book Value', value: data.bookValue, prefix: '₹' },
    { label: 'Dividend Yield', value: data.dividendYield, suffix: '%' },
    { label: 'ROCE', value: data.roce, suffix: '%' },
    { label: 'ROE', value: data.roe, suffix: '%' },
    { label: 'Face Value', value: data.faceValue, prefix: '₹' },
  ];

  return (
    <div className="bg-white dark:bg-darkcard rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {data.name}
            <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">
              {data.sector}
            </span>
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-primary hover:underline">BSE: 500325</a>
            <span>|</span>
            <a href="#" className="hover:text-primary hover:underline">NSE: {data.symbol}</a>
          </div>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300">
            <Bell size={18} />
          </button>
           <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300">
            <Star size={18} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors">
            <Download size={16} /> Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
        {metrics.map((metric, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
              {metric.label}
            </span>
            <span className="text-sm sm:text-lg font-semibold text-slate-800 dark:text-slate-100">
              {metric.prefix}{metric.value}{metric.suffix}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        <span className="font-semibold text-slate-900 dark:text-white">About: </span>
        {data.about}
      </div>
    </div>
  );
};

export default StockHeader;