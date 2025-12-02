
import React from 'react';

interface NavigationDockProps {
    activeView: 'graph' | 'search' | 'category' | '3d';
    onNavigate: (view: 'graph' | 'search' | 'category' | '3d') => void;
}

const NavigationDock: React.FC<NavigationDockProps> = ({ activeView, onNavigate }) => {
    const navItems = [
        { id: 'graph', icon: 'hub', label: 'Sơ đồ 2D' },
        { id: '3d', icon: '3d_rotation', label: 'Không gian 3D' },
        { id: 'search', icon: 'search', label: 'Tìm kiếm' },
        { id: 'category', icon: 'category', label: 'Phân loại' },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 p-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id as any)}
                        className={`relative group flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${
                            activeView === item.id 
                            ? 'bg-sky-500/20 text-sky-300 shadow-[0_0_15px_rgba(14,165,233,0.3)] border border-sky-500/50' 
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <span className={`material-symbols-outlined text-2xl transition-transform duration-300 ${activeView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                            {item.icon}
                        </span>
                        
                        {/* Tooltip */}
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
                            {item.label}
                        </span>

                        {/* Active Dot */}
                        {activeView === item.id && (
                            <span className="absolute bottom-1 w-1 h-1 bg-sky-400 rounded-full shadow-[0_0_5px_#38bdf8]"></span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default NavigationDock;
