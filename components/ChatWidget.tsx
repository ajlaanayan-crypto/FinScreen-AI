import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import { streamChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hi there! I\'m your AI Financial Analyst. I can help you analyze stocks, explain complex financial terms, or summarize market trends. What would you like to know today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    // Hide greeting bubble after 5 seconds if chat is not opened
    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    // Prepare history for Gemini
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: responseId, role: 'model', text: '', timestamp: new Date() }]);

    try {
      const stream = streamChatResponse(userMsg.text, history);

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => prev.map(m =>
          m.id === responseId ? { ...m, text: fullText } : m
        ));
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'I encountered a temporary issue. Please try again.', isError: true, timestamp: new Date() }]);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Interactive greeting bubble */}
      {!isOpen && showGreeting && (
        <div className="mb-4 mr-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-gray-200 px-4 py-3 rounded-2xl rounded-br-none shadow-xl border border-gray-100 dark:border-gray-700 animate-bounce-subtle max-w-xs pointer-events-auto">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
              <Sparkles size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Need market insights?</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">I can analyze any stock for you instantly.</p>
            </div>
            <button
              onClick={() => setShowGreeting(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white p-4 rounded-full shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-110 active:scale-95 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
          <MessageSquare size={28} className="relative z-10" />
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-ping"></span>
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        </button>
      ) : (
        <div className="pointer-events-auto w-[400px] h-[600px] max-h-[80vh] bg-white dark:bg-darkcard rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm border border-white/10">
                <Bot size={20} className="text-blue-300" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">FinScreen AI</h3>
                <div className="flex items-center gap-1.5 opacity-80">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-xs">Online & Ready</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-2 rounded-full transition-colors text-gray-300 hover:text-white"
              >
                <ChevronDown size={20} />
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-[#0f172a]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'
                  }`}>
                  {msg.role === 'model' && (
                    <div className="flex items-center gap-2 mb-1.5 border-b border-gray-100 dark:border-gray-700/50 pb-1.5 opacity-70">
                      <Sparkles size={12} className="text-blue-500" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider">AI Analysis</span>
                    </div>
                  )}
                  <div className="markdown-body">
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i} className="min-h-[1em]">{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {isStreaming && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 dark:border-gray-700 flex gap-2 items-center">
                  <Loader2 className="animate-spin text-primary" size={18} />
                  <span className="text-xs text-gray-400 font-medium">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-darkcard border-t border-gray-100 dark:border-gray-800">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about stocks, trends, or metrics..."
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-4 pr-12 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm dark:text-white dark:placeholder-gray-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className="absolute right-2 top-2 p-1.5 bg-primary hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-slate-700 text-white rounded-lg transition-all duration-200 shadow-sm disabled:shadow-none hover:shadow-md active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="text-center mt-2">
              <p className="text-[10px] text-gray-400 dark:text-gray-500">AI can make mistakes. Please verify important financial data.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;