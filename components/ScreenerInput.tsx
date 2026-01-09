import React, { useState } from 'react';
import { Sparkles, ArrowRight, Database } from 'lucide-react';
import { interpretScreenQuery } from '../services/geminiService';

const ScreenerInput: React.FC = () => {
  const [query, setQuery] = useState('');
  const [interpretedQuery, setInterpretedQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsAnalyzing(true);
    const result = await interpretScreenQuery(query);
    setInterpretedQuery(result);
    setIsAnalyzing(false);
  };

  return (
    <div id="screener" className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl shadow-lg p-6 sm:p-10 mb-8 text-white">
       <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
         <Sparkles className="text-yellow-300" />
         AI Stock Screener
       </h2>
       <p className="text-blue-100 mb-6 max-w-2xl">
         Describe the companies you are looking for in plain English. The AI will build the screen filters for you.
       </p>

       <form onSubmit={handleSubmit} className="relative max-w-3xl">
         <input
           type="text"
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           placeholder="e.g. Debt free smallcap companies with ROCE > 20% and growing sales"
           className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg py-4 pl-5 pr-12 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
         />
         <button 
          type="submit"
          className="absolute right-2 top-2 bottom-2 bg-white text-blue-600 rounded-md px-4 font-medium hover:bg-blue-50 transition-colors flex items-center"
         >
           {isAnalyzing ? '...' : <ArrowRight size={20} />}
         </button>
       </form>

       {interpretedQuery && (
         <div className="mt-6 bg-black/20 rounded-lg p-4 border border-white/10 animate-fade-in">
            <div className="flex items-start gap-3">
              <Database className="mt-1 text-blue-300" size={18} />
              <div>
                <p className="text-xs text-blue-300 uppercase font-semibold tracking-wider mb-1">Generated Filter Logic</p>
                <code className="font-mono text-sm text-green-300 break-all">
                  {interpretedQuery}
                </code>
              </div>
            </div>
         </div>
       )}

       <div className="mt-6 flex flex-wrap gap-2 text-sm text-blue-200">
         <span className="opacity-75">Try:</span>
         <button onClick={() => setQuery("Companies with highest promoter holding and low PE")} className="hover:text-white underline decoration-dotted">High promoter holding & Low PE</button>
         <button onClick={() => setQuery("Consistent profit growth > 15% for 5 years")} className="hover:text-white underline decoration-dotted">Consistent compounders</button>
       </div>
    </div>
  );
};

export default ScreenerInput;