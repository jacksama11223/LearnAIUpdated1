
import React from 'react';
import NavigationDock from './NavigationDock';

interface ExploreCategoryProps {
    onBack: () => void;
    onShowAbout: () => void;
    onTopicSelect?: () => void;
    onDifficultySelect?: () => void;
    onSkillSelect?: () => void;
    onLogout: () => void;
    onShowFAQ: () => void;
    onShowAccount: () => void;
}

const ExploreCategory: React.FC<ExploreCategoryProps> = ({ onBack, onTopicSelect, onDifficultySelect, onSkillSelect, onLogout, onShowAccount }) => {
    
    const handleNavigation = (view: 'graph' | 'search' | 'category' | '3d') => {
        if (view !== 'category') onBack(); 
    };

    const GalaxyCard = ({ title, icon, color, onClick, desc }: { title: string, icon: string, color: string, onClick?: () => void, desc: string }) => (
        <div 
            onClick={onClick}
            className="group relative h-64 w-full rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02]"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
            <div className="absolute inset-0 backdrop-blur-3xl bg-black/20"></div>
            <div className="absolute inset-0 border border-white/10 rounded-3xl group-hover:border-white/30 transition-colors"></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-white/5 shadow-inner mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5`}>
                    <span className={`material-symbols-outlined text-5xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`}>{icon}</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-wide uppercase">{title}</h3>
                <p className="text-sm text-slate-300 font-medium">{desc}</p>
            </div>
            
            {/* Animated particles or glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all"></div>
        </div>
    );

    return (
        <div className="bg-[#02041a] font-display text-text-dark min-h-screen flex flex-col relative overflow-hidden">
            <style>{`
                .material-symbols-outlined { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48; }
            `}</style>

            <header className="flex items-center justify-between px-6 py-4 bg-[#02041a]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-3xl text-sky-400">category</span>
                    <h2 className="text-lg font-bold text-white">Phân Loại</h2>
                </div>
                <div className="flex gap-3">
                    <button onClick={onShowAccount} className="p-2 rounded-full hover:bg-white/10 text-slate-300"><span className="material-symbols-outlined">person</span></button>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
                <div className="w-full max-w-6xl">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Danh Mục Tri Thức</h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">Chọn lăng kính bạn muốn sử dụng để quan sát vũ trụ kiến thức của mình.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <GalaxyCard 
                            title="Chủ Đề" 
                            icon="topic" 
                            color="from-purple-500 to-indigo-500" 
                            desc="Sắp xếp theo lĩnh vực"
                            onClick={onTopicSelect}
                        />
                        <GalaxyCard 
                            title="Độ Khó" 
                            icon="signal_cellular_alt" 
                            color="from-blue-500 to-cyan-500" 
                            desc="Theo cấp độ thử thách"
                            onClick={onDifficultySelect}
                        />
                        <GalaxyCard 
                            title="Kỹ Năng" 
                            icon="psychology" 
                            color="from-emerald-500 to-teal-500" 
                            desc="Tư duy & Kỹ thuật"
                            onClick={onSkillSelect}
                        />
                        <GalaxyCard 
                            title="Tiên Quyết" 
                            icon="account_tree" 
                            color="from-amber-500 to-orange-500" 
                            desc="Cây lộ trình học tập"
                            onClick={() => {}} 
                        />
                    </div>
                </div>
            </main>

            <NavigationDock activeView="category" onNavigate={handleNavigation} />
            <footer className="h-20"></footer>
        </div>
    );
};

export default ExploreCategory;
