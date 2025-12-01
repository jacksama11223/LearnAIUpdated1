
import React from 'react';

interface CramModeProps {
    onBack: () => void;
    onShowAbout: () => void;
    onLogout: () => void;
    onShowFAQ: () => void;
    onShowAccount: () => void;
}

const CramMode: React.FC<CramModeProps> = ({ onBack, onShowAbout, onLogout, onShowFAQ, onShowAccount }) => {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#2a1e3e] group/design-root overflow-x-hidden font-display text-white">
            <div className="layout-container flex h-full grow flex-col">
                <header className="flex items-center justify-between whitespace-nowrap px-10 py-3 font-display bg-gradient-to-b from-[#4a356a]/50 to-transparent relative z-30">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2.5 text-xl font-bold text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
                            <span className="material-symbols-outlined text-3xl">sailing</span>
                            <span>LearnAI</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <a className="text-white text-sm font-bold leading-normal hover:text-white/80 transition-colors [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]" href="#">Tính năng</a>
                            <a onClick={(e) => { e.preventDefault(); onShowAbout(); }} className="text-white text-sm font-bold leading-normal hover:text-white/80 transition-colors [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] cursor-pointer" href="#">Giới thiệu</a>
                            <a onClick={(e) => { e.preventDefault(); onShowFAQ(); }} className="text-white text-sm font-bold leading-normal hover:text-white/80 transition-colors [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] cursor-pointer" href="#">Hỏi đáp</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onShowAccount}
                            className="flex items-center gap-2 cursor-pointer rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]"
                        >
                            <span className="material-symbols-outlined text-base">person</span>
                            <span>Tài khoản</span>
                        </button>
                        <button onClick={onLogout} className="flex items-center gap-2 cursor-pointer rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
                            <span className="material-symbols-outlined text-base">logout</span>
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </header>
                
                <main className="flex-grow flex flex-col items-center px-4 py-8 relative overflow-hidden">
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#4a356a] via-[#f7b7a3] to-[#ffcb9a] opacity-60"></div>
                    <div className="absolute inset-0 z-10 bottom-0 overflow-hidden pointer-events-none">
                        <div className="bubble-cram w-[10px] h-[10px] left-[10%] animate-[floatUp_12s_ease-in-out_infinite]"></div>
                        <div className="bubble-cram w-[20px] h-[20px] left-[20%] animate-[floatUp_8s_ease-in-out_infinite] [animation-delay:2s]"></div>
                        <div className="bubble-cram w-[15px] h-[15px] left-[35%] animate-[floatUp_15s_ease-in-out_infinite]"></div>
                        <div className="bubble-cram w-[8px] h-[8px] left-[50%] animate-[floatUp_9s_ease-in-out_infinite] [animation-delay:4s]"></div>
                        <div className="bubble-cram w-[25px] h-[25px] left-[65%] animate-[floatUp_13s_ease-in-out_infinite]"></div>
                        <div className="bubble-cram w-[12px] h-[12px] left-[80%] animate-[floatUp_7s_ease-in-out_infinite] [animation-delay:1s]"></div>
                        <div className="bubble-cram w-[18px] h-[18px] left-[90%] animate-[floatUp_11s_ease-in-out_infinite]"></div>
                    </div>
                    
                    <div className="relative z-20 flex flex-col items-center w-full max-w-4xl">
                        <div className="w-full flex justify-start">
                            <button 
                                onClick={onBack}
                                className="flex items-center justify-center rounded-xl h-10 px-4 text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] bg-black/20 hover:bg-black/40 transition-colors backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:scale-105"
                            >
                                <span className="material-symbols-outlined text-white" style={{ fontSize: '20px', fontWeight: 700 }}>arrow_back</span>
                                <span>Quay về</span>
                            </button>
                        </div>
                        
                        <div className="text-center mt-8 animate-[fadeInUp_0.8s_ease-out_forwards]">
                            <h1 className="text-white text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em] [text-shadow:0_2px_10px_rgba(0,0,0,0.4)]">Hải Trình Tri Thức: Cram Mode</h1>
                            <p className="text-gray-100 text-lg font-medium leading-normal mt-3 max-w-2xl mx-auto [text-shadow:0_1px_5px_rgba(0,0,0,0.4)]">Nhập deadline của bạn, AI sẽ vạch ra hải trình chinh phục 20% kiến thức quan trọng nhất.</p>
                        </div>
                        
                        <div className="mt-12 flex flex-col lg:flex-row items-center justify-center gap-12 w-full">
                            <div className="flex flex-col items-center gap-6 w-full max-w-sm animate-[fadeInUp_1s_ease-out_forwards]">
                                <div className="w-full">
                                    <label className="flex flex-col min-w-40 flex-1">
                                        <p className="text-white text-base font-semibold leading-normal pb-2 text-center [text-shadow:0_1px_4px_rgba(0,0,0,0.3)]">Deadline</p>
                                        <div className="relative flex w-full flex-1 items-stretch rounded-xl shadow-lg group">
                                            <input 
                                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#f9a8d4] border-2 border-white/30 bg-black/40 backdrop-blur-sm h-14 placeholder:text-gray-300 p-[15px] text-base font-medium leading-normal text-center transition-all focus:bg-black/60" 
                                                placeholder="Chọn ngày deadline của bạn" 
                                                type="text"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white group-hover:animate-bounce">
                                                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}> hourglass_top </span>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                <button className="group relative flex w-full max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 bg-[#e57373] text-white gap-3 text-lg font-bold leading-normal tracking-[0.015em] shadow-lg hover:shadow-[#e57373]/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-95">
                                    <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    <span className="material-symbols-outlined animate-[spin_3s_linear_infinite]">sailing</span>
                                    <span>Bắt đầu Cram Mode</span>
                                </button>
                            </div>
                            
                            <div className="relative w-full max-w-md aspect-square animate-map-breathe">
                                <img 
                                    className="w-full h-full object-cover rounded-full opacity-60 border-4 border-[#ffc38d]/50 shadow-[0_0_30px_rgba(255,195,141,0.3)]" 
                                    alt="Nautical map" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH7kfkmBoZnKhW-Qq0MrRblzfoocRZfxsemTgoO8Q6DMDrAf0AehzBB5ihrLyyTqhEC7CxnIbFD0T3tr46UoV_D502Zk9rF2xcRVQJc9ASMMAfS6BAu82RWpXkDjOhyb7y4_6JvieLY1ukhjN2bEd1wHvTHYLLTgG9Hfl_IgpLGL3W9mKbFjKZDOltqqm1a7LWjRjxGNhBWgUezFs7I0y_BSV3eZvPHdq9wPMN0VAIWV240sZYMe-Suirary-w-PytY9nmmX8b1WT2"
                                />
                                <div className="absolute top-1/4 left-1/4 w-10 h-10 bg-[#f9a8d4] rounded-full animate-bulb-pulse flex items-center justify-center shadow-lg border-2 border-white/50 cursor-pointer hover:scale-125 transition-transform" title="Chủ điểm 1">
                                    <span className="material-symbols-outlined text-[#3f2a56]">lightbulb</span>
                                </div>
                                <div className="absolute top-1/3 right-1/4 w-10 h-10 bg-[#f9a8d4] rounded-full animate-bulb-pulse [animation-delay:0.3s] flex items-center justify-center shadow-lg border-2 border-white/50 cursor-pointer hover:scale-125 transition-transform" title="Chủ điểm 2">
                                    <span className="material-symbols-outlined text-[#3f2a56]">lightbulb</span>
                                </div>
                                <div className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-[#f9a8d4] rounded-full animate-bulb-pulse [animation-delay:0.6s] flex items-center justify-center shadow-lg border-2 border-white/50 cursor-pointer hover:scale-125 transition-transform" title="Chủ điểm 3">
                                    <span className="material-symbols-outlined text-[#3f2a56]">lightbulb</span>
                                </div>
                                <div className="absolute bottom-1/3 right-1/2 w-10 h-10 bg-[#f9a8d4] rounded-full animate-bulb-pulse [animation-delay:0.9s] flex items-center justify-center shadow-lg border-2 border-white/50 cursor-pointer hover:scale-125 transition-transform" title="Chủ điểm 4">
                                    <span className="material-symbols-outlined text-[#3f2a56]">lightbulb</span>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-48 h-48 animate-diver-float">
                                    <img 
                                        className="w-full h-full object-contain transform -scale-x-100 drop-shadow-[0_10px_15px_rgba(0,0,0,0.4)] saturate-90 brightness-105 hover:scale-110 transition-transform duration-500" 
                                        alt="Cat diver" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD88sls_WBnuwwmB9eZlZsLt6BZ7thvgOgu8jESraq76hENodORwg-JpxmIfq_AcSXzU8UmIneyAzKtjjKW3Mbo20X_JMo6oquPxBDB7tShmfXm7NtmGVJrFCdpkY-2QIdzrt5C16K80kIA4qJIXNL-MWoYUpYtrrV0U4etg3BaWZYgSe9w_4VH_zCUVRc1jLITEdhtHME6HaTxHG-0tCQVpzplEuqAUDsW17ttqawkYfeJSbeJ2DaoVk4Jwj7FPMidAuTY-FhjJZ4Z"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <footer className="px-4 sm:px-6 lg:px-8 py-8 border-t border-[#4a356a]/30 bg-[#2a1e3e]/80 backdrop-blur-md">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="text-white text-2xl">
                                <span className="material-symbols-outlined">sailing</span>
                            </div>
                            <h2 className="text-lg font-bold text-white">LearnAI</h2>
                        </div>
                        <div className="flex gap-6 text-sm font-medium text-white/70">
                            <a className="hover:text-white transition-colors" href="#">Điều khoản dịch vụ</a>
                            <a className="hover:text-white transition-colors" href="#">Chính sách bảo mật</a>
                        </div>
                        <p className="text-sm text-white/70">© 2024 LearnAI. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default CramMode;
