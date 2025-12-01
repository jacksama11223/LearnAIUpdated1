
import React, { useState } from 'react';
import { KnowledgeNode, FlashcardItem, QuizItem } from '../types';
import { calculateSM2 } from '../services/sm2Service';

interface LearningModalProps {
    node: KnowledgeNode;
    onClose: () => void;
    onUpdateNode?: (node: KnowledgeNode) => void;
}

const LearningModal: React.FC<LearningModalProps> = ({ node, onClose, onUpdateNode }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({}); // qIndex -> optionIndex
    const [showQuizResult, setShowQuizResult] = useState(false);
    
    // Generic state for revealing answers in other modes
    const [revealedItems, setRevealedItems] = useState<{[key: number]: boolean}>({});

    const toggleReveal = (index: number) => {
        setRevealedItems(prev => ({...prev, [index]: !prev[index]}));
    };

    const handleRating = (quality: number) => {
        if (onUpdateNode) {
            const updatedNode = calculateSM2(node, quality);
            onUpdateNode(updatedNode);
        }
        // Move to next or close if finished (simple logic: just close for now or could iterate)
        // For single-item nodes (summaries), we close. For lists, we might want to track individual item progress, 
        // but currently Node is the unit of repetition.
        onClose();
    };

    if (!node.data) {
        return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl max-w-md text-center">
                    <span className="material-symbols-outlined text-4xl text-yellow-500 mb-4">warning</span>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Chưa có nội dung</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">Nội dung bài học này chưa được tạo hoặc bị lỗi.</p>
                    <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Đóng</button>
                </div>
            </div>
        );
    }

    // --- FLASHCARD LOGIC ---
    const flashcards = node.data.flashcards || [];
    const handleNextCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % flashcards.length);
        }, 150);
    };
    const handlePrevCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
        }, 150);
    };

    // --- QUIZ LOGIC ---
    const quiz = node.data.quiz || [];
    const handleOptionSelect = (qIndex: number, optionIndex: number) => {
        if (showQuizResult) return;
        setQuizAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
    };
    const calculateScore = () => {
        let score = 0;
        quiz.forEach((q, idx) => {
            if (quizAnswers[idx] === q.correctAnswer) score++;
        });
        return score;
    };
    
    // Auto-calculate SM-2 quality for Quiz
    const handleQuizCompletion = () => {
        setShowQuizResult(true);
        const score = calculateScore();
        const percentage = score / quiz.length;
        
        let quality = 0;
        if (percentage >= 0.9) quality = 5;
        else if (percentage >= 0.8) quality = 4;
        else if (percentage >= 0.6) quality = 3;
        else if (percentage >= 0.4) quality = 2;
        else if (percentage >= 0.2) quality = 1;
        else quality = 0;

        // Auto update node after a short delay so user sees score first? 
        // Or present a "Finish" button. Let's do a Finish button.
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-[fadeIn_0.3s_ease-out] font-display">
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-50"
            >
                <span className="material-symbols-outlined text-4xl">close</span>
            </button>

            <div className="w-full max-w-4xl h-[85vh] flex flex-col">
                <div className="text-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{node.title}</h2>
                    <div className="flex items-center justify-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-sky-300 border border-sky-500/30">
                            {node.type}
                        </span>
                        {node.sm2 && (
                            <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-400 border border-white/10">
                                Interval: {node.sm2.interval}d
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex-grow relative bg-slate-900/50 rounded-3xl border border-white/10 overflow-hidden flex flex-col p-4 md:p-8 shadow-2xl">
                    
                    {/* FLASHCARD VIEW */}
                    {node.type === 'Flashcard' && flashcards.length > 0 && (
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
                                            {flashcards[currentIndex].front}
                                        </p>
                                        <p className="absolute bottom-4 text-slate-400 text-xs animate-pulse">Nhấn để lật</p>
                                    </div>

                                    {/* Back */}
                                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.3)] flex flex-col items-center justify-center p-8 text-center border-2 border-indigo-500/50">
                                        <span className="text-indigo-300 text-sm uppercase tracking-widest mb-4 font-bold">Mặt sau</span>
                                        <p className="text-xl md:text-2xl font-medium text-white leading-relaxed">
                                            {flashcards[currentIndex].back}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Flashcard Controls */}
                            <div className="flex flex-col gap-4 w-full max-w-2xl">
                                <div className="flex items-center justify-center gap-6">
                                    <button onClick={handlePrevCard} className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
                                        <span className="material-symbols-outlined">arrow_back</span>
                                    </button>
                                    <span className="text-white font-medium">
                                        {currentIndex + 1} / {flashcards.length}
                                    </span>
                                    <button onClick={handleNextCard} className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </button>
                                </div>
                                
                                {/* SM-2 Ratings for Flashcards - Only show if flipped (conceptually correct, but for UX we show always to allow grading the whole set at end or individual) */}
                                {/* Let's assume we rate the whole SET for simplicity in this node model, or allow exiting with a rating */}
                                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between gap-2">
                                    <button onClick={() => handleRating(0)} className="flex-1 py-2 bg-red-600/20 text-red-400 border border-red-600/50 rounded-lg hover:bg-red-600/40">Quên hẳn (Again)</button>
                                    <button onClick={() => handleRating(3)} className="flex-1 py-2 bg-yellow-600/20 text-yellow-400 border border-yellow-600/50 rounded-lg hover:bg-yellow-600/40">Khó (Hard)</button>
                                    <button onClick={() => handleRating(4)} className="flex-1 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/50 rounded-lg hover:bg-blue-600/40">Được (Good)</button>
                                    <button onClick={() => handleRating(5)} className="flex-1 py-2 bg-green-600/20 text-green-400 border border-green-600/50 rounded-lg hover:bg-green-600/40">Dễ (Easy)</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* QUIZ VIEW */}
                    {node.type === 'Quiz' && quiz.length > 0 && (
                        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar pr-2">
                            {showQuizResult ? (
                                <div className="flex flex-col items-center justify-center h-full animate-[fadeIn_0.5s]">
                                    <div className="size-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg mb-6">
                                        <span className="material-symbols-outlined text-6xl text-white">emoji_events</span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-2">Hoàn thành!</h3>
                                    <p className="text-xl text-slate-300 mb-8">
                                        Bạn trả lời đúng <span className="text-green-400 font-bold">{calculateScore()}</span> / {quiz.length} câu.
                                    </p>
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => { setShowQuizResult(false); setQuizAnswers({}); }}
                                            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
                                        >
                                            Làm lại
                                        </button>
                                        <button 
                                            onClick={() => {
                                                const score = calculateScore();
                                                const percentage = score / quiz.length;
                                                let quality = 3;
                                                if (percentage >= 0.9) quality = 5;
                                                else if (percentage >= 0.75) quality = 4;
                                                else if (percentage >= 0.5) quality = 3;
                                                else quality = 1;
                                                handleRating(quality);
                                            }}
                                            className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg transition-all"
                                        >
                                            Cập nhật tiến độ & Đóng
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 pb-8">
                                    {quiz.map((q, qIdx) => (
                                        <div key={qIdx} className="bg-white/5 p-6 rounded-xl border border-white/10">
                                            <h4 className="text-lg md:text-xl font-bold text-white mb-4 flex gap-3">
                                                <span className="text-sky-400">Q{qIdx + 1}.</span>
                                                {q.question}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {q.options.map((opt, optIdx) => (
                                                    <button
                                                        key={optIdx}
                                                        onClick={() => handleOptionSelect(qIdx, optIdx)}
                                                        className={`p-4 rounded-lg text-left text-sm md:text-base transition-all border ${
                                                            quizAnswers[qIdx] === optIdx 
                                                            ? 'bg-sky-500/20 border-sky-500 text-sky-100 shadow-[0_0_10px_rgba(14,165,233,0.3)]' 
                                                            : 'bg-black/20 border-white/10 text-slate-300 hover:bg-white/10'
                                                        }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex justify-end pt-4">
                                        <button 
                                            onClick={handleQuizCompletion}
                                            disabled={Object.keys(quizAnswers).length < quiz.length}
                                            className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                                        >
                                            Nộp bài
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* FILL IN THE BLANKS */}
                    {node.type === 'Fill-in-the-blanks' && node.data.fillInBlanks && (
                        <div className="flex flex-col h-full">
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                                <p className="text-slate-300 text-center mb-4">Điền vào chỗ trống hoặc nhấn để xem đáp án.</p>
                                {node.data.fillInBlanks.map((item, idx) => (
                                    <div key={idx} className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-jade-green/50 transition-colors">
                                        <p className="text-lg text-white mb-3 leading-relaxed">
                                            <span className="text-jade-green font-bold mr-2">{idx + 1}.</span>
                                            {item.sentence}
                                        </p>
                                        <button 
                                            onClick={() => toggleReveal(idx)}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${revealedItems[idx] ? 'bg-jade-green text-black' : 'bg-white/10 text-slate-400 hover:text-white'}`}
                                        >
                                            {revealedItems[idx] ? item.answer : "Hiện đáp án"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10 flex justify-center gap-4">
                                <button onClick={() => handleRating(3)} className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">Chưa vững</button>
                                <button onClick={() => handleRating(5)} className="px-6 py-2 bg-jade-green text-black font-bold rounded-lg hover:bg-jade-green/90">Đã hiểu</button>
                            </div>
                        </div>
                    )}

                    {/* SPOT THE ERROR & CASE STUDY */}
                    {(node.type === 'Spot the Error' || node.type === 'Case Study') && (
                        <div className="flex flex-col h-full">
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                                {/* Rendering logic remains same as previous, just wrapping */}
                                {node.type === 'Spot the Error' && node.data.spotErrors?.map((item, idx) => (
                                    <div key={idx} onClick={() => toggleReveal(idx)} className="bg-white/5 p-6 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-coral-orange mt-1">error_outline</span>
                                            <div className="flex-1">
                                                <p className={`text-lg mb-2 font-medium ${revealedItems[idx] ? 'text-coral-orange line-through decoration-2' : 'text-white'}`}>{item.text}</p>
                                                {revealedItems[idx] && <div className="mt-3 pl-4 border-l-2 border-green-500 animate-[fadeIn_0.3s]"><p className="text-green-400 font-bold mb-1">Đúng: {item.correction}</p><p className="text-slate-400 text-sm">{item.error}</p></div>}
                                                {!revealedItems[idx] && <p className="text-xs text-slate-500 mt-2">Nhấn để hiện lỗi sai</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {node.type === 'Case Study' && node.data.caseStudies?.map((item, idx) => (
                                    <div key={idx} className="bg-white/5 p-6 rounded-xl border border-white/10">
                                        <div className="flex items-center gap-2 mb-3"><span className="bg-warm-gold text-black text-xs font-bold px-2 py-1 rounded">Scenario {idx + 1}</span></div>
                                        <p className="text-white text-lg mb-4 leading-relaxed font-serif italic border-l-4 border-warm-gold pl-4 bg-black/20 py-2 pr-2 rounded-r">"{item.scenario}"</p>
                                        <div className="mb-4"><h4 className="text-sky-300 font-bold mb-1 flex items-center gap-2"><span className="material-symbols-outlined text-sm">help</span> Câu hỏi:</h4><p className="text-slate-300">{item.question}</p></div>
                                        <button onClick={() => toggleReveal(idx)} className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-slate-300 transition-colors flex items-center justify-center gap-2"><span className="material-symbols-outlined">{revealedItems[idx] ? 'expand_less' : 'expand_more'}</span>{revealedItems[idx] ? 'Ẩn phân tích' : 'Xem phân tích chuyên sâu'}</button>
                                        {revealedItems[idx] && <div className="mt-4 bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/30 animate-[fadeIn_0.3s]"><h4 className="text-indigo-300 font-bold mb-2">Phân tích:</h4><p className="text-slate-200 leading-relaxed text-sm">{item.analysis}</p></div>}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between gap-2">
                                <button onClick={() => handleRating(0)} className="flex-1 py-2 bg-red-600/20 text-red-400 border border-red-600/50 rounded-lg hover:bg-red-600/40">Quên</button>
                                <button onClick={() => handleRating(3)} className="flex-1 py-2 bg-yellow-600/20 text-yellow-400 border border-yellow-600/50 rounded-lg hover:bg-yellow-600/40">Khó</button>
                                <button onClick={() => handleRating(4)} className="flex-1 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/50 rounded-lg hover:bg-blue-600/40">Được</button>
                                <button onClick={() => handleRating(5)} className="flex-1 py-2 bg-green-600/20 text-green-400 border border-green-600/50 rounded-lg hover:bg-green-600/40">Dễ</button>
                            </div>
                        </div>
                    )}

                    {/* FALLBACK FOR MISSING DATA OR OTHER TYPES */}
                    {!flashcards.length && !quiz.length && !node.data.fillInBlanks && !node.data.spotErrors && !node.data.caseStudies && (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <span className="material-symbols-outlined text-6xl text-sky-300 mb-4">school</span>
                            <h3 className="text-2xl font-bold text-white mb-4">Nội dung tóm tắt</h3>
                            <div className="bg-black/30 p-6 rounded-xl border border-white/10 max-w-2xl w-full text-left max-h-[60vh] overflow-y-auto">
                                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {node.data.summary || "Nội dung đang được cập nhật..."}
                                </p>
                            </div>
                            <button onClick={() => handleRating(4)} className="mt-6 px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500">Đã đọc</button>
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
