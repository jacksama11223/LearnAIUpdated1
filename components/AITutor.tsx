import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'Chào bạn! Tôi là trợ lý LearnAI của bạn. Hôm nay bạn muốn học gì nào? Tôi có thể giúp bạn học từ vựng, ngữ pháp, hay kiến thức khoa học...',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Format history for Gemini API
    const history = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    try {
        const responseText = await sendMessageToGemini(input, history);
        
        const botMessage: ChatMessage = {
            role: 'model',
            text: responseText,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto p-4 bg-white dark:bg-[#101c22]">
      {/* Header of Chat */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-[#F8F9FA] dark:bg-[#101c22] rounded-t-xl">
        <div className="flex items-center gap-3">
             <div className="flex items-center justify-center size-10 rounded-full bg-[#3498db]/20 text-[#3498db]">
                <span className="material-symbols-outlined">smart_toy</span>
             </div>
             <div>
                <h3 className="font-bold text-[#212529] dark:text-[#F8F9FA]">Gia sư AI</h3>
                <span className="text-xs text-[#6c757d] flex items-center gap-1">
                    <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                    Trực tuyến
                </span>
             </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-[#101c22]">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-[#3498db] text-white rounded-br-none' 
                  : 'bg-[#F8F9FA] dark:bg-slate-800 text-[#212529] dark:text-[#F8F9FA] border border-slate-200 dark:border-slate-700 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-[#F8F9FA] dark:bg-slate-800 rounded-2xl p-4 rounded-bl-none border border-slate-200 dark:border-slate-700">
                <div className="flex gap-1">
                    <div className="size-2 bg-slate-400 rounded-full animate-bounce delay-0"></div>
                    <div className="size-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                    <div className="size-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-[#101c22] border-t border-slate-200 dark:border-slate-700">
        <div className="relative flex items-center gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhập câu hỏi của bạn..."
                className="w-full h-12 pl-4 pr-12 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[#212529] dark:text-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-[#3498db] transition-all"
                disabled={isLoading}
            />
            <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-1.5 p-2 rounded-full bg-[#f1c40f] text-slate-900 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <span className="material-symbols-outlined text-xl">send</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
