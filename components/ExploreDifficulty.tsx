
import React from 'react';

interface ExploreDifficultyProps {
    onBack: () => void;
    onShowAbout: () => void;
    onLogout: () => void;
    onShowFAQ: () => void;
    onShowAccount: () => void;
}

const ExploreDifficulty: React.FC<ExploreDifficultyProps> = ({ onBack, onShowAbout, onLogout, onShowFAQ, onShowAccount }) => {
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
                .level-button {
                    transition: transform 0.3s ease, filter 0.3s ease, box-shadow 0.3s ease;
                    cursor: pointer;
                }
                .level-button:hover {
                    transform: translateY(-8px);
                    filter: brightness(1.3);
                }
                .range-lg {
                    height: 8px;
                    border-radius: 4px;
                }
                /* Custom Range Slider Styling */
                input[type=range] {
                    -webkit-appearance: none;
                    background: transparent;
                }
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background: #f0e14a;
                    cursor: pointer;
                    margin-top: -8px;
                    box-shadow: 0 0 10px #f0e14a;
                }
                input[type=range]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 8px;
                    cursor: pointer;
                    background: rgba(160, 210, 235, 0.2);
                    border-radius: 4px;
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
                    <section className="relative min-h-[calc(100vh-160px)] w-full flex flex-col items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8">
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
                        <div className="relative z-10 w-full max-w-4xl bg-black/30 backdrop-blur-lg border border-sky-blue/30 rounded-2xl shadow-lg p-8">
                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-bold text-white tracking-wider">Chọn Mức Độ Thử Thách</h1>
                                <p className="text-text-muted-dark mt-2">Điều chỉnh độ khó để cá nhân hóa lộ trình học tập của bạn</p>
                            </div>
                            <div className="flex items-end justify-center space-x-4 sm:space-x-8 h-64">
                                <div className="level-button flex flex-col items-center group w-1/4">
                                    <div className="w-full h-24 bg-level-easy/30 border border-level-easy/70 rounded-lg shadow-glow-easy flex items-center justify-center animate-barPulse" style={{ animationDelay: '0s' }}>
                                        <span className="material-symbols-outlined text-level-easy text-5xl opacity-80 group-hover:opacity-100 transition-opacity">spa</span>
                                    </div>
                                    <span className="mt-4 font-semibold text-white tracking-wide text-center">Dễ</span>
                                </div>
                                <div className="level-button flex flex-col items-center group w-1/4">
                                    <div className="w-full h-32 bg-level-medium/30 border border-level-medium/70 rounded-lg shadow-glow-medium flex items-center justify-center animate-barPulse" style={{ animationDelay: '0.2s' }}>
                                        <span className="material-symbols-outlined text-level-medium text-5xl opacity-80 group-hover:opacity-100 transition-opacity">trending_up</span>
                                    </div>
                                    <span className="mt-4 font-semibold text-white tracking-wide text-center">Trung bình</span>
                                </div>
                                <div className="level-button flex flex-col items-center group w-1/4">
                                    <div className="w-full h-40 bg-level-hard/30 border border-level-hard/70 rounded-lg shadow-glow-hard flex items-center justify-center animate-barPulse" style={{ animationDelay: '0.4s' }}>
                                        <span className="material-symbols-outlined text-level-hard text-5xl opacity-80 group-hover:opacity-100 transition-opacity">local_fire_department</span>
                                    </div>
                                    <span className="mt-4 font-semibold text-white tracking-wide text-center">Khó</span>
                                </div>
                                <div className="level-button flex flex-col items-center group w-1/4">
                                    <div className="w-full h-48 bg-level-advanced/30 border border-level-advanced/70 rounded-lg shadow-glow-advanced flex items-center justify-center animate-barPulse" style={{ animationDelay: '0.6s' }}>
                                        <span className="material-symbols-outlined text-level-advanced text-5xl opacity-80 group-hover:opacity-100 transition-opacity">rocket_launch</span>
                                    </div>
                                    <span className="mt-4 font-semibold text-white tracking-wide text-center">Nâng cao</span>
                                </div>
                            </div>
                            <div className="mt-10">
                                <label className="sr-only" htmlFor="difficulty-range">Difficulty</label>
                                <input className="w-full h-2 bg-sky-blue/20 rounded-lg appearance-none cursor-pointer range-lg accent-neon-yellow" id="difficulty-range" max="4" min="1" type="range" defaultValue="2"/>
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

export default ExploreDifficulty;
