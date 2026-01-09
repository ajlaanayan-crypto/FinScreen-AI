import React, { useState, useRef, useEffect } from 'react';
import { Search, Moon, Sun, BarChart3, Menu } from 'lucide-react';
import { SEARCH_SUGGESTIONS } from '../constants';

interface NavbarProps {
  darkMode: boolean;
  toggleTheme: () => void;
  onSearch: (term: string) => void;
  onLogoClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleTheme, onSearch, onLogoClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<typeof SEARCH_SUGGESTIONS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 0) {
      const filtered = SEARCH_SUGGESTIONS.filter(
        item => 
          item.name.toLowerCase().includes(value.toLowerCase()) || 
          item.symbol.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setSearchTerm(name);
    setShowSuggestions(false);
    onSearch(name);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(searchTerm);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-darkcard border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer group" onClick={onLogoClick}>
              <BarChart3 className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">FinScreen<span className="text-primary">.AI</span></span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button onClick={onLogoClick} className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </button>
              <a href="#" className="border-primary text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Analysis
              </a>
              <a href="#screener" className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Screens
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block relative" ref={dropdownRef}>
              <form onSubmit={handleFormSubmit} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => searchTerm && setShowSuggestions(true)}
                  placeholder="Search for a company..."
                  className="w-64 lg:w-80 bg-gray-100 dark:bg-slate-800 border-none rounded-md py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary dark:text-white transition-all"
                />
                <button type="submit" className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-primary">
                  <Search size={18} />
                </button>
              </form>
              
              {/* Autosuggest Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-50 max-h-96 overflow-y-auto">
                  {suggestions.map((item) => (
                    <div
                      key={item.symbol}
                      onClick={() => handleSuggestionClick(item.name)}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex justify-between items-center group"
                    >
                      <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary">{item.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{item.symbol}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none"
            >
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>

            <button className="sm:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;