
import React, { useEffect, useRef, useState } from 'react';
import { KnowledgeNode } from '../types';
import { getReviewStatus } from '../services/sm2Service';

interface ExploreGraphProps {
    onBack: () => void;
    onShowAbout: () => void;
    onExplore?: () => void;
    onSearch?: () => void;
    onCategory?: () => void;
    on3DMode?: () => void;
    onLogout: () => void;
    onShowFAQ: () => void;
    onShowAccount: () => void;
    userNodes?: KnowledgeNode[]; // Pass user nodes to explore
    onNodeClick?: (node: KnowledgeNode) => void;
}

const ExploreGraph: React.FC<ExploreGraphProps> = ({ onBack, onShowAbout, onExplore, onSearch, onCategory, on3DMode, onLogout, onShowFAQ, onShowAccount, userNodes = [], onNodeClick }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedCategory, setSelectedCategory] = useState<'due' | 'future' | 'weak' | 'learning' | 'all'>('all');

    // Categorize nodes for the HUD
    const dueNodes = userNodes.filter(n => getReviewStatus(n) === 'due');
    const futureNodes = userNodes.filter(n => getReviewStatus(n) === 'future');
    const weakNodes = userNodes.filter(n => getReviewStatus(n) === 'weak');
    const learningNodes = userNodes.filter(n => getReviewStatus(n) === 'learning');

    // Filter displayed nodes based on selection
    const displayNodes = selectedCategory === 'all' ? userNodes : 
                         selectedCategory === 'due' ? dueNodes :
                         selectedCategory === 'future' ? futureNodes :
                         selectedCategory === 'weak' ? weakNodes : learningNodes;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let mouse = { x: -1000, y: -1000 };

        // Configuration
        const PARTICLE_COUNT = 90; // Số lượng hạt
        const CONNECT_DISTANCE = 110; // Khoảng cách kết nối
        const MOUSE_RADIUS = 150; // Vùng ảnh hưởng của chuột

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        window.addEventListener('mousemove', handleMouseMove);

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5; // Tốc độ chậm
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                // Màu sắc theo theme Neon: Cyan và Yellow
                const colors = ['rgba(34, 211, 238,', 'rgba(240, 225, 74,']; 
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < MOUSE_RADIUS) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const maxDistance = MOUSE_RADIUS;
                    const force = (maxDistance - distance) / maxDistance;
                    const directionX = forceDirectionX * force * 0.5; 
                    const directionY = forceDirectionY * force * 0.5;
                    
                    // Hạt bị hút nhẹ về phía chuột
                    this.x += directionX;
                    this.y += directionY;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `${this.color} 0.8)`;
                ctx.shadowBlur = 5;
                ctx.shadowColor = `${this.color} 0.5)`;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Connect particles to each other (Mạng lưới tri thức)
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < CONNECT_DISTANCE) {
                        ctx.beginPath();
                        const opacity = 1 - (distance / CONNECT_DISTANCE);
                        ctx.strokeStyle = `${particles[i].color} ${opacity * 0.2})`; // Đường nối mờ
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
                
                // Connect to mouse
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < MOUSE_RADIUS) {
                     ctx.beginPath();
                     const opacity = 1 - (distance / MOUSE_RADIUS);
                     ctx.strokeStyle = `${particles[i].color} ${opacity * 0.3})`;
                     ctx.lineWidth = 0.8;
                     ctx.moveTo(particles[i].x, particles[i].y);
                     ctx.lineTo(mouse.x, mouse.y);
                     ctx.stroke();
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Helper for HUD buttons
    const FilterButton = ({ type, count, label, color }: { type: string, count: number, label: string, color: string }) => (
        <button 
            onClick={() => setSelectedCategory(type as any)}
            className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-300 backdrop-blur-md ${
                selectedCategory === type 
                ? `bg-${color}/20 border-${color} shadow-[0_0_15px_rgba(0,0,0,0.3)] scale-105` 
                : `bg-black/30 border-white/10 hover:bg-white/5`
            }`}
        >
            <span className={`text-2xl font-bold text-${color}`}>{count}</span>
            <span className="text-xs text-gray-300">{label}</span>
        </button>
    );

    return (
        <div className="bg-glow-grid-bg font-display text-text-dark min-h-screen flex flex-col relative group/design-root">
            <style>{`
                .material-symbols-outlined {
                    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                }
                .grid-bg {
                    background-color: transparent;
                    background-image:
                        linear-gradient(rgba(34, 211, 238, 0.1), transparent 1px),
                        linear-gradient(90deg, rgba(34, 211, 238, 0.1), transparent 1px),
                        linear-gradient(rgba(240, 225, 74, 0.05), transparent 1px),
                        linear-gradient(90deg, rgba(240, 225, 74, 0.05), transparent 1px);
                    background-size: 70px 70px, 70px 70px, 350px 350px, 350px 350px;
                    background-position: -1px -1px, -1px -1px, -1px -1px, -1px -1px;
                    animation: gridPulse 15s ease-in-out infinite;
                }
                .crystal-node {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    cursor: pointer;
                }
                .crystal-node:hover {
                    transform: scale(1.1);
                    filter: brightness(1.2);
                }
            `}</style>
            
            {/* Background Layers */}
            <div className="absolute inset-0 bg-[#02041a] z-0"></div>
            <div className="absolute inset-0 grid-bg z-0 pointer-events-none"></div>
            
            {/* Particle Canvas */}
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 z-0 pointer-events-none"
            ></canvas>

            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden z-10">
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-sky-blue/20 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-50 bg-[#02041a]/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="text-sky-blue text-3xl">
                            <span className="material-symbols-outlined">sailing</span>
                        </div>
                        <h2 className="text-xl font-bold text-white">LearnAI</h2>
                        <div className="hidden md:flex ml-8 items-center gap-8">
                            <a className="text-sm font-medium hover:text-sky-blue text-text-muted-dark transition-colors" href="#">Tính năng</a>
                            <a onClick={(e) => { e.preventDefault(); onShowAbout(); }} className="text-sm font-medium hover:text-sky-blue text-text-muted-dark transition-colors cursor-pointer" href="#">Giới thiệu</a>
                            <a onClick={(e) => { e.preventDefault(); onShowFAQ(); }} className="text-sm font-medium hover:text-sky-blue text-text-muted-dark transition-colors cursor-pointer" href="#">Hỏi đáp</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onShowAccount}
                            className="flex gap-2 cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-sky-blue/10 border border-sky-blue/50 text-sky-blue text-sm font-medium leading-normal hover:bg-sky-blue/20 transition-colors"
                        >
                            <span className="material-symbols-outlined text-base">person</span>
                            <span className="truncate">Tài khoản</span>
                        </button>
                        <button onClick={onLogout} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-sky-blue/20 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-sky-blue/30 transition-colors">
                            <span className="truncate">Đăng xuất</span>
                        </button>
                    </div>
                </header>
                <main className="flex-grow">
                    <section className="relative min-h-[calc(100vh-160px)] w-full flex flex-col items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8">
                        <button 
                            onClick={onBack}
                            className="absolute top-6 left-6 z-30 flex items-center gap-2 px-4 py-2 bg-black/30 rounded-full shadow-md hover:bg-black/40 transition-all duration-300 backdrop-blur-sm border border-white/20 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24" }}>arrow_back</span>
                            <span className="text-sm font-bold text-white hidden sm:inline">Quay về</span>
                        </button>

                        {/* Spaced Repetition HUD */}
                        <div className="absolute top-20 right-6 z-30 w-64 bg-black/40 backdrop-blur-lg border border-sky-blue/30 rounded-2xl p-4 shadow-xl animate-[fadeIn_0.5s_ease-out]">
                            <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-neon-yellow text-sm">timelapse</span>
                                Hải trình Lặp lại (SM-2)
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                <FilterButton type="due" count={dueNodes.length} label="Đến hạn" color="red-500" />
                                <FilterButton type="future" count={futureNodes.length} label="Chưa hạn" color="green-500" />
                                <FilterButton type="weak" count={weakNodes.length} label="Còn yếu" color="orange-500" />
                                <FilterButton type="learning" count={learningNodes.length} label="Chưa vững" color="blue-400" />
                            </div>
                            <button 
                                onClick={() => setSelectedCategory('all')}
                                className={`w-full mt-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10'}`}
                            >
                                Hiển thị tất cả
                            </button>
                        </div>

                        <div className="relative w-full h-[60vh] max-w-6xl z-10 perspective-[1000px]">
                            {/* Static Background Graph */}
                            <div className="absolute w-full h-full" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg) rotateZ(-30deg)' }}>
                                <svg className="absolute w-full h-full opacity-60" fill="none" preserveAspectRatio="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="neon-stream" x1="0%" x2="100%" y1="0%" y2="0%">
                                            <stop offset="0%" stopColor="#f0e14a"></stop>
                                            <stop offset="50%" stopColor="#22d3ee"></stop>
                                            <stop offset="100%" stopColor="#f0e14a"></stop>
                                        </linearGradient>
                                        <filter height="300%" id="glow" width="300%" x="-100%" y="-100%">
                                            <feGaussianBlur result="coloredBlur" stdDeviation="2"></feGaussianBlur>
                                            <feMerge>
                                                <feMergeNode in="coloredBlur"></feMergeNode>
                                                <feMergeNode in="SourceGraphic"></feMergeNode>
                                            </feMerge>
                                        </filter>
                                    </defs>
                                    <g filter="url(#glow)">
                                        <path d="M 22 50 C 30 50, 30 35, 40 35" stroke="url(#neon-stream)" strokeLinecap="round" strokeWidth="0.8"></path>
                                        <path d="M 22 50 C 30 50, 30 65, 40 65" stroke="url(#neon-stream)" strokeLinecap="round" strokeWidth="0.8"></path>
                                        <path d="M 60 35 C 70 35, 70 50, 78 50" stroke="url(#neon-stream)" strokeLinecap="round" strokeWidth="0.8"></path>
                                        <path d="M 60 65 C 70 65, 70 50, 78 50" stroke="url(#neon-stream)" strokeLinecap="round" strokeWidth="0.8"></path>
                                        <path d="M 40 35 C 45 35, 55 35, 60 35" stroke="url(#neon-stream)" strokeLinecap="round" strokeWidth="0.8"></path>
                                        <path d="M 40 65 C 45 65, 55 65, 60 65" stroke="url(#neon-stream)" strokeLinecap="round" strokeWidth="0.8"></path>
                                    </g>
                                </svg>
                                
                                {/* Render User Nodes on the Graph */}
                                {displayNodes.map((node) => {
                                    // Determine visual style based on status
                                    let borderColor = 'border-white/30';
                                    let shadowColor = 'shadow-glow-blue';
                                    let statusIndicator = null;

                                    if (getReviewStatus(node) === 'due') {
                                        borderColor = 'border-red-500/80';
                                        shadowColor = 'shadow-[0_0_20px_rgba(239,68,68,0.6)]';
                                        statusIndicator = <div className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full animate-ping"></div>;
                                    } else if (getReviewStatus(node) === 'weak') {
                                        borderColor = 'border-orange-500/80';
                                        shadowColor = 'shadow-[0_0_20px_rgba(249,115,22,0.6)]';
                                    }

                                    return (
                                        <div 
                                            key={node.id}
                                            onClick={() => onNodeClick && onNodeClick(node)}
                                            className="crystal-node absolute animate-float" 
                                            style={{ 
                                                top: `${node.y}%`, 
                                                left: `${node.x}%`, 
                                                animationDuration: `${5 + Math.random() * 5}s`,
                                                animationDelay: `-${Math.random() * 5}s`
                                            }}
                                        >
                                            <div className={`relative px-5 py-3 text-sm font-bold text-white bg-black/60 rounded-2xl ${shadowColor} border ${borderColor} backdrop-blur-sm flex items-center gap-2 group`}>
                                                {statusIndicator}
                                                <span className="truncate max-w-[120px]">{node.title}</span>
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 text-xs rounded whitespace-nowrap z-50 pointer-events-none">
                                                    {node.type} • Interval: {node.sm2?.interval}d
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="absolute bottom-6 right-6 z-30 flex flex-col gap-3">
                            <button 
                                onClick={onSearch}
                                className="flex items-center justify-center gap-2.5 px-4 py-2.5 bg-sky-blue/10 text-sky-blue rounded-full border border-sky-blue/30 backdrop-blur-md hover:bg-sky-blue/20 hover:border-sky-blue/50 transition-all shadow-glow-neon"
                            >
                                <span className="material-symbols-outlined text-base">search</span>
                                <span className="text-sm font-semibold">Tìm kiếm</span>
                            </button>
                            <button 
                                onClick={onCategory}
                                className="flex items-center justify-center gap-2.5 px-4 py-2.5 bg-sky-blue/10 text-sky-blue rounded-full border border-sky-blue/30 backdrop-blur-md hover:bg-sky-blue/20 hover:border-sky-blue/50 transition-all shadow-glow-neon"
                            >
                                <span className="material-symbols-outlined text-base">category</span>
                                <span className="text-sm font-semibold">Phân loại</span>
                            </button>
                            <button 
                                onClick={on3DMode}
                                className="flex items-center justify-center gap-2.5 px-4 py-2.5 bg-sky-blue/10 text-sky-blue rounded-full border border-sky-blue/30 backdrop-blur-md hover:bg-sky-blue/20 hover:border-sky-blue/50 transition-all shadow-glow-neon"
                            >
                                <span className="material-symbols-outlined text-base">3d_rotation</span>
                                <span className="text-sm font-semibold">Chế độ 3D</span>
                            </button>
                        </div>
                    </section>
                </main>
                <footer className="px-4 sm:px-6 lg:px-8 py-8 border-t border-sky-blue/20 bg-[#02041a]/80 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="text-sky-blue text-2xl">
                                <span className="material-symbols-outlined">sailing</span>
                            </div>
                            <h2 className="text-lg font-bold text-white">LearnAI</h2>
                        </div>
                        <div className="flex gap-6 text-sm font-medium text-text-muted-dark">
                            <a className="hover:text-sky-blue transition-colors" href="#">Điều khoản dịch vụ</a>
                            <a className="hover:text-sky-blue transition-colors" href="#">Chính sách bảo mật</a>
                        </div>
                        <p className="text-sm text-text-muted-dark">© 2024 LearnAI. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ExploreGraph;
