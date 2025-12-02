
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, KnowledgeNode, SavedChatSession, TutorPersona } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface SocraticTutorProps {
  onBack: () => void;
  onShowAbout: () => void;
  onLogout: () => void;
  onShowFAQ: () => void;
  onShowAccount: () => void;
  initialMessage?: string;
  userNodes?: KnowledgeNode[];
  stats?: { due: number; weak: number; new: number };
}

// PERSONA DEFINITIONS
const PERSONAS: TutorPersona[] = [
    {
        id: 'socratic',
        name: 'Gia sư Biện chứng',
        description: 'Đặt câu hỏi để giúp bạn tự tìm ra câu trả lời (Mặc định).',
        icon: 'psychology_alt',
        systemInstruction: "You are a Socratic Tutor. Never give the answer directly. Instead, ask guiding questions to help the user discover the answer themselves. Be patient, encouraging, and concise.",
        color: 'text-amber-glow'
    },
    {
        id: 'feynman',
        name: 'Thầy Feynman',
        description: 'Giải thích siêu đơn giản bằng phép ẩn dụ, như cho trẻ 5 tuổi.',
        icon: 'child_care',
        systemInstruction: "You are Richard Feynman. Explain complex concepts in simple language, using analogies and metaphors. Avoid jargon. Act as if you are explaining to a 5-year-old or a complete beginner.",
        color: 'text-green-400'
    },
    {
        id: 'strict',
        name: 'Giáo sư Nghiêm khắc',
        description: 'Chỉ ra lỗi sai thẳng thắn và yêu cầu độ chính xác cao.',
        icon: 'gavel',
        systemInstruction: "You are a strict, academic professor. You demand precision and accuracy. Correct any logical fallacies or factual errors immediately. Do not be rude, but be very firm and direct.",
        color: 'text-red-400'
    },
    {
        id: 'buddy',
        name: 'Bạn học Thân thiện',
        description: 'Học cùng nhau, dùng ngôn ngữ teen, emoji và vui vẻ.',
        icon: 'sentiment_very_satisfied',
        systemInstruction: "You are a study buddy. Use casual language, slang, and emojis. Be very supportive and hype the user up. Make learning feel like a fun collaboration.",
        color: 'text-sky-400'
    },
    {
        id: 'debater',
        name: 'Đối thủ Tranh biện',
        description: 'Thử thách kiến thức của bạn bằng cách phản biện lại mọi luận điểm.',
        icon: 'swords',
        systemInstruction: "You are a skilled Debater. Your goal is to challenge the user's understanding by finding flaws, counter-examples, or logical gaps in their statements. Play devil's advocate. Be respectful but sharp.",
        color: 'text-purple-400'
    }
];

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
        }, 8); // Speed of typing
        return () => clearInterval(intervalId);
    }, [text]);

    return <span>{displayedText}</span>;
};

const SocraticTutor: React.FC<SocraticTutorProps> = ({ onBack, onShowAbout, onLogout, onShowFAQ, onShowAccount, initialMessage, userNodes, stats }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Advanced Features State
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [savedSessions, setSavedSessions] = useState<SavedChatSession[]>([]);
  const [currentPersona, setCurrentPersona] = useState<TutorPersona>(PERSONAS[0]); // Default Socratic
  const [isChallengeMode, setIsChallengeMode] = useState(false);

  // Ref to ensure initial message is sent only once
  const hasSentInitialRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load Saved Sessions from LocalStorage on mount
  useEffect(() => {
      const stored = localStorage.getItem('learnai_chat_history');
      if (stored) {
          try {
              setSavedSessions(JSON.parse(stored));
          } catch (e) {
              console.error("Failed to load chat history", e);
          }
      }
  }, []);

  // Effect to handle Initialization (Deep Dive OR Graph Aware Greeting)
  useEffect(() => {
      if (hasSentInitialRef.current) return;
      hasSentInitialRef.current = true;

      // Case 1: Deep Dive (Context provided from LearningModal)
      if (initialMessage) {
          const userMsg: ChatMessage = {
              role: 'user',
              text: initialMessage,
              timestamp: new Date()
          };
          setMessages(prev => [...prev, userMsg]);
          
          setIsLoading(true);
          const history = messages.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }));

          sendMessageToGemini(initialMessage, history, currentPersona.systemInstruction)
              .then(responseText => {
                  const botMessage: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
                  setMessages(prev => [...prev, botMessage]);
              })
              .catch(e => console.error(e))
              .finally(() => setIsLoading(false));
      
      // Case 2: Graph Aware Greeting (Proactive Tutor)
      } else {
          // Check if we have stats to use
          if (stats && (stats.weak > 0 || stats.due > 0) && userNodes && userNodes.length > 0) {
              setIsLoading(true);
              const weakNodes = userNodes.filter(n => n.type !== 'Mixed').slice(0, 3).map(n => n.title).join(", ");
              const prompt = `
                I am a user of LearnAI. I have ${stats.due} cards due for review and ${stats.weak} items marked as weak. 
                Some of my topics are: ${weakNodes}.
                Greet me as a ${currentPersona.name}, acknowledge my progress, and suggest we review the weak topics. Be brief and encouraging.
              `;
              
              sendMessageToGemini(prompt, [], currentPersona.systemInstruction)
                .then(responseText => {
                    setMessages([{ role: 'model', text: responseText, timestamp: new Date() }]);
                })
                .catch(() => {
                    setMessages([{ 
                        role: 'model', 
                        text: 'Chào mừng trở lại! Tôi thấy bạn có một số bài cần ôn tập. Bạn muốn bắt đầu ngay không?', 
                        timestamp: new Date() 
                    }]);
                })
                .finally(() => setIsLoading(false));
          } else {
              setMessages([{
                  role: 'model',
                  text: `Chào mừng! Tôi là ${currentPersona.name}. ${currentPersona.description} Bạn muốn bắt đầu từ đâu?`,
                  timestamp: new Date()
              }]);
          }
      }
  }, [initialMessage, stats, userNodes, currentPersona]);

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
      const responseText = await sendMessageToGemini(input, history, currentPersona.systemInstruction);
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

  const handleSaveSession = () => {
      if (messages.length < 2) {
          alert("Cuộc trò chuyện quá ngắn để lưu!");
          return;
      }
      const title = messages[1]?.text.substring(0, 30) + "..." || "Phiên học mới";
      const newSession: SavedChatSession = {
          id: Date.now().toString(),
          title: title,
          date: new Date().toLocaleDateString(),
          messages: messages,
          personaId: currentPersona.id
      };
      
      const updatedSessions = [newSession, ...savedSessions];
      setSavedSessions(updatedSessions);
      localStorage.setItem('learnai_chat_history', JSON.stringify(updatedSessions));
      alert("Đã lưu cuộc trò chuyện!");
  };

  const handleLoadSession = (session: SavedChatSession) => {
      setMessages(session.messages);
      const persona = PERSONAS.find(p => p.id === session.personaId) || PERSONAS[0];
      setCurrentPersona(persona);
      setShowHistoryModal(false);
  };

  const handleDeleteSession = (id: string) => {
      const updatedSessions = savedSessions.filter(s => s.id !== id);
      setSavedSessions(updatedSessions);
      localStorage.setItem('learnai_chat_history', JSON.stringify(updatedSessions));
  };

  const handlePersonaSelect = (persona: TutorPersona) => {
      setCurrentPersona(persona);
      setShowPersonaModal(false);
      // Reset chat and send greeting with new persona
      setMessages([]);
      hasSentInitialRef.current = false; // Allow effect to re-run
      // Trigger re-greeting logic via effect or manual
      setIsLoading(true);
      setTimeout(() => {
          setMessages([{
              role: 'model',
              text: `Giao diện ${persona.name} đã kích hoạt! ${persona.description} Chúng ta bắt đầu nhé?`,
              timestamp: new Date()
          }]);
          setIsLoading(false);
      }, 500);
  };

  // --- Feature: Debate Arena (Challenge Mode) ---
  const handleStartChallenge = () => {
      if (!userNodes || userNodes.length === 0) {
          alert("Bạn cần có ít nhất một nốt tri thức để bắt đầu Thách đấu!");
          return;
      }

      setIsChallengeMode(true);
      
      // Find a topic to debate (prefer 'mastered' or 'future', fallback to random)
      const topics = userNodes.filter(n => n.type !== 'Mixed');
      const topic = topics[Math.floor(Math.random() * topics.length)];
      
      // Switch persona to Debater
      const debatePersona = PERSONAS.find(p => p.id === 'debater') || PERSONAS[0];
      setCurrentPersona(debatePersona);
      
      // Seed the conversation
      setMessages([]);
      setIsLoading(true);
      
      const prompt = `
        I want to debate about the topic: "${topic.title}".
        I claim I know this topic well.
        Start by asking me a tough, provocative question or making a counter-intuitive statement about "${topic.title}" to challenge my understanding.
      `;

      sendMessageToGemini(prompt, [], debatePersona.systemInstruction)
        .then(responseText => {
            setMessages([{ role: 'model', text: responseText, timestamp: new Date() }]);
        })
        .finally(() => setIsLoading(false));
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
    <div className={`flex min-h-screen w-full flex-col font-display relative ${isChallengeMode ? 'bg-[#1a0505]' : 'bg-ink-blue-dark'} text-text-silver transition-colors duration-500`}>
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

      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between whitespace-nowrap border-b border-solid border-white/10 bg-opacity-80 px-4 py-3 shadow-[0_4px_30px_rgba(173,216,230,0.1)] backdrop-blur-xl sm:px-6 lg:px-8 transition-colors">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
                <span className="material-symbols-outlined animate-sparkle text-3xl text-silver-sparkle text-glow-silver">sailing</span>
                <span className="animate-sparkle text-2xl font-bold tracking-wide text-silver-sparkle text-glow-silver">LearnAI</span>
            </div>
            <nav className="ml-6 hidden items-center gap-6 md:flex">
                <a className="text-base font-medium text-text-muted-silver transition-colors hover:text-silver-sparkle hover:drop-shadow-[0_0_8px_var(--silver-sparkle)]" href="#">Tính năng</a>
                <a onClick={(e) => { e.preventDefault(); onShowAbout(); }} className="text-base font-medium text-text-muted-silver transition-colors hover:text-silver-sparkle hover:drop-shadow-[0_0_8px_var(--silver-sparkle)] cursor-pointer" href="#">Giới thiệu</a>
            </nav>
        </div>
        <div className="flex items-center gap-4">
            <button onClick={() => setShowPersonaModal(true)} className="flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium hover:bg-white/10 transition-all">
                <span className={`material-symbols-outlined ${currentPersona.color}`}>{currentPersona.icon}</span>
                <span className="hidden sm:inline">{currentPersona.name}</span>
            </button>
            <button onClick={() => setShowHistoryModal(true)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
                <span className="material-symbols-outlined text-silver-sparkle">history</span>
            </button>
            <button 
                onClick={onShowAccount}
                className="flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full px-4 text-base font-medium leading-normal text-silver-sparkle transition-all hover:bg-white/10 hover:shadow-[0_0_12px_var(--glow-color)]"
            >
                <span className="material-symbols-outlined text-xl">person</span>
                <span className="hidden sm:inline truncate">Tài khoản</span>
            </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-grow">
        <div className={`relative flex min-h-[calc(100vh-64px)] flex-col overflow-hidden bg-gradient-to-b ${isChallengeMode ? 'from-[#2d0a0a] to-[#4a0e0e]' : 'from-ink-blue-dark to-emerald-deep'} transition-colors duration-1000`}>
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

                <div className={`flex h-0 flex-1 flex-col overflow-hidden rounded-xl backdrop-blur-sm border ${isChallengeMode ? 'bg-red-950/20 border-red-500/20' : 'bg-black/20 border-white/5'} relative transition-colors duration-500`}>
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'items-start'} gap-4`}>
                                {msg.role === 'model' && (
                                    <div className={`animate-gentle-bob mt-1 h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 ${isChallengeMode ? 'border-red-500 shadow-red-500/50' : 'border-amber-glow shadow-amber-glow/50'} shadow-[0_0_20px]`}>
                                        <img alt="AI Socratic Tutor Avatar" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzBziidarPdbfcDaUAFRuu07-wOY7iyD8ZgNiDDT0Vwg_JMAv0e4i03OezBnPi7s6CgFrS5KzzBAU0djMmfh4mNaeiKwpx_I001Rx2gUZcC5SS_3gc6QmepK9vTBmjp-RSB_6mIKUKKHfkSLOXAkgplGFKxOIIMFWxYYWHzbBzHHTmULNkl8u9qWhA7_V_sfqGeNcSkMfPwyL14O8IDeqh_mEnhhmxA7nTvze9zR_PqWIOaQ8ORAjk0yENVSRNAzTOvm5irIEp8ojp"/>
                                    </div>
                                )}
                                
                                <div className={`flex max-w-2xl flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} gap-2`}>
                                    <p className={`text-base font-bold ${msg.role === 'model' ? `drop-shadow-sm ${currentPersona.color}` : 'text-gray-100 text-glow-silver'}`}>
                                        {msg.role === 'model' ? currentPersona.name : 'Bạn'}
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
                                <div className={`animate-gentle-bob mt-1 h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 ${isChallengeMode ? 'border-red-500' : 'border-amber-glow'} shadow-[0_0_20px]`}>
                                    <img alt="AI Socratic Tutor Avatar" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzBziidarPdbfcDaUAFRuu07-wOY7iyD8ZgNiDDT0Vwg_JMAv0e4i03OezBnPi7s6CgFrS5KzzBAU0djMmfh4mNaeiKwpx_I001Rx2gUZcC5SS_3gc6QmepK9vTBmjp-RSB_6mIKUKKHfkSLOXAkgplGFKxOIIMFWxYYWHzbBzHHTmULNkl8u9qWhA7_V_sfqGeNcSkMfPwyL14O8IDeqh_mEnhhmxA7nTvze9zR_PqWIOaQ8ORAjk0yENVSRNAzTOvm5irIEp8ojp"/>
                                </div>
                                <div className="flex flex-col items-start gap-2">
                                    <p className="text-base font-bold text-white drop-shadow-sm">{currentPersona.name}</p>
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
                                className={`w-full rounded-full border-2 border-transparent bg-slate-900/80 py-4 pl-6 pr-16 text-base text-white placeholder-white/50 shadow-[0_0_15px_rgba(173,216,230,0.3)] ring-1 ring-white/20 transition-all focus:outline-none focus:ring-2 focus:shadow-[0_0_30px] ${isChallengeMode ? 'focus:border-red-500 focus:ring-red-500 focus:shadow-red-500/50' : 'focus:border-amber-glow focus:ring-amber-glow focus:shadow-amber-glow/70'}`} 
                                placeholder="Nhập câu trả lời của bạn..." 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                disabled={isLoading}
                            />
                            <button 
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className={`absolute inset-y-0 right-0 flex items-center pr-4 transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${isChallengeMode ? 'text-red-500' : 'text-amber-glow'}`} 
                                style={{ textShadow: `0 0 10px ${isChallengeMode ? 'red' : 'var(--amber-glow)'}` }}
                            >
                                <span className="material-symbols-outlined text-3xl">send</span>
                            </button>
                        </div>
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                            <button onClick={handleSaveSession} className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-black/30 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                                <span className="material-symbols-outlined text-xl">save</span>Lưu
                            </button>
                            <button onClick={() => setShowHistoryModal(true)} className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-black/30 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                                <span className="material-symbols-outlined text-xl">history</span>Lịch sử
                            </button>
                            <button onClick={() => setShowPersonaModal(true)} className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-black/30 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                                <span className="material-symbols-outlined text-xl">groups</span>Chọn gia sư
                            </button>
                            {!isChallengeMode && (
                                <button onClick={handleStartChallenge} className="flex items-center gap-2 rounded-full border border-red-500/50 bg-red-600/20 px-4 py-2 text-sm font-bold text-red-200 shadow-lg shadow-red-500/20 backdrop-blur-sm transition-all duration-300 hover:bg-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]">
                                    <span className="material-symbols-outlined text-xl">swords</span>Thách đấu
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>

      {/* History Modal */}
      {showHistoryModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.3s]">
              <div className="bg-[#0f172a] border border-white/20 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2"><span className="material-symbols-outlined">history</span> Lịch sử trò chuyện</h3>
                      <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-white"><span className="material-symbols-outlined">close</span></button>
                  </div>
                  <div className="p-4 overflow-y-auto flex-1 space-y-3">
                      {savedSessions.length === 0 ? (
                          <p className="text-slate-400 text-center py-8">Chưa có cuộc trò chuyện nào được lưu.</p>
                      ) : (
                          savedSessions.map(session => (
                              <div key={session.id} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex justify-between items-center group">
                                  <div className="flex-1 cursor-pointer" onClick={() => handleLoadSession(session)}>
                                      <h4 className="text-white font-bold truncate">{session.title}</h4>
                                      <p className="text-xs text-slate-400">{session.date} • {session.messages.length} tin nhắn</p>
                                  </div>
                                  <button onClick={() => handleDeleteSession(session.id)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                                      <span className="material-symbols-outlined text-lg">delete</span>
                                  </button>
                              </div>
                          ))
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Persona Modal */}
      {showPersonaModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.3s]">
              <div className="bg-[#0f172a] border border-white/20 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2"><span className="material-symbols-outlined text-yellow-400">school</span> Chọn Gia Sư Của Bạn</h3>
                      <button onClick={() => setShowPersonaModal(false)} className="text-slate-400 hover:text-white"><span className="material-symbols-outlined">close</span></button>
                  </div>
                  <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {PERSONAS.map(persona => (
                          <button 
                            key={persona.id}
                            onClick={() => handlePersonaSelect(persona)}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-3 hover:scale-[1.02] ${
                                currentPersona.id === persona.id 
                                ? 'bg-white/10 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
                                : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                            }`}
                          >
                              <div className={`p-3 rounded-full bg-black/30 ${persona.color}`}>
                                  <span className="material-symbols-outlined text-3xl">{persona.icon}</span>
                              </div>
                              <div>
                                  <h4 className={`text-lg font-bold ${persona.color}`}>{persona.name}</h4>
                                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{persona.description}</p>
                              </div>
                              {currentPersona.id === persona.id && (
                                  <span className="text-xs bg-amber-400 text-black px-2 py-0.5 rounded-full font-bold mt-2">Đang chọn</span>
                              )}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}

      <footer className="border-t border-white/10 bg-gradient-to-t from-[#010712] to-transparent px-4 py-6 shadow-[0_-4px_30px_rgba(173,216,230,0.1)] backdrop-blur-xl sm:px-6 lg:px-8">
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
