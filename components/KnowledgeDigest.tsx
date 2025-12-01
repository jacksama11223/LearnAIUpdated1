
import React from 'react';

interface KnowledgeDigestProps {
    onBack: () => void;
    onShowAbout: () => void;
    onLogout: () => void;
    onShowFAQ: () => void;
    onShowAccount: () => void;
}

const KnowledgeDigest: React.FC<KnowledgeDigestProps> = ({ onBack, onShowAbout, onLogout, onShowFAQ, onShowAccount }) => {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#020a1a] group/design-root overflow-x-hidden font-display">
            {/* Background Layers */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#03102d] via-[#051e48] to-[#012d26] opacity-90"></div>
            <div className="absolute inset-0 z-10 bottom-0 overflow-hidden pointer-events-none">
                <div className="particle-digest bg-emerald-300 w-[2px] h-[2px] top-[10%] left-[15%] [animation-delay:0.5s]"></div>
                <div className="particle-digest bg-cyan-300 w-[3px] h-[3px] top-[20%] left-[80%] [animation-delay:1.2s]"></div>
                <div className="particle-digest bg-emerald-400 w-[1px] h-[1px] top-[50%] left-[50%] [animation-delay:2.5s]"></div>
                <div className="particle-digest bg-yellow-300 w-[2px] h-[2px] top-[80%] left-[25%] [animation-delay:0.8s]"></div>
                <div className="particle-digest bg-cyan-200 w-[3px] h-[3px] top-[90%] left-[90%] [animation-delay:3s]"></div>
                <div className="particle-digest bg-yellow-200 w-[2px] h-[2px] top-[40%] left-[5%] [animation-delay:1.8s]"></div>
                <div className="particle-digest bg-emerald-300 w-[1px] h-[1px] top-[65%] left-[70%] [animation-delay:2.2s]"></div>
            </div>
            <img 
                alt="Underwater sacred garden with bioluminescent plants and ancient ruins" 
                className="absolute inset-0 w-full h-full object-cover opacity-15 z-0" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOwBbddQ-MP9UgXIUfN4w08iKkMlLT1lmcKekZN9OJB69pVuOVEVwUn8_lyYzV9eB6C3D1rrbe4dgd5RSQ4IXpUxvjih2SjJC6fkuzSb2LPjD5knydjj1IuI6L5G_0Nj5xySZmqaQCqJkg416LgzEwQ2D8Ktl325ZBIkJyTCqpfcD6ycsgO24Vb4GxsnCFUd5FE1FkNkF9naJD8ux4dIBS8NGMOinP-Mi1o6xbWE_U9qmmsq4Act3qcDwphuV0O387HOL8dMsQgPZt"
            />

            {/* Content Container */}
            <div className="layout-container flex h-full grow flex-col relative z-20">
                <header className="flex items-center justify-between whitespace-nowrap px-10 py-3 font-display bg-gradient-to-b from-[#03102d]/50 to-transparent">
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
                            className="flex items-center gap-2 cursor-pointer text-sm font-bold text-white transition-colors hover:text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]"
                        >
                            <span className="material-symbols-outlined text-base">person</span>
                            <span>Tài khoản</span>
                        </button>
                        <button onClick={onLogout} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-white transition-colors hover:text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
                            <span className="material-symbols-outlined text-base">logout</span>
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </header>

                <main className="flex-grow flex flex-col items-center px-4 py-8">
                    <div className="w-full max-w-6xl">
                        <div className="w-full flex justify-start mb-6">
                            <button 
                                onClick={onBack}
                                className="flex items-center justify-center rounded-xl h-10 px-4 text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] bg-black/20 hover:bg-black/40 transition-colors backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                            >
                                <span className="material-symbols-outlined text-white" style={{ fontSize: '20px', fontWeight: 700 }}>arrow_back</span>
                                <span>Quay về</span>
                            </button>
                        </div>
                        <div className="bg-slate-900/40 backdrop-blur-lg border border-cyan-400/20 rounded-xl shadow-2xl shadow-cyan-500/10 p-8 flex flex-col lg:flex-row gap-8 items-start">
                            <div className="w-full lg:w-1/3 flex flex-col gap-6 items-center">
                                <h1 className="text-white text-3xl font-black leading-tight tracking-[-0.033em] [text-shadow:0_2px_10px_rgba(56,189,248,0.3)] text-center">Tiêu hóa kiến thức</h1>
                                <div className="relative w-48 h-48">
                                    <img 
                                        alt="A cute British Shorthair cat wearing a vintage diver's helmet, acting as a scientist." 
                                        className="w-full h-full object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.4)]" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD88sls_WBnuwwmB9eZlZsLt6BZ7thvgOgu8jESraq76hENodORwg-JpxmIfq_AcSXzU8UmIneyAzKtjjKW3Mbo20X_JMo6oquPxBDB7tShmfXm7NtmGVJrFCdpkY-2QIdzrt5C16K80kIA4qJIXNL-MWoYUpYtrrV0U4etg3BaWZYgSe9w_4VH_zCUVRc1jLITEdhtHME6HaTxHG-0tCQVpzplEuqAUDsW17ttqawkYfeJSbeJ2DaoVk4Jwj7FPMidAuTY-FhjJZ4Z"
                                    />
                                </div>
                                <p className="text-cyan-200 text-center text-sm">Nạp kiến thức thô, AI sẽ tinh lọc thành các mô hình tư duy cốt lõi cho bạn.</p>
                                <div className="w-full space-y-4">
                                    <button className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-blue-600 text-white gap-3 text-base font-bold leading-normal shadow-lg shadow-blue-500/30 hover:bg-blue-500 hover:shadow-glow-blue-2 transition-all duration-300 transform hover:scale-105">
                                        <span className="material-symbols-outlined">upload_file</span>
                                        <span>Import Content</span>
                                    </button>
                                    <textarea 
                                        className="form-textarea w-full h-32 resize-none rounded-lg text-white placeholder:text-cyan-300/60 bg-cyan-900/30 border-2 border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 p-3 text-sm" 
                                        placeholder="Hoặc dán highlights của bạn vào đây..."
                                    ></textarea>
                                    <button className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-amber-500 text-white gap-3 text-base font-bold leading-normal shadow-lg shadow-amber-500/30 hover:bg-amber-400 hover:shadow-glow-yellow transition-all duration-300 transform hover:scale-105">
                                        <span className="material-symbols-outlined">auto_awesome</span>
                                        <span>Extract Insights</span>
                                    </button>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/3">
                                <h2 className="text-2xl font-bold text-amber-300 mb-4 [text-shadow:0_1px_5px_rgba(252,211,77,0.4)]">Key Mental Models</h2>
                                <div className="space-y-4">
                                    <div className="bg-blue-900/30 border-2 border-blue-400/40 rounded-lg p-4 backdrop-blur-sm shadow-lg hover:shadow-glow-blue-2 transition-shadow duration-300">
                                        <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2"><span className="material-symbols-outlined text-amber-300">psychology</span> Nguyên tắc 80/20 (Pareto Principle)</h3>
                                        <p className="text-cyan-100/90 mt-2 text-sm">Tập trung vào 20% nỗ lực (các chương quan trọng nhất) sẽ mang lại 80% kết quả (hiểu được cốt lõi cuốn sách).</p>
                                    </div>
                                    <div className="bg-yellow-900/30 border-2 border-yellow-400/40 rounded-lg p-4 backdrop-blur-sm shadow-lg hover:shadow-glow-yellow transition-shadow duration-300">
                                        <h3 className="text-lg font-semibold text-yellow-300 flex items-center gap-2"><span className="material-symbols-outlined text-blue-300">hub</span> Tư duy hệ thống (Systems Thinking)</h3>
                                        <p className="text-cyan-100/90 mt-2 text-sm">Hiểu cách các nhân vật, sự kiện và ý tưởng trong sách liên kết và ảnh hưởng lẫn nhau như một hệ thống hoàn chỉnh.</p>
                                    </div>
                                    <div className="bg-blue-900/30 border-2 border-blue-400/40 rounded-lg p-4 backdrop-blur-sm shadow-lg hover:shadow-glow-blue-2 transition-shadow duration-300">
                                        <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2"><span className="material-symbols-outlined text-amber-300">model_training</span> Bài tập tình huống</h3>
                                        <p className="text-cyan-100/90 mt-2 text-sm">Áp dụng Nguyên tắc 80/20 vào kế hoạch học tập tuần tới của bạn. Liệt kê 3-5 nhiệm vụ quan trọng nhất cần ưu tiên.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <footer className="flex items-center justify-between whitespace-nowrap px-10 py-4 font-display bg-gradient-to-t from-[#012d26]/50 to-transparent">
                    <div className="flex items-center gap-2.5 text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
                        <span className="material-symbols-outlined text-3xl">sailing</span>
                        <span className="text-xl font-bold">LearnAI</span>
                    </div>
                    <div className="flex-1 flex justify-center items-center gap-6">
                        <a className="text-white text-sm font-bold leading-normal hover:text-white/80 transition-colors [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]" href="#">Điều khoản dịch vụ</a>
                        <a className="text-white text-sm font-bold leading-normal hover:text-white/80 transition-colors [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]" href="#">Chính sách bảo mật</a>
                    </div>
                    <p className="text-gray-200 text-sm font-medium [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">© 2024 LearnAI. All rights reserved</p>
                </footer>
            </div>
        </div>
    );
};

export default KnowledgeDigest;
