
import React from 'react';

interface HeaderProps {
  onStart: () => void;
  onLoginClick: () => void;
  isAppView: boolean;
  onShowAbout: () => void;
  onShowFAQ: () => void;
}

const Header: React.FC<HeaderProps> = ({ onStart, onLoginClick, isAppView, onShowAbout, onShowFAQ }) => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200/80 dark:border-slate-700/80 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-50 bg-[#F8F9FA]/80 dark:bg-[#101c22]/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
        <div className="text-[#3498db] text-3xl select-none">
          <span className="material-symbols-outlined">auto_awesome</span>
        </div>
        <h2 className="text-xl font-bold text-[#212529] dark:text-[#F8F9FA]">LearnAI</h2>
      </div>
      
      {!isAppView && (
        <div className="hidden md:flex flex-1 justify-center gap-8">
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-[#212529] dark:text-[#F8F9FA] hover:text-[#3498db] transition-colors">Tính năng</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onShowAbout(); }} className="text-sm font-medium text-[#212529] dark:text-[#F8F9FA] hover:text-[#3498db] transition-colors">Giới thiệu</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onShowFAQ(); }} className="text-sm font-medium text-[#212529] dark:text-[#F8F9FA] hover:text-[#3498db] transition-colors">Hỏi đáp</a>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {!isAppView ? (
          <>
            <button 
              onClick={onLoginClick}
              className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#3498db]/20 text-[#3498db] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#3498db]/30 transition-colors"
            >
              <span className="truncate">Đăng nhập</span>
            </button>
            <button 
              onClick={onStart}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f1c40f] text-slate-900 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-amber-400 transition-colors"
            >
              <span className="truncate">Học ngay</span>
            </button>
          </>
        ) : (
           <button 
              onClick={() => window.location.reload()}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#3498db]/20 text-[#3498db] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#3498db]/30 transition-colors"
            >
              <span className="truncate">Trang chủ</span>
            </button>
        )}
      </div>
    </header>
  );
};

export default Header;
