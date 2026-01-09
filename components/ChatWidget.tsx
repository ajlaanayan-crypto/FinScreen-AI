import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { streamChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hi! I can analyze stocks, explain financial metrics, or search for recent market news. How can I help?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
       setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'Something went wrong.', isError: true, timestamp: new Date() }]);
    } finally {
      setIsStreaming(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 z-50"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-darkcard rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 overflow-hidden">
      <div className="p-4 bg-primary text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
           <Bot size={20} />
           <span className="font-semibold">Financial Assistant</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
              msg.role === 'user' 
                ? 'bg-primary text-white rounded-br-none' 
                : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isStreaming && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
           <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg rounded-bl-none shadow-sm border border-gray-200 dark:border-gray-700">
                <Loader2 className="animate-spin text-primary" size={16} />
              </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-darkcard">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 bg-gray-100 dark:bg-slate-800 border-none rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary dark:text-white"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="bg-primary hover:bg-blue-600 disabled:bg-blue-300 text-white p-2 rounded-md transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;