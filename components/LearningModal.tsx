
import React, { useState, useMemo } from 'react';
import { KnowledgeNode, FlashcardItem, QuizItem, FillBlankItem, SpotErrorItem, CaseStudyItem } from '../types';
import { calculateItemSM2 } from '../services/sm2Service';

interface LearningModalProps {
    node: KnowledgeNode;
    onClose: () => void;
    onUpdateNode?: (node: KnowledgeNode) => void;
    onDeepDive: (context: string) => void;
    playlistTotal?: number;
    playlistCurrent?: number;
    onNextNode?: () => void;
}

// Define a unified SessionItem to handle mixed types
type SessionItemType = 'Flashcard' | 'Quiz' | 'Fill-in-the-blanks' | 'Spot the Error' | 'Case Study';

interface SessionItem {
    type: SessionItemType;
    data: any;
    originalIndex: number;
}

const LearningModal: React.FC<LearningModalProps> = ({ node, onClose, onUpdateNode, onDeepDive, playlistTotal, playlistCurrent, onNextNode }) => {
    // --- STATE MANAGEMENT ---
    
    // Flatten all due items into a single queue
    const sessionQueue = useMemo<SessionItem[]>(() => {
        if (!node.data) return [];

        let queue: SessionItem[] = [];
        const now = new Date();
        const todayStart = new Date(now.setHours(0,0,0,0)).getTime();

        const checkAndAdd = (item: any, idx: number, type: SessionItemType) => {
            const reviewDate = new Date(item.sm2.nextReviewDate).setHours(0,0,0,0);
            const isDue = reviewDate <= todayStart;
            if (isDue) {
                queue.push({ type, data: item, originalIndex: idx });
            }
        };

        if (node.data.flashcards) node.data.flashcards.forEach((item, idx) => checkAndAdd(item, idx, 'Flashcard'));
        if (node.data.quiz) node.data.quiz.forEach((item, idx) => checkAndAdd(item, idx, 'Quiz'));
        if (node.data.fillInBlanks) node.data.fillInBlanks.forEach((item, idx) => checkAndAdd(item, idx, 'Fill-in-the-blanks'));
        if (node.data.spotErrors) node.data.spotErrors.forEach((item, idx) => checkAndAdd(item, idx, 'Spot the Error'));
        if (node.data.caseStudies) node.data.caseStudies.forEach((item, idx) => checkAndAdd(item, idx, 'Case Study'));

        return queue;
    }, [node.data]);

    const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({}); // qIndex -> optionIndex
    
    // Generic state for revealing answers in other modes
    const [revealedItems, setRevealedItems] = useState<{[key: number]: boolean}>({});

    const currentSessionItem = sessionQueue[currentQueueIndex];

    // --- ACTIONS ---

    // Generic Update Function
    const updateItemSM2 = (type: SessionItemType, index: number, quality: number) => {
        if (!node.data || !onUpdateNode) return;

        const newData = { ...node.data };
        
        const updateArray = (arrKey: keyof typeof newData) => {
            const arr = newData[arrKey] as any[];
            if (!arr) return;
            const item = arr[index];
            const newSM2 = calculateItemSM2(item.sm2, quality);
            arr[index] = { ...item, sm2: newSM2 }; // Mutate copy
        };

        if (type === 'Flashcard') updateArray('flashcards');
        else if (type === 'Quiz') updateArray('quiz');
        else if (type === 'Fill-in-the-blanks') updateArray('fillInBlanks');
        else if (type === 'Spot the Error') updateArray('spotErrors');
        else if (type === 'Case Study') updateArray('caseStudies');

        const updatedNode = { ...node, data: newData };
        onUpdateNode(updatedNode);
    };

    const handleNext = () => {
        setIsFlipped(false);
        setRevealedItems({}); // Reset reveals
        if (currentQueueIndex < sessionQueue.length - 1) {
            setCurrentQueueIndex(prev => prev + 1);
        } else {
            // Finished session for this node
            if (onNextNode) {
                onNextNode();
            } else {
                onClose();
            }
        }
    };

    const handleRating = (quality: number) => {
        if (currentSessionItem) {
            updateItemSM2(currentSessionItem.type, currentSessionItem.originalIndex, quality);
        }
        handleNext();
    };

    const handleDeepDiveClick = () => {
        if (!currentSessionItem) return;
        const { type, data } = currentSessionItem;
        let context = `Tôi đang học chủ đề "${node.title}" (Item Type: ${type}) và cần bạn giải thích sâu hơn về phần này:\n\n`;

        if (type === 'Flashcard') {
            context += `Thuật ngữ/Câu hỏi: "${data.front}"\nĐịnh nghĩa/Đáp án: "${data.back}"`;
        } else if (type === 'Quiz') {
            context += `Câu hỏi: "${data.question}"\nCác lựa chọn: ${data.options.join(', ')}\nĐáp án đúng: ${data.options[data.correctAnswer]}`;
        } else if (type === 'Fill-in-the-blanks') {
            context += `Câu điền từ: "${data.sentence}"\nTừ cần điền: "${data.answer}"`;
        } else if (type === 'Spot the Error') {
            context += `Câu có lỗi: "${data.text}"\nLỗi sai: "${data.error}"\nSửa lại: "${data.correction}"`;
        } else if (type === 'Case Study') {
            context += `Tình huống: "${data.scenario}"\nCâu hỏi: "${data.question}"\nPhân tích: "${data.analysis}"`;
        }

        context += "\n\nHãy giải thích chi tiết hơn giúp tôi.";
        onDeepDive(context);
    };

    // --- RENDER ---

    if (!node.data) return null;

    if (sessionQueue.length === 0) {
        return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.3s]">
                <div className="bg-slate-900 border border-emerald-500/30 p-8 rounded-2xl max-w-md text-center shadow-2xl shadow-emerald-500/10">
                    <span className="material-symbols-outlined text-6xl text-emerald-400 mb-4 animate-bounce">check_circle</span>
                    <h3 className="text-2xl font-bold text-white mb-2">Tuyệt vời!</h3>
                    <p className="text-slate-300 mb-6">Bạn đã hoàn thành hết các bài học cần ôn tập trong chủ đề này.</p>
                    <div className="flex flex-col gap-3">
                        {onNextNode ? (
                            <button onClick={onNextNode} className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-500 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2">
                                <span>Bài tiếp theo</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        ) : (
                            <button onClick={onClose} className="px-8 py-3 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/40 cursor-pointer">
                                Quay lại Sơ đồ
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Safety guard: if index is stale or queue is mismatched, don't crash
    if (!currentSessionItem) return null;

    const progressPercent = ((currentQueueIndex + 1) / sessionQueue.length) * 100;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-[fadeIn_0.3s_ease-out] font-display">
            <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
                <button 
                    onClick={handleDeepDiveClick}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-indigo-500/40 cursor-pointer backdrop-blur-sm border border-indigo-400/30"
                    title="Hỏi gia sư về nội dung này"
                >
                    <span className="material-symbols-outlined text-lg">psychology</span>
                    <span className="hidden sm:inline">Hỏi Gia sư</span>
                </button>
                <button 
                    onClick={onClose}
                    className="text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined text-4xl">close</span>
                </button>
            </div>

            <div className="w-full max-w-4xl h-[90vh] flex flex-col">
                {/* Header & Progress */}
                <div className="mb-6">
                    {playlistTotal && playlistTotal > 1 && (
                        <div className="text-center mb-1">
                            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest bg-sky-900/30 px-3 py-1 rounded-full border border-sky-500/30">
                                Playlist: Bài {playlistCurrent} / {playlistTotal}
                            </span>
                        </div>
                    )}
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2 truncate">{node.title}</h2>
                    <div className="flex items-center justify-center gap-4 text-sm text-slate-400 mb-4">
                        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">{currentSessionItem.type}</span>
                        <span>{currentQueueIndex + 1} / {sessionQueue.length} câu</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-300 ease-out" 
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex-grow relative bg-slate-900/50 rounded-3xl border border-white/10 overflow-hidden flex flex-col p-4 md:p-8 shadow-2xl">
                    
                    {/* FLASHCARD RENDER */}
                    {currentSessionItem.type === 'Flashcard' && (
                        <div className="flex flex-col items-center justify-center h-full gap-8">
                            <div className="relative w-full max-w-2xl aspect-[3/2] perspective-[1000px]">
                                <div 
                                    className={`w-full h-full relative preserve-3d transition-transform duration-500 cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                                    onClick={() => setIsFlipped(!isFlipped)}
                                >
                                    {/* Front */}
                                    <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-800 rounded-2xl shadow-[0_0_30px_rgba(56,189,248,0.2)] flex flex-col items-center justify-center p-8 text-center border-2 border-slate-200 dark:border-slate-700">
                                        <span className="text-slate-400 text-sm uppercase tracking-widest mb-4 font-bold">Mặt trước</span>
                                        <p className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white leading-relaxed">
                                            {currentSessionItem.data.front}
                                        </p>
                                        <p className="absolute bottom-4 text-slate-400 text-xs animate-pulse">Nhấn để lật</p>
                                    </div>

                                    {/* Back */}
                                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.3)] flex flex-col items-center justify-center p-8 text-center border-2 border-indigo-500/50">
                                        <span className="text-indigo-300 text-sm uppercase tracking-widest mb-4 font-bold">Mặt sau</span>
                                        <p className="text-xl md:text-2xl font-medium text-white leading-relaxed">
                                            {currentSessionItem.data.back}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {isFlipped ? (
                                <div className="grid grid-cols-4 gap-3 w-full max-w-2xl animate-[fadeInUp_0.3s]">
                                    <button onClick={() => handleRating(0)} className="py-3 bg-red-900/30 text-red-300 border border-red-500/30 rounded-xl hover:bg-red-500/20 font-bold cursor-pointer transition-colors">Quên (Again)</button>
                                    <button onClick={() => handleRating(3)} className="py-3 bg-yellow-900/30 text-yellow-300 border border-yellow-500/30 rounded-xl hover:bg-yellow-500/20 font-bold cursor-pointer transition-colors">Khó (Hard)</button>
                                    <button onClick={() => handleRating(4)} className="py-3 bg-blue-900/30 text-blue-300 border border-blue-500/30 rounded-xl hover:bg-blue-500/20 font-bold cursor-pointer transition-colors">Được (Good)</button>
                                    <button onClick={() => handleRating(5)} className="py-3 bg-green-900/30 text-green-300 border border-green-500/30 rounded-xl hover:bg-green-500/20 font-bold cursor-pointer transition-colors">Dễ (Easy)</button>
                                </div>
                            ) : (
                                <div className="text-slate-400 text-sm">Lật thẻ để đánh giá mức độ ghi nhớ</div>
                            )}
                        </div>
                    )}

                    {/* QUIZ RENDER */}
                    {currentSessionItem.type === 'Quiz' && (
                        <div className="flex flex-col h-full justify-center max-w-3xl mx-auto w-full">
                            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                                <h4 className="text-xl md:text-2xl font-bold text-white mb-6 leading-relaxed">
                                    <span className="text-sky-400 mr-2">Q.</span>
                                    {currentSessionItem.data.question}
                                </h4>
                                <div className="space-y-3">
                                    {currentSessionItem.data.options.map((opt: string, optIdx: number) => {
                                        const isSelected = quizAnswers[currentQueueIndex] === optIdx;
                                        const isCorrect = optIdx === currentSessionItem.data.correctAnswer;
                                        let btnClass = "bg-black/20 border-white/10 text-slate-300 hover:bg-white/10";
                                        
                                        if (revealedItems[currentQueueIndex]) {
                                            if (isCorrect) btnClass = "bg-green-500/20 border-green-500 text-green-100";
                                            else if (isSelected) btnClass = "bg-red-500/20 border-red-500 text-red-100";
                                        } else if (isSelected) {
                                            btnClass = "bg-sky-500/20 border-sky-500 text-sky-100";
                                        }

                                        return (
                                            <button
                                                key={optIdx}
                                                disabled={revealedItems[currentQueueIndex]}
                                                onClick={() => setQuizAnswers(prev => ({ ...prev, [currentQueueIndex]: optIdx }))}
                                                className={`w-full p-4 rounded-xl text-left text-base md:text-lg transition-all border cursor-pointer ${btnClass}`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                {revealedItems[currentQueueIndex] && (
                                    <div className="mt-6 p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/30 animate-[fadeIn_0.3s]">
                                        <p className="text-indigo-200 text-sm">{currentSessionItem.data.explanation}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 flex justify-center">
                                {!revealedItems[currentQueueIndex] ? (
                                    <button 
                                        disabled={quizAnswers[currentQueueIndex] === undefined}
                                        onClick={() => {
                                            const isCorrect = quizAnswers[currentQueueIndex] === currentSessionItem.data.correctAnswer;
                                            const quality = isCorrect ? 5 : 1; 
                                            setRevealedItems(prev => ({...prev, [currentQueueIndex]: true}));
                                            
                                            // Update SM-2 immediately
                                            if (currentSessionItem) {
                                                updateItemSM2('Quiz', currentSessionItem.originalIndex, quality);
                                            }
                                        }}
                                        className="px-10 py-3 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform cursor-pointer"
                                    >
                                        Kiểm tra
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleNext}
                                        className="px-10 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold border border-white/20 cursor-pointer"
                                    >
                                        Câu tiếp theo
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* OTHER TYPES (Fill/Spot/Case) */}
                    {(['Fill-in-the-blanks', 'Spot the Error', 'Case Study'].includes(currentSessionItem.type)) && (
                        <div className="flex flex-col h-full justify-center max-w-3xl mx-auto w-full text-center">
                            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 mb-8 min-h-[300px] flex flex-col justify-center items-center">
                                {currentSessionItem.type === 'Fill-in-the-blanks' && (
                                    <>
                                        <p className="text-2xl text-white font-medium leading-relaxed">
                                            {currentSessionItem.data.sentence}
                                        </p>
                                        {revealedItems[currentQueueIndex] && (
                                            <div className="mt-6 text-emerald-400 font-bold text-xl animate-[fadeIn_0.5s]">
                                                Đáp án: {currentSessionItem.data.answer}
                                            </div>
                                        )}
                                    </>
                                )}

                                {currentSessionItem.type === 'Spot the Error' && (
                                    <>
                                        <div className="flex items-center gap-2 mb-4 text-coral-orange">
                                            <span className="material-symbols-outlined">error_outline</span>
                                            <span className="font-bold uppercase tracking-wider text-sm">Tìm lỗi sai</span>
                                        </div>
                                        <p className={`text-xl text-white mb-4 ${revealedItems[currentQueueIndex] ? 'line-through opacity-50' : ''}`}>
                                            {currentSessionItem.data.text}
                                        </p>
                                        {revealedItems[currentQueueIndex] && (
                                            <div className="animate-[fadeIn_0.5s]">
                                                <p className="text-green-400 font-bold text-xl mb-2">{currentSessionItem.data.correction}</p>
                                                <p className="text-slate-400 text-sm">{currentSessionItem.data.error}</p>
                                            </div>
                                        )}
                                    </>
                                )}

                                {currentSessionItem.type === 'Case Study' && (
                                    <div className="text-left w-full">
                                        <div className="bg-black/20 p-4 rounded-lg border-l-4 border-warm-gold mb-4 italic text-slate-300">
                                            "{currentSessionItem.data.scenario}"
                                        </div>
                                        <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sky-400">help</span>
                                            Câu hỏi:
                                        </h4>
                                        <p className="text-white mb-6">{currentSessionItem.data.question}</p>
                                        
                                        {revealedItems[currentQueueIndex] && (
                                            <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/30 animate-[fadeIn_0.5s]">
                                                <h5 className="text-indigo-300 font-bold mb-1 text-sm uppercase">Phân tích</h5>
                                                <p className="text-slate-200 text-sm leading-relaxed">{currentSessionItem.data.analysis}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {!revealedItems[currentQueueIndex] ? (
                                <button 
                                    onClick={() => setRevealedItems(prev => ({...prev, [currentQueueIndex]: true}))}
                                    className="px-8 py-3 rounded-full bg-sky-600 text-white font-bold hover:bg-sky-500 shadow-lg transition-all hover:scale-105 cursor-pointer"
                                >
                                    Hiện đáp án / Phân tích
                                </button>
                            ) : (
                                <div className="flex flex-col gap-2 w-full max-w-xl mx-auto animate-[fadeInUp_0.3s]">
                                    <p className="text-sm text-slate-400 mb-2">Bạn cảm thấy thế nào?</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button onClick={() => handleRating(1)} className="py-3 bg-red-600/20 text-red-300 border border-red-600/50 rounded-xl hover:bg-red-600/40 font-bold transition-all cursor-pointer">Chưa hiểu</button>
                                        <button onClick={() => handleRating(3)} className="py-3 bg-yellow-600/20 text-yellow-300 border border-yellow-600/50 rounded-xl hover:bg-yellow-600/40 font-bold transition-all cursor-pointer">Tạm ổn</button>
                                        <button onClick={() => handleRating(5)} className="py-3 bg-green-600/20 text-green-300 border border-green-600/50 rounded-xl hover:bg-green-600/40 font-bold transition-all cursor-pointer">Đã hiểu rõ</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
            <style>{`
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .perspective-\[1000px\] { perspective: 1000px; }
            `}</style>
        </div>
    );
};

export default LearningModal;
