
import React from 'react';

interface ExploreSearchProps {
    onBack: () => void;
    onShowAbout: () => void;
    onLogout: () => void;
    onShowFAQ: () => void;
    onShowAccount: () => void;
}

const ExploreSearch: React.FC<ExploreSearchProps> = ({ onBack, onShowAbout, onLogout, onShowFAQ, onShowAccount }) => {
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
                    background-size: 70px 70px, 70px 70px, 350px 350px, 350px 350px;
                    background-position: -1px -1px, -1px -1px, -1px -1px, -1px -1px;
                    animation: gridPulse 10s ease-in-out infinite;
                }
                .crystal-node {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    cursor: pointer;
                }
                .crystal-node:hover {
                    transform: scale(1.1);
                    filter: brightness(1.2);
                }
                .search-input::placeholder {
                    color: rgba(160, 210, 235, 0.6);
                }
            `}</style>
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
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
                    <section className="relative min-h-[calc(100vh-160px)] w-full flex flex-col items-center justify-start pt-16 sm:pt-20 lg:pt-24 overflow-hidden p-4 sm:p-6 lg:p-8">
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
                        <div className="relative w-full max-w-3xl z-10 flex flex-col items-center gap-12">
                            <div className="relative w-full">
                                <input className="search-input w-full h-16 pl-6 pr-20 bg-sky-blue/10 border-2 border-neon-yellow/50 rounded-full text-lg text-text-dark placeholder-text-muted-dark/60 focus:ring-2 focus:ring-neon-yellow focus:border-neon-yellow transition-all duration-300 backdrop-blur-sm shadow-glow-yellow" placeholder="Quét mạng lưới tri thức..." type="search"/>
                                <button className="absolute top-1/2 right-3 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-neon-yellow rounded-full text-glow-grid-bg hover:bg-yellow-300 transition-colors animate-sonarPulse">
                                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>search</span>
                                </button>
                            </div>
                            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="crystal-node">
                                    <div className="px-5 py-3 h-full text-center text-sm font-bold text-white bg-crystal-purple/80 rounded-2xl shadow-glow-purple border border-white/30 backdrop-blur-sm flex items-center justify-center">Kết quả 1: Unit C</div>
                                </div>
                                <div className="crystal-node">
                                    <div className="px-5 py-3 h-full text-center text-sm font-bold text-white bg-crystal-blue/80 rounded-2xl shadow-glow-blue border border-white/30 backdrop-blur-sm flex items-center justify-center">Kết quả 2: Skill D</div>
                                </div>
                                <div className="crystal-node">
                                    <div className="px-5 py-3 h-full text-center text-sm font-bold text-white bg-crystal-gold/80 rounded-2xl shadow-glow-gold border border-white/30 backdrop-blur-sm flex items-center justify-center">Kết quả 3: Topic E</div>
                                </div>
                                <div className="crystal-node">
                                    <div className="px-5 py-3 h-full text-center text-sm font-bold text-white bg-crystal-gold/80 rounded-2xl shadow-glow-gold border border-white/30 backdrop-blur-sm flex items-center justify-center">Kết quả 4: Skill F</div>
                                </div>
                                <div className="crystal-node">
                                    <div className="px-5 py-3 h-full text-center text-sm font-bold text-white bg-crystal-purple/80 rounded-2xl shadow-glow-purple border border-white/30 backdrop-blur-sm flex items-center justify-center">Kết quả 5: Unit G</div>
                                </div>
                                <div className="crystal-node">
                                    <div className="px-5 py-3 h-full text-center text-sm font-bold text-white bg-crystal-blue/80 rounded-2xl shadow-glow-blue border border-white/30 backdrop-blur-sm flex items-center justify-center">Kết quả 6: Unit H</div>
                                </div>
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
        </div>
    );
};

export default ExploreSearch;
