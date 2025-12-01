
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface SocraticTutorProps {
  onBack: () => void;
  onShowAbout: () => void;
  onLogout: () => void;
  onShowFAQ: () => void;
  onShowAccount: () => void;
}

// Helper for typewriter effect
const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');
    
    useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            setDisplayedText((prev) => {
                if (index < text.length) {
                    index++;
                    return text.slice(0, index);
                }
                clearInterval(intervalId);
                return text;
            });
        }, 10); // Speed of typing
        return () => clearInterval(intervalId);
    }, [text]);

    return <span>{displayedText}</span>;
};

const SocraticTutor: React.FC<SocraticTutorProps> = ({ onBack, onShowAbout, onLogout, onShowFAQ, onShowAccount }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'Chào mừng đến với AI Learning Hub! Tôi là Socratic, gia sư AI của bạn. Hãy cùng nhau khám phá đại dương tri thức nhé. Bạn muốn bắt đầu từ đâu?',
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
  }, [messages, isLoading]);

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
      // In a real app, handle error UI here
    } finally {
      setIsLoading(false);
    }
  };

  // Particles Configuration
  const particles = [
      { size: '2px', xStart: '10%', xEnd: '15%', duration: '25s', delay: '0s' },
      { size: '1.5px', xStart: '20%', xEnd: '22%', duration: '18s', delay: '-5s' },
      { size: '3px', xStart: '30%', xEnd: '25%', duration: '30s', delay: '-10s' },
      { size: '1px', xStart: '40%', xEnd: '48%', duration: '22s', delay: '-3s' },
      { size: '2.5px', xStart: '50%', xEnd: '45%', duration: '28s', delay: '-8s' },
      { size: '1px', xStart: '60%', xEnd: '65%', duration: '15s', delay: '-1s' },
      { size: '3.5px', xStart: '70%', xEnd: '68%', duration: '35s', delay: '-15s' },
      { size: '2px', xStart: '80%', xEnd: '85%', duration: '20s', delay: '-7s' },
      { size: '1.5px', xStart: '90%', xEnd: '92%', duration: '26s', delay: '-12s' },
      { size: '2px', xStart: '15%', xEnd: '18%', duration: '19s', delay: '-18s' },
      { size: '2.5px', xStart: '85%', xEnd: '80%', duration: '24s', delay: '-22s' },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-ink-blue-dark text-text-silver font-display">
      <style>{`
        @keyframes float-particles {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            20% { opacity: 0.8; }
            100% { transform: translateY(-100vh) translateX(var(--x-end)); opacity: 0; }
        }
        .particle {
            position: absolute;
            bottom: -50px;
            left: var(--x-start);
            width: var(--size);
            height: var(--size);
            background-color: #F0F8FF;
            border-radius: 50%;
            animation: float-particles linear infinite;
            animation-duration: var(--duration);
            animation-delay: var(--delay);
            filter: blur(1px);
            box-shadow: 0 0 10px #F0F8FF;
            pointer-events: none;
        }
      `}</style>
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between whitespace-nowrap border-b border-solid border-white/10 bg-ink-blue-dark/80 px-4 py-3 shadow-[0_4px_30px_rgba(173,216,230,0.1)] backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
                <span className="material-symbols-outlined animate-sparkle text-3xl text-silver-sparkle text-glow-silver">sailing</span>
                <span className="animate-sparkle text-2xl font-bold tracking-wide text-silver-sparkle text-glow-silver">LearnAI</span>
            </div>
            <nav className="ml-6 hidden items-center gap-6 md:flex">
                <a className="text-base font-medium text-text-muted-silver transition-colors hover:text-silver-sparkle hover:drop-shadow-[0_0_8px_var(--silver-sparkle)]" href="#">Tính năng</a>
                <a onClick={(e) => { e.preventDefault(); onShowAbout(); }} className="text-base font-medium text-text-muted-silver transition-colors hover:text-silver-sparkle hover:drop-shadow-[0_0_8px_var(--silver-sparkle)] cursor-pointer" href="#">Giới thiệu</a>
                <a onClick={(e) => { e.preventDefault(); onShowFAQ(); }} className="text-base font-medium text-text-muted-silver transition-colors hover:text-silver-sparkle hover:drop-shadow-[0_0_8px_var(--silver-sparkle)] cursor-pointer" href="#">Hỏi đáp</a>
            </nav>
        </div>
        <div className="flex items-center gap-4">
            <button 
                onClick={onShowAccount}
                className="flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full px-4 text-base font-medium leading-normal text-silver-sparkle transition-all hover:bg-white/10 hover:shadow-[0_0_12px_var(--glow-color)]"
            >
                <span className="material-symbols-outlined text-xl">person</span>
                <span className="hidden sm:inline truncate">Tài khoản</span>
            </button>
            <button onClick={onLogout} className="flex h-10 min-w-[40px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/10 px-4 text-base font-medium leading-normal text-silver-sparkle transition-all hover:bg-white/20 hover:shadow-[0_0_12px_var(--glow-color)]">
                <span className="hidden sm:inline truncate">Đăng xuất</span>
                <span className="material-symbols-outlined sm:hidden text-xl">logout</span>
            </button>
        </div>
      </header>

      <main className="flex-grow">
        <div className="relative flex min-h-[calc(100vh-64px)] flex-col overflow-hidden bg-gradient-to-b from-ink-blue-dark to-emerald-deep">
            {/* Particles */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {particles.map((p, i) => (
                    <div 
                        key={i}
                        className="particle"
                        style={{
                            '--size': p.size,
                            '--x-start': p.xStart,
                            '--x-end': p.xEnd,
                            '--duration': p.duration,
                            '--delay': p.delay
                        } as React.CSSProperties}
                    ></div>
                ))}
            </div>

            <div className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-1 flex-col px-4 pb-6 pt-4 sm:px-6 lg:px-8">
                <button 
                    onClick={onBack}
                    className="mb-4 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-base text-white/90 transition-all hover:bg-white/20 hover:text-white cursor-pointer"
                >
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    <span className="font-medium">Quay về</span>
                </button>

                <div className="flex h-0 flex-1 flex-col overflow-hidden rounded-xl bg-black/20 backdrop-blur-sm border border-white/5">
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'items-start'} gap-4`}>
                                {msg.role === 'model' && (
                                    <div className="animate-gentle-bob mt-1 h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-amber-glow shadow-[0_0_20px_rgba(255,195,0,0.5)]">
                                        <img alt="AI Socratic Tutor Avatar" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzBziidarPdbfcDaUAFRuu07-wOY7iyD8ZgNiDDT0Vwg_JMAv0e4i03OezBnPi7s6CgFrS5KzzBAU0djMmfh4mNaeiKwpx_I001Rx2gUZcC5SS_3gc6QmepK9vTBmjp-RSB_6mIKUKKHfkSLOXAkgplGFKxOIIMFWxYYWHzbBzHHTmULNkl8u9qWhA7_V_sfqGeNcSkMfPwyL14O8IDeqh_mEnhhmxA7nTvze9zR_PqWIOaQ8ORAjk0yENVSRNAzTOvm5irIEp8ojp"/>
                                    </div>
                                )}
                                
                                <div className={`flex max-w-2xl flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} gap-2`}>
                                    <p className={`text-base font-bold ${msg.role === 'model' ? 'text-amber-glow text-glow-amber' : 'text-gray-100 text-glow-silver'}`}>
                                        {msg.role === 'model' ? 'Gia sư Biện chứng' : 'Bạn'}
                                    </p>
                                    <div className={`p-4 shadow-xl backdrop-blur-md ${
                                        msg.role === 'model' 
                                        ? 'rounded-b-2xl rounded-tr-2xl bg-ai-bubble/80 shadow-black/40' 
                                        : 'rounded-b-2xl rounded-tl-2xl border border-white/20 bg-user-bubble shadow-black/20 backdrop-blur-sm'
                                    }`}>
                                        <p className="text-base leading-relaxed text-white font-medium drop-shadow-sm">
                                            {msg.role === 'model' ? <TypewriterText text={msg.text} /> : msg.text}
                                        </p>
                                    </div>
                                </div>

                                {msg.role === 'user' && (
                                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-slate-300 shadow-lg">
                                        <img alt="User Avatar" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASNNYmUrIpYEiFvYOWnDjgQO8O0oA0AJ9VRZaGMQ12qdEGuSY8de79sbS9SSRhAqiLLyFfNkyUgIuDhN_z6K9DZzewPbvvraeD-gSMMrF_2CGSDAFBb9WraNXGVSvg2OZLTsMn1TJn4NDj2DmPB5JVsb0O0CyQ_xXsTed3_wfhXaUWFaNtciFoidqkIUhssSNT3JhLif5ShCoCJcJi4e9lOHyk1nJ_j0kFdg4sa3yo8vBED0n9PWUcw22Fy04mNzyNuZtkUDmUPnAn"/>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-4">
                                <div className="animate-gentle-bob mt-1 h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-amber-glow shadow-[0_0_20px_rgba(255,195,0,0.5)]">
                                    <img alt="AI Socratic Tutor Avatar" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzBziidarPdbfcDaUAFRuu07-wOY7iyD8ZgNiDDT0Vwg_JMAv0e4i03OezBnPi7s6CgFrS5KzzBAU0djMmfh4mNaeiKwpx_I001Rx2gUZcC5SS_3gc6QmepK9vTBmjp-RSB_6mIKUKKHfkSLOXAkgplGFKxOIIMFWxYYWHzbBzHHTmULNkl8u9qWhA7_V_sfqGeNcSkMfPwyL14O8IDeqh_mEnhhmxA7nTvze9zR_PqWIOaQ8ORAjk0yENVSRNAzTOvm5irIEp8ojp"/>
                                </div>
                                <div className="flex flex-col items-start gap-2">
                                    <p className="text-base font-bold text-amber-glow text-glow-amber">Gia sư Biện chứng</p>
                                    <div className="rounded-b-2xl rounded-tr-2xl bg-ai-bubble/80 p-4 shadow-xl shadow-black/40 backdrop-blur-md">
                                        <div className="flex gap-1 h-6 items-center">
                                            <div className="size-2 bg-text-silver/50 rounded-full animate-bounce"></div>
                                            <div className="size-2 bg-text-silver/50 rounded-full animate-bounce delay-75"></div>
                                            <div className="size-2 bg-text-silver/50 rounded-full animate-bounce delay-150"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="mt-auto px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
                        <div className="relative">
                            <input 
                                className="w-full rounded-full border-2 border-transparent bg-slate-900/80 py-4 pl-6 pr-16 text-base text-white placeholder-white/50 shadow-[0_0_15px_rgba(173,216,230,0.3)] ring-1 ring-white/20 transition-all focus:border-amber-glow focus:outline-none focus:ring-2 focus:ring-amber-glow focus:shadow-[0_0_30px_rgba(255,195,0,0.7)]" 
                                placeholder="Nhập câu hỏi của bạn..." 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                disabled={isLoading}
                            />
                            <button 
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-amber-glow transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed" 
                                style={{ textShadow: '0 0 10px var(--amber-glow)' }}
                            >
                                <span className="material-symbols-outlined text-3xl">send</span>
                            </button>
                        </div>
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                            <button className="flex items-center gap-2 rounded-full border border-transparent bg-gradient-to-br from-yellow-400 to-amber-600 px-4 py-2 text-sm font-bold text-black shadow-lg shadow-amber-500/30 transition-all duration-300 hover:from-yellow-300 hover:to-amber-500 hover:shadow-[0_0_20px_rgba(255,195,0,0.8)]"><span className="material-symbols-outlined text-xl">file_upload</span>Nhập nội dung</button>
                            <button className="flex items-center gap-2 rounded-full border border-transparent bg-gradient-to-br from-yellow-400 to-amber-600 px-4 py-2 text-sm font-bold text-black shadow-lg shadow-amber-500/30 transition-all duration-300 hover:from-yellow-300 hover:to-amber-500 hover:shadow-[0_0_20px_rgba(255,195,0,0.8)]"><span className="material-symbols-outlined text-xl">file_download</span>Xuất nội dung</button>
                            <button className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-black/30 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"><span className="material-symbols-outlined text-xl">save</span>Lưu cuộc trò chuyện</button>
                            <button className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-black/30 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"><span className="material-symbols-outlined text-xl">history</span>Các cuộc trò chuyện</button>
                            <button className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-black/30 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"><span className="material-symbols-outlined text-xl">groups</span>Chọn gia sư</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-gradient-to-t from-[#010712] to-ink-blue-dark px-4 py-6 shadow-[0_-4px_30px_rgba(173,216,230,0.1)] backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined animate-sparkle text-2xl text-silver-sparkle text-glow-silver">sailing</span>
                <span className="animate-sparkle text-xl font-bold text-silver-sparkle text-glow-silver">LearnAI</span>
            </div>
            <div className="flex flex-grow justify-center gap-x-6 gap-y-2 text-sm font-medium text-text-muted-silver">
                <a className="transition-colors hover:text-silver-sparkle hover:drop-shadow-[0_0_8px_var(--silver-sparkle)]" href="#">Điều khoản dịch vụ</a>
                <a className="transition-colors hover:text-silver-sparkle hover:drop-shadow-[0_0_8px_var(--silver-sparkle)]" href="#">Chính sách bảo mật</a>
            </div>
            <p className="text-sm text-text-muted-silver">© 2024 LearnAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SocraticTutor;
