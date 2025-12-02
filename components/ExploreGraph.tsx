
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { KnowledgeNode } from '../types';
import { getNodeAggregateStatus } from '../services/sm2Service';
import { deepAnalyzeContent, generateLearningPath } from '../services/geminiService';
import NavigationDock from './NavigationDock';

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
    userNodes?: KnowledgeNode[];
    onNodeClick?: (node: KnowledgeNode) => void;
    onStartPlaylist?: (nodes: KnowledgeNode[]) => void;
    onMergeNodes?: (nodes: KnowledgeNode[]) => void;
    onDeleteNodes?: (nodes: KnowledgeNode[]) => void;
}

// Physics Constants
const REPULSION_FORCE = 800;
const SPRING_LENGTH = 150;
const SPRING_STRENGTH = 0.05;
const CENTER_GRAVITY = 0.0005;
const DAMPING = 0.85; // Friction to stop movement eventually
const VELOCITY_DECAY = 0.96; // Air resistance

type FilterMode = 'all' | 'due' | 'weak' | 'mastered';

const ExploreGraph: React.FC<ExploreGraphProps> = ({ onBack, onSearch, onCategory, on3DMode, onLogout, onShowAccount, userNodes = [], onNodeClick, onStartPlaylist, onMergeNodes, onDeleteNodes }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Graph State
    const [nodes, setNodes] = useState<any[]>([]);
    const [links, setLinks] = useState<any[]>([]);
    
    // Interaction State
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const [draggedNode, setDraggedNode] = useState<string | null>(null);
    const [linkingSource, setLinkingSource] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    
    // Selection State
    const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
    
    // Analysis State
    const [isThinking, setIsThinking] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);

    // Feature: Spectral Filters
    const [filterMode, setFilterMode] = useState<FilterMode>('all');

    // Feature: AI Pathfinder
    const [isPathfinding, setIsPathfinding] = useState(false);
    const [pathModeTargetId, setPathModeTargetId] = useState<string | null>(null);
    const [suggestedPathIds, setSuggestedPathIds] = useState<string[]>([]);

    // Helper for node color (needs to be available for useEffect)
    const getNodeColor = (node: KnowledgeNode) => {
        // Tag-based coloring
        const tag = node.tags && node.tags.length > 0 ? node.tags[0] : 'General';
        let hash = 0;
        for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + '00000'.substring(0, 6 - c.length) + c;
    };

    // Initialize Simulation Data - Optimized for stability
    useEffect(() => {
        if (!containerRef.current) return;
        const { width, height } = containerRef.current.getBoundingClientRect();

        setNodes(prevNodes => {
            return userNodes.map(n => {
                // Try to find existing node state to preserve physics
                const existing = prevNodes.find(pn => pn.id === n.id);
                
                if (existing) {
                    return {
                        ...existing, // Keep x, y, vx, vy
                        ...n, // Update data like title, tags, status, but override old physics with existing physics
                        // Ensure we use the latest visual properties if changed
                        color: getNodeColor(n),
                        radius: 8 + (n.tags?.length || 0) * 1.5,
                        status: getNodeAggregateStatus(n)
                    };
                }

                // New node initialization
                return {
                    ...n,
                    // Map percentage coordinates to absolute pixels if it's the first load
                    x: (n.x / 100) * width || Math.random() * width,
                    y: (n.y / 100) * height || Math.random() * height,
                    vx: (Math.random() - 0.5) * 2, // Velocity X
                    vy: (Math.random() - 0.5) * 2, // Velocity Y
                    radius: 8 + (n.tags?.length || 0) * 1.5, // Size based on connectivity/importance
                    color: getNodeColor(n),
                    status: getNodeAggregateStatus(n)
                };
            });
        });
    }, [userNodes]);

    // Recalculate Links when nodes change
    useEffect(() => {
        const newLinks: any[] = [];
        
        // 1. Tag-based connections (Automatic)
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeA = nodes[i];
                const nodeB = nodes[j];
                const commonTags = nodeA.tags?.filter((t: string) => nodeB.tags?.includes(t));
                if (commonTags && commonTags.length > 0) {
                    newLinks.push({ source: nodeA.id, target: nodeB.id, type: 'tag' });
                }
            }
        }

        // 2. Manual connections (User created)
        nodes.forEach(node => {
            if (node.connectedNodeIds) {
                node.connectedNodeIds.forEach((targetId: string) => {
                    // Check if target exists in current nodes
                    if (nodes.find(n => n.id === targetId)) {
                         // Check distinct link existence
                        if (!newLinks.find(l => (l.source === node.id && l.target === targetId) || (l.source === targetId && l.target === node.id))) {
                            newLinks.push({ source: node.id, target: targetId, type: 'manual' });
                        }
                    }
                });
            }
        });

        // 3. AI Pathfinder Connections (Visual Overlay)
        if (suggestedPathIds.length > 1) {
            for (let i = 0; i < suggestedPathIds.length - 1; i++) {
                const sourceId = suggestedPathIds[i];
                const targetId = suggestedPathIds[i+1];
                // Only add visual link if nodes exist
                if (nodes.find(n => n.id === sourceId) && nodes.find(n => n.id === targetId)) {
                     newLinks.push({ source: sourceId, target: targetId, type: 'path' });
                }
            }
        }

        setLinks(newLinks);
    }, [nodes, suggestedPathIds]);

    // Physics Loop & Rendering
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resize = () => {
            if (containerRef.current) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;
            }
        };
        window.addEventListener('resize', resize);
        resize();

        const animate = () => {
            if (!ctx) return;
            const width = canvas.width;
            const height = canvas.height;
            const center = { x: width / 2, y: height / 2 };

            ctx.clearRect(0, 0, width, height);

            // 1. Calculate Forces
            nodes.forEach(node => {
                if (node.id === draggedNode) return; // Don't apply physics to dragged node

                let fx = 0, fy = 0;

                // Repulsion (Coulomb) - Push apart
                nodes.forEach(other => {
                    if (node.id === other.id) return;
                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    let dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    if (dist < 300) { // Only affect nearby
                        const force = REPULSION_FORCE / (dist * dist);
                        fx += (dx / dist) * force;
                        fy += (dy / dist) * force;
                    }
                });

                // Attraction to Center (Gravity) - Keep in view
                const dxCenter = center.x - node.x;
                const dyCenter = center.y - node.y;
                fx += dxCenter * CENTER_GRAVITY;
                fy += dyCenter * CENTER_GRAVITY;

                // Apply Force to Velocity
                node.vx = (node.vx + fx) * VELOCITY_DECAY;
                node.vy = (node.vy + fy) * VELOCITY_DECAY;
            });

            // Link Attraction (Spring)
            links.forEach(link => {
                const source = nodes.find(n => n.id === link.source);
                const target = nodes.find(n => n.id === link.target);
                if (!source || !target) return;

                const dx = target.x - source.x;
                const dy = target.y - source.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                
                // Spring force: proportional to displacement from resting length
                const force = (dist - SPRING_LENGTH) * SPRING_STRENGTH;
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;

                if (source.id !== draggedNode) {
                    source.vx += fx;
                    source.vy += fy;
                }
                if (target.id !== draggedNode) {
                    target.vx -= fx;
                    target.vy -= fy;
                }
            });

            // 2. Update Positions & Draw Lines
            // Draw links first (behind nodes)
            links.forEach(link => {
                const source = nodes.find(n => n.id === link.source);
                const target = nodes.find(n => n.id === link.target);
                if (!source || !target) return;

                // Check filter visibility for links: both nodes must be visible
                const sourceVisible = filterMode === 'all' || 
                                      (filterMode === 'due' && source.status === 'due') || 
                                      (filterMode === 'weak' && source.status === 'weak') ||
                                      (filterMode === 'mastered' && source.status === 'future');
                const targetVisible = filterMode === 'all' || 
                                      (filterMode === 'due' && target.status === 'due') || 
                                      (filterMode === 'weak' && target.status === 'weak') ||
                                      (filterMode === 'mastered' && target.status === 'future');

                ctx.globalAlpha = (sourceVisible && targetVisible) ? 1 : 0.05;

                ctx.beginPath();
                ctx.moveTo(source.x, source.y);
                ctx.lineTo(target.x, target.y);
                
                if (link.type === 'path') {
                    // Pathfinder link
                    ctx.strokeStyle = '#00FF00'; // Bright Green
                    ctx.lineWidth = 4;
                    ctx.shadowColor = '#00FF00';
                    ctx.shadowBlur = 10;
                } else {
                    ctx.strokeStyle = link.type === 'manual' ? 'rgba(255, 215, 0, 0.6)' : 'rgba(100, 116, 139, 0.2)'; // Gold for manual, Slate for auto
                    ctx.lineWidth = link.type === 'manual' ? 2 : 1;
                    ctx.shadowBlur = 0;
                }
                
                ctx.stroke();
                ctx.shadowBlur = 0;
            });

            ctx.globalAlpha = 1; // Reset alpha for manual linking line

            // 3. Draw Linking Line (if actively linking)
            if (linkingSource) {
                const source = nodes.find(n => n.id === linkingSource);
                if (source) {
                    ctx.beginPath();
                    ctx.moveTo(source.x, source.y);
                    ctx.lineTo(mousePos.x, mousePos.y);
                    ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
                    ctx.setLineDash([5, 5]);
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            }

            // 4. Draw Nodes
            nodes.forEach(node => {
                // Apply Velocity
                if (node.id !== draggedNode) {
                    node.x += node.vx;
                    node.y += node.vy;
                }

                // Bounds checking (Keep inside canvas roughly)
                const padding = 20;
                if (node.x < padding) node.vx += 1;
                if (node.x > width - padding) node.vx -= 1;
                if (node.y < padding) node.vy += 1;
                if (node.y > height - padding) node.vy -= 1;

                // --- Spectral Filter Check ---
                // 'future' status means mastered/not due
                const isDue = node.status === 'due' || node.status === 'learning';
                const isWeak = node.status === 'weak';
                const isMastered = node.status === 'future';

                let isVisible = true;
                if (filterMode === 'due' && !isDue) isVisible = false;
                if (filterMode === 'weak' && !isWeak) isVisible = false;
                if (filterMode === 'mastered' && !isMastered) isVisible = false;

                // Ghosting effect for filtered out nodes
                ctx.globalAlpha = isVisible ? 1 : 0.1;

                // Draw Node
                const isSelected = selectedNodeIds.has(node.id);
                const isHovered = hoveredNodeId === node.id;
                const isInPath = suggestedPathIds.includes(node.id);

                // Glow effect for selected/hovered/due/path
                if ((isSelected || isHovered || isDue || isInPath) && isVisible) {
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
                    if (isInPath) {
                        ctx.fillStyle = 'rgba(0, 255, 0, 0.4)'; // Green for path
                    } else {
                        ctx.fillStyle = isDue ? 'rgba(239, 68, 68, 0.3)' : 'rgba(56, 189, 248, 0.3)';
                    }
                    ctx.fill();
                }

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                ctx.shadowBlur = (isHovered && isVisible) ? 15 : 5;
                ctx.shadowColor = node.color;
                ctx.fill();
                ctx.shadowBlur = 0; // Reset

                // Border for selection
                if (isSelected) {
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }

                // Label (Only if hovered or selected or few nodes OR if visibility filter is active OR in Path)
                if ((isHovered || isSelected || isInPath || nodes.length < 15 || filterMode !== 'all') && isVisible) {
                    ctx.fillStyle = '#fff';
                    ctx.font = isHovered ? 'bold 12px Lexend' : '10px Lexend';
                    ctx.textAlign = 'center';
                    ctx.fillText(node.title, node.x, node.y + node.radius + 15);
                    
                    if (isInPath) {
                        // Order number
                        const order = suggestedPathIds.indexOf(node.id) + 1;
                        ctx.fillStyle = '#00FF00';
                        ctx.font = 'bold 10px Lexend';
                        ctx.fillText(`${order}`, node.x, node.y - node.radius - 5);
                    }
                }
            });
            
            ctx.globalAlpha = 1; // Reset at end of frame

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [nodes, links, draggedNode, linkingSource, mousePos, hoveredNodeId, selectedNodeIds, filterMode, suggestedPathIds]);

    // Interaction Handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Find clicked node
        // Reverse iterate to click top nodes first
        const clickedNode = [...nodes].reverse().find(node => {
            const dx = node.x - x;
            const dy = node.y - y;
            return Math.sqrt(dx*dx + dy*dy) < node.radius + 5;
        });

        if (clickedNode) {
            if (pathModeTargetId) {
                // If in pathfinding target selection mode
                handleGeneratePath(clickedNode);
                return;
            }

            if (e.ctrlKey || e.metaKey) {
                // Manual Linking Mode or Multi-Select
                setLinkingSource(clickedNode.id);
            } else {
                // Dragging Mode
                setDraggedNode(clickedNode.id);
                // Also select it if not adding to multi-selection
                if (!selectedNodeIds.has(clickedNode.id)) {
                    setSelectedNodeIds(new Set([clickedNode.id]));
                    onNodeClick && onNodeClick(clickedNode);
                }
            }
        } else {
            // Clicked background - clear selection & path
            if (!e.ctrlKey) {
                setSelectedNodeIds(new Set());
                if (!isPathfinding) setSuggestedPathIds([]);
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos({ x, y });

        // Hover detection
        const hovered = nodes.find(node => {
            const dx = node.x - x;
            const dy = node.y - y;
            return Math.sqrt(dx*dx + dy*dy) < node.radius + 5;
        });
        setHoveredNodeId(hovered ? hovered.id : null);

        if (draggedNode) {
            // Update dragged node position directly
            setNodes(prev => prev.map(n => {
                if (n.id === draggedNode) {
                    return { ...n, x: x, y: y, vx: 0, vy: 0 };
                }
                return n;
            }));
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (linkingSource) {
            // Finish linking?
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const targetNode = nodes.find(node => {
                    const dx = node.x - x;
                    const dy = node.y - y;
                    return Math.sqrt(dx*dx + dy*dy) < node.radius + 10;
                });

                if (targetNode && targetNode.id !== linkingSource) {
                    // Create manual link!
                    setNodes(prev => prev.map(n => {
                        if (n.id === linkingSource) {
                            const currentConnections = n.connectedNodeIds || [];
                            if (!currentConnections.includes(targetNode.id)) {
                                return { ...n, connectedNodeIds: [...currentConnections, targetNode.id] };
                            }
                        }
                        return n;
                    }));
                } else if (targetNode && targetNode.id === linkingSource) {
                    // It was just a Ctrl+Click (Select)
                    const newSelection = new Set(selectedNodeIds);
                    if (newSelection.has(linkingSource)) newSelection.delete(linkingSource);
                    else newSelection.add(linkingSource);
                    setSelectedNodeIds(newSelection);
                }
            }
        }

        setDraggedNode(null);
        setLinkingSource(null);
    };

    const handleNavigation = (view: 'graph' | 'search' | 'category' | '3d') => {
        if (view === 'search' && onSearch) onSearch();
        if (view === 'category' && onCategory) onCategory();
        if (view === '3d' && on3DMode) on3DMode();
    };

    const handleDeepAnalysis = async () => {
        if (nodes.length === 0) return;
        setIsThinking(true);
        const context = nodes.map(n => `Title: ${n.title}, Type: ${n.type}, Tags: ${n.tags?.join(', ')}`).join('\n');
        const result = await deepAnalyzeContent(context);
        setAnalysisResult(result);
        setIsThinking(false);
    };

    const handleDelete = () => {
        if (!onDeleteNodes) return;
        const nodesToDelete = nodes.filter(n => selectedNodeIds.has(n.id));
        if (nodesToDelete.length > 0) {
            onDeleteNodes(nodesToDelete);
            setSelectedNodeIds(new Set()); // Clear selection after delete
        }
    };

    // --- Pathfinding Logic ---
    const startPathfinding = () => {
        setIsPathfinding(true);
        setPathModeTargetId('SELECT'); // Waiting for selection
        setSuggestedPathIds([]);
    };

    const handleGeneratePath = async (targetNode: any) => {
        setPathModeTargetId(null); // Stop selecting
        setIsThinking(true);
        
        // Prepare context for AI
        const context = nodes.map(n => `ID: ${n.id}, Title: ${n.title}, Tags: ${n.tags?.join(', ')}`).join('\n');
        
        const pathIds = await generateLearningPath(targetNode.title, context);
        
        // Add target node to the end if not present (AI might miss it)
        if (!pathIds.includes(targetNode.id)) {
            pathIds.push(targetNode.id);
        }

        setSuggestedPathIds(pathIds);
        setIsThinking(false);
        setIsPathfinding(false);
    };

    return (
        <div className="bg-[#02041a] font-display text-text-dark min-h-screen flex flex-col relative overflow-hidden select-none">
            {/* Grid Background */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-20 z-0"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            ></div>

            {/* Canvas Layer */}
            <div className={`flex-grow relative h-[calc(100vh-80px)] w-full ${pathModeTargetId === 'SELECT' ? 'cursor-alias' : 'cursor-crosshair'}`} ref={containerRef}>
                <canvas 
                    ref={canvasRef} 
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={() => { setDraggedNode(null); setLinkingSource(null); }}
                    className="absolute inset-0 z-10"
                />
            </div>

            {/* UI Overlays */}
            <button onClick={onBack} className="absolute top-6 left-6 z-30 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-sm border border-white/10 transition-all text-white text-sm font-bold shadow-lg">
                <span className="material-symbols-outlined text-lg">arrow_back</span> Quay về
            </button>

            {/* Spectral Filters Toolbar */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 p-1 bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
                <button 
                    onClick={() => setFilterMode('all')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterMode === 'all' ? 'bg-white text-black shadow-glow-white-sm' : 'text-slate-400 hover:text-white'}`}
                >
                    Tất cả
                </button>
                <button 
                    onClick={() => setFilterMode('due')}
                    className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterMode === 'due' ? 'bg-red-500 text-white shadow-lg' : 'text-slate-400 hover:text-red-400'}`}
                >
                    <span className="material-symbols-outlined text-[14px]">notifications_active</span>
                    Đến hạn
                </button>
                <button 
                    onClick={() => setFilterMode('weak')}
                    className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterMode === 'weak' ? 'bg-yellow-500 text-black shadow-lg' : 'text-slate-400 hover:text-yellow-400'}`}
                >
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Yếu
                </button>
                <button 
                    onClick={() => setFilterMode('mastered')}
                    className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterMode === 'mastered' ? 'bg-green-500 text-white shadow-lg' : 'text-slate-400 hover:text-green-400'}`}
                >
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Đã thuộc
                </button>
            </div>

            {/* HUD Panel */}
            <div className="absolute top-6 right-6 z-30 w-60 bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-xs font-bold uppercase tracking-widest text-sky-400">Điều khiển</h3>
                    <div className="flex gap-2">
                        <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-1 rounded">Nodes: {nodes.length}</span>
                    </div>
                </div>
                <div className="text-xs text-slate-400 space-y-2 mb-4">
                    <p>• <b>Kéo</b> để di chuyển node</p>
                    <p>• <b>Ctrl + Kéo</b> để nối dây</p>
                    <p>• <b>Ctrl + Click</b> để chọn nhiều</p>
                </div>
                
                <div className="pt-4 border-t border-white/10 space-y-2">
                    <button 
                        onClick={handleDeepAnalysis}
                        disabled={isThinking}
                        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isThinking ? <span className="material-symbols-outlined animate-spin text-lg">sync</span> : <span className="material-symbols-outlined text-lg">psychology</span>}
                        {isThinking ? "Đang suy nghĩ..." : "Phân tích Sâu"}
                    </button>
                    
                    <button 
                        onClick={startPathfinding}
                        disabled={isThinking}
                        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-lg">explore</span>
                        Tìm Lộ Trình
                    </button>
                </div>
            </div>

            {/* Instruction Toast for Pathfinder */}
            {pathModeTargetId === 'SELECT' && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 bg-black/80 text-white px-6 py-3 rounded-full border border-green-500 shadow-glow-green animate-bounce">
                    Chọn một nốt mục tiêu để AI vẽ lộ trình
                </div>
            )}

            {/* Floating Action Bar */}
            {selectedNodeIds.size > 0 && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl animate-[fadeInUp_0.3s_ease-out]">
                    <span className="text-white font-bold text-sm mr-2">{selectedNodeIds.size} đã chọn</span>
                    <div className="h-6 w-[1px] bg-white/20"></div>
                    <button 
                        onClick={() => onStartPlaylist && onStartPlaylist(nodes.filter(n => selectedNodeIds.has(n.id)))}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white text-sm font-bold transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">play_circle</span>
                        Học Playlist
                    </button>
                    <button 
                        onClick={() => onMergeNodes && onMergeNodes(nodes.filter(n => selectedNodeIds.has(n.id)))}
                        disabled={selectedNodeIds.size < 2}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">call_merge</span>
                        Hợp nhất
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                    <button 
                        onClick={() => setSelectedNodeIds(new Set())}
                        className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>
            )}

            {/* Deep Analysis Modal */}
            {analysisResult && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.3s]">
                    <div className="bg-[#0f172a] border border-purple-500/50 p-8 rounded-2xl max-w-2xl w-full shadow-2xl relative max-h-[80vh] overflow-y-auto">
                        <button onClick={() => setAnalysisResult(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><span className="material-symbols-outlined">close</span></button>
                        <h3 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2"><span className="material-symbols-outlined">psychology</span> Kết quả Phân tích</h3>
                        <div className="prose prose-invert prose-p:text-slate-300"><p className="whitespace-pre-wrap">{analysisResult}</p></div>
                    </div>
                </div>
            )}

            <NavigationDock activeView="graph" onNavigate={handleNavigation} />
        </div>
    );
};

export default ExploreGraph;
