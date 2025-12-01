
import React from 'react';

interface DashboardProps {
  onLogout: () => void;
  onFeatureSelect: (feature: string) => void;
  onShowAbout: () => void;
  onShowFAQ: () => void;
  onShowAccount: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, onFeatureSelect, onShowAbout, onShowFAQ, onShowAccount }) => {
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
        <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden deep-sea-gradient">
          <div className="animated-bg">
            <div className="sun-rays"></div>
            <div className="water-texture"></div>
            <div className="bubbles">
                <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-12">
            <div className="text-center">
              <h1 className="text-4xl font-black leading-tight tracking-tighter md:text-5xl lg:text-6xl text-white" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>Bảng điều khiển Hải đăng</h1>
              <p className="mt-4 text-base font-normal leading-normal text-text-muted-dark md:text-lg">Chào mừng trở lại! Hãy cùng khám phá đại dương tri thức và tiếp tục hành trình của bạn.</p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full [perspective:1000px]">
              {/* Card 1 */}
              <div className="bg-blue-900/40 backdrop-blur-lg p-6 rounded-2xl border border-blue-300/20 text-center flex flex-col items-center gap-3 transition-transform duration-500 hover:scale-105">
                <div className="relative">
                  <svg className="size-24 text-pastel-blue" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 100 100">
                    <path className="text-blue-300/20" d="M 50,50 m 0,-45 a 45,45 0 1 1 0,90 a 45,45 0 1 1 0,-90"></path>
                    <path d="M 50,50 m 0,-45 a 45,45 0 1 1 0,90 a 45,45 0 1 1 0,-90" pathLength="1" strokeDasharray="0.75 1" strokeDashoffset="0.25" strokeLinecap="round"></path>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white stat-shimmer rounded-full">75%</div>
                </div>
                <h3 className="font-bold text-lg text-white">Tiến độ hàng ngày</h3>
                <p className="text-sm text-text-muted-dark">Hoàn thành 3/4 mục tiêu</p>
              </div>

              {/* Card 2 */}
              <div className="bg-blue-900/40 backdrop-blur-lg p-6 rounded-2xl border border-blue-300/20 text-center flex flex-col items-center gap-3 transition-transform duration-500 hover:scale-105">
                <span className="material-symbols-outlined text-5xl text-coral-pink stat-shimmer rounded-full p-2">school</span>
                <h3 className="font-bold text-lg text-white">Khóa học của tôi</h3>
                <p className="text-sm text-text-muted-dark">Đang học: 2 | Đã hoàn thành: 5</p>
                <button 
                    onClick={() => onFeatureSelect('courses')}
                    className="relative mt-auto w-full text-sm font-semibold bg-pastel-blue/20 text-pastel-blue py-2 px-4 rounded-full hover:bg-pastel-blue/30 transition-colors overflow-hidden btn-bubble"
                >
                    Xem tất cả
                </button>
              </div>

              {/* Card 3 */}
              <div className="bg-blue-900/40 backdrop-blur-lg p-6 rounded-2xl border border-blue-300/20 text-center flex flex-col items-center gap-3 transition-transform duration-500 hover:scale-105">
                <span className="material-symbols-outlined text-5xl text-accent stat-shimmer rounded-full p-2">lightbulb</span>
                <h3 className="font-bold text-lg text-white">Gợi ý cho bạn</h3>
                <p className="text-sm text-text-muted-dark">Ôn tập "Lịch sử Thế giới" để củng cố kiến thức.</p>
                <button 
                    onClick={() => onFeatureSelect('review')}
                    className="relative mt-auto w-full text-sm font-semibold bg-pastel-blue/20 text-pastel-blue py-2 px-4 rounded-full hover:bg-pastel-blue/30 transition-colors overflow-hidden btn-bubble"
                >
                    Bắt đầu ngay
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Navigation */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative bg-deep-sea-blue overflow-hidden">
          <div className="absolute inset-0 opacity-20">
          </div>
          <div className="relative flex flex-col gap-12 @container max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
              <button onClick={() => onFeatureSelect('alchemy')} className="group pearl-card flex flex-col items-center justify-center text-center gap-2 p-4 size-40 md:size-48 rounded-full border border-pastel-blue/30">
                <div className="flex items-center justify-center size-14 rounded-full bg-pastel-blue/20 text-pastel-blue text-3xl transition-colors group-hover:bg-pastel-blue group-hover:text-deep-sea-blue"><span className="material-symbols-outlined">science</span></div>
                <p className="text-base font-bold text-white">Giả kim thuật nội dung</p>
              </button>
              
              <button onClick={() => onFeatureSelect('knowledge-graph')} className="group pearl-card flex flex-col items-center justify-center text-center gap-2 p-4 size-40 md:size-48 rounded-full border border-pastel-blue/30">
                <div className="flex items-center justify-center size-14 rounded-full bg-pastel-blue/20 text-pastel-blue text-3xl transition-colors group-hover:bg-pastel-blue group-hover:text-deep-sea-blue"><span className="material-symbols-outlined">hub</span></div>
                <p className="text-base font-bold text-white">Sơ đồ tri thức</p>
              </button>
              
              <button onClick={() => onFeatureSelect('tutor')} className="group pearl-card flex flex-col items-center justify-center text-center gap-2 p-4 size-40 md:size-48 rounded-full border border-pastel-blue/30">
                <div className="flex items-center justify-center size-14 rounded-full bg-pastel-blue/20 text-pastel-blue text-3xl transition-colors group-hover:bg-pastel-blue group-hover:text-deep-sea-blue"><span className="material-symbols-outlined">record_voice_over</span></div>
                <p className="text-base font-bold text-white">Gia sư biện chứng</p>
              </button>
              
              <button onClick={() => onFeatureSelect('media')} className="group pearl-card flex flex-col items-center justify-center text-center gap-2 p-4 size-40 md:size-48 rounded-full border border-pastel-blue/30">
                <div className="flex items-center justify-center size-14 rounded-full bg-pastel-blue/20 text-pastel-blue text-3xl transition-colors group-hover:bg-pastel-blue group-hover:text-deep-sea-blue"><span className="material-symbols-outlined">perm_media</span></div>
                <p className="text-base font-bold text-white">Thẻ đa phương tiện</p>
              </button>
              
              <button onClick={() => onFeatureSelect('quick-learn')} className="group pearl-card flex flex-col items-center justify-center text-center gap-2 p-6 w-40 h-44 md:w-48 md:h-52 border border-coral-pink/30 seashell-shape">
                <div className="flex items-center justify-center size-14 rounded-full bg-coral-pink/30 text-coral-pink text-3xl mt-4 transition-colors group-hover:bg-coral-pink group-hover:text-deep-sea-blue"><span className="material-symbols-outlined">bolt</span></div>
                <p className="text-base font-bold text-white">Học để dùng ngay</p>
              </button>
              
              <button onClick={() => onFeatureSelect('digest')} className="group pearl-card flex flex-col items-center justify-center text-center gap-2 p-4 size-40 md:size-48 rounded-full border border-pastel-blue/30">
                <div className="flex items-center justify-center size-14 rounded-full bg-pastel-blue/20 text-pastel-blue text-3xl transition-colors group-hover:bg-pastel-blue group-hover:text-deep-sea-blue"><span className="material-symbols-outlined">menu_book</span></div>
                <p className="text-base font-bold text-white">Tiêu hóa kiến thức</p>
              </button>
              
              <button onClick={() => onFeatureSelect('video')} className="group pearl-card flex flex-col items-center justify-center text-center gap-2 p-4 size-40 md:size-48 rounded-full border border-pastel-blue/30">
                <div className="flex items-center justify-center size-14 rounded-full bg-pastel-blue/20 text-pastel-blue text-3xl transition-colors group-hover:bg-pastel-blue group-hover:text-deep-sea-blue"><span className="material-symbols-outlined">smart_display</span></div>
                <p className="text-base font-bold text-white">Video khóa học</p>
              </button>
              
              <button onClick={() => onFeatureSelect('exam')} className="group pearl-card flex flex-col items-center justify-center text-center gap-2 p-6 w-40 h-44 md:w-48 md:h-52 border border-coral-pink/30 seashell-shape">
                <div className="flex items-center justify-center size-14 rounded-full bg-coral-pink/30 text-coral-pink text-3xl mt-4 transition-colors group-hover:bg-coral-pink group-hover:text-deep-sea-blue"><span className="material-symbols-outlined">school</span></div>
                <p className="text-base font-bold text-white">Thi chứng chỉ</p>
              </button>
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
