
import React from 'react';

interface ExploreTopicProps {
    onBack: () => void;
    onShowAbout: () => void;
    onLogout: () => void;
    onShowFAQ: () => void;
    onShowAccount: () => void;
}

const ExploreTopic: React.FC<ExploreTopicProps> = ({ onBack, onShowAbout, onLogout, onShowFAQ, onShowAccount }) => {
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
                .crystal-button {
                    transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;
                    cursor: pointer;
                }
                .crystal-button:hover {
                    transform: scale(1.05) rotate(2deg);
                    filter: brightness(1.2);
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
                        <div className="relative z-10 w-full max-w-5xl bg-black/30 backdrop-blur-lg border border-sky-blue/30 rounded-2xl shadow-lg p-8">
                            <div className="text-center mb-6">
                                <h1 className="text-3xl font-bold text-white tracking-wider">Chọn Chủ Đề</h1>
                                <p className="text-text-muted-dark mt-2">Khám phá kiến thức theo từng lĩnh vực bạn quan tâm</p>
                            </div>
                            <div className="relative mb-6">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted-dark pointer-events-none" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>search</span>
                                <input className="w-full h-12 bg-black/40 border border-sky-blue/40 rounded-full pl-12 pr-4 text-white placeholder:text-text-muted-dark/70 focus:ring-2 focus:ring-neon-cyan/80 focus:border-neon-cyan transition duration-300" placeholder="Tìm kiếm chủ đề..." type="search"/>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="crystal-button flex flex-col items-center p-6 bg-crystal-purple/20 border border-crystal-purple/50 rounded-xl shadow-glow-purple backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-crystal-purple text-5xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48" }}>science</span>
                                    <span className="mt-3 font-semibold text-white text-center">Khoa học</span>
                                </div>
                                <div className="crystal-button flex flex-col items-center p-6 bg-crystal-blue/20 border border-crystal-blue/50 rounded-xl shadow-glow-blue backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-crystal-blue text-5xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48" }}>history_edu</span>
                                    <span className="mt-3 font-semibold text-white text-center">Lịch sử</span>
                                </div>
                                <div className="crystal-button flex flex-col items-center p-6 bg-crystal-gold/20 border border-crystal-gold/50 rounded-xl shadow-glow-gold backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-crystal-gold text-5xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48" }}>brush</span>
                                    <span className="mt-3 font-semibold text-white text-center">Nghệ thuật</span>
                                </div>
                                <div className="crystal-button flex flex-col items-center p-6 bg-neon-cyan/20 border border-neon-cyan/50 rounded-xl shadow-glow-neon backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-neon-cyan text-5xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48" }}>music_note</span>
                                    <span className="mt-3 font-semibold text-white text-center">Âm nhạc</span>
                                </div>
                                <div className="crystal-button flex flex-col items-center p-6 bg-crystal-blue/20 border border-crystal-blue/50 rounded-xl shadow-glow-blue backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-crystal-blue text-5xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48" }}>calculate</span>
                                    <span className="mt-3 font-semibold text-white text-center">Toán học</span>
                                </div>
                                <div className="crystal-button flex flex-col items-center p-6 bg-crystal-gold/20 border border-crystal-gold/50 rounded-xl shadow-glow-gold backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-crystal-gold text-5xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48" }}>g_translate</span>
                                    <span className="mt-3 font-semibold text-white text-center">Ngôn ngữ</span>
                                </div>
                                <div className="crystal-button flex flex-col items-center p-6 bg-neon-cyan/20 border border-neon-cyan/50 rounded-xl shadow-glow-neon backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-neon-cyan text-5xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48" }}>code</span>
                                    <span className="mt-3 font-semibold text-white text-center">Lập trình</span>
                                </div>
                                <div className="crystal-button flex flex-col items-center p-6 bg-crystal-purple/20 border border-crystal-purple/50 rounded-xl shadow-glow-purple backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-crystal-purple text-5xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48" }}>psychology</span>
                                    <span className="mt-3 font-semibold text-white text-center">Tâm lý học</span>
                                </div>
                                <div className="crystal-button flex flex-col items-center p-6 bg-crystal-gold/20 border border-crystal-gold/50 rounded-xl shadow-glow-gold backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-crystal-gold text-5xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48" }}>public</span>
                                    <span className="mt-3 font-semibold text-white text-center">Địa lý</span>
                                </div>
                                <div className="crystal-button flex flex-col items-center p-6 bg-crystal-blue/20 border border-crystal-blue/50 rounded-xl shadow-glow-blue backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-crystal-blue text-5xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48" }}>rocket_launch</span>
                                    <span className="mt-3 font-semibold text-white text-center">Vũ trụ học</span>
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

export default ExploreTopic;
