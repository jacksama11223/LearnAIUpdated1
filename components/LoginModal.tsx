import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative z-10 flex w-full max-w-[900px] overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-all animate-[fadeIn_0.3s_ease-out]">
        
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col bg-[#FDFDF8] relative">
            {/* Decoration Stars */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[#3498db]">
                 <span className="material-symbols-outlined text-3xl">auto_awesome</span>
            </div>

            <div className="mt-8 mb-6 text-center">
                <h2 className="text-2xl font-black text-[#101c22] mb-2">Chào mừng trở lại!</h2>
                <p className="text-sm text-[#6c757d]">Đăng nhập để tiếp tục hành trình của bạn</p>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-[#e1f0fa] rounded-full mb-6">
                <button 
                    onClick={() => setActiveTab('login')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all ${
                        activeTab === 'login' 
                        ? 'bg-white text-[#3498db] shadow-sm' 
                        : 'text-[#6c757d] hover:text-[#3498db]'
                    }`}
                >
                    Đăng nhập
                </button>
                <button 
                    onClick={() => setActiveTab('register')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all ${
                        activeTab === 'register' 
                        ? 'bg-white text-[#3498db] shadow-sm' 
                        : 'text-[#6c757d] hover:text-[#3498db]'
                    }`}
                >
                    Đăng ký
                </button>
            </div>

            {/* Form Inputs */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#6c757d] uppercase ml-3">Email</label>
                    <input 
                        type="email" 
                        placeholder="email@example.com"
                        className="w-full px-6 py-3.5 rounded-full border border-slate-200 bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#3498db]/50 focus:border-[#3498db] transition-all"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#6c757d] uppercase ml-3">Mật khẩu</label>
                    <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full px-6 py-3.5 rounded-full border border-slate-200 bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#3498db]/50 focus:border-[#3498db] transition-all"
                    />
                </div>
            </div>

            {/* Forgot Password */}
            <div className="mt-4 mb-6">
                <a href="#" className="text-sm font-medium text-[#3498db] hover:underline ml-3">Quên mật khẩu?</a>
            </div>

            {/* Action Button */}
            <button 
                onClick={onLoginSuccess}
                className="w-full py-3.5 rounded-full bg-[#2980b9] hover:bg-[#3498db] text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95"
            >
                Ra khơi!
            </button>

            {/* Footer Text */}
            <div className="mt-auto pt-6 text-center">
                <p className="text-sm text-[#6c757d]">
                    {activeTab === 'login' ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
                    <button 
                        onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
                        className="text-[#2980b9] font-bold hover:underline"
                    >
                        {activeTab === 'login' ? "Đăng ký" : "Đăng nhập"}
                    </button>
                </p>
            </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:block w-1/2 relative bg-gray-100">
            <img 
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1287&auto=format&fit=crop" 
                alt="Student smiling" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            
            {/* Speech Bubble */}
            <div className="absolute top-1/3 -left-4 bg-white px-5 py-3 rounded-2xl rounded-bl-none shadow-lg animate-bounce">
                <p className="text-[#212529] font-medium">Lâu rồi không gặp!</p>
            </div>
        </div>

        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-colors md:text-white text-slate-500 md:bg-white/20"
        >
             <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  );
};

export default LoginModal;