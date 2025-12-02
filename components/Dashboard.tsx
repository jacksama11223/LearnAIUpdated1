
import React from 'react';

interface DashboardProps {
  onLogout: () => void;
  onFeatureSelect: (feature: string) => void;
  onShowAbout: () => void;
  onShowFAQ: () => void;
  onShowAccount: () => void;
  stats?: { due: number; weak: number; new: number };
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, onFeatureSelect, onShowAbout, onShowFAQ, onShowAccount, stats }) => {
  
  const FeatureCard = ({ icon, title, desc, onClick, color }: { icon: string, title: string, desc: string, onClick: () => void, color: string }) => (
    <button 
        onClick={onClick} 
        className={`group relative flex flex-col items-center justify-center text-center p-6 w-full aspect-square rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10 overflow-hidden shadow-lg`}
    >
        {/* Hover Glow Background */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-${color}`}></div>
        
        <div className={`flex items-center justify-center size-16 rounded-full bg-white/10 mb-4 group-hover:scale-110 transition-transform shadow-inner`}>
            <span className={`material-symbols-outlined text-4xl text-${color}`}>{icon}</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-xs text-slate-300 font-medium">{desc}</p>
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </button>
  );

  return (
    <div className="bg-deep-sea-blue min-h-screen font-display text-text-dark flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-pastel-blue/20 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-50 bg-deep-sea-blue/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="text-pastel-blue text-3xl">
            <span className="material-symbols-outlined">sailing</span>
          </div>
          <h2 className="text-xl font-bold text-white logo-glow">LearnAI</h2>
          <div className="hidden md:flex ml-8 items-center gap-8">
            <a className="text-sm font-medium text-pastel-blue hover:text-white transition-colors" href="#">Tính năng</a>
            <a onClick={(e) => { e.preventDefault(); onShowAbout(); }} className="text-sm font-medium text-pastel-blue hover:text-white transition-colors cursor-pointer" href="#">Giới thiệu</a>
            <a onClick={(e) => { e.preventDefault(); onShowFAQ(); }} className="text-sm font-medium text-pastel-blue hover:text-white transition-colors cursor-pointer" href="#">Hỏi đáp</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onShowAccount}
            className="flex gap-2 cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 pl-2 pr-4 bg-transparent border border-pastel-blue/50 text-pastel-blue text-sm font-medium leading-normal hover:bg-pastel-blue/10 transition-colors"
          >
            <div className="flex items-center justify-center bg-pastel-blue/20 aspect-square rounded-full size-8">
                <span className="material-symbols-outlined text-xl">person</span>
            </div>
            <span className="truncate">Tài khoản</span>
          </button>
          <button 
            onClick={onLogout}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-coral-pink text-slate-900 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-coral-pink/90 transition-colors shadow-lg hover:shadow-coral-pink/40"
          >
            <span className="truncate">Đăng xuất</span>
          </button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden deep-sea-gradient">
          <div className="animated-bg">
            <div className="sun-rays"></div>
            <div className="water-texture"></div>
            <div className="bubbles">
                <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-10">
            <div className="text-center">
              <h1 className="text-4xl font-black leading-tight tracking-tighter md:text-5xl lg:text-6xl text-white" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>Bảng điều khiển Hải đăng</h1>
              <p className="mt-4 text-base font-normal leading-normal text-text-muted-dark md:text-lg">Chào mừng trở lại! Hãy cùng khám phá đại dương tri thức.</p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/20 transition-colors">
                <div className="p-3 bg-red-500/20 rounded-full text-red-300">
                    <span className="material-symbols-outlined text-3xl">notifications_active</span>
                </div>
                <div>
                    <h3 className="text-white font-bold text-2xl">{stats?.due || 0}</h3>
                    <p className="text-xs text-slate-300 uppercase tracking-wider font-bold">Thẻ đến hạn</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/20 transition-colors">
                <div className="p-3 bg-yellow-500/20 rounded-full text-yellow-300">
                    <span className="material-symbols-outlined text-3xl">warning</span>
                </div>
                <div>
                    <h3 className="text-white font-bold text-2xl">{stats?.weak || 0}</h3>
                    <p className="text-xs text-slate-300 uppercase tracking-wider font-bold">Thẻ còn yếu</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/20 transition-colors">
                <div className="p-3 bg-blue-500/20 rounded-full text-blue-300">
                    <span className="material-symbols-outlined text-3xl">fiber_new</span>
                </div>
                <div>
                    <h3 className="text-white font-bold text-2xl">{stats?.new || 0}</h3>
                    <p className="text-xs text-slate-300 uppercase tracking-wider font-bold">Thẻ chưa hoàn thành</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Navigation Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 relative bg-deep-sea-blue overflow-hidden">
          <div className="relative max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 pl-2 border-l-4 border-coral-pink">Công cụ Thám hiểm</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <FeatureCard 
                icon="science" 
                title="Giả kim thuật" 
                desc="Biến văn bản thành bài học" 
                color="pastel-blue"
                onClick={() => onFeatureSelect('alchemy')} 
              />
              <FeatureCard 
                icon="hub" 
                title="Sơ đồ tri thức" 
                desc="Bản đồ tư duy của bạn" 
                color="coral-pink"
                onClick={() => onFeatureSelect('knowledge-graph')} 
              />
              <FeatureCard 
                icon="record_voice_over" 
                title="Gia sư biện chứng" 
                desc="Đối thoại cùng AI Socratic" 
                color="jade-green"
                onClick={() => onFeatureSelect('tutor')} 
              />
              <FeatureCard 
                icon="explore" 
                title="Khám phá" 
                desc="Tìm kiếm và mở rộng" 
                color="warm-gold"
                onClick={() => onFeatureSelect('explore-graph')} 
              />
              <FeatureCard 
                icon="perm_media" 
                title="Thẻ đa phương tiện" 
                desc="Học qua hình ảnh & video" 
                color="map-purple"
                onClick={() => onFeatureSelect('media')} 
              />
              <FeatureCard 
                icon="menu_book" 
                title="Tiêu hóa kiến thức" 
                desc="Tóm tắt & Mental Models" 
                color="map-blue"
                onClick={() => onFeatureSelect('digest')} 
              />
              <FeatureCard 
                icon="bolt" 
                title="Cram Mode" 
                desc="Ôn thi cấp tốc" 
                color="coral-orange"
                onClick={() => onFeatureSelect('quick-learn')} 
              />
              <FeatureCard 
                icon="school" 
                title="Thi chứng chỉ" 
                desc="Lộ trình chinh phục" 
                color="text-white"
                onClick={() => onFeatureSelect('exam')} 
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-8 border-t border-blue-300/20 bg-deep-sea-blue/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="text-pastel-blue text-2xl">
              <span className="material-symbols-outlined">sailing</span>
            </div>
            <h2 className="text-lg font-bold text-white">LearnAI</h2>
          </div>
          <div className="flex gap-6 text-sm font-medium text-text-muted-dark">
            <a className="hover:text-pastel-blue transition-colors" href="#">Điều khoản dịch vụ</a>
            <a className="hover:text-pastel-blue transition-colors" href="#">Chính sách bảo mật</a>
          </div>
          <p className="text-sm text-text-muted-dark">© 2024 LearnAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;