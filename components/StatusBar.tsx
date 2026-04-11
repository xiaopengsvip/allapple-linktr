import React, { useState, useEffect } from 'react';
import { Clock, CloudSun, Languages } from 'lucide-react';
import { motion } from 'framer-motion';
import { Language, translations } from '../translations';

interface StatusBarProps {
  lang: Language;
  setLang: (lang: Language) => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ lang, setLang }) => {
  const [time, setTime] = useState<string>('');
  const [weather, setWeather] = useState<string>('');
  const t = translations[lang];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Use different time format based on language
      const timeString = now.toLocaleTimeString(lang === 'zh' ? 'zh-CN' : 'en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: lang === 'en' 
      });
      setTime(timeString);
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);

    // Fetch weather with language parameter
    const weatherLang = lang === 'zh' ? 'zh' : 'en';
    fetch(`https://wttr.in/?format=%C+%t&lang=${weatherLang}`)
      .then(res => res.text())
      .then(text => setWeather(text.trim()))
      .catch(() => setWeather(t.weatherError));

    return () => clearInterval(timer);
  }, [lang, t.weatherError]);

  const toggleLang = () => {
    setLang(lang === 'zh' ? 'en' : 'zh');
  };

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-2 pb-4 pointer-events-none"
    >
      <div className="
        flex items-center gap-4 sm:gap-6 px-4 py-2 
        bg-black/30 backdrop-blur-xl border border-white/10 
        rounded-full shadow-lg pointer-events-auto
        transition-all duration-300 hover:bg-black/40
      ">
        <div className="flex items-center gap-2 text-sm font-medium text-white/90 min-w-[60px]">
          <Clock size={14} className="text-blue-400" />
          <span>{time || t.loading}</span>
        </div>
        
        <div className="w-px h-4 bg-white/20" />
        
        <div className="flex items-center gap-2 text-sm font-medium text-white/90 min-w-[80px]">
          <CloudSun size={14} className="text-yellow-400" />
          <span>{weather || t.checkingWeather}</span>
        </div>

        <div className="w-px h-4 bg-white/20" />

        <button 
          onClick={toggleLang}
          className="flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
        >
          <Languages size={14} className="text-purple-400" />
          <span className="uppercase">{lang}</span>
        </button>
      </div>
    </motion.div>
  );
};

export default StatusBar;