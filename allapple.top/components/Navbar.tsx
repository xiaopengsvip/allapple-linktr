
import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Menu, X, Globe, ChevronRight, ExternalLink } from 'lucide-react';
import { NAV_LINKS, ASSETS, STYLES, TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface NavbarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  lang: Language;
  toggleLanguage: () => void;
  onOpenEcosystem: () => void; // 新增回调
}

const Navbar: React.FC<NavbarProps> = ({ toggleDarkMode, isDarkMode, lang, toggleLanguage, onOpenEcosystem }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 使用 constants 中的 TRANSLATIONS.nav 获取翻译
  const navLabels = TRANSLATIONS[lang].nav as Record<string, string>;

  // 监听滚动事件，用于改变导航栏样式
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 当移动端菜单打开时，禁止背景滚动
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const handleNavClick = (e: React.MouseEvent, key: string, isExternal?: boolean) => {
    if (isExternal && key === 'ecosystem') {
      e.preventDefault();
      setIsMenuOpen(false);
      onOpenEcosystem();
    } else {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 border-b top-9 ${
      isScrolled || isMenuOpen
        ? `${STYLES.glassFloating} py-2 md:py-3 shadow-lg border-white/10` 
        : 'py-2 md:py-4 bg-transparent border-transparent'
    }`}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex justify-between items-center relative">
        {/* Logo 区域 */}
        <div 
          className="flex items-center gap-2 md:gap-3 cursor-pointer group select-none z-[101]"
          onClick={() => {
             window.scrollTo(0,0);
             setIsMenuOpen(false);
          }}
        >
          <img src={ASSETS.logo} alt="Logo" className="h-7 w-7 md:h-9 md:w-9 rounded-xl transition-transform duration-500 group-hover:rotate-12 ring-1 ring-white/20 shadow-lg" />
          <span className="text-lg md:text-xl font-bold tracking-tight font-orbitron group-hover:text-accent transition-colors drop-shadow-md">allapple.top</span>
        </div>

        {/* 桌面端导航菜单 */}
        <ul className="hidden md:flex gap-1 items-center bg-black/20 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/5">
          {NAV_LINKS.map((link) => (
            <li key={link.key}>
              <a 
                href={link.href}
                onClick={(e) => handleNavClick(e, link.key, link.isExternal)}
                className={`px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium rounded-full transition-all relative group uppercase tracking-wide flex items-center gap-1 ${
                    link.isExternal 
                    ? 'text-accent hover:bg-accent hover:text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {navLabels[link.key] || link.key}
                {link.isExternal && <ExternalLink size={12} className="mb-0.5" />}
              </a>
            </li>
          ))}
        </ul>

        {/* 右侧操作区：搜索、语言切换、暗黑模式、移动端菜单开关 */}
        <div className="flex items-center gap-2 md:gap-3 z-[101]">
          {/* 搜索框 (仅桌面端显示) */}
          <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 hover:border-accent/50 hover:bg-white/10 transition-all group focus-within:w-56 w-40 focus-within:border-accent">
            <Search size={16} className="text-gray-400 group-hover:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder={TRANSLATIONS[lang].searchPlaceholder} 
              className="bg-transparent border-none outline-none text-sm ml-2 w-full text-white placeholder-gray-500 font-orbitron"
            />
          </div>

          <button 
            onClick={toggleLanguage}
            className="p-1.5 md:p-2 rounded-full hover:bg-white/10 transition-colors text-gray-300 flex items-center gap-1 text-[10px] md:text-xs font-bold border border-transparent hover:border-white/10"
            title="Switch Language"
          >
             <Globe size={16} className="md:w-[18px] md:h-[18px]" />
             <span>{lang === 'zh' ? 'EN' : '中'}</span>
          </button>

          <button 
            onClick={toggleDarkMode} 
            className="p-1.5 md:p-2 rounded-full hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
          >
            {isDarkMode ? <Moon size={18} className="text-yellow-300 md:w-5 md:h-5" /> : <Sun size={18} className="text-orange-400 md:w-5 md:h-5" />}
          </button>

          <button 
            className={`md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-all duration-300 ${isMenuOpen ? 'bg-white/10 text-accent rotate-90' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* 移动端全屏菜单 */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[90] bg-black/95 backdrop-blur-3xl flex flex-col pt-24 pb-10 px-6 animate-fade-in overflow-y-auto h-[100dvh]">
          {/* 背景装饰元素 */}
          <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-accent/20 rounded-full blur-[80px] pointer-events-none animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none animate-pulse-slow"></div>

          <div className="flex flex-col items-center justify-start gap-3 w-full max-w-sm mx-auto flex-1">
            {NAV_LINKS.map((link, idx) => (
              <a 
                key={link.key}
                href={link.href} 
                onClick={(e) => handleNavClick(e, link.key, link.isExternal)}
                className={`group relative w-full py-4 px-6 rounded-2xl border bg-white/5 overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,113,227,0.3)] animate-slide-right opacity-0 flex items-center justify-between active:scale-[0.98]
                  ${link.isExternal ? 'border-accent/50 text-accent hover:bg-accent/10' : 'border-white/5 hover:border-accent/50'}
                `}
                style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'forwards' }}
              >
                {/* 悬停时的背景滑块效果 */}
                <div className="absolute inset-0 bg-accent translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out z-0 opacity-10"></div>
                
                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className="text-lg font-bold font-orbitron tracking-widest text-gray-200 group-hover:text-white transition-colors flex items-center gap-2">
                    {navLabels[link.key] || link.key}
                    {link.isExternal && <ExternalLink size={16} />}
                  </span>
                  <ChevronRight size={18} className="text-gray-500 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center opacity-50 text-[10px] font-mono tracking-[0.2em] text-gray-500 animate-fade-in" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
            SYSTEM STATUS: ONLINE
            <br/>
            EVERETT OS V2.5
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
