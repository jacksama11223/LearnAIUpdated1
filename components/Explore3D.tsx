
import React from 'react';

interface Explore3DProps {
    onBack: () => void;
    onShowAbout: () => void;
    onLogout: () => void;
    onShowFAQ: () => void;
    onShowAccount: () => void;
}

const Explore3D: React.FC<Explore3DProps> = ({ onBack, onShowAbout, onLogout, onShowFAQ, onShowAccount }) => {
    return (
        <div className="bg-glow-grid-bg font-display text-text-dark min-h-screen flex flex-col">
            <style>{`
                .material-symbols-outlined {
                    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                }
                .grid-bg {
                    background-color: #02041a;
                    background-image:
                        linear-gradient(rgba(34, 211, 238, 0.2), transparent 1px),
                        linear-gradient(90deg, rgba(34, 211, 238, 0.2), transparent 1px),
                        linear-gradient(rgba(240, 225, 74, 0.05), transparent 1px),
                        linear-gradient(90deg, rgba(240, 225, 74, 0.05), transparent 1px);
                    background-size: 100px 100px, 100px 100px, 500px 500px, 500px 500px;
                    background-position: -1px -1px, -1px -1px, -1px -1px, -1px -1px;
                    animation: gridPulse 10s ease-in-out infinite;
                }
                .crystal-node {
                    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: grab;
                }
                .crystal-node:hover {
                    transform: scale(1.15) translateZ(30px);
                    filter: brightness(1.3);
                }
                .animate-stream {
                    stroke-dasharray: 5 10;
                    animation: stream 5s linear infinite;
                }
            `}</style>
            <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
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
                <main className="flex-grow flex flex-col">
                    <section className="relative flex-grow w-full flex items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8">
                        <div className="absolute inset-0 grid-bg z-0"></div>
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute left-[10%] top-[20%] h-1 w-1 rounded-full bg-neon-yellow animate-ping opacity-75" style={{ animationDelay: '1s' }}></div>
                            <div className="absolute left-[80%] top-[30%] h-1 w-1 rounded-full bg-neon-cyan animate-ping opacity-75" style={{ animationDelay: '3s' }}></div>
                            <div className="absolute left-[50%] top-[70%] h-1.5 w-1.5 rounded-full bg-neon-yellow animate-ping opacity-75" style={{ animationDelay: '2s' }}></div>
                            <div className="absolute left-[25%] top-[85%] h-1 w-1 rounded-full bg-neon-cyan animate-ping opacity-75"></div>
                            <div className="absolute left-[90%] top-[90%] h-1 w-1 rounded-full bg-neon-yellow animate-ping opacity-75" style={{ animationDelay: '4s' }}></div>
                            <div className="absolute rounded-full bg-white/10 animate-bubble w-3 h-3 left-[15%] bottom-0" style={{ animationDuration: '9s', animationDelay: '1s' }}></div>
                            <div className="absolute rounded-full bg-white/10 animate-bubble w-5 h-5 left-[35%] bottom-0" style={{ animationDuration: '7s', animationDelay: '3s' }}></div>
                            <div className="absolute rounded-full bg-white/10 animate-bubble w-2 h-2 left-[65%] bottom-0" style={{ animationDuration: '11s', animationDelay: '0.5s' }}></div>
                            <div className="absolute rounded-full bg-white/10 animate-bubble w-4 h-4 left-[80%] bottom-0" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
                        </div>
                        <button 
                            onClick={onBack}
                            className="absolute top-6 left-6 z-30 flex items-center gap-2 px-4 py-2 bg-black/30 rounded-full shadow-md hover:bg-black/40 transition-all duration-300 backdrop-blur-sm border border-white/20 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24" }}>arrow_back</span>
                            <span className="text-sm font-bold text-white hidden sm:inline">Quay về</span>
                        </button>
                        <div className="absolute w-full h-full z-10" style={{ perspective: '1200px' }}>
                            <div className="w-full h-full" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(15deg) rotateY(-25deg) scale(0.9)' }}>
                                <svg className="absolute inset-0 w-full h-full opacity-70" fill="none" preserveAspectRatio="none" viewBox="-50 -50 200 200" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="stream-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
                                            <stop offset="0%" stopColor="#f0e14a" stopOpacity="1"></stop>
                                            <stop offset="50%" stopColor="#22d3ee" stopOpacity="1"></stop>
                                            <stop offset="100%" stopColor="#f0e14a" stopOpacity="1"></stop>
                                        </linearGradient>
                                        <filter height="400%" id="glow-effect" width="400%" x="-150%" y="-150%">
                                            <feGaussianBlur result="coloredBlur" stdDeviation="3"></feGaussianBlur>
                                            <feMerge>
                                                <feMergeNode in="coloredBlur"></feMergeNode>
                                                <feMergeNode in="SourceGraphic"></feMergeNode>
                                            </feMerge>
                                        </filter>
                                    </defs>
                                    <g filter="url(#glow-effect)">
                                        <path className="animate-stream" d="M 22 50 C 40 50, 40 30, 60 30" stroke="url(#stream-gradient)" strokeLinecap="round" strokeWidth="1.5"></path>
                                        <path className="animate-stream" d="M 22 50 C 40 50, 40 70, 60 70" stroke="url(#stream-gradient)" strokeLinecap="round" strokeWidth="1.5" style={{ animationDelay: '-1.5s' }}></path>
                                        <path className="animate-stream" d="M 60 30 C 80 30, 80 50, 98 50" stroke="url(#stream-gradient)" strokeLinecap="round" strokeWidth="1.5" style={{ animationDelay: '-2.5s' }}></path>
                                        <path className="animate-stream" d="M 60 70 C 80 70, 80 50, 98 50" stroke="url(#stream-gradient)" strokeLinecap="round" strokeWidth="1.5" style={{ animationDelay: '-0.5s' }}></path>
                                        <path className="animate-stream" d="M 60 30 C 50 10, 50 -10, 70 0" stroke="url(#stream-gradient)" strokeLinecap="round" strokeWidth="1.5" style={{ animationDelay: '-3s' }}></path>
                                        <path className="animate-stream" d="M 70 0 C 90 10, 90 30, 98 50" stroke="url(#stream-gradient)" strokeLinecap="round" strokeWidth="1.5" style={{ animationDelay: '-4s' }}></path>
                                    </g>
                                </svg>
                                <div className="crystal-node absolute animate-float3d" style={{ top: '50%', left: '15%', transform: 'translate3d(-50%, -50%, 50px)' }}>
                                    <div className="relative px-6 py-4 text-center font-bold text-white bg-crystal-purple/80 rounded-3xl shadow-glow-purple-3d border-2 border-white/40 backdrop-blur-sm">
                                        Unit 1
                                        <div className="absolute -inset-1 bg-crystal-purple/30 rounded-3xl blur-md -z-10"></div>
                                    </div>
                                </div>
                                <div className="crystal-node absolute animate-float3d" style={{ top: '30%', left: '55%', transform: 'translate3d(-50%, -50%, -30px)', animationDelay: '-2s' }}>
                                    <div className="relative px-6 py-4 text-center font-bold text-white bg-crystal-gold/80 rounded-3xl shadow-glow-gold-3d border-2 border-white/40 backdrop-blur-sm">
                                        Skill A
                                        <div className="absolute -inset-1 bg-crystal-gold/30 rounded-3xl blur-md -z-10"></div>
                                    </div>
                                </div>
                                <div className="crystal-node absolute animate-float3d" style={{ top: '70%', left: '55%', transform: 'translate3d(-50%, -50%, 20px)', animationDelay: '-4s' }}>
                                    <div className="relative px-6 py-4 text-center font-bold text-white bg-crystal-gold/80 rounded-3xl shadow-glow-gold-3d border-2 border-white/40 backdrop-blur-sm">
                                        Skill B
                                        <div className="absolute -inset-1 bg-crystal-gold/30 rounded-3xl blur-md -z-10"></div>
                                    </div>
                                </div>
                                <div className="crystal-node absolute animate-float3d" style={{ top: '50%', left: '95%', transform: 'translate3d(-50%, -50%, -60px)', animationDelay: '-6s' }}>
                                    <div className="relative px-6 py-4 text-center font-bold text-white bg-crystal-blue/80 rounded-3xl shadow-glow-blue-3d border-2 border-white/40 backdrop-blur-sm">
                                        Unit 2
                                        <div className="absolute -inset-1 bg-crystal-blue/30 rounded-3xl blur-md -z-10"></div>
                                    </div>
                                </div>
                                <div className="crystal-node absolute animate-float3d" style={{ top: '0%', left: '65%', transform: 'translate3d(-50%, -50%, -100px)', animationDelay: '-1s' }}>
                                    <div className="relative px-6 py-4 text-center font-bold text-white bg-crystal-blue/80 rounded-3xl shadow-glow-blue-3d border-2 border-white/40 backdrop-blur-sm">
                                        Unit 3
                                        <div className="absolute -inset-1 bg-crystal-blue/30 rounded-3xl blur-md -z-10"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-6 right-6 z-30 flex flex-col items-start gap-3 p-3 bg-black/30 rounded-2xl border border-white/20 backdrop-blur-md shadow-lg">
                            <button className="flex w-full items-center justify-start gap-3 px-3 py-2 text-sky-blue hover:bg-sky-blue/20 rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>rotate_right</span>
                                <span className="text-sm font-medium">Xoay tự động</span>
                            </button>
                            <button className="flex w-full items-center justify-start gap-3 px-3 py-2 text-sky-blue hover:bg-sky-blue/20 rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>lock</span>
                                <span className="text-sm font-medium">Khóa trục</span>
                            </button>
                            <button className="flex w-full items-center justify-start gap-3 px-3 py-2 text-sky-blue hover:bg-sky-blue/20 rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>camera_alt</span>
                                <span className="text-sm font-medium">Đổi góc nhìn</span>
                            </button>
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
        </div>
    );
};

export default Explore3D;
