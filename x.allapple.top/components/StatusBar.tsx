
import React, { useState, useEffect } from 'react';
import { TRANSLATIONS, STYLES } from '../constants';
import { Language } from '../types';

interface StatusBarProps {
  lang: Language;
}

const StatusBar: React.FC<StatusBarProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [time, setTime] = useState(t.loading);
  const [weather, setWeather] = useState(t.weatherFetching);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Use different locale based on lang prop
      const locale = lang === 'zh' ? 'zh-CN' : 'en-US';
      const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' };
      // [MODIFIED] Added 'second: 2-digit' for precise time display
      const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      const dateStr = now.toLocaleDateString(locale, dateOptions);
      const timeStr = now.toLocaleTimeString(locale, timeOptions);
      setTime(`🕓 ${dateStr} ${timeStr}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [lang, t.loading]);

  useEffect(() => {
    const loadWeather = async (lat?: number, lon?: number) => {
      try {
        // [MODIFIED] Use format string to prioritize location name (%l)
        // If lat/lon is provided, wttr.in usually resolves to nearest station name.
        const query = lat && lon ? `${lat},${lon}` : '';
        const format = '%l | %C %t'; 
        const res = await fetch(`https://wttr.in/${query}?format=${encodeURIComponent(format)}&lang=${lang}`);
        let text = await res.text();
        text = text.replace(/\n/g, ' ').trim();
        
        // Basic cleanup if returns raw coordinates (rare but possible) or unknown
        if (text.includes('Unknown') && (lat && lon)) {
             setWeather(`📍 ${lat.toFixed(2)}, ${lon.toFixed(2)} | 🌡️ --`);
        } else {
             setWeather(`🌤️ ${text}`);
        }
      } catch (e) {
        setWeather('☁️ Offline');
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          loadWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation denied, using IP location", error);
          loadWeather(); // Fallback to IP location
        }
      );
    } else {
      loadWeather();
    }
  }, [lang]);

  return (
    <div className={`fixed top-0 left-0 w-full z-[101] h-9 flex justify-between items-center px-6 text-[11px] md:text-xs tracking-wide text-gray-300 ${STYLES.glassFloating} rounded-none border-b border-white/10 select-none font-sans uppercase`}>
      <span className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-default font-mono">{time}</span>
      <span className="flex items-center gap-2 text-right truncate max-w-[50%] opacity-80 hover:opacity-100 transition-opacity cursor-default">{weather}</span>
    </div>
  );
};

export default StatusBar;
