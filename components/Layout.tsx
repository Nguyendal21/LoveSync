import React, { useState } from 'react';
import { Heart, Image, Target, Settings, Home, LogOut, Palette, X } from 'lucide-react';
import { ViewState, ThemeType } from '../types';
import { THEMES } from '../services/theme';
import ThemeEffects from './ThemeEffects';

interface LayoutProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  children: React.ReactNode;
  onLogout: () => void;
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  currentView, 
  onChangeView, 
  children, 
  onLogout,
  currentTheme,
  onThemeChange
}) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  
  const navItems = [
    { id: ViewState.HOME, label: 'Trang chủ', icon: Home },
    { id: ViewState.MEMORIES, label: 'Kỉ niệm', icon: Heart },
    { id: ViewState.ALBUM, label: 'Album', icon: Image },
    { id: ViewState.GOALS, label: 'Mục tiêu', icon: Target },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${THEMES[currentTheme].bgGradient} flex flex-col transition-colors duration-700`}>
      {/* Dynamic Weather/Holiday Effects */}
      <ThemeEffects theme={currentTheme} />

      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/60 border-b border-white/20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-1 md:space-x-4 overflow-x-auto no-scrollbar w-full md:w-auto justify-center md:justify-start items-center">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onChangeView(item.id)}
                    className={`flex items-center px-3 py-2 rounded-full transition-all duration-200 text-sm md:text-base whitespace-nowrap
                      ${isActive 
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' 
                        : 'text-gray-600 hover:bg-rose-100 hover:text-rose-600'
                      }`}
                  >
                    <Icon size={18} className="mr-1 md:mr-2" />
                    {item.label}
                  </button>
                );
              })}
              
              <div className="h-6 w-px bg-gray-300 mx-1"></div>

              {/* Theme Selector Button */}
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className={`flex items-center p-2 rounded-full transition-all duration-200 relative
                  ${showThemeMenu 
                    ? 'bg-rose-100 text-rose-600' 
                    : 'text-gray-600 hover:bg-rose-100 hover:text-rose-600'
                  }`}
                title="Chọn chủ đề"
              >
                <Palette size={18} />
              </button>

              <button
                onClick={() => onChangeView(ViewState.SETTINGS)}
                className={`flex items-center p-2 rounded-full transition-all duration-200 text-sm md:text-base
                  ${currentView === ViewState.SETTINGS 
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' 
                    : 'text-gray-600 hover:bg-rose-100 hover:text-rose-600'
                  }`}
              >
                <Settings size={18} />
              </button>
            </div>
            
            <div className="hidden md:block">
                 <button onClick={onLogout} title="Đăng xuất" className="text-gray-400 hover:text-rose-500 transition-colors">
                    <LogOut size={20}/>
                 </button>
            </div>
          </div>
        </div>

        {/* Theme Menu Dropdown */}
        {showThemeMenu && (
            <div className="absolute top-16 left-0 w-full md:w-auto md:left-auto md:right-0 z-50 p-2 animate-fade-in-up">
                <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl p-4 max-w-sm mx-auto md:mx-0 md:mr-4 grid grid-cols-2 gap-2">
                    <div className="col-span-2 flex justify-between items-center mb-2 pb-2 border-b">
                        <span className="text-sm font-bold text-gray-700">Chọn chủ đề</span>
                        <button onClick={() => setShowThemeMenu(false)}><X size={16} className="text-gray-400"/></button>
                    </div>
                    {Object.entries(THEMES).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => {
                                onThemeChange(key as ThemeType);
                                setShowThemeMenu(false);
                            }}
                            className={`text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2
                                ${currentTheme === key ? 'bg-rose-100 text-rose-700 font-medium' : 'hover:bg-gray-50 text-gray-600'}
                            `}
                        >
                            <span>{config.decorations[0]}</span>
                            {config.name}
                        </button>
                    ))}
                </div>
            </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-4xl mx-auto p-4 md:p-6 pb-24 relative z-10">
        {children}
      </main>

      {/* Signature */}
      <div className="fixed bottom-4 right-4 z-50 pointer-events-none select-none">
          <p className="font-serif italic text-red-600 text-xs md:text-sm drop-shadow-md bg-white/30 backdrop-blur-[2px] px-2 py-1 rounded-md">
              Web của riêng Long và Trang
          </p>
      </div>
    </div>
  );
};

export default Layout;