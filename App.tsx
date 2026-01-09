import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StockHeader from './components/StockHeader';
import StockChart from './components/StockChart';
import Financials from './components/Financials';
import AiAnalysis from './components/AiAnalysis';
import WelcomeScreen from './components/WelcomeScreen';
import PeersTable from './components/PeersTable';
import ChatWidget from './components/ChatWidget';
import { MOCK_STOCK_DATA } from './constants';
import { StockData } from './types';
import { fetchRealtimeStockData } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentStock, setCurrentStock] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize theme
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Update HTML class for Tailwind dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const loadStockData = async (query: string) => {
    setIsLoading(true);
    setError('');
    setCurrentStock(null); // Clear current stock to show loading clearly
    try {
      const data = await fetchRealtimeStockData(query);
      setCurrentStock(data);
    } catch (e) {
      console.error("Failed to load stock data", e);
      setError('Failed to fetch realtime data. Using offline mock data.');
      setCurrentStock(MOCK_STOCK_DATA);
    } finally {
      setIsLoading(false);
    }
  };

  const resetToHome = () => {
    setCurrentStock(null);
    setError('');
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleSearch = (term: string) => {
    if (term.trim()) {
      loadStockData(term);
    }
  };

  return (
    <div className="min-h-screen pb-20 transition-colors duration-200">
      <Navbar 
        darkMode={darkMode} 
        toggleTheme={toggleTheme} 
        onSearch={handleSearch} 
        onLogoClick={resetToHome} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 border border-red-200 dark:border-red-800 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-sm underline hover:text-red-800">Dismiss</button>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-gray-200 dark:border-slate-700"></div>
                <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 animate-pulse font-medium">Fetching Market Data & Generating AI Insights...</p>
          </div>
        ) : !currentStock ? (
          /* Welcome Screen / Dashboard */
          <WelcomeScreen onSearch={handleSearch} />
        ) : (
          /* Stock Detail View */
          <div className="animate-in fade-in duration-500 space-y-6">
            <StockHeader data={currentStock} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <StockChart darkMode={darkMode} />
              </div>
              <div className="lg:col-span-1">
                 {/* AI Analysis of the fetched data */}
                 <AiAnalysis stock={currentStock} />
              </div>
            </div>

            <PeersTable peers={currentStock.peers} />
            <Financials data={currentStock} />

            {/* Documents Section (Static for UI Demo) */}
            <div className="bg-white dark:bg-darkcard rounded-lg shadow-sm p-6">
               <div className="flex items-center justify-between mb-4">
                 <h2 className="text-lg font-bold text-slate-900 dark:text-white">Corporate Filings</h2>
                 <span className="text-xs text-gray-500 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">Last Updated: Just now</span>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 {['Annual Report 2024', 'Credit Rating Report', 'Concall Transcript Q1', 'Investor Presentation'].map((doc, i) => (
                   <a key={i} href="#" className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 group transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-red-600 dark:text-red-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary truncate max-w-[120px] sm:max-w-none">{doc}</span>
                      </div>
                      <span className="text-xs text-gray-400">PDF</span>
                   </a>
                 ))}
               </div>
            </div>
          </div>
        )}
      </main>

      <ChatWidget />
    </div>
  );
};

export default App;