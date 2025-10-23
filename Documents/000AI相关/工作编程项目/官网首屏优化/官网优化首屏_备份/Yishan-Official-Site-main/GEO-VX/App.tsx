import React from 'react';

const YishanLogo: React.FC = () => (
    <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M29.9999 5L55.495 50H4.50481L29.9999 5Z" fill="#34D399"/>
            <path d="M29.9999 15.2223L47.7475 50H12.2523L29.9999 15.2223Z" fill="white"/>
            <path d="M30 0L33.0902 9.40983H43.1695L35.0396 15.2223L38.1298 24.6321L30 18.8194L21.8702 24.6321L24.9604 15.2223L16.8305 9.40983H26.9098L30 0Z" fill="#10B981"/>
        </svg>
    </div>
);

const BookCover: React.FC = () => {
    return (
        <div className="relative w-80 h-[28rem] scale-100 sm:scale-110 drop-shadow-2xl">
            {/* The book behind */}
            <div className="absolute top-0 left-0 w-full h-full bg-white rounded-lg transform translate-x-4 translate-y-4">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 opacity-10 rounded-lg"></div>
            </div>
            
            {/* Front cover */}
            <div className="absolute top-0 left-0 w-full h-full bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-200/50">
                {/* Background design elements */}
                <div className="absolute w-[500px] h-[500px] bg-green-400/30 rounded-full -top-40 -right-40 filter blur-xl"></div>

                <div className="relative z-10 p-6 flex flex-col h-full text-slate-800">
                    {/* Header */}
                    <div className="flex items-center gap-2">
                        <YishanLogo />
                        <span className="font-bold text-xl tracking-wider">移山科技</span>
                    </div>

                    {/* Main Title */}
                    <div className="flex-grow flex flex-col justify-center items-center">
                        <div className="flex items-center gap-4">
                            <svg width="24" height="42" viewBox="0 0 24 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0L24 21L0 42V0Z" fill="#34D399"/>
                            </svg>
                            <p className="text-lg font-medium tracking-widest text-slate-600">B2B企业数字营销</p>
                        </div>
                        <h2 className="text-6xl font-black text-slate-900 tracking-tighter mt-1 leading-[0.9] text-center">
                            <span className="block">GEO</span>
                            <span className="block whitespace-nowrap">白皮书</span>
                        </h2>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto">
                        <p className="font-semibold text-slate-700">Yishan Technology</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  return (
    <main className="bg-slate-900 min-h-screen w-full flex items-center justify-center p-4 sm:p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black"></div>
        <div className="relative max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Section */}
            <div className="flex flex-col gap-8 text-center lg:text-left animate-fade-in-down">
                <h1 className="text-7xl md:text-8xl font-extrabold tracking-tighter bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">
                    免费领取
                </h1>
                <p className="text-3xl md:text-4xl font-semibold text-slate-200">
                    「GEO白皮书」
                </p>
                <div className="bg-green-500 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-lg shadow-green-500/20">
                    <img 
                        src="./GEO.png" 
                        alt="移山科技 QR Code" 
                        className="w-32 h-32 rounded-lg bg-white p-1 flex-shrink-0"
                    />
                    <div className="text-slate-900 font-bold text-xl sm:text-2xl">
                        <p>微信扫描二维码</p>
                        <p>回复: <span className="text-white">GEO白皮书</span></p>
                        <p>即可免费领取!</p>
                    </div>
                </div>
                <p className="text-sm text-slate-500">
                    PDF电子白皮书（永久免费领取）
                </p>
            </div>

            {/* Right Section */}
            <div className="flex justify-center items-center h-full animate-fade-in-up">
                <BookCover />
            </div>
        </div>
        <style>
          {`
            @keyframes fade-in-down {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fade-in-up {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
            .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; animation-delay: 0.2s; }
          `}
        </style>
    </main>
  );
};

export default App;