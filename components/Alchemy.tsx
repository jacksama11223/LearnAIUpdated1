
import React, { useState, useEffect, useRef } from 'react';
import { KnowledgeNode, LearningMethod } from '../types';
import { scanUrlForContent, generateLearningContent, generateCoverImage, refineLearningContent, generateContentFromImage } from '../services/geminiService';

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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    
    // States for the multi-step process
    const [isScanning, setIsScanning] = useState(false); 
    const [scannedContent, setScannedContent] = useState<string | null>(null); 
    const [showMethodSelection, setShowMethodSelection] = useState(false); 
    
    const [isGenerating, setIsGenerating] = useState(false); 
    const [isComplete, setIsComplete] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState('');

    // Refinement State
    const [showRefinement, setShowRefinement] = useState(false);
    const [isRefining, setIsRefining] = useState(false);

    // Image Generation State
    const [showImageGen, setShowImageGen] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [selectedRatio, setSelectedRatio] = useState<string>("16:9");
    const [tempNodeData, setTempNodeData] = useState<Partial<KnowledgeNode> | null>(null);

    // Generate random magic particles
    const particles = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: `${20 + Math.random() * 60}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 3}s`
    }));

    useEffect(() => {
        let interval: any;
        if ((isScanning || isGenerating || isRefining) && !isComplete && !showImageGen && !showRefinement) {
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
    }, [isScanning, isGenerating, isRefining, isComplete, showImageGen, showRefinement]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
                setInputValue(''); // Clear text input if image is selected
            };
            reader.readAsDataURL(file);
        }
    };

    // Step 1: Scan/Extract Content (Text/URL or Image)
    const handleScanStart = async () => {
        if (!inputValue.trim() && !selectedImage) {
            alert("Vui lòng nhập đường dẫn, nội dung hoặc tải lên một hình ảnh!");
            return;
        }

        setIsScanning(true);
        setScannedContent(null);
        setProgress(0);
        
        // Case A: Image Input
        if (selectedImage) {
            setStatusMessage('Đang phân tích hình ảnh bằng Thấu kính Ma thuật...');
            // We skip the fetch/clean step for images and go straight to method selection
            // We pass the base64 string as "scannedContent" but add a prefix to identify it
            setTimeout(() => {
                setScannedContent("IMAGE_SOURCE:" + selectedImage); 
                setIsScanning(false);
                setProgress(100);
                setShowMethodSelection(true);
            }, 1500); // Fake delay for UX
            return;
        }

        // Case B: Text/URL Input
        const isUrl = /^(http|https):\/\/[^ "]+$/.test(inputValue.trim());
        if (isUrl) {
            setStatusMessage('Đang truy cập trang web và trích xuất HTML...');
        } else {
            setStatusMessage('Đang đọc dữ liệu văn bản...');
        }

        try {
            const content = await scanUrlForContent(inputValue);
            setScannedContent(content);
            setIsScanning(false);
            setProgress(100);
            setShowMethodSelection(true);
        } catch (error) {
            console.error(error);
            alert("Không thể đọc nội dung từ liên kết này. Vui lòng kiểm tra lại hoặc copy/paste nội dung trực tiếp.");
            setIsScanning(false);
            setProgress(0);
        }
    };

    const initItemsWithSM2 = (items: any[]) => {
        if (!items) return [];
        return items.map(item => ({
            ...item,
            sm2: {
                repetitions: 0,
                interval: 0,
                efactor: 2.5,
                nextReviewDate: new Date().toISOString(),
            }
        }));
    };

    const generateCoordinatesFromTags = (tags?: string[]) => {
        if (!tags || tags.length === 0) {
            return {
                x: 20 + Math.random() * 60,
                y: 20 + Math.random() * 60
            };
        }
        const primaryTag = tags[0];
        let hash = 0;
        for (let i = 0; i < primaryTag.length; i++) {
            hash = primaryTag.charCodeAt(i) + ((hash << 5) - hash);
        }
        const normalizedHash = Math.abs(hash % 1000) / 1000;
        const angle = normalizedHash * Math.PI * 2; 
        const radius = 15 + (Math.abs(hash % 20)); 
        const centerX = 50 + Math.cos(angle) * radius; 
        const centerY = 50 + Math.sin(angle) * radius;
        const jitterX = (Math.random() - 0.5) * 12; 
        const jitterY = (Math.random() - 0.5) * 12;
        
        return {
            x: Math.max(10, Math.min(90, centerX + jitterX)), 
            y: Math.max(10, Math.min(90, centerY + jitterY))
        };
    };

    // Step 2: Generate Content
    const handleMethodSelect = async (method: Exclude<LearningMethod, 'Mixed'>) => {
        if (!scannedContent) return;

        setShowMethodSelection(false);
        setIsGenerating(true);
        setIsComplete(false);
        setProgress(0);
        setStatusMessage(`Đang đúc kết tri thức theo phương pháp ${method}...`);

        try {
            let generatedData;
            
            // Check if source is Image or Text
            if (scannedContent.startsWith("IMAGE_SOURCE:")) {
                const base64Img = scannedContent.replace("IMAGE_SOURCE:", "");
                generatedData = await generateContentFromImage(base64Img, method);
            } else {
                generatedData = await generateLearningContent(scannedContent, method);
            }
            
            setProgress(100);

            const processedData = { ...generatedData };
            // Initialize SM2 items immediately for correct structure, but refinement might update them
            if (method === 'Flashcard' && processedData.flashcards) processedData.flashcards = initItemsWithSM2(processedData.flashcards);
            else if (method === 'Quiz' && processedData.quiz) processedData.quiz = initItemsWithSM2(processedData.quiz);
            else if (method === 'Fill-in-the-blanks' && processedData.fillInBlanks) processedData.fillInBlanks = initItemsWithSM2(processedData.fillInBlanks);
            else if (method === 'Spot the Error' && processedData.spotErrors) processedData.spotErrors = initItemsWithSM2(processedData.spotErrors);
            else if (method === 'Case Study' && processedData.caseStudies) processedData.caseStudies = initItemsWithSM2(processedData.caseStudies);

            const coords = generateCoordinatesFromTags(generatedData.tags);

            setTempNodeData({
                id: Date.now().toString(),
                title: generatedData.title || (inputValue.includes('http') ? 'Liên kết ngoài' : inputValue.substring(0, 15) + '...'),
                type: method,
                status: 'new',
                tags: generatedData.tags || [], 
                x: coords.x, 
                y: coords.y,
                sourceUrl: selectedImage ? 'Image Upload' : inputValue,
                timestamp: new Date(),
                data: processedData
            });

            setIsGenerating(false);
            // Go to Refinement Step instead of Image Gen
            setShowRefinement(true);

        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra khi tạo nội dung AI. Vui lòng thử lại.");
            setIsGenerating(false);
            setProgress(0);
        }
    };

    // Step 3: Refine Content (Optional)
    const handleRefine = async (type: 'Simplify' | 'Translate' | 'Deepen' | 'Add Examples') => {
        if (!tempNodeData || !tempNodeData.data) return;
        
        setShowRefinement(false);
        setIsRefining(true);
        setStatusMessage(`Đang ${type === 'Translate' ? 'dịch thuật' : 'tinh chỉnh'} nội dung...`);
        
        try {
            // Only send the raw data part to save tokens/complexity, not the whole node
            const refinedDataRaw = await refineLearningContent(tempNodeData.data, type);
            
            // Re-apply SM2 structure if lost (safeguard) or preserve existing SM2
            // For simplicity, we re-initialize SM2 on the refined items
            const processedData = { ...refinedDataRaw };
            if (tempNodeData.type === 'Flashcard' && processedData.flashcards) processedData.flashcards = initItemsWithSM2(processedData.flashcards);
            else if (tempNodeData.type === 'Quiz' && processedData.quiz) processedData.quiz = initItemsWithSM2(processedData.quiz);
            else if (tempNodeData.type === 'Fill-in-the-blanks' && processedData.fillInBlanks) processedData.fillInBlanks = initItemsWithSM2(processedData.fillInBlanks);
            else if (tempNodeData.type === 'Spot the Error' && processedData.spotErrors) processedData.spotErrors = initItemsWithSM2(processedData.spotErrors);
            else if (tempNodeData.type === 'Case Study' && processedData.caseStudies) processedData.caseStudies = initItemsWithSM2(processedData.caseStudies);

            setTempNodeData(prev => ({
                ...prev,
                data: processedData,
                title: processedData.title || prev?.title // Update title if translated
            }));

        } catch (error) {
            console.error(error);
            alert("Không thể tinh chỉnh nội dung. Vui lòng thử lại.");
        } finally {
            setIsRefining(false);
            setShowRefinement(true);
        }
    };

    const handleProceedToImageGen = () => {
        setShowRefinement(false);
        setShowImageGen(true);
    };

    // Step 4: Image Gen
    const handleGenerateImage = async () => {
        if (!tempNodeData) return;
        setIsGenerating(true);
        setStatusMessage('Đang vẽ minh họa cho tri thức (Gemini 2.5 Flash Image)...');
        
        try {
            const prompt = tempNodeData.title || tempNodeData.tags?.[0] || "Knowledge";
            const imageBase64 = await generateCoverImage(prompt, selectedRatio);
            setGeneratedImage(imageBase64);
        } catch (e) {
            console.error(e);
            alert("Không thể tạo ảnh. Bỏ qua bước này.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFinalizeNode = () => {
        if (tempNodeData) {
            const finalNode = {
                ...tempNodeData,
                imageUrl: generatedImage || undefined
            } as KnowledgeNode;
            
            onAddNode(finalNode);
            setShowImageGen(false);
            setIsComplete(true);
        }
    };

    const resetProcess = () => {
        setIsComplete(false);
        setInputValue('');
        setScannedContent(null);
        setSelectedImage(null);
        if(fileInputRef.current) fileInputRef.current.value = '';
        setProgress(0);
        setTempNodeData(null);
        setGeneratedImage(null);
        setShowImageGen(false);
        setShowRefinement(false);
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
                                    onClick={() => handleMethodSelect(method.id as Exclude<LearningMethod, 'Mixed'>)}
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
                <section className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8 beach-gradient overflow-hidden min-h-[calc(100vh-80px)]">
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
                    </div>
                    
                    <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-10">
                        <div className="text-center">
                            <h1 className="text-4xl font-black leading-tight tracking-tighter md:text-5xl lg:text-6xl text-deep-sea-blue drop-shadow-sm">Giả kim thuật nội dung</h1>
                            <p className="mt-4 text-base font-normal leading-normal text-slate-700 md:text-lg">Biến tài liệu học tập thành kho báu tri thức của riêng bạn!</p>
                        </div>
                        <div className="w-full relative px-4">
                            <div className="relative mt-8">
                                <div className="treasure-chest w-full max-w-3xl mx-auto px-6 py-8 sm:p-10 pt-16 animate-breathe transition-transform duration-300">
                                    
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
                                        {!isScanning && !isGenerating && !isComplete && !showImageGen && !showRefinement && !isRefining && (
                                            <>
                                                <div className="flex flex-col items-center justify-center text-center text-slate-600">
                                                    <div className="flex items-center justify-center size-20 bg-emerald-sea/20 rounded-full text-emerald-sea mb-4 animate-bounce">
                                                        <span className="material-symbols-outlined text-5xl transform -rotate-12" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48" }}>arrow_upward</span>
                                                    </div>
                                                    <h3 className="font-handwritten text-3xl mt-2 text-deep-sea-blue">Thả kho báu của bạn vào đây</h3>
                                                    <p className="text-sm mt-1">Kéo thả file PDF, link YouTube, hoặc dán văn bản/chủ đề</p>
                                                </div>
                                                
                                                <div className="w-full max-w-lg flex flex-col gap-4">
                                                    {selectedImage && (
                                                        <div className="relative w-full aspect-video bg-black/10 rounded-xl overflow-hidden border-2 border-emerald-sea/50">
                                                            <img src={selectedImage} alt="Selected" className="w-full h-full object-contain" />
                                                            <button 
                                                                onClick={() => setSelectedImage(null)}
                                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-md"
                                                            >
                                                                <span className="material-symbols-outlined">close</span>
                                                            </button>
                                                        </div>
                                                    )}

                                                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                                                        <div className="relative w-full group">
                                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-emerald-sea/70 pointer-events-none group-hover:text-emerald-sea transition-colors">link</span>
                                                            <input 
                                                                className="w-full rounded-full border-emerald-sea/30 bg-white/80 focus:ring-emerald-sea focus:border-emerald-sea transition pl-11 pr-12 py-3 placeholder-slate-500 hover:bg-white focus:bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                                                                placeholder={selectedImage ? "Đã chọn ảnh..." : "Link, Văn bản, hoặc Chủ đề..."}
                                                                type="text"
                                                                value={inputValue}
                                                                onChange={(e) => setInputValue(e.target.value)}
                                                                disabled={!!selectedImage}
                                                            />
                                                            {/* Image Upload Button */}
                                                            <input 
                                                                type="file" 
                                                                ref={fileInputRef}
                                                                accept="image/*"
                                                                className="hidden" 
                                                                onChange={handleFileSelect}
                                                            />
                                                            <button 
                                                                onClick={() => fileInputRef.current?.click()}
                                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-emerald-sea/10 text-emerald-sea transition-colors"
                                                                title="Tải ảnh lên (Thấu kính Ma thuật)"
                                                            >
                                                                <span className="material-symbols-outlined">image</span>
                                                            </button>
                                                        </div>
                                                        <button 
                                                            onClick={handleScanStart}
                                                            className="flex-shrink-0 flex items-center justify-center gap-2 w-full sm:w-auto text-nowrap px-6 py-3 bg-accent text-deep-sea-blue font-bold rounded-full hover:bg-accent/90 transition-all shadow-lantern animate-glow hover:scale-105 active:scale-95"
                                                        >
                                                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 24" }}>lightbulb</span>
                                                            <span>Bắt đầu</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* State: SCANNING or GENERATING TEXT or REFINING */}
                                        {(isScanning || (isGenerating && !showImageGen) || isRefining) && (
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
                                                    {isScanning ? "Đang kết nối đến nguồn dữ liệu..." : isRefining ? "Đang đun nấu lại kiến thức trong lò luyện..." : "Đang tạo liên kết nơ-ron tri thức..."}
                                                </p>
                                            </div>
                                        )}

                                        {/* State: REFINEMENT CRUCIBLE */}
                                        {showRefinement && !isRefining && (
                                            <div className="w-full max-w-xl flex flex-col items-center gap-6 py-4 animate-[fadeInUp_0.5s_ease-out]">
                                                <div className="text-center">
                                                    <span className="material-symbols-outlined text-5xl text-orange-500 mb-2">science</span>
                                                    <h3 className="text-2xl font-bold text-deep-sea-blue">Lò Luyện Tinh Chế</h3>
                                                    <p className="text-slate-600 text-sm mt-2">Nội dung thô đã được trích xuất. Bạn có muốn tinh chỉnh nó trước khi đóng gói không?</p>
                                                </div>

                                                <div className="w-full bg-white/50 p-4 rounded-xl border border-slate-200 text-left max-h-40 overflow-y-auto scrollbar-thin">
                                                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Preview Tiêu đề:</p>
                                                    <p className="text-sm font-medium text-slate-800">{tempNodeData?.title}</p>
                                                    <p className="text-xs text-slate-500 font-bold uppercase mt-2 mb-1">Tags:</p>
                                                    <div className="flex gap-1 flex-wrap">
                                                        {tempNodeData?.tags?.map((tag, i) => (
                                                            <span key={i} className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-700">#{tag}</span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 w-full">
                                                    <button onClick={() => handleRefine('Simplify')} className="flex flex-col items-center justify-center p-3 bg-white hover:bg-orange-50 border border-orange-200 rounded-lg transition-all shadow-sm">
                                                        <span className="material-symbols-outlined text-orange-500 mb-1">child_care</span>
                                                        <span className="text-xs font-bold text-slate-700">Đơn giản hóa</span>
                                                    </button>
                                                    <button onClick={() => handleRefine('Translate')} className="flex flex-col items-center justify-center p-3 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-all shadow-sm">
                                                        <span className="material-symbols-outlined text-blue-500 mb-1">translate</span>
                                                        <span className="text-xs font-bold text-slate-700">Dịch Tiếng Việt</span>
                                                    </button>
                                                    <button onClick={() => handleRefine('Deepen')} className="flex flex-col items-center justify-center p-3 bg-white hover:bg-purple-50 border border-purple-200 rounded-lg transition-all shadow-sm">
                                                        <span className="material-symbols-outlined text-purple-500 mb-1">psychology</span>
                                                        <span className="text-xs font-bold text-slate-700">Đào sâu hơn</span>
                                                    </button>
                                                    <button onClick={() => handleRefine('Add Examples')} className="flex flex-col items-center justify-center p-3 bg-white hover:bg-green-50 border border-green-200 rounded-lg transition-all shadow-sm">
                                                        <span className="material-symbols-outlined text-green-500 mb-1">library_add</span>
                                                        <span className="text-xs font-bold text-slate-700">Thêm ví dụ</span>
                                                    </button>
                                                </div>

                                                <div className="w-full h-px bg-slate-300/50"></div>

                                                <button 
                                                    onClick={handleProceedToImageGen} 
                                                    className="w-full px-6 py-3 rounded-full bg-deep-sea-blue text-white font-bold hover:bg-deep-sea-end shadow-lg flex items-center justify-center gap-2 animate-pulse"
                                                >
                                                    <span>Tiếp tục: Vẽ ảnh bìa</span>
                                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                                </button>
                                            </div>
                                        )}

                                        {/* State: IMAGE GENERATION UI (NANO BANANA) */}
                                        {showImageGen && !isGenerating && (
                                            <div className="w-full max-w-xl flex flex-col items-center gap-6 py-4 animate-[fadeInUp_0.5s_ease-out]">
                                                <div className="text-center">
                                                    <span className="material-symbols-outlined text-5xl text-purple-500 mb-2">palette</span>
                                                    <h3 className="text-2xl font-bold text-deep-sea-blue">Họa sĩ Tri thức</h3>
                                                    <p className="text-slate-600 text-sm mt-2">Nội dung đã sẵn sàng! Bạn có muốn AI vẽ một bức tranh minh họa cho chủ đề này không?</p>
                                                </div>

                                                <div className="w-full bg-white/50 p-4 rounded-xl border border-slate-200">
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Chọn tỷ lệ khung hình:</label>
                                                    <div className="flex flex-wrap gap-2 justify-center">
                                                        {['1:1', '16:9', '4:3', '3:4', '9:16'].map(ratio => (
                                                            <button
                                                                key={ratio}
                                                                onClick={() => setSelectedRatio(ratio)}
                                                                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                                                                    selectedRatio === ratio 
                                                                    ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
                                                                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                                                                }`}
                                                            >
                                                                {ratio}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {generatedImage ? (
                                                    <div className="relative group w-full max-w-sm aspect-video rounded-lg overflow-hidden shadow-lg border-2 border-purple-200">
                                                        <img src={generatedImage} alt="Generated Cover" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => setGeneratedImage(null)} className="text-white bg-red-500 px-4 py-2 rounded-full font-bold text-sm">Xóa ảnh</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-32 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 bg-white/30">
                                                        <span className="text-sm">Chưa có ảnh</span>
                                                    </div>
                                                )}

                                                <div className="flex gap-4 w-full justify-center mt-2">
                                                    {!generatedImage ? (
                                                        <>
                                                            <button 
                                                                onClick={handleFinalizeNode} 
                                                                className="px-6 py-2 rounded-full border border-slate-400 text-slate-600 font-bold hover:bg-slate-100"
                                                            >
                                                                Bỏ qua
                                                            </button>
                                                            <button 
                                                                onClick={handleGenerateImage}
                                                                className="px-6 py-2 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-500 shadow-lg flex items-center gap-2"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                                                Tạo ảnh bìa
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button 
                                                            onClick={handleFinalizeNode} 
                                                            className="w-full px-6 py-3 rounded-full bg-green-600 text-white font-bold hover:bg-green-500 shadow-lg flex items-center justify-center gap-2 animate-pulse"
                                                        >
                                                            <span className="material-symbols-outlined">check</span>
                                                            Hoàn tất
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* State: GENERATING IMAGE */}
                                        {isGenerating && showImageGen && (
                                            <div className="w-full max-w-xl flex flex-col items-center gap-6 py-4 animate-[fadeIn_0.5s_ease-out]">
                                                <h3 className="text-xl font-bold text-purple-600 animate-pulse text-center">{statusMessage}</h3>
                                                <div className="relative w-24 h-24">
                                                    <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                                                    <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                                                    <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-purple-600">brush</span>
                                                </div>
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
