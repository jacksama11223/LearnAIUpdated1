
import React from 'react';

interface VideoCourseProps {
    onBack: () => void;
    onShowAbout: () => void;
    onLogout: () => void;
    onShowFAQ: () => void;
    onShowAccount: () => void;
}

const VideoCourse: React.FC<VideoCourseProps> = ({ onBack, onShowAbout, onLogout, onShowFAQ, onShowAccount }) => {
    return (
        <div className="bg-sapphire-dark font-display text-text-dark min-h-screen flex flex-col">
            <style>{`
                .material-symbols-outlined {
                    font-variation-settings: 'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24;
                }
                .deep-sea-gradient {
                    background: linear-gradient(170deg, #1B263B 0%, #0D1B2A 70%);
                }
                .bubble {
                    position: absolute;
                    background-color: rgba(224, 225, 221, 0.1);
                    border-radius: 50%;
                    pointer-events: none;
                }
                .light-beam {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    width: 2px;
                    height: 100%;
                    background: linear-gradient(to bottom, rgba(224, 225, 221, 0.15) 0%, rgba(224, 225, 221, 0) 70%);
                    transform-origin: top center;
                    pointer-events: none;
                }
            `}</style>
            <div className="relative flex min-h-screen w-full flex-col overflow-hidden deep-sea-gradient">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="light-beam" style={{ transform: 'translateX(-30vw) rotate(-25deg)' }}></div>
                    <div className="light-beam" style={{ transform: 'translateX(10vw) rotate(15deg)', width: '1px', background: 'linear-gradient(to bottom, rgba(224, 225, 221, 0.1) 0%, rgba(224, 225, 221, 0) 60%)' }}></div>
                    <div className="light-beam" style={{ transform: 'translateX(40vw) rotate(30deg)' }}></div>
                    <div className="bubble" style={{ left: '10%', width: '20px', height: '20px', animation: 'float-rise 25s linear infinite', animationDelay: '-2s' }}></div>
                    <div className="bubble" style={{ left: '20%', width: '5px', height: '5px', animation: 'float-rise 18s linear infinite', animationDelay: '-5s' }}></div>
                    <div className="bubble" style={{ left: '50%', width: '15px', height: '15px', animation: 'float-rise 22s linear infinite', animationDelay: '-10s' }}></div>
                    <div className="bubble" style={{ left: '75%', width: '10px', height: '10px', animation: 'float-rise 20s linear infinite', animationDelay: '-15s' }}></div>
                    <div className="bubble" style={{ left: '90%', width: '7px', height: '7px', animation: 'float-rise 16s linear infinite', animationDelay: '-8s' }}></div>
                </div>
                <div className="relative z-10 flex h-full grow flex-col">
                    <div className="flex flex-1 justify-center">
                        <div className="flex w-full max-w-7xl flex-col flex-1">
                            <header className="flex items-center justify-between whitespace-nowrap px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-50 bg-gradient-to-b from-indigo-deep/30 to-transparent backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="text-glowing-white text-3xl">
                                        <span className="material-symbols-outlined">sailing</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-glowing-white">LearnAI</h2>
                                    <div className="hidden md:flex ml-8 items-center gap-8">
                                        <a className="text-sm font-medium hover:text-light-silver text-glowing-white transition-colors" href="#">Tính năng</a>
                                        <a onClick={(e) => { e.preventDefault(); onShowAbout(); }} className="text-sm font-medium hover:text-light-silver text-glowing-white transition-colors cursor-pointer" href="#">Giới thiệu</a>
                                        <a onClick={(e) => { e.preventDefault(); onShowFAQ(); }} className="text-sm font-medium hover:text-light-silver text-glowing-white transition-colors cursor-pointer" href="#">Hỏi đáp</a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={onShowAccount}
                                        className="flex gap-2 cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 pl-2 pr-4 bg-transparent border border-light-silver/30 text-glowing-white text-sm font-medium leading-normal hover:bg-light-silver/10 transition-colors"
                                    >
                                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCz4vh7zoDmpL8KUlXRmrSSwG5l7clTtv_0Nt4Kf3bs9Ew_50ptR49MFLUTCvG7iEQoGAlwhKoXqiYIRluKUZVtD5kFmRIFB1-AlF4mFsOCNmBxq8sURGKmMHg0sSxDLj15MPAuul1CAomK2R_fUk2KtHiDVMQgm-ZRrrE5O4i-oF7IRyLqUz1wCLSucG8oz_0dj--qZj8wdRnZ5iweItzb3vYfVnAwfn2iZ0rYo7wlJwPWs1a5qSriW9WRLASzPmms0idMSOSrJhLT")' }}></div>
                                        <span className="truncate">Tài khoản</span>
                                    </button>
                                    <button onClick={onLogout} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-coral-pink/90 text-slate-900 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-coral-pink transition-colors">
                                        <span className="truncate">Đăng xuất</span>
                                    </button>
                                </div>
                            </header>
                            <main className="flex-grow">
                                <section className="relative py-12 md:py-16 px-4 sm:px-6 lg:px-8">
                                    <div className="max-w-6xl mx-auto flex flex-col gap-8">
                                        <div className="flex items-center gap-4">
                                            <button onClick={onBack} className="flex items-center justify-center size-10 rounded-full hover:bg-white/10 transition-colors">
                                                <span className="material-symbols-outlined text-glowing-white">arrow_back</span>
                                            </button>
                                            <div className="text-center flex-1">
                                                <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl text-glowing-white">Rạp Chiếu Tri Thức</h1>
                                                <p className="mt-2 text-base font-normal leading-normal text-text-muted-dark">Chuyển hóa video thành bài học tương tác</p>
                                            </div>
                                            <div className="w-10"></div>
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className="lg:col-span-2 flex flex-col gap-4">
                                                <div className="aspect-video w-full bg-sapphire-dark rounded-xl shadow-2xl shadow-indigo-deep/50 overflow-hidden ring-1 ring-light-silver/10">
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-6xl text-light-silver/30">play_circle</span>
                                                    </div>
                                                </div>
                                                <div className="bg-indigo-deep/30 rounded-lg p-4 ring-1 ring-white/5">
                                                    <div className="relative w-full h-2 bg-sapphire-dark rounded-full">
                                                        <div className="absolute top-1/2 -translate-y-1/2 size-4 rounded-full bg-glowing-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-sparkle-strong" style={{ left: '20%', animationDelay: '0.5s' }}></div>
                                                        <div className="absolute top-1/2 -translate-y-1/2" style={{ left: '45%' }}>
                                                            <span className="material-symbols-outlined text-lg text-glowing-white opacity-80">help_outline</span>
                                                        </div>
                                                        <div className="absolute top-1/2 -translate-y-1/2 size-4 rounded-full bg-glowing-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-sparkle-strong" style={{ left: '75%' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <div className="bg-indigo-deep/30 rounded-xl p-6 ring-1 ring-white/10 flex flex-col gap-4">
                                                    <h3 className="text-lg font-bold text-glowing-white">Bảng điều khiển</h3>
                                                    <div className="relative">
                                                        <input className="w-full rounded-full border-light-silver/20 focus:ring-sea-blue focus:border-sea-blue transition bg-sapphire-dark/50 text-light-silver placeholder:text-text-muted-dark/70 pl-10" placeholder="Dán link video YouTube..." type="text" />
                                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-dark/70">link</span>
                                                    </div>
                                                    <div className="flex flex-col gap-3 mt-2">
                                                        <button className="flex items-center justify-center gap-3 w-full text-nowrap px-4 py-3 bg-sea-blue/80 text-glowing-white font-semibold rounded-full hover:bg-sea-blue transition-colors shadow-lg shadow-sea-blue/20">
                                                            <span className="material-symbols-outlined">psychology</span>
                                                            <span>Trích xuất câu hỏi</span>
                                                        </button>
                                                        <button className="flex items-center justify-center gap-3 w-full text-nowrap px-4 py-3 bg-light-silver/10 text-glowing-white font-semibold rounded-full hover:bg-light-silver/20 transition-colors">
                                                            <span className="material-symbols-outlined">quiz</span>
                                                            <span>Tạo bài kiểm tra</span>
                                                        </button>
                                                        <button className="flex items-center justify-center gap-3 w-full text-nowrap px-4 py-3 bg-light-silver/10 text-glowing-white font-semibold rounded-full hover:bg-light-silver/20 transition-colors">
                                                            <span className="material-symbols-outlined">history</span>
                                                            <span>Xem lại dòng thời gian</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </main>
                            <footer className="px-4 sm:px-6 lg:px-8 py-8 mt-auto bg-gradient-to-t from-sapphire-dark/30 to-transparent">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="text-glowing-white text-2xl">
                                            <span className="material-symbols-outlined">sailing</span>
                                        </div>
                                        <h2 className="text-lg font-bold text-glowing-white">LearnAI</h2>
                                    </div>
                                    <div className="flex gap-6 text-sm font-medium text-text-muted-dark">
                                        <a className="hover:text-glowing-white transition-colors" href="#">Điều khoản dịch vụ</a>
                                        <a className="hover:text-glowing-white transition-colors" href="#">Chính sách bảo mật</a>
                                    </div>
                                    <p className="text-sm text-text-muted-dark/80">© 2024 LearnAI. All rights reserved.</p>
                                </div>
                            </footer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCourse;
