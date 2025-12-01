
import React, { useState, useEffect } from 'react';
import { KnowledgeNode, LearningMethod } from '../types';
import { scanUrlForContent, generateLearningContent } from '../services/geminiService';

interface AlchemyProps {
    onBack: () => void;
    onShowAbout: () => void;
    onLogout: () => void;
    onShowFAQ: () => void;
    onShowAccount: () => void;
    onAddNode: (node: KnowledgeNode) => void;
    onGoToGraph: () => void;
}

const Alchemy: React.FC<AlchemyProps> = ({ onBack, onShowAbout, onLogout, onShowFAQ, onShowAccount, onAddNode, onGoToGraph }) => {
    const [inputValue, setInputValue] = useState('');
    
    // States for the 2-step process
    const [isScanning, setIsScanning] = useState(false); // Step 1: Scanning URL
    const [scannedContent, setScannedContent] = useState<string | null>(null); // Store extracted content
    const [showMethodSelection, setShowMethodSelection] = useState(false); // Modal visibility
    
    const [isGenerating, setIsGenerating] = useState(false); // Step 2: Generating AI content
    const [isComplete, setIsComplete] = useState(false); // Done
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState('');

    // Generate random magic particles
    const particles = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: `${20 + Math.random() * 60}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 3}s`
    }));

    useEffect(() => {
        let interval: any;
        if ((isScanning || isGenerating) && !isComplete) {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev < 30) return prev + 2;
                    if (prev < 60) return prev + 1;
                    if (prev < 90) return prev + 0.2;
                    return 90; 
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isScanning, isGenerating, isComplete]);

    // Step 1: Scan/Extract Content
    const handleScanStart = async () => {
        if (!inputValue.trim()) {
            alert("Vui lòng nhập đường dẫn hoặc nội dung!");
            return;
        }

        setIsScanning(true);
        setScannedContent(null);
        setProgress(0);
        
        const isUrl = /^(http|https):\/\/[^ "]+$/.test(inputValue.trim());
        if (isUrl) {
            setStatusMessage('Đang truy cập trang web và trích xuất HTML...');
        } else {
            setStatusMessage('Đang đọc dữ liệu văn bản...');
        }

        try {
            // Call the service to actually fetch and clean HTML
            const content = await scanUrlForContent(inputValue);
            
            // Success
            setScannedContent(content);
            setIsScanning(false);
            setProgress(100);
            
            // Open modal to choose method
            setShowMethodSelection(true);

        } catch (error) {
            console.error(error);
            alert("Không thể đọc nội dung từ liên kết này. Vui lòng kiểm tra lại hoặc copy/paste nội dung trực tiếp.");
            setIsScanning(false);
            setProgress(0);
        }
    };

    // Step 2: Generate Content based on selection
    const handleMethodSelect = async (method: LearningMethod) => {
        if (!scannedContent) return;

        setShowMethodSelection(false);
        setIsGenerating(true);
        setIsComplete(false);
        setProgress(0);
        setStatusMessage(`Đang đúc kết tri thức theo phương pháp ${method}...`);

        try {
            // Call AI with the ALREADY EXTRACTED content
            const generatedData = await generateLearningContent(scannedContent, method);
            
            setProgress(100);

            // Create Node with SM-2 Initialization
            const newNode: KnowledgeNode = {
                id: Date.now().toString(),
                title: generatedData.title || (inputValue.includes('http') ? 'Liên kết ngoài' : inputValue.substring(0, 15) + '...'),
                type: method,
                status: 'new',
                x: 20 + Math.random() * 60, 
                y: 20 + Math.random() * 60,
                sourceUrl: inputValue,
                timestamp: new Date(),
                // Initialize SM-2 Data
                sm2: {
                    repetitions: 0,
                    interval: 0,
                    efactor: 2.5,
                    nextReviewDate: new Date(), // Due immediately
                    lastReviewDate: undefined
                },
                data: generatedData
            };

            onAddNode(newNode);
            setIsGenerating(false);
            setIsComplete(true);

        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra khi tạo nội dung AI. Vui lòng thử lại.");
            setIsGenerating(false);
            setProgress(0);
        }
    };

    const resetProcess = () => {
        setIsComplete(false);
        setInputValue('');
        setScannedContent(null);
        setProgress(0);
    };

    return (
        <div className="bg-light-sand font-display text-text-light min-h-screen flex flex-col relative">
            {/* Overlay for Method Selection */}
            {showMethodSelection && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-deep-sea-blue/80 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
                    <div className="bg-white/90 dark:bg-deep-sea-blue rounded-2xl p-8 max-w-4xl w-full shadow-2xl border-2 border-sand-yellow relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-sea via-sand-yellow to-emerald-sea"></div>
                        <button 
                            onClick={() => setShowMethodSelection(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <span className="material-symbols-outlined text-3xl">close</span>
                        </button>
                        
                        <div className="text-center mb-10">
                            <span className="material-symbols-outlined text-6xl text-sand-yellow mb-4 animate-bounce">auto_awesome</span>
                            <h2 className="text-3xl font-bold text-deep-sea-blue dark:text-white">Chọn Phương Thức Chuyển Hóa</h2>
                            <p className="text-green-600 dark:text-green-400 mt-2 font-medium">Đã trích xuất nội dung thành công!</p>
                            <p className="text-slate-600 dark:text-slate-300 mt-1">Bạn muốn AI biến đổi nội dung này thành dạng kiến thức nào?</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {[
                                { id: 'Flashcard', icon: 'style', color: 'text-blue-500', bg: 'bg-blue-50', label: 'Flashcards', desc: 'Ghi nhớ nhanh qua thẻ' },
                                { id: 'Quiz', icon: 'quiz', color: 'text-purple-500', bg: 'bg-purple-50', label: 'Trắc nghiệm', desc: 'Kiểm tra kiến thức' },
                                { id: 'Fill-in-the-blanks', icon: 'edit_note', color: 'text-green-500', bg: 'bg-green-50', label: 'Điền từ', desc: 'Hoàn thành câu' },
                                { id: 'Spot the Error', icon: 'bug_report', color: 'text-red-500', bg: 'bg-red-50', label: 'Tìm lỗi sai', desc: 'Tư duy phản biện' },
                                { id: 'Case Study', icon: 'work_history', color: 'text-amber-600', bg: 'bg-amber-50', label: 'Case Study', desc: 'Tình huống thực tế' },
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => handleMethodSelect(method.id as LearningMethod)}
                                    className={`flex flex-col items-center p-4 rounded-xl border-2 border-transparent hover:border-sand-yellow transition-all duration-300 hover:-translate-y-1 group ${method.bg} dark:bg-white/5`}
                                >
                                    <div className={`p-3 rounded-full bg-white shadow-sm mb-3 group-hover:scale-110 transition-transform`}>
                                        <span className={`material-symbols-outlined text-3xl ${method.color}`}>{method.icon}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 dark:text-white mb-1">{method.label}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">{method.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-sand-yellow/50 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-50 bg-light-sand/80 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="text-sea-blue text-3xl">
                        <span className="material-symbols-outlined">sailing</span>
                    </div>
                    <h2 className="text-xl font-bold text-deep-sea-blue">LearnAI</h2>
                    <div className="hidden md:flex ml-8 items-center gap-8">
                        <a className="text-sm font-medium hover:text-sea-blue text-text-muted-light transition-colors" href="#">Tính năng</a>
                        <a onClick={(e) => { e.preventDefault(); onShowAbout(); }} className="text-sm font-medium hover:text-sea-blue text-text-muted-light transition-colors cursor-pointer" href="#">Giới thiệu</a>
                        <a onClick={(e) => { e.preventDefault(); onShowFAQ(); }} className="text-sm font-medium hover:text-sea-blue text-text-muted-light transition-colors cursor-pointer" href="#">Hỏi đáp</a>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onShowAccount}
                        className="flex gap-2 cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 pl-2 pr-4 bg-transparent border border-sea-blue/50 text-sea-blue text-sm font-medium leading-normal hover:bg-sea-blue/10 transition-colors"
                    >
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCz4vh7zoDmpL8KUlXRmrSSwG5l7clTtv_0Nt4Kf3bs9Ew_50ptR49MFLUTCvG7iEQoGAlwhKoXqiYIRluKUZVtD5kFmRIFB1-AlF4mFsOCNmBxq8sURGKmMHg0sSxDLj15MPAuul1CAomK2R_fUk2KtHiDVMQgm-ZRrrE5O4i-oF7IRyLqUz1wCLSucG8oz_0dj--qZj8wdRnZ5iweItzb3vYfVnAwfn2iZ0rYo7wlJwPWs1a5qSriW9WRLASzPmms0idMSOSrJhLT")' }}></div>
                        <span className="truncate">Tài khoản</span>
                    </button>
                    <button onClick={onLogout} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-coral-pink text-slate-900 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-coral-pink/90 transition-colors">
                        <span className="truncate">Đăng xuất</span>
                    </button>
                </div>
            </header>
            <main className="flex-grow">
                <section className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8 beach-gradient overflow-hidden">
                    <button 
                        onClick={onBack}
                        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/70 rounded-full shadow-md hover:bg-white transition-all duration-300 backdrop-blur-sm cursor-pointer hover:-translate-y-1"
                    >
                        <span className="material-symbols-outlined text-sea-blue" style={{ fontVariationSettings: "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24" }}>arrow_back</span>
                        <span className="text-sm font-bold text-deep-sea-blue hidden sm:inline">Quay về</span>
                    </button>
                    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                        <span className="material-symbols-outlined absolute top-[15%] left-[10%] text-6xl text-white/50 -rotate-12 animate-float">star</span>
                        <span className="material-symbols-outlined absolute top-[70%] left-[5%] text-4xl text-white/50 rotate-6 animate-float" style={{ animationDelay: '1s' }}>eco</span>
                        <span className="material-symbols-outlined absolute top-[25%] right-[8%] text-5xl text-white/50 rotate-12 animate-float" style={{ animationDelay: '2s' }}>star</span>
                        <span className="material-symbols-outlined absolute top-[80%] right-[15%] text-7xl text-white/50 -rotate-6 animate-float" style={{ animationDelay: '1.5s' }}>eco</span>
                        <span className="material-symbols-outlined absolute bottom-[5%] left-[30%] text-3xl text-white/50 animate-float" style={{ animationDelay: '0.5s' }}>star</span>
                    </div>
                    
                    {/* Animated Waves Background */}
                    <div className="absolute bottom-0 left-0 w-full h-24 overflow-hidden pointer-events-none z-0">
                        <div className="absolute bottom-0 left-0 w-[200%] h-full opacity-30 animate-wave" 
                             style={{ 
                                 background: 'linear-gradient(to top, rgba(32, 201, 151, 0.4), transparent)',
                                 borderRadius: '50% 50% 0 0',
                                 transformOrigin: 'bottom center'
                             }}>
                        </div>
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-10">
                        <div className="text-center">
                            <h1 className="text-4xl font-black leading-tight tracking-tighter md:text-5xl lg:text-6xl text-deep-sea-blue drop-shadow-sm">Giả kim thuật nội dung</h1>
                            <p className="mt-4 text-base font-normal leading-normal text-slate-700 md:text-lg">Biến tài liệu học tập thành kho báu tri thức của riêng bạn!</p>
                        </div>
                        <div className="w-full relative px-4">
                            {/* Animated Mascot 1 */}
                            <img 
                                alt="Mascot 1" 
                                className="absolute -bottom-8 -left-20 w-48 h-auto z-20 hidden lg:block pointer-events-none transform -rotate-12 animate-[float_6s_ease-in-out_infinite]" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCACOm5eY0AK5GPsD4dHbKRtjIqeY8D0-etpHEAELlPyMzDnNxYAG2_SOf3_G8oKa5QSIkhwSq5DGtg2sTrbnDzI9aLF3k62dLFDAB7RU95dnZTYcMpsC9CNgaHqklvp_i0hZkDwyR8wOgRnc7T7lR2piUKWd7xMwqUNHkUBoJpi-EfB0r9DwqgYHN1q9sfFGfdMR5ORAaAfluSisTYaeNhWo9e1Zv1lc2eKF-fhFpU0Emm0q5YVRUECRkj2I4jvi2kFO4eunqJCUdM"
                            />
                            
                            <div className="relative mt-8">
                                <div className="treasure-chest w-full max-w-3xl mx-auto px-6 py-8 sm:p-10 pt-16 animate-breathe hover:scale-[1.02] transition-transform duration-300">
                                    
                                    {/* Magic Dust Particles */}
                                    <div className="absolute top-0 left-0 w-full h-20 overflow-visible pointer-events-none">
                                        {particles.map(p => (
                                            <div 
                                                key={p.id}
                                                className="magic-dust animate-rise-fade"
                                                style={{ 
                                                    left: p.left, 
                                                    animationDelay: p.animationDelay,
                                                    animationDuration: p.animationDuration
                                                }}
                                            ></div>
                                        ))}
                                    </div>

                                    <div className="bg-light-sand/90 p-6 sm:p-8 rounded-xl border-2 border-dashed border-yellow-700/30 flex flex-col items-center gap-6 backdrop-blur-sm relative z-10">
                                        {/* State: IDLE */}
                                        {!isScanning && !isGenerating && !isComplete && (
                                            <>
                                                <div className="flex flex-col items-center justify-center text-center text-slate-600">
                                                    <div className="flex items-center justify-center size-20 bg-emerald-sea/20 rounded-full text-emerald-sea mb-4 animate-bounce">
                                                        <span className="material-symbols-outlined text-5xl transform -rotate-12" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48" }}>arrow_upward</span>
                                                    </div>
                                                    <h3 className="font-handwritten text-3xl mt-2 text-deep-sea-blue">Thả kho báu của bạn vào đây</h3>
                                                    <p className="text-sm mt-1">Kéo thả file PDF, link YouTube, hoặc dán văn bản/chủ đề</p>
                                                </div>
                                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg mt-4">
                                                    <div className="relative w-full group">
                                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-emerald-sea/70 pointer-events-none group-hover:text-emerald-sea transition-colors">link</span>
                                                        <input 
                                                            className="w-full rounded-full border-emerald-sea/30 bg-white/80 focus:ring-emerald-sea focus:border-emerald-sea transition pl-11 pr-4 py-3 placeholder-slate-500 hover:bg-white focus:bg-white shadow-sm" 
                                                            placeholder="Link, Văn bản, hoặc Chủ đề..." 
                                                            type="text"
                                                            value={inputValue}
                                                            onChange={(e) => setInputValue(e.target.value)}
                                                        />
                                                    </div>
                                                    <button 
                                                        onClick={handleScanStart}
                                                        className="flex-shrink-0 flex items-center justify-center gap-2 w-full sm:w-auto text-nowrap px-6 py-3 bg-accent text-deep-sea-blue font-bold rounded-full hover:bg-accent/90 transition-all shadow-lantern animate-glow hover:scale-105 active:scale-95"
                                                    >
                                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 24" }}>lightbulb</span>
                                                        <span>Bắt đầu</span>
                                                    </button>
                                                </div>
                                            </>
                                        )}

                                        {/* State: SCANNING or GENERATING */}
                                        {(isScanning || isGenerating) && (
                                            <div className="w-full max-w-xl flex flex-col items-center gap-6 py-4 animate-[fadeIn_0.5s_ease-out]">
                                                <h3 className="text-xl font-bold text-deep-sea-blue animate-pulse text-center">{statusMessage}</h3>
                                                <div className="relative w-full h-6 bg-sky-blue/30 rounded-full overflow-hidden border border-sky-blue/50 shadow-inner">
                                                    <div className="processing-bar" style={{ '--progress': `${progress}%` } as React.CSSProperties}></div>
                                                </div>
                                                <div className="flex gap-4 mt-2">
                                                    <div className="wave-bubble" style={{ position: 'relative', width: '20px', height: '20px', animationDelay: '0s' }}></div>
                                                    <div className="wave-bubble" style={{ position: 'relative', width: '20px', height: '20px', animationDelay: '0.3s' }}></div>
                                                    <div className="wave-bubble" style={{ position: 'relative', width: '20px', height: '20px', animationDelay: '0.6s' }}></div>
                                                </div>
                                                <p className="text-sm text-slate-600">
                                                    {isScanning ? "Đang kết nối đến nguồn dữ liệu..." : "Đang tạo liên kết nơ-ron tri thức..."}
                                                </p>
                                            </div>
                                        )}

                                        {/* State: COMPLETE */}
                                        {isComplete && (
                                            <div className="w-full max-w-xl flex flex-col items-center gap-6 py-4 animate-[fadeInUp_0.5s_ease-out]">
                                                <div className="size-20 bg-green-100 rounded-full flex items-center justify-center border-4 border-green-400 shadow-lg">
                                                    <span className="material-symbols-outlined text-5xl text-green-500">check_circle</span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-deep-sea-blue">Giả kim thuật thành công!</h3>
                                                <p className="text-center text-slate-700">Nội dung đã được chuyển hóa và lưu vào Mạng lưới Tri thức của bạn.</p>
                                                <div className="flex gap-4 mt-4">
                                                    <button 
                                                        onClick={resetProcess}
                                                        className="px-6 py-2 rounded-full border border-slate-400 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
                                                    >
                                                        Thêm nữa
                                                    </button>
                                                    <button 
                                                        onClick={onGoToGraph}
                                                        className="px-6 py-2 rounded-full bg-deep-sea-blue text-white font-bold hover:bg-deep-sea-end transition-colors shadow-lg flex items-center gap-2"
                                                    >
                                                        <span>Xem Sơ đồ</span>
                                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="px-4 sm:px-6 lg:px-8 py-8 border-t border-sand-yellow/50 bg-light-sand">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="text-sea-blue text-2xl">
                            <span className="material-symbols-outlined">sailing</span>
                        </div>
                        <h2 className="text-lg font-bold text-deep-sea-blue">LearnAI</h2>
                    </div>
                    <div className="flex gap-6 text-sm font-medium text-text-muted-light">
                        <a className="hover:text-sea-blue transition-colors" href="#">Điều khoản dịch vụ</a>
                        <a className="hover:text-sea-blue transition-colors" href="#">Chính sách bảo mật</a>
                    </div>
                    <p className="text-sm text-text-muted-light">© 2024 LearnAI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Alchemy;
