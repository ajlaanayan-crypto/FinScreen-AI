import React, { useEffect, useState } from 'react';
import { StockData } from '../types';
import { generateStockAnalysis, AnalysisResult } from '../services/geminiService';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

interface AiAnalysisProps {
  stock: StockData;
}

const AiAnalysis: React.FC<AiAnalysisProps> = ({ stock }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalysis = async () => {
    setLoading(true);
    const result = await generateStockAnalysis(stock);
    setAnalysis(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stock.symbol]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-darkcard rounded-lg shadow-sm p-6 mb-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
        <div className="h-24 bg-gray-100 dark:bg-slate-800 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
           <div className="h-32 bg-gray-100 dark:bg-slate-800 rounded"></div>
           <div className="h-32 bg-gray-100 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-white dark:bg-darkcard rounded-lg shadow-sm p-6 mb-6 border border-blue-100 dark:border-blue-900/30">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="text-primary fill-current" size={20} />
          AI Financial Analysis
        </h2>
        <button 
          onClick={fetchAnalysis}
          className="text-sm text-primary hover:text-blue-600 flex items-center gap-1"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
        <p>{analysis.summary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Fair Value Card */}
        <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Fair Value Estimate</h3>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {analysis.fairValue.verdict}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
            <span className="text-gray-500">DCF Model</span>
            <span className="font-mono font-medium dark:text-gray-200">₹{analysis.fairValue.dcf.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">Historical PE</span>
            <span className="font-mono font-medium dark:text-gray-200">₹{analysis.fairValue.pe.toFixed(0)}</span>
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
              <TrendingUp size={16} /> Strengths
            </h3>
            <ul className="space-y-1">
              {analysis.strengths.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle size={14} className="mt-0.5 text-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertTriangle size={16} /> Risks
            </h3>
            <ul className="space-y-1">
              {analysis.risks.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAnalysis;