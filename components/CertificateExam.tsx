
import React from 'react';

interface CertificateExamProps {
    onBack: () => void;
    onShowAbout: () => void;
    onLogout: () => void;
    onShowFAQ: () => void;
    onShowAccount: () => void;
}

const CertificateExam: React.FC<CertificateExamProps> = ({ onBack, onShowAbout, onLogout, onShowFAQ, onShowAccount }) => {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-gray-900 group/design-root overflow-x-hidden font-display" 
             style={{ 
                 backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA1ogdsTWAOkVRjRx0woOUWdUdUd8vyjYo7zd9RDCKvmIBhgm_Y_moSYuNpxrcMGMOwpueY86wGO5Edqjar2CwL2Dxq1bKdkMry64LmwuQVQ8Iv-nw-evF8roGgC2fwYRCOoxC6gFjRamUGiJRf0KpxiILKsjnEhnvN2FKr4LZfBvQYFRCmgeyqkbgTwsDtaXMhxUaK5Fgxd4285PJe4GoF33xNd38nM82G4zVzuQk0j02eSbV-8GSn-1jddrdxSdgQUKOLmpRGN4UT')", 
                 backgroundSize: 'cover', 
                 backgroundPosition: 'center' 
             }}>
            <style>{`
                .material-symbols-outlined {
                    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                }
                @keyframes underwater-snow {
                    0% { transform: translateY(-10vh) translateX(0) scale(0.8); opacity: 0; }
                    50% { opacity: 0.9; }
                    100% { transform: translateY(110vh) translateX(50px) scale(1.2); opacity: 0; }
                }
                @keyframes water-swirl {
                    0%, 100% { transform: translateX(0) skewX(0); }
                    50% { transform: translateX(-20px) skewX(5deg); }
                }
                .snow-particle {
                    position: absolute;
                    background-color: rgba(255, 255, 255, 0.15);
                    border-radius: 50%;
                    animation-name: underwater-snow;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                    filter: blur(1px);
                }
                .swirl {
                    position: absolute;
                    width: 200%;
                    height: 200%;
                    background-image: radial-gradient(circle, rgba(10, 50, 100, 0) 40%, rgba(10, 50, 100, 0.1) 70%);
                    animation: water-swirl 30s infinite ease-in-out;
                    opacity: 0.5;
                }
                .snow-1 { width: 3px; height: 3px; left: 10%; animation-duration: 25s; animation-delay: 0s; }
                .snow-2 { width: 4px; height: 4px; left: 20%; animation-duration: 18s; animation-delay: 5s; }
                .snow-3 { width: 2px; height: 2px; left: 35%; animation-duration: 30s; animation-delay: 2s; }
                .snow-4 { width: 3px; height: 3px; left: 50%; animation-duration: 22s; animation-delay: 8s; }
                .snow-5 { width: 5px; height: 5px; left: 65%; animation-duration: 15s; animation-delay: 3s; }
                .snow-6 { width: 3px; height: 3px; left: 80%; animation-duration: 28s; animation-delay: 1s; }
                .snow-7 { width: 4px; height: 4px; left: 90%; animation-duration: 19s; animation-delay: 6s; }
                .snow-8 { width: 2px; height: 2px; left: 5%; animation-duration: 26s; animation-delay: 10s; }
                .snow-9 { width: 4px; height: 4px; left: 95%; animation-duration: 21s; animation-delay: 4s; }
                .snow-10 { width: 3px; height: 3px; left: 45%; animation-duration: 24s; animation-delay: 7s; }
                .btn-glow-yellow {
                    box-shadow: 0 0 8px #ffc107, 0 0 20px #ffc107, 0 0 35px #ffc107, 0 0 5px rgba(255,193,7,0.5) inset;
                }
                .btn-glow-cyan {
                    box-shadow: 0 0 8px #00bcd4, 0 0 20px #00bcd4, 0 0 35px #00bcd4, 0 0 5px rgba(0,188,212,0.5) inset;
                }
                .form-select {
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
                    background-position: right 0.5rem center;
                    background-repeat: no-repeat;
                    background-size: 1.5em 1.5em;
                    -webkit-appearance: none;
                    appearance: none;
                }
            `}</style>
            
            <div className="absolute inset-0 bg-gradient-to-b from-[#010a1a] via-[#041d44] to-[#122b51] opacity-95 z-0"></div>
            
            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                <div className="swirl"></div>
                <div className="snow-particle snow-1"></div>
                <div className="snow-particle snow-2"></div>
                <div className="snow-particle snow-3"></div>
                <div className="snow-particle snow-4"></div>
                <div className="snow-particle snow-5"></div>
                <div className="snow-particle snow-6"></div>
                <div className="snow-particle snow-7"></div>
                <div className="snow-particle snow-8"></div>
                <div className="snow-particle snow-9"></div>
                <div className="snow-particle snow-10"></div>
            </div>

            <div className="layout-container flex h-full grow flex-col relative z-20">
                <header className="flex items-center justify-between whitespace-nowrap px-10 py-3 font-display bg-gradient-to-b from-[#010a1a]/50 to-transparent">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2.5 text-xl font-bold text-white [text-shadow:0_2px_10px_rgba(255,255,255,0.3)]">
                            <span className="material-symbols-outlined text-3xl">sailing</span>
                            <span className="font-extrabold">LearnAI</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <a className="text-white text-sm font-semibold leading-normal hover:text-white/80 transition-colors [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]" href="#">Tính năng</a>
                            <a onClick={(e) => { e.preventDefault(); onShowAbout(); }} className="text-white text-sm font-semibold leading-normal hover:text-white/80 transition-colors [text-shadow:0_1px_6px_rgba(0,0,0,0.7)] cursor-pointer" href="#">Giới thiệu</a>
                            <a onClick={(e) => { e.preventDefault(); onShowFAQ(); }} className="text-white text-sm font-semibold leading-normal hover:text-white/80 transition-colors [text-shadow:0_1px_6px_rgba(0,0,0,0.7)] cursor-pointer" href="#">Hỏi đáp</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onShowAccount}
                            className="flex items-center gap-2 cursor-pointer rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]"
                        >
                            <span className="material-symbols-outlined text-base">person</span>
                            <span>Tài khoản</span>
                        </button>
                        <button onClick={onLogout} className="flex items-center gap-2 cursor-pointer rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]">
                            <span className="material-symbols-outlined text-base">logout</span>
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </header>

                <main className="flex-grow flex flex-col items-center px-4 py-8">
                    <div className="w-full max-w-7xl flex flex-col items-center">
                        <div className="w-full flex justify-start">
                            <button 
                                onClick={onBack}
                                className="flex items-center justify-center rounded-xl h-10 px-4 text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] bg-black/30 hover:bg-black/50 transition-colors backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-white/20"
                            >
                                <span className="material-symbols-outlined text-white" style={{ fontSize: '20px', fontWeight: 700 }}>arrow_back</span>
                                <span>Quay về</span>
                            </button>
                        </div>
                        
                        <div className="text-center mt-8">
                            <h1 className="text-white text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em] [text-shadow:0_3px_15px_rgba(0,188,212,0.5)]">Đỉnh Cao Tri Thức: Thi Chứng Chỉ</h1>
                            <p className="text-gray-200 text-lg font-medium leading-normal mt-3 max-w-3xl mx-auto [text-shadow:0_1px_5px_rgba(0,0,0,0.6)]">Chinh phục đỉnh Everest dưới đại dương. AI sẽ phân tích và tạo lộ trình tối ưu nhất để bạn đạt điểm số cao nhất.</p>
                        </div>

                        <div className="mt-12 w-full max-w-6xl bg-slate-800/40 backdrop-blur-lg rounded-xl shadow-2xl shadow-cyan-500/20 border border-slate-600/60 p-6 lg:p-8">
                            <div className="flex flex-col lg:flex-row gap-8">
                                <div className="flex-[2] flex flex-col gap-6">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button className="flex-1 flex items-center justify-center gap-2 text-base font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg px-6 py-3 transition-all duration-300 transform hover:scale-105 btn-glow-yellow">
                                            <span className="material-symbols-outlined">upload_file</span>
                                            <span>Nạp đề thi cũ</span>
                                        </button>
                                        <div className="flex-1">
                                            <select className="form-select w-full h-full bg-slate-900/70 border-2 border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none">
                                                <option>Chọn loại chứng chỉ</option>
                                                <option>IELTS</option>
                                                <option>TOEIC</option>
                                                <option>TOEFL</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700/80">
                                        <h3 className="text-xl font-bold text-cyan-300 mb-3 [text-shadow:0_0_10px_rgba(0,188,212,0.8)]">Xu hướng Phân tích Đề thi</h3>
                                        <div className="w-full h-48 lg:h-64 bg-black/40 rounded-md flex items-center justify-center p-2 overflow-hidden">
                                            <img className="w-full h-full object-contain" alt="3D glowing bar chart showing exam topic trends" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDR_NGyYz5KZnbbqffYimnfN2S-Qi8WxZ6DYLt30mUbA4DCwC-vzDatB3Y_KfS115AR1viQ11NnXQx7CYXiE5-6jIKIvTG_Y2DHdKJZ-UErrR9TXxNyXUPM_nUs0IXfXJr1H8QwvbAS0nQdlaNskSjtb7qF1zcMP7nvq-O7_ZlUDibrQVUX5fukNt_vgk4BxAqNIKcoaFaeeoAZUf7hhIINql9JseXt9yPoF3eC89Tcie3wSahlw1KX04JuZhUN1lOIsQGdVx84GzOq"/>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex-[3] flex flex-col gap-6">
                                    <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700/80 flex-grow">
                                        <h3 className="text-xl font-bold text-amber-300 mb-3 [text-shadow:0_0_10px_rgba(255,193,7,0.8)]">Lộ trình Điểm rơi Phong độ</h3>
                                        <div className="w-full h-48 lg:h-full bg-black/40 rounded-md flex items-center justify-center p-2 overflow-hidden">
                                            <img className="w-full h-full object-contain" alt="A luminous path winding upwards on a 3D mountain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDumklvIev5VxzBFqU3ADrBsr40oYra8ShkVpvFPpi31Os8AJps5J4DKs6zS4TaMYcDoWO8xnSeuvhVw5g0M2r15PDRVn6u5ysLaSE2j0x5Q-KmNdJMNvSTTDaXQHxjq7Sy6NO_awyL6agR90GZe0rszu5IdRDEnWGDObzXJg-dlZBK4isQ2D4VmbPq-92pmrbH06jmcKNkXzY1ew542QiI-x28Do-DTvsv3lKq2k-p3PYk_kVIoSLUaVaONAW2TkFXEZWsr2y-tCze"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <button className="flex items-center justify-center gap-2 text-sm font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg px-5 py-3 transition-all duration-300 transform hover:scale-105 btn-glow-cyan">
                                    <span className="material-symbols-outlined">query_stats</span>
                                    <span>Phân tích xu hướng</span>
                                </button>
                                <button className="flex items-center justify-center gap-2 text-sm font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg px-5 py-3 transition-all duration-300 transform hover:scale-105 btn-glow-cyan">
                                    <span className="material-symbols-outlined">route</span>
                                    <span>Tối ưu lộ trình học</span>
                                </button>
                                <button className="sm:col-span-2 lg:col-span-1 flex items-center justify-center gap-2 text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg px-5 py-3 transition-all duration-300 transform hover:scale-105 btn-glow-yellow">
                                    <span className="material-symbols-outlined">psychology</span>
                                    <span>Gia sư biện chứng lỗi</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="flex items-center justify-between whitespace-nowrap px-10 py-4 font-display bg-gradient-to-t from-[#122b51]/50 to-transparent">
                    <div className="flex items-center gap-2.5 text-white [text-shadow:0_2px_10px_rgba(255,255,255,0.3)]">
                        <span className="material-symbols-outlined text-3xl">sailing</span>
                        <span className="text-xl font-extrabold">LearnAI</span>
                    </div>
                    <div className="flex-1 flex justify-center items-center gap-6">
                        <a className="text-white text-sm font-semibold leading-normal hover:text-white/80 transition-colors [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]" href="#">Điều khoản dịch vụ</a>
                        <a className="text-white text-sm font-semibold leading-normal hover:text-white/80 transition-colors [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]" href="#">Chính sách bảo mật</a>
                    </div>
                    <p className="text-gray-200 text-sm font-semibold [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]">© 2024 LearnAI. All rights reserved</p>
                </footer>
            </div>
        </div>
    );
};

export default CertificateExam;
