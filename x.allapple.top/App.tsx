
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
import { FEATURES, SPECS, TEAM, BLOG_POSTS, CONTACT_EMAIL, ASSETS, TRANSLATIONS, WEBSITE_URL, STYLES } from './constants';
import { ModalState, Language } from './types';
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Mail, User, Share2 } from 'lucide-react';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Language State
  const [lang, setLang] = useState<Language>('zh');
  const t = TRANSLATIONS[lang]; // Shortcut for current language text

  const [modal, setModal] = useState<ModalState>({ isOpen: false, title: '', content: '' });
  const [showQR, setShowQR] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
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
    alert(lang === 'zh' ? '感谢您的消息！' : 'Thank you for your message!');
    e.currentTarget.reset();
  };

  // Web Share API Implementation
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.siteTitle,
          text: t.shareMessage,
          url: WEBSITE_URL,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      setShowQR(true); // Fallback to QR code
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
      `}</style>

      {/* 
        [REPLACE] BACKGROUND VIDEO
        Update src={ASSETS.bgVideo} in constants.ts or directly here to change the background.
        Ensure the file exists in your resource folder.
      */}
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
      
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black/20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-black/90"></div>

      <StatusBar lang={lang} />
      <Navbar 
        toggleDarkMode={toggleDarkMode} 
        isDarkMode={isDarkMode} 
        lang={lang} 
        toggleLanguage={toggleLanguage} 
      />
      
      <main className="relative z-10 pb-32 md:pb-32 overflow-hidden">
        <Hero lang={lang} />

        {/* Video Section */}
        <Section id="video" className="w-full max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className={`${STYLES.glassPanel} rounded-2xl md:rounded-3xl p-6 md:p-12 transition-transform duration-500 hover:scale-[1.01]`}>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-10 text-center font-orbitron tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Everett Visuals
            </h2>
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl md:rounded-2xl bg-black/50 shadow-2xl border border-white/10 mb-6 md:mb-8">
              <img 
                 src={ASSETS.introVideoCover}
                 alt="Video Cover"
                 className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group cursor-pointer hover:bg-black/20 transition-all">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                     <div className="w-0 h-0 border-t-[8px] md:border-t-[10px] border-t-transparent border-l-[14px] md:border-l-[18px] border-l-white border-b-[8px] md:border-b-[10px] border-b-transparent ml-1"></div>
                  </div>
              </div>
            </div>
            <p className="text-center text-sm md:text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed">
              探索 Everett 的无限可能，感受自然与科技的完美共振。
            </p>
          </div>
        </Section>

        {/* Global Dashboard (Time Zone & Weather) */}
        <Section id="dashboard" className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24" animation="fade">
           <GlobalDashboard lang={lang} />
        </Section>
        
        {/* Customizer */}
        <Section id="customizer" className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24" animation="fade">
           <ProductCustomizer lang={lang} />
        </Section>

        {/* Features */}
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

        {/* Specs */}
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

        {/* Team */}
        <Section id="about" className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24" animation="slide-right">
          <div className={`${STYLES.glassPanel} rounded-2xl md:rounded-3xl p-6 md:p-16`}>
            <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-center font-orbitron">{t.team.title}</h2>
            <p className="text-center max-w-3xl mx-auto mb-10 md:mb-16 text-gray-300 text-sm md:text-lg">{t.team.desc}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {TEAM.map((member, idx) => (
                <div 
                  key={idx}
                  onClick={() => openModal(`${member.role[lang]}: ${member.name}`, member.description[lang])}
                  className="bg-white/5 p-6 md:p-8 rounded-2xl text-center border border-white/10 hover:border-accent hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto mb-4 md:mb-6 p-1 border-2 border-accent/30 group-hover:border-accent transition-all relative overflow-hidden">
                      <img 
                        src={member.avatar || `https://picsum.photos/seed/${idx + 50}/200`} 
                        alt={member.name} 
                        className="w-full h-full object-cover rounded-full filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110" 
                      />
                  </div>
                  <h4 className="text-lg md:text-xl font-bold font-orbitron mb-1">{member.name}</h4>
                  <p className="text-accent text-xs md:text-sm font-medium mb-3 md:mb-4 uppercase tracking-wider">{member.role[lang]}</p>
                  <p className="text-xs md:text-sm text-gray-400 line-clamp-2">{member.description[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Blog */}
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

        {/* Contact */}
        <Section id="contact" className="w-full max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24" animation="slide-left">
          <div className={`${STYLES.glassPanel} rounded-2xl md:rounded-3xl p-6 md:p-16 relative overflow-hidden`}>
             <h2 className="text-2xl md:text-4xl font-bold mb-8 text-center font-orbitron">{t.contactUs}</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
               <div className="space-y-6 md:space-y-8">
                 <div className="space-y-4 md:space-y-6 text-base md:text-lg">
                    <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors">
                      <Mail className="text-accent w-5 h-5 md:w-6 md:h-6" />
                      <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm md:text-base break-all">{CONTACT_EMAIL}</a>
                    </div>
                    <div className="flex items-center gap-4 text-gray-300">
                      <MapPin className="text-accent w-5 h-5 md:w-6 md:h-6" />
                      <span className="text-sm md:text-base">Future City, Sector 7</span>
                    </div>
                 </div>
                 <div className="flex gap-6 text-xl md:text-2xl pt-4 justify-center md:justify-start">
                    <a href="#" onClick={handleShare} title={t.shareTitle} className="text-gray-400 hover:text-accent transition-colors hover:scale-110"><Share2 /></a>
                    <a href="#" className="text-gray-400 hover:text-accent transition-colors hover:scale-110"><Twitter /></a>
                    <a href="#" className="text-gray-400 hover:text-accent transition-colors hover:scale-110"><Instagram /></a>
                 </div>
               </div>

               <form onSubmit={handleContactSubmit} className="space-y-4">
                 <input type="text" placeholder={t.namePlaceholder} className={`${STYLES.glassInput} w-full p-3 md:p-4 rounded-xl text-white focus:outline-none transition-all placeholder-gray-600 text-sm md:text-base`} />
                 <input type="email" placeholder={t.emailPlaceholder} className={`${STYLES.glassInput} w-full p-3 md:p-4 rounded-xl text-white focus:outline-none transition-all placeholder-gray-600 text-sm md:text-base`} />
                 <textarea rows={4} placeholder={t.msgPlaceholder} className={`${STYLES.glassInput} w-full p-3 md:p-4 rounded-xl text-white focus:outline-none transition-all placeholder-gray-600 text-sm md:text-base`}></textarea>
                 <button type="submit" className="w-full py-3 md:py-4 bg-accent hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-accent/50 active:scale-95 uppercase tracking-wide text-sm md:text-base">
                   {t.sendMessage}
                 </button>
               </form>
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

      <Modal 
        isOpen={modal.isOpen} 
        title={modal.title} 
        content={modal.content} 
        onClose={() => setModal({ ...modal, isOpen: false })} 
      />

      {showQR && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fade-in px-4"
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
