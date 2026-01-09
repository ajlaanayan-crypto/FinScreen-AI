import React from 'react';
import { TrendingUp, BarChart2, Search } from 'lucide-react';
import ScreenerInput from './ScreenerInput';

interface WelcomeScreenProps {
  onSearch: (term: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSearch }) => {
   const trending = ["Reliance", "TCS", "HDFC Bank", "Tata Motors", "Zomato", "ITC", "Infosys"];
   
   return (
     <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="inline-flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl mb-2 shadow-sm border border-blue-100 dark:border-blue-800">
             <BarChart2 className="w-12 h-12 text-primary" />
           </div>
           <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
             Financial Intelligence, <br className="hidden sm:block"/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Simplified</span>
           </h1>
           <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
             Access real-time market data, AI-powered valuation models, and natural language screening for the modern investor.
           </p>
        </div>
        
        {/* AI Screener (Hero Feature) */}
        <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 transform transition-all hover:scale-[1.01]">
           <ScreenerInput />
        </div>
        
        {/* Trending Tags */}
        <div className="w-full max-w-3xl text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
           <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-4 uppercase tracking-widest">Trending Companies</p>
           <div className="flex flex-wrap justify-center gap-3">
             {trending.map(stock => (
               <button 
                 key={stock}
                 onClick={() => onSearch(stock)}
                 className="group px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary dark:hover:text-primary transition-all shadow-sm flex items-center gap-2 hover:shadow-md"
               >
                 <TrendingUp size={14} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                 {stock}
               </button>
             ))}
           </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 text-center sm:text-left">
           <div className="space-y-2 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 justify-center sm:justify-start">
                <Search size={18} className="text-blue-500"/> Smart Search
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Instantly find financial data, peer comparisons, and documents for any listed company.</p>
           </div>
           <div className="space-y-2 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 justify-center sm:justify-start">
                 <BarChart2 size={18} className="text-blue-500"/> Deep Analysis
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive ratios, quarterly results, and interactive charts at your fingertips.</p>
           </div>
           <div className="space-y-2 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 justify-center sm:justify-start">
                 <TrendingUp size={18} className="text-blue-500"/> AI Insights
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get instant valuation summaries and fair value estimates powered by Gemini.</p>
           </div>
        </div>
     </div>
   )
}
export default WelcomeScreen;