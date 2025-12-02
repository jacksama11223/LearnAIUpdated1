
import React from 'react';
import NavigationDock from './NavigationDock';

interface ExploreSearchProps {
    onBack: () => void;
    onShowAbout: () => void;
    onLogout: () => void;
    onShowFAQ: () => void;
    onShowAccount: () => void;
}

const ExploreSearch: React.FC<ExploreSearchProps> = ({ onBack, onShowAbout, onLogout, onShowFAQ, onShowAccount }) => {
    
    // Mock handler for navigation - in real app would lift state
    const handleNavigation = (view: 'graph' | 'search' | 'category' | '3d') => {
        if (view === 'graph') onBack();
        // Handle others via parent props if needed, but for now we assume graph is the hub
        // Or implement a router. For this task, we link back to graph mostly.
        if (view !== 'search') onBack(); // Temporary: Go back to graph to route elsewhere
    };

    return (
        <div className="bg-[#02041a] font-display text-text-dark min-h-screen flex flex-col relative overflow-hidden">
            <style>{`
                .material-symbols-outlined { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
                .omnibar-glow { box-shadow: 0 0 20px rgba(34, 211, 238, 0.15), inset 0 0 10px rgba(34, 211, 238, 0.05); }
                .data-chip:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
            `}</style>
            
            <header className="flex items-center justify-between px-6 py-4 bg-[#02041a]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-3xl text-sky-400">search</span>
                    <h2 className="text-lg font-bold text-white">Database Search</h2>
                </div>
                <div className="flex gap-3">
                    <button onClick={onShowAccount} className="p-2 rounded-full hover:bg-white/10 text-slate-300"><span className="material-symbols-outlined">person</span></button>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center pt-20 px-4">
                <div className="w-full max-w-3xl flex flex-col gap-8 relative z-10">
                    <div className="text-center mb-4">
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400 mb-2">Truy Xuất Dữ Liệu</h1>
                        <p className="text-slate-400">Tìm kiếm mọi nốt tri thức trong mạng lưới của bạn</p>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 via-purple-500 to-sky-500 rounded-full opacity-30 group-hover:opacity-70 blur transition duration-500"></div>
                        <div className="relative flex items-center bg-[#0f172a] rounded-full omnibar-glow border border-white/10">
                            <span className="material-symbols-outlined text-2xl text-slate-400 ml-6">search</span>
                            <input 
                                className="w-full bg-transparent border-none focus:ring-0 text-white text-lg py-4 px-4 placeholder-slate-500" 
                                placeholder="Nhập từ khóa, thẻ tag, hoặc chủ đề..." 
                                type="text"
                                autoFocus
                            />
                            <button className="mr-2 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 transition-colors">
                                <span className="material-symbols-outlined">mic</span>
                            </button>
                            <button className="mr-2 p-3 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow-lg">
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 text-sm text-slate-400">
                        <span>Gợi ý:</span>
                        {['Lịch sử', 'Toán học', 'Từ vựng', 'Python', 'React'].map(tag => (
                            <button key={tag} className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-sky-500/30 transition-colors">#{tag}</button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                        {/* Mock Results as Data Chips */}
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="data-chip p-4 rounded-xl bg-[#1e293b]/50 border border-white/5 backdrop-blur-md cursor-pointer transition-all duration-300">
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${i % 2 === 0 ? 'from-purple-500/20 to-blue-500/20 text-purple-300' : 'from-yellow-500/20 to-orange-500/20 text-yellow-300'}`}>
                                        <span className="material-symbols-outlined">{i % 2 === 0 ? 'school' : 'lightbulb'}</span>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Unit {i}</span>
                                </div>
                                <h3 className="text-white font-bold mb-1">Kiến thức cơ bản {i}</h3>
                                <p className="text-slate-400 text-xs line-clamp-2">Tóm tắt nội dung ngắn gọn về chủ đề này để người dùng nắm bắt nhanh...</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <NavigationDock activeView="search" onNavigate={handleNavigation} />
            <footer className="h-20"></footer>
        </div>
    );
};

export default ExploreSearch;
