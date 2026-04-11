import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Section from './components/Section';
import Modal from './components/Modal';
import StatusBar from './components/StatusBar';
import Controls from './components/Controls';
import ProductCustomizer from './components/ProductCustomizer';
import AiAssistant from './components/AiAssistant';
import GlobalDashboard from './components/GlobalDashboard';
import AboutStory from './components/AboutStory';
import CryptoHub from './components/CryptoHub'; // 新增：区块链组件
import IframeModal from './components/IframeModal'; // 新增：生态页面组件
import { FEATURES, SPECS, TEAM, BLOG_POSTS, CONTACT_EMAIL, ASSETS, TRANSLATIONS, WEBSITE_URL, STYLES, SOCIAL_URLS, SHARE_CONFIG } from './constants';
import { ModalState, Language } from './types';
import { Instagram, MapPin, Mail, Share2, Twitter } from 'lucide-react';

// 自定义 X (Twitter) Logo 组件
const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState<Language>('zh');
  const t = TRANSLATIONS[lang]; 

  const [modal, setModal] = useState<ModalState>({ isOpen: false, title: '', content: '' });
  const [showQR, setShowQR] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isEcosystemOpen, setIsEcosystemOpen] = useState(false); // 生态页面开关
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  };

  const openModal = (title: string, content: string) => {
    setModal({ isOpen: true, title, content });
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(lang === 'zh' ? '消息已发送至星际网络！' : 'Message transmitted to interstellar network!');
    e.currentTarget.reset();
  };

  // 增强版分享逻辑：使用预设文案
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      try {
        await navigator.share({
          title: SHARE_CONFIG.title,
          text: SHARE_CONFIG.text,
          url: SHARE_CONFIG.url,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      setShowQR(true); // 浏览器不支持 Share API 时回退到二维码
    }
  };

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'dark' : ''}`}>
       <style>{`
        .matrix-mode {
          font-family: 'Courier New', monospace !important;
          color: #00ff00 !important;
          background-color: #000 !important;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        
        /* 隐藏 Iframe 滚动条但允许滚动 */
        .custom-scrollbar-hide::-webkit-scrollbar { display: none; }
        .custom-scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* 背景视频层 */}
      <div className="fixed top-0 left-0 w-full h-full -z-20 overflow-hidden">
        <video 
          ref={bgVideoRef}
          className="w-full h-full object-cover filter brightness-[0.5] scale-105" 
          autoPlay 
          loop 
          muted 
          playsInline
          poster={ASSETS.introVideoCover}
        >
          <source src={ASSETS.bgVideo} type="video/mp4" />
        </video>
      </div>
      
      {/* 噪点与渐变覆盖层 */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black/20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-black/90 pointer-events-none"></div>

      <StatusBar lang={lang} />
      <Navbar 
        toggleDarkMode={toggleDarkMode} 
        isDarkMode={isDarkMode} 
        lang={lang} 
        toggleLanguage={toggleLanguage} 
        onOpenEcosystem={() => setIsEcosystemOpen(true)}
      />
      
      <main className="relative z-10 pb-32 md:pb-32 overflow-hidden">
        <Hero lang={lang} />

        {/* [1] 视觉展示 */}
        <Section id="video" className="w-full max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className={`${STYLES.glassPanel} rounded-2xl md:rounded-3xl p-6 md:p-12 transition-transform duration-500 hover:scale-[1.01]`}>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-10 text-center font-orbitron tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Everett Visuals
            </h2>
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl md:rounded-2xl bg-black/50 shadow-2xl border border-white/10 mb-6 md:mb-8 group">
              <img 
                 src={ASSETS.introVideoCover}
                 alt="Video Cover"
                 className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-all cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 group-hover:scale-110 group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                     <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                  </div>
              </div>
            </div>
            <p className="text-center text-sm md:text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {lang === 'zh' ? '探索 Everett 的无限可能，感受自然与科技的完美共振。' : 'Explore the infinite possibilities of Everett.'}
            </p>
          </div>
        </Section>

        {/* [2] 两个仪表盘：全球指挥中心 + [新增] 加密金融中枢 */}
        <div id="dashboard" className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 space-y-8">
           <Section animation="fade">
              <GlobalDashboard lang={lang} />
           </Section>
           
           {/* [新增] 区块链 K 线板块 */}
           <Section id="crypto" animation="slide-left" delay={200}>
              <CryptoHub lang={lang} />
           </Section>
        </div>
        
        {/* [3] 品牌故事 */}
        <Section id="about-story" className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24" animation="slide-right">
           <AboutStory lang={lang} openModal={openModal} />
        </Section>

        {/* [4] 产品定制 */}
        <Section id="customizer" className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24" animation="fade">
           <ProductCustomizer lang={lang} />
        </Section>

        {/* [5] 核心功能 */}
        <Section id="features" className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24" animation="slide-left">
          <div className={`${STYLES.glassPanel} rounded-2xl md:rounded-3xl p-6 md:p-16`}>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-10 md:mb-16 text-center font-orbitron text-white">{lang === 'zh' ? '核心功能' : 'Core Features'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {FEATURES.map((feature, idx) => (
                <div 
                  key={idx}
                  onClick={() => openModal(feature.title[lang], feature.modalContent[lang])}
                  className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-accent hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,113,227,0.3)] transition-all duration-300 cursor-pointer group flex flex-col h-full"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent/20 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                    <span className="font-orbitron font-bold text-accent text-lg group-hover:text-white">{idx + 1}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-100 group-hover:text-accent transition-colors">{feature.title[lang]}</h3>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed flex-grow">{feature.description[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* [6] 技术规格 */}
        <Section id="specs" className="w-full max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-24" animation="fade">
          <div className={`${STYLES.glassPanel} rounded-2xl md:rounded-3xl p-6 md:p-16 hover:border-accent/30 transition-colors`}>
            <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12 text-center font-orbitron">{t.specs.title}</h2>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="p-4 md:p-6 text-sm md:text-lg font-semibold text-accent font-orbitron uppercase tracking-wider">{t.specs.param}</th>
                    <th className="p-4 md:p-6 text-sm md:text-lg font-semibold text-accent font-orbitron uppercase tracking-wider">{t.specs.detail}</th>
                  </tr>
                </thead>
                <tbody>
                  {SPECS.map((spec, idx) => (
                    <tr key={idx} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 md:p-6 font-medium text-white/90 text-sm md:text-lg">{spec.label[lang]}</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm md:text-lg">{spec.value[lang]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* [7] 博客文章 */}
        <Section id="blog" className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24" animation="fade">
          <div className={`${STYLES.glassPanel} rounded-2xl md:rounded-3xl p-6 md:p-16`}>
            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-center font-orbitron">{t.blog.title}</h2>
            <p className="text-center text-gray-400 mb-8 md:mb-12 uppercase tracking-widest text-xs">{t.blog.subtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {BLOG_POSTS.map((post, idx) => (
                <div 
                  key={idx}
                  onClick={() => openModal(post.title[lang], post.fullContent[lang])}
                  className="bg-gradient-to-br from-white/5 to-transparent p-6 md:p-10 rounded-2xl border border-white/10 hover:border-accent/50 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
                >
                  <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 group-hover:text-accent transition-colors font-orbitron leading-tight">{post.title[lang]}</h3>
                  <p className="text-gray-300 mb-6 md:mb-8 leading-relaxed text-sm md:text-lg">{post.excerpt[lang]}</p>
                  <span className="text-accent text-xs md:text-sm font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform uppercase tracking-wider">
                    {t.readMore} <span className="text-lg md:text-xl">&rarr;</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* [8] 联系与社交 (重点修复 X 显示问题) */}
        <Section id="contact" className="w-full max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-24" animation="slide-left">
          <div className={`${STYLES.glassPanel} rounded-2xl md:rounded-3xl p-6 md:p-16 relative overflow-hidden flex flex-col md:flex-row gap-12`}>
             
             {/* 左侧：表单 */}
             <div className="flex-1 order-2 md:order-1">
               <h2 className="text-2xl md:text-4xl font-bold mb-8 font-orbitron">{t.contactUs}</h2>
               <form onSubmit={handleContactSubmit} className="space-y-4">
                 <input type="text" placeholder={t.namePlaceholder} className={`${STYLES.glassInput} w-full p-4 rounded-xl text-white focus:outline-none transition-all placeholder-gray-500`} />
                 <input type="email" placeholder={t.emailPlaceholder} className={`${STYLES.glassInput} w-full p-4 rounded-xl text-white focus:outline-none transition-all placeholder-gray-500`} />
                 <textarea rows={4} placeholder={t.msgPlaceholder} className={`${STYLES.glassInput} w-full p-4 rounded-xl text-white focus:outline-none transition-all placeholder-gray-500`}></textarea>
                 <button type="submit" className="w-full py-4 bg-accent hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-accent/50 uppercase tracking-wide">
                   {t.sendMessage}
                 </button>
               </form>
             </div>

             {/* 右侧：联系信息与社交图标 (独立展示，确保可见性) */}
             <div className="flex-1 order-1 md:order-2 flex flex-col justify-between">
                <div className="space-y-6">
                    <h3 className="text-xl font-bold font-orbitron text-gray-200">Connect With Us</h3>
                    <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors bg-white/5 p-4 rounded-xl border border-white/5">
                      <Mail className="text-accent" />
                      <a href={`mailto:${CONTACT_EMAIL}`} className="break-all">{CONTACT_EMAIL}</a>
                    </div>
                    <div className="flex items-center gap-4 text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5">
                      <MapPin className="text-accent" />
                      <span>Future City, Sector 7</span>
                    </div>
                </div>

                {/* 社交链接：大尺寸，醒目 */}
                <div className="mt-8 md:mt-0 pt-8 border-t border-white/10">
                    <p className="text-sm text-accent font-bold uppercase tracking-widest mb-4 animate-pulse">{t.followUs}</p>
                    <div className="flex gap-4">
                        {/* X (Twitter) - 核心关注点 */}
                        <a 
                          href={SOCIAL_URLS.x} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex-1 bg-black/40 hover:bg-black/80 border border-white/10 hover:border-white/50 h-16 rounded-xl flex items-center justify-center transition-all group"
                        >
                           <XLogo className="w-8 h-8 text-white group-hover:scale-125 transition-transform" />
                        </a>
                        
                        {/* Instagram */}
                        <a 
                          href={SOCIAL_URLS.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex-1 bg-black/40 hover:bg-pink-900/40 border border-white/10 hover:border-pink-500/50 h-16 rounded-xl flex items-center justify-center transition-all group"
                        >
                           <Instagram className="w-8 h-8 text-gray-300 group-hover:text-pink-500 group-hover:scale-125 transition-transform" />
                        </a>

                        {/* Share */}
                        <button 
                          onClick={handleShare} 
                          className="flex-1 bg-accent/20 hover:bg-accent border border-accent/30 hover:border-accent h-16 rounded-xl flex items-center justify-center transition-all group"
                        >
                           <Share2 className="w-8 h-8 text-accent group-hover:text-white group-hover:rotate-12 transition-transform" />
                        </button>
                    </div>
                </div>
             </div>
          </div>
        </Section>

        {/* Footer */}
        <footer className="text-center py-8 md:py-10 text-gray-600 text-xs md:text-sm relative z-10 px-4">
          <p>© {new Date().getFullYear()} {WEBSITE_URL} · {t.footerText}</p>
        </footer>
      </main>

      <Controls 
        bgVideoRef={bgVideoRef} 
        onToggleAi={() => setIsAiOpen(prev => !prev)} 
        isAiOpen={isAiOpen}
        onShare={handleShare}
      />
      
      <AiAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} lang={lang} />
      
      {/* 新增：生态页面模态框 */}
      <IframeModal isOpen={isEcosystemOpen} onClose={() => setIsEcosystemOpen(false)} lang={lang} />

      <Modal 
        isOpen={modal.isOpen} 
        title={modal.title} 
        content={modal.content} 
        onClose={() => setModal({ ...modal, isOpen: false })} 
      />

      {showQR && (
        <div 
          className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fade-in px-4"
          onClick={() => setShowQR(false)}
        >
          <div className={`${STYLES.glassPanel} p-8 md:p-10 rounded-3xl text-center flex flex-col items-center shadow-2xl border-white/20 w-full max-w-sm`} onClick={e => e.stopPropagation()}>
            <div className="bg-white p-2 rounded-xl mb-6 w-full max-w-[200px]">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(WEBSITE_URL)}`} 
                alt="QR Code" 
                className="rounded-lg w-full h-auto"
              />
            </div>
            <p className="text-white font-orbitron mb-2 text-xl font-bold">{t.scanToEnter}</p>
            <p className="text-accent break-all text-sm">{WEBSITE_URL}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;