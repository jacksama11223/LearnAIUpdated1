
import React from 'react';

interface MediaCardsProps {
    onBack: () => void;
    onShowAbout: () => void;
    onLogout: () => void;
    onShowFAQ: () => void;
    onShowAccount: () => void;
}

const MediaCards: React.FC<MediaCardsProps> = ({ onBack, onShowAbout, onLogout, onShowFAQ, onShowAccount }) => {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-hidden iridescent-bg-enhanced font-vietnam text-silver-sparkle bg-[#0c0a18]">
            {/* Light Streams */}
            <div className="light-stream top-[10%] left-0"></div>
            <div className="light-stream bottom-[15%] right-0" style={{ animationDuration: '25s', animationDelay: '-10s' }}></div>

            {/* Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="particle-media bg-coral-pink w-1 h-1" style={{ '--x-start': '10vw', '--x-end': '20vw', animationDuration: '20s', animationDelay: '-2s' } as React.CSSProperties}></div>
                <div className="particle-media bg-mint-green w-0.5 h-0.5" style={{ '--x-start': '25vw', '--x-end': '15vw', animationDuration: '15s', animationDelay: '-5s' } as React.CSSProperties}></div>
                <div className="particle-media bg-lavender w-1.5 h-1.5" style={{ '--x-start': '40vw', '--x-end': '55vw', animationDuration: '25s', animationDelay: '0s' } as React.CSSProperties}></div>
                <div className="particle-media bg-aqua-glow w-1 h-1" style={{ '--x-start': '60vw', '--x-end': '50vw', animationDuration: '18s', animationDelay: '-8s' } as React.CSSProperties}></div>
                <div className="particle-media bg-white w-0.5 h-0.5" style={{ '--x-start': '80vw', '--x-end': '90vw', animationDuration: '22s', animationDelay: '-3s' } as React.CSSProperties}></div>
                <div className="particle-media bg-pink-300 w-1 h-1" style={{ '--x-start': '95vw', '--x-end': '80vw', animationDuration: '16s', animationDelay: '-10s' } as React.CSSProperties}></div>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/50 pointer-events-none"></div>
            
            {/* Header */}
            <header className="sticky top-0 z-50 flex h-20 items-center justify-between whitespace-nowrap border-b border-solid border-white/10 bg-gradient-to-b from-[rgba(17,24,39,0.5)] to-transparent px-6 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.2)] backdrop-blur-md lg:px-12 transition-all duration-300">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined animate-sparkle-subtle text-3xl text-glow-silver text-silver-sparkle">sailing</span>
                        <span className="animate-sparkle-subtle text-2xl font-bold tracking-wider text-glow-silver text-silver-sparkle">LearnAI</span>
                    </div>
                    <nav className="ml-8 hidden items-center gap-8 md:flex">
                        <a className="text-base font-medium text-text-muted-silver transition-colors hover:text-silver-sparkle hover:drop-shadow-[0_0_8px_#F0F8FF]" href="#">Tính năng</a>
                        <a onClick={(e) => { e.preventDefault(); onShowAbout(); }} className="text-base font-medium text-text-muted-silver transition-colors hover:text-silver-sparkle hover:drop-shadow-[0_0_8px_#F0F8FF] cursor-pointer" href="#">Giới thiệu</a>
                        <a onClick={(e) => { e.preventDefault(); onShowFAQ(); }} className="text-base font-medium text-text-muted-silver transition-colors hover:text-silver-sparkle hover:drop-shadow-[0_0_8px_#F0F8FF] cursor-pointer" href="#">Hỏi đáp</a>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onShowAccount}
                        className="flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full px-4 text-base font-medium leading-normal text-silver-sparkle transition-all hover:bg-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                    >
                        <span className="material-symbols-outlined text-xl">person</span>
                        <span className="hidden sm:inline truncate">Tài khoản</span>
                    </button>
                    <button onClick={onLogout} className="flex h-10 min-w-[40px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/10 px-4 text-base font-medium leading-normal text-silver-sparkle transition-all hover:bg-white/20 hover:shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                        <span className="hidden sm:inline truncate">Đăng xuất</span>
                        <span className="material-symbols-outlined sm:hidden text-xl">logout</span>
                    </button>
                </div>
            </header>

            <main className="relative z-10 flex-grow">
                <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col px-6 py-12 lg:px-8">
                    <button 
                        onClick={onBack}
                        className="pearl-button mb-10 inline-flex w-fit items-center gap-2.5 rounded-full py-2.5 pl-3 pr-5 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-2xl text-[#6b21a8]">arrow_back</span>
                        <span className="font-bold text-base text-slate-800">Quay về</span>
                    </button>
                    <div className="flex-grow text-center">
                        <h1 className="text-5xl font-extrabold text-white text-glow-silver drop-shadow-xl sm:text-6xl md:text-7xl">Biển Sáng Tạo</h1>
                        <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-200 font-medium drop-shadow-md">Chọn một tinh thể tri thức để bắt đầu cuộc hành trình sáng tạo của bạn.</p>
                    </div>
                    <div className="relative mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 lg:gap-16">
                        <div className="group relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-white/20 bg-black/20 p-8 text-center backdrop-blur-xl card-animated hover:bg-black/40 transition-colors">
                            <span className="material-symbols-outlined animate-icon-sway relative text-7xl text-[#87CEEB] drop-shadow-[0_0_15px_#87CEEB]">code_blocks</span>
                            <h2 className="relative mt-5 text-2xl font-bold text-white">Coding Practice</h2>
                            <p className="relative mt-2 text-slate-300">Viết và chạy mã trong một môi trường mini IDE dưới lòng biển sâu.</p>
                        </div>
                        <div className="group relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-white/20 bg-black/20 p-8 text-center backdrop-blur-xl card-animated hover:bg-black/40 transition-colors" style={{ animationDelay: '-2s' }}>
                            <span className="material-symbols-outlined animate-icon-sway relative text-7xl text-[#FFB6C1] drop-shadow-[0_0_15px_#FFB6C1]">palette</span>
                            <h2 className="relative mt-5 text-2xl font-bold text-white">Image Generation</h2>
                            <p className="relative mt-2 text-slate-300">Tạo ra những hình ảnh nghệ thuật như những bong bóng lấp lánh.</p>
                        </div>
                        <div className="group relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-white/20 bg-black/20 p-8 text-center backdrop-blur-xl card-animated hover:bg-black/40 transition-colors" style={{ animationDelay: '-4s' }}>
                            <span className="material-symbols-outlined animate-icon-sway relative text-7xl text-[#90EE90] drop-shadow-[0_0_15px_#90EE90]">hub</span>
                            <h2 className="relative mt-5 text-2xl font-bold text-white">Diagram Flow</h2>
                            <p className="relative mt-2 text-slate-300">Minh họa các ý tưởng phức tạp qua những dòng chảy logic.</p>
                        </div>
                    </div>
                    <div className="mt-20 text-center">
                        <button className="animate-button-glow-strong rounded-full bg-aqua-glow px-10 py-4 font-bold text-lg text-gray-900 shadow-xl hover:scale-105 active:scale-95 transition-transform border border-white/50">
                            Tạo Thẻ Mới
                        </button>
                    </div>
                    <div className="absolute bottom-[-40px] left-8 z-20 md:bottom-[-20px] lg:left-16">
                        <div className="animate-gentle-bob-cat relative h-32 w-32 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] md:h-40 md:w-40">
                            <img 
                                alt="Cat Mascot" 
                                className="h-full w-full object-contain" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzBziidarPdbfcDaUAFRuu07-wOY7iyD8ZgNiDDT0Vwg_JMAv0e4i03OezBnPi7s6CgFrS5KzzBAU0djMmfh4mNaeiKwpx_I001Rx2gUZcC5SS_3gc6QmepK9vTBmjp-RSB_6mIKUKKHfkSLOXAkgplGFKxOIIMFWxYYWHzbBzHHTmULNkl8u9qWhA7_V_sfqGeNcSkMfPwyL14O8IDeqh_mEnhhmxA7nTvze9zR_PqWIOaQ8ORAjk0yENVSRNAzTOvm5irIEp8ojp"
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/20 bg-gradient-to-t from-[#111827]/80 to-transparent px-6 py-6 shadow-md lg:px-12">
                <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined animate-sparkle-subtle text-2xl text-glow-silver text-silver-sparkle">sailing</span>
                        <span className="animate-sparkle-subtle text-xl font-bold text-glow-silver text-silver-sparkle">LearnAI</span>
                    </div>
                    <div className="flex flex-grow justify-center gap-x-6 gap-y-2 text-sm font-medium text-text-muted-silver">
                        <a className="transition-colors hover:text-silver-sparkle hover:drop-shadow-[0_0_8px_#F0F8FF]" href="#">Điều khoản dịch vụ</a>
                        <a className="transition-colors hover:text-silver-sparkle hover:drop-shadow-[0_0_8px_#F0F8FF]" href="#">Chính sách bảo mật</a>
                    </div>
                    <p className="text-sm text-text-muted-silver">© 2024 LearnAI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default MediaCards;
