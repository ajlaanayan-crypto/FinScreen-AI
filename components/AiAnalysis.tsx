import React, { useEffect, useState } from 'react';
import { StockData } from '../types';
import { generateStockAnalysis, AnalysisResult } from '../services/geminiService';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, RefreshCw, Layers, ArrowRight } from 'lucide-react';

interface AiAnalysisProps {
  stock: StockData;
}

const AiAnalysis: React.FC<AiAnalysisProps> = ({ stock }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const result = await generateStockAnalysis(stock);
      setAnalysis(result);
    } catch (e) {
      console.error("Analysis failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stock.symbol]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-darkcard rounded-xl shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
          <div className="h-6 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
        <div className="space-y-3 mb-6">
          <div className="h-4 w-full bg-gray-100 dark:bg-slate-800 rounded animate-pulse"></div>
          <div className="h-4 w-[90%] bg-gray-100 dark:bg-slate-800 rounded animate-pulse"></div>
          <div className="h-4 w-[95%] bg-gray-100 dark:bg-slate-800 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-gray-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
          <div className="h-32 bg-gray-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-white dark:bg-darkcard rounded-xl shadow-sm p-6 mb-6 border border-blue-100 dark:border-blue-900/30 transition-all hover:shadow-md relative overflow-hidden group">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-colors duration-500 pointer-events-none"></div>

      <div className="flex justify-between items-center mb-5 relative z-10">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <div className="bg-blue-100 dark:bg-blue-900/40 p-1.5 rounded-lg text-primary">
            <Sparkles className="fill-current" size={18} />
          </div>
          <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            AI Financial Analysis
          </span>
        </h2>
        <button
          onClick={fetchAnalysis}
          className="text-xs font-medium text-gray-500 hover:text-primary bg-gray-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 group/btn"
        >
          <RefreshCw size={12} className="group-hover/btn:rotate-180 transition-transform duration-500" />
          Refresh Analysis
        </button>
      </div>

      <div className="mb-6 relative z-10">
        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 text-slate-700 dark:text-slate-300 text-sm leading-relaxed backdrop-blur-sm">
          <p>{analysis.summary}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 relative z-10">
        {/* Fair Value Card */}
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={14} /> Fair Value Estimate
            </h3>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${analysis.fairValue.verdict.toLowerCase().includes('undervalued')
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : analysis.fairValue.verdict.toLowerCase().includes('overvalued')
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
              {analysis.fairValue.verdict}
            </span>
          </div>

          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {analysis.fairValue.verdict.split(' ')[0]}
            </span>
            <span className="text-sm text-gray-500 font-medium">
              valuation
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm py-2 border-t border-gray-200/60 dark:border-gray-700">
              <span className="text-gray-500 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-blue-400"></span> DCF Model
              </span>
              <span className="font-mono font-medium dark:text-gray-200">₹{analysis.fairValue.dcf.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm py-1">
              <span className="text-gray-500 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-purple-400"></span> Peer Avg PE
              </span>
              <span className="font-mono font-medium dark:text-gray-200">₹{analysis.fairValue.pe.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-green-50/50 dark:bg-green-900/10 p-3 rounded-lg border border-green-100 dark:border-green-900/30">
            <h3 className="text-xs font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1.5">
              <TrendingUp size={14} /> Strengths
            </h3>
            <ul className="space-y-1.5">
              {analysis.strengths.slice(0, 3).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <CheckCircle size={12} className="mt-0.5 text-green-500 flex-shrink-0" />
                  <span className="leading-tight">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-50/50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
            <h3 className="text-xs font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-1.5">
              <AlertTriangle size={14} /> Risks
            </h3>
            <ul className="space-y-1.5">
              {analysis.risks.slice(0, 3).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
                  <span className="leading-tight">{item}</span>
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