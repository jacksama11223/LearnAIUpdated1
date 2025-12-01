
import React from 'react';
import { KnowledgeNode } from '../types';

interface KnowledgeGraphProps {
    onBack: () => void;
    onShowAbout: () => void;
    onExplore?: () => void;
    onLogout: () => void;
    onShowFAQ: () => void;
    onShowAccount: () => void;
    userNodes?: KnowledgeNode[];
    onNodeClick?: (node: KnowledgeNode) => void;
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ onBack, onShowAbout, onExplore, onLogout, onShowFAQ, onShowAccount, userNodes = [], onNodeClick }) => {
    
    // Mapping node types to colors/icons for visualization
    const getNodeStyle = (type: string) => {
        switch(type) {
            case 'Flashcard': return { bg: 'bg-map-blue/80', shadow: 'shadow-glow-blue', border: 'border-white/30', innerGlow: 'shadow-inner-glow-blue' };
            case 'Quiz': return { bg: 'bg-map-purple/80', shadow: 'shadow-glow-purple', border: 'border-white/30', innerGlow: 'shadow-inner-glow-purple' };
            case 'Fill-in-the-blanks': return { bg: 'bg-jade-green/80', shadow: 'shadow-glow-green', border: 'border-white/30', innerGlow: 'shadow-inner-glow-green' };
            case 'Spot the Error': return { bg: 'bg-coral-orange/80', shadow: 'shadow-glow-orange', border: 'border-white/30', innerGlow: 'shadow-inner-glow-orange' };
            case 'Case Study': return { bg: 'bg-warm-gold/80', shadow: 'shadow-glow-gold', border: 'border-white/30', innerGlow: 'shadow-inner-glow-gold' };
            default: return { bg: 'bg-map-blue/80', shadow: 'shadow-glow-blue', border: 'border-white/30', innerGlow: 'shadow-inner-glow-blue' };
        }
    };

    return (
        <div className="bg-deep-sea-start font-display text-text-dark min-h-screen flex flex-col">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-sky-blue/20 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-50 bg-deep-sea-start/80 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="text-sky-blue text-3xl">
                        <span className="material-symbols-outlined">sailing</span>
                    </div>
                    <h2 className="text-xl font-bold text-white">LearnAI</h2>
                    <div className="hidden md:flex ml-8 items-center gap-8">
                        <a className="text-sm font-medium hover:text-sky-blue text-text-muted-dark transition-colors" href="#">Tính năng</a>
                        <a onClick={(e) => { e.preventDefault(); onShowAbout(); }} className="text-sm font-medium hover:text-sky-blue text-text-muted-dark transition-colors cursor-pointer" href="#">Giới thiệu</a>
                        <a onClick={(e) => { e.preventDefault(); onShowFAQ(); }} className="text-sm font-medium hover:text-sky-blue text-text-muted-dark transition-colors cursor-pointer" href="#">Hỏi đáp</a>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onShowAccount}
                        className="flex gap-2 cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-sky-blue/10 border border-sky-blue/50 text-sky-blue text-sm font-medium leading-normal hover:bg-sky-blue/20 transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">person</span>
                        <span className="truncate">Tài khoản</span>
                    </button>
                    <button onClick={onLogout} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-sky-blue/20 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-sky-blue/30 transition-colors">
                        <span className="truncate">Đăng xuất</span>
                    </button>
                </div>
            </header>
            <main className="flex-grow">
                <section className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8 deep-sea-gradient-graph min-h-[calc(100vh-160px)] flex flex-col items-center justify-center">
                    <div className="absolute inset-0 light-rays z-0"></div>
                    <button 
                        onClick={onBack}
                        className="absolute top-6 left-6 z-30 flex items-center gap-2 px-4 py-2 bg-black/30 rounded-full shadow-md hover:bg-black/40 transition-all duration-300 backdrop-blur-sm border border-white/20 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24" }}>arrow_back</span>
                        <span className="text-sm font-bold text-white hidden sm:inline">Quay về</span>
                    </button>
                    <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-10 w-full">
                        <div className="text-center">
                            <h1 className="text-4xl font-black leading-tight tracking-tighter md:text-5xl lg:text-6xl text-white drop-shadow-lg">Đại dương Tri thức: Sơ đồ Kiến thức</h1>
                        </div>
                        <div className="w-full relative px-4 mt-8 flex-grow">
                            <div className="relative w-full max-w-4xl mx-auto aspect-[4/3] border border-white/5 bg-white/5 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
                                {/* Base SVG Graph - Static Backbone */}
                                <svg className="absolute w-full h-full inset-0 pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="stream-grad" x1="0%" x2="100%" y1="0%" y2="0%">
                                            <stop offset="0%" stopColor="#FFD700"></stop>
                                            <stop offset="50%" stopColor="#FFCA28"></stop>
                                            <stop offset="100%" stopColor="#FFD700"></stop>
                                        </linearGradient>
                                    </defs>
                                    <path className="drop-shadow-[0_0_3px_#FFD700]" d="M 20% 50% C 30% 50%, 30% 35%, 40% 35%" fill="none" stroke="url(#stream-grad)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2.5"></path>
                                    <path className="drop-shadow-[0_0_3px_#FFD700]" d="M 20% 50% C 30% 50%, 30% 65%, 40% 65%" fill="none" stroke="url(#stream-grad)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2.5"></path>
                                    <path className="drop-shadow-[0_0_3px_#FFD700]" d="M 60% 35% C 70% 35%, 70% 50%, 80% 50%" fill="none" stroke="url(#stream-grad)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2.5"></path>
                                    <path className="drop-shadow-[0_0_3px_#FFD700]" d="M 60% 65% C 70% 65%, 70% 50%, 80% 50%" fill="none" stroke="url(#stream-grad)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2.5"></path>
                                    <path className="drop-shadow-[0_0_3px_#FFD700]" d="M 40% 35% C 45% 35%, 55% 35%, 60% 35%" fill="none" stroke="url(#stream-grad)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2.5"></path>
                                    <path className="drop-shadow-[0_0_3px_#FFD700]" d="M 40% 65% C 45% 65%, 55% 65%, 60% 65%" fill="none" stroke="url(#stream-grad)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="2.5"></path>
                                    <g>
                                        <circle className="animate-sparkle" cx="30%" cy="42%" fill="#FFD700" opacity="0.8" r="2"></circle>
                                        <circle className="animate-sparkle" cx="50%" cy="32%" fill="#FFD700" opacity="0.8" r="2" style={{ animationDelay: '0.5s' }}></circle>
                                        <circle className="animate-sparkle" cx="70%" cy="58%" fill="#FFD700" opacity="0.8" r="1.5" style={{ animationDelay: '1s' }}></circle>
                                        <circle className="animate-sparkle" cx="45%" cy="68%" fill="#FFD700" opacity="0.8" r="1.5" style={{ animationDelay: '1.5s' }}></circle>
                                    </g>
                                </svg>

                                {/* Background ambient bubbles */}
                                <div className="bubble-graph animate-bubble" style={{ left: '25%', top: '55%', width: '5px', height: '5px', animationDuration: '4s' }}></div>
                                <div className="bubble-graph animate-bubble" style={{ left: '50%', top: '40%', width: '8px', height: '8px', animationDuration: '3.5s', animationDelay: '1s' }}></div>
                                <div className="bubble-graph animate-bubble" style={{ left: '75%', top: '60%', width: '6px', height: '6px', animationDuration: '4.5s', animationDelay: '0.5s' }}></div>
                                <div className="bubble-graph animate-bubble" style={{ left: '15%', top: '70%', width: '4px', height: '4px', animationDuration: '5.5s', animationDelay: '2s' }}></div>
                                <div className="bubble-graph animate-bubble" style={{ left: '85%', top: '30%', width: '7px', height: '7px', animationDuration: '4.8s', animationDelay: '1.5s' }}></div>

                                {/* Default Static Nodes */}
                                <div className="absolute animate-subtleBob" style={{ top: '50%', left: '15%', transform: 'translate(-50%, -50%)', animationDuration: '4s' }}>
                                    <div className="px-5 py-3 text-sm font-bold text-white bg-map-purple/80 rounded-2xl shadow-glow-purple border border-white/30 backdrop-blur-sm knowledge-map-node shadow-inner-glow-purple cursor-pointer">Unit 1</div>
                                </div>
                                <div className="absolute animate-subtleBob" style={{ top: '35%', left: '50%', transform: 'translate(-50%, -50%)', animationDuration: '3.5s', animationDelay: '0.5s' }}>
                                    <div className="px-5 py-3 text-sm font-bold text-white bg-map-orange/80 rounded-2xl shadow-glow-orange border border-white/30 backdrop-blur-sm knowledge-map-node shadow-inner-glow-orange cursor-pointer">Skill A</div>
                                </div>
                                <div className="absolute animate-subtleBob" style={{ top: '65%', left: '50%', transform: 'translate(-50%, -50%)', animationDuration: '4.2s', animationDelay: '0.2s' }}>
                                    <div className="px-5 py-3 text-sm font-bold text-white bg-map-orange/80 rounded-2xl shadow-glow-orange border border-white/30 backdrop-blur-sm knowledge-map-node shadow-inner-glow-orange cursor-pointer">Skill B</div>
                                </div>
                                <div className="absolute animate-subtleBob" style={{ top: '50%', left: '85%', transform: 'translate(-50%, -50%)', animationDuration: '3.8s', animationDelay: '0.8s' }}>
                                    <div className="px-5 py-3 text-sm font-bold text-white bg-map-blue/80 rounded-2xl shadow-glow-blue border border-white/30 backdrop-blur-sm knowledge-map-node shadow-inner-glow-blue cursor-pointer">Unit 2</div>
                                </div>

                                {/* Dynamic Generated Nodes */}
                                {userNodes.map((node) => {
                                    const style = getNodeStyle(node.type);
                                    return (
                                        <div 
                                            key={node.id}
                                            onClick={() => onNodeClick && onNodeClick(node)}
                                            className="absolute animate-subtleBob cursor-pointer group"
                                            style={{ 
                                                top: `${node.y}%`, 
                                                left: `${node.x}%`, 
                                                transform: 'translate(-50%, -50%)',
                                                animationDuration: `${3 + Math.random() * 2}s` 
                                            }}
                                        >
                                            <div className={`px-4 py-2 text-sm font-bold text-white ${style.bg} rounded-2xl ${style.shadow} border ${style.border} backdrop-blur-sm knowledge-map-node ${style.innerGlow} flex items-center gap-2 hover:scale-110 transition-transform`}>
                                                <span className="truncate max-w-[100px]">{node.title}</span>
                                                <div className="size-2 rounded-full bg-green-400 animate-pulse" title="New"></div>
                                            </div>
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                                                Click để học: {node.type}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mt-10">
                            <button className="functional-button flex-shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 backdrop-blur-sm border border-white/20">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 600" }}>file_download</span>
                                <span>Nhập nội dung</span>
                            </button>
                            <button 
                                onClick={onExplore}
                                className="functional-button flex-shrink-0 flex items-center justify-center gap-2 w-full sm:w-auto text-nowrap px-6 py-3 bg-warm-gold text-deep-sea-start font-bold rounded-full hover:bg-accent/90 shadow-glow-gold"
                            >
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>explore</span>
                                <span>Khám phá sơ đồ</span>
                            </button>
                            <button className="functional-button flex-shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 backdrop-blur-sm border border-white/20">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 600" }}>file_upload</span>
                                <span>Xuất nội dung</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="px-4 sm:px-6 lg:px-8 py-8 border-t border-sky-blue/20 bg-deep-sea-start/80">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="text-sky-blue text-2xl">
                            <span className="material-symbols-outlined">sailing</span>
                        </div>
                        <h2 className="text-lg font-bold text-white">LearnAI</h2>
                    </div>
                    <div className="flex gap-6 text-sm font-medium text-text-muted-dark">
                        <a className="hover:text-sky-blue transition-colors" href="#">Điều khoản dịch vụ</a>
                        <a className="hover:text-sky-blue transition-colors" href="#">Chính sách bảo mật</a>
                    </div>
                    <p className="text-sm text-text-muted-dark">© 2024 LearnAI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default KnowledgeGraph;
