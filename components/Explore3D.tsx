
import React, { useState } from 'react';
import NavigationDock from './NavigationDock';

interface Explore3DProps {
    onBack: () => void;
    onShowAbout: () => void;
    onLogout: () => void;
    onShowFAQ: () => void;
    onShowAccount: () => void;
}

const Explore3D: React.FC<Explore3DProps> = ({ onBack, onLogout, onShowAccount }) => {
    const [rotationX, setRotationX] = useState(15);
    const [rotationY, setRotationY] = useState(-25);
    const [zoom, setZoom] = useState(1);

    const handleNavigation = (view: 'graph' | 'search' | 'category' | '3d') => {
        if (view !== '3d') onBack(); 
    };

    return (
        <div className="bg-[#02041a] font-display text-text-dark min-h-screen flex flex-col relative overflow-hidden select-none">
            <style>{`
                .material-symbols-outlined { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
                .grid-bg-3d {
                    background-image: radial-gradient(circle, rgba(34,211,238,0.1) 1px, transparent 1px);
                    background-size: 30px 30px;
                }
                .node-3d { transform-style: preserve-3d; transition: transform 0.1s ease-out; }
                .node-content { backface-visibility: hidden; }
            `}</style>

            <header className="flex items-center justify-between px-6 py-4 bg-[#02041a]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-3xl text-sky-400">3d_rotation</span>
                    <h2 className="text-lg font-bold text-white">Không Gian 3D</h2>
                </div>
                <div className="flex gap-3">
                    <button onClick={onShowAccount} className="p-2 rounded-full hover:bg-white/10 text-slate-300"><span className="material-symbols-outlined">person</span></button>
                </div>
            </header>

            <main className="flex-grow relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 grid-bg-3d opacity-20 pointer-events-none"></div>
                
                {/* 3D Scene Container */}
                <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
                    <div 
                        className="absolute top-1/2 left-1/2 w-0 h-0 node-3d"
                        style={{ 
                            transform: `translate(-50%, -50%) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${zoom})` 
                        }}
                    >
                        {/* Center Core */}
                        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/10 border border-sky-400 shadow-[0_0_50px_rgba(56,189,248,0.5)] flex items-center justify-center animate-pulse">
                            <span className="material-symbols-outlined text-4xl text-sky-400">hub</span>
                        </div>

                        {/* Satellites (Mock Nodes) */}
                        {[
                            { x: 150, y: -50, z: 50, label: 'Unit A', color: 'bg-purple-500' },
                            { x: -120, y: 100, z: -80, label: 'Skill B', color: 'bg-blue-500' },
                            { x: 80, y: 150, z: 120, label: 'Topic C', color: 'bg-emerald-500' },
                            { x: -180, y: -120, z: 40, label: 'Quiz D', color: 'bg-amber-500' },
                            { x: 0, y: -200, z: -100, label: 'History E', color: 'bg-pink-500' },
                        ].map((node, i) => (
                            <div 
                                key={i}
                                className="absolute flex flex-col items-center gap-2 group cursor-pointer"
                                style={{ transform: `translate3d(${node.x}px, ${node.y}px, ${node.z}px)` }}
                            >
                                {/* Line to center (Visual only) */}
                                <div className="absolute top-1/2 left-1/2 w-[1px] bg-white/10 origin-top-left -z-10" 
                                     style={{ 
                                         height: Math.sqrt(node.x**2 + node.y**2 + node.z**2), 
                                         transform: `rotateZ(${Math.atan2(node.y, node.x) + Math.PI/2}rad) rotateX(${Math.atan2(node.z, Math.sqrt(node.x**2 + node.y**2))}rad)` 
                                     }}
                                ></div>
                                
                                <div className={`w-12 h-12 rounded-full ${node.color} shadow-lg flex items-center justify-center text-white font-bold border-2 border-white/20 group-hover:scale-125 transition-transform`}>
                                    {node.label[0]}
                                </div>
                                <span className="text-xs text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">{node.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Camera Controls (Virtual Joystick) */}
                <div className="absolute bottom-24 right-6 flex flex-col gap-4 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold">Xoay Ngang (Y)</label>
                        <input 
                            type="range" min="-180" max="180" value={rotationY} 
                            onChange={(e) => setRotationY(Number(e.target.value))}
                            className="w-32 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-sky-400"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold">Xoay Dọc (X)</label>
                        <input 
                            type="range" min="-90" max="90" value={rotationX} 
                            onChange={(e) => setRotationX(Number(e.target.value))}
                            className="w-32 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-sky-400"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold">Zoom</label>
                        <input 
                            type="range" min="0.5" max="2" step="0.1" value={zoom} 
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-32 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-sky-400"
                        />
                    </div>
                    <button 
                        onClick={() => { setRotationX(15); setRotationY(-25); setZoom(1); }}
                        className="mt-2 text-xs text-sky-400 hover:text-white underline text-center"
                    >
                        Đặt lại góc nhìn
                    </button>
                </div>
            </main>

            <NavigationDock activeView="3d" onNavigate={handleNavigation} />
            <footer className="h-16"></footer>
        </div>
    );
};

export default Explore3D;
