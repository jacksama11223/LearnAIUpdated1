
import React from 'react';
import NavigationDock from './NavigationDock';

interface ExploreDifficultyProps {
    onBack: () => void;
    onShowAbout: () => void;
    onLogout: () => void;
    onShowFAQ: () => void;
    onShowAccount: () => void;
}

const ExploreDifficulty: React.FC<ExploreDifficultyProps> = ({ onBack, onShowAccount }) => {
    
    const handleNavigation = (view: 'graph' | 'search' | 'category' | '3d') => {
        if (view === 'category') onBack();
    };

    return (
        <div className="bg-[#02041a] font-display text-text-dark min-h-screen flex flex-col relative overflow-hidden">
            <style>{` .material-symbols-outlined { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; } `}</style>
            
            <header className="flex items-center justify-between px-6 py-4 bg-[#02041a]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-3xl text-orange-400">signal_cellular_alt</span>
                    <h2 className="text-lg font-bold text-white">Độ Khó</h2>
                </div>
                <div className="flex gap-3">
                    <button onClick={onShowAccount} className="p-2 rounded-full hover:bg-white/10 text-slate-300"><span className="material-symbols-outlined">person</span></button>
                </div>
            </header>

            <main className="flex-grow p-6 pb-24">
                <div className="max-w-6xl mx-auto">
                    <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span> Quay lại phân loại
                    </button>
                    
                    <h1 className="text-3xl font-bold text-white mb-12 text-center">Chọn Thử Thách Của Bạn</h1>
                    
                    <div className="flex flex-col md:flex-row justify-center items-end gap-4 h-96">
                        {[
                            { label: 'Dễ', height: 'h-1/3', color: 'bg-green-500', icon: 'sentiment_satisfied' },
                            { label: 'Trung bình', height: 'h-1/2', color: 'bg-yellow-500', icon: 'sentiment_neutral' },
                            { label: 'Khó', height: 'h-2/3', color: 'bg-orange-500', icon: 'sentiment_dissatisfied' },
                            { label: 'Chuyên gia', height: 'h-full', color: 'bg-red-600', icon: 'local_fire_department' },
                        ].map((level, idx) => (
                            <div key={idx} className={`w-full md:w-1/4 ${level.height} ${level.color} rounded-t-2xl relative group cursor-pointer transition-all hover:brightness-110 flex flex-col justify-end p-6`}>
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-black/20 group-hover:text-black/40 transition-colors">
                                    <span className="material-symbols-outlined text-6xl">{level.icon}</span>
                                </div>
                                <h3 className="text-white text-2xl font-black text-center uppercase tracking-wider relative z-10">{level.label}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <NavigationDock activeView="category" onNavigate={handleNavigation} />
        </div>
    );
};

export default ExploreDifficulty;
