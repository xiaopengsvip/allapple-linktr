
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

  // 实时时钟效果：每秒更新
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // 根据语言选择不同的日期区域格式
      const locale = lang === 'zh' ? 'zh-CN' : 'en-US';
      const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' };
      // [已修改] 增加 second: '2-digit' 以显示精确秒数
      const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      const dateStr = now.toLocaleDateString(locale, dateOptions);
      const timeStr = now.toLocaleTimeString(locale, timeOptions);
      setTime(`🕓 ${dateStr} ${timeStr}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000); // 1秒刷新一次
    return () => clearInterval(timer);
  }, [lang, t.loading]);

  // 天气获取效果
  useEffect(() => {
    const loadWeather = async (lat?: number, lon?: number) => {
      try {
        // [已修改] 使用 wttr.in 的格式化字符串。
        // %l: 地点名称, %C: 天气状况文本, %t: 温度
        // 如果有经纬度，查询 URL 为 "lat,lon"，否则为空（自动IP定位）
        const query = lat && lon ? `${lat},${lon}` : '';
        const format = '%l | %C %t'; 
        
        const res = await fetch(`https://wttr.in/${query}?format=${encodeURIComponent(format)}&lang=${lang}`);
        let text = await res.text();
        text = text.replace(/\n/g, ' ').trim();
        
        // 简单的错误处理：如果返回包含 Unknown 且我们有经纬度，则显示坐标
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
          // 获取到用户精确位置，使用经纬度查询天气
          loadWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation denied, using IP location", error);
          loadWeather(); // 用户拒绝定位或出错，回退到 IP 定位
        }
      );
    } else {
      loadWeather(); // 浏览器不支持定位
    }
  }, [lang]);

  return (
    <div className={`fixed top-0 left-0 w-full z-[101] h-9 flex justify-between items-center px-6 text-[11px] md:text-xs tracking-wide text-gray-300 ${STYLES.glassFloating} rounded-none border-b border-white/10 select-none font-sans uppercase font-medium`}>
      <span className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-default font-mono tracking-wider">
        {time}
      </span>
      <span className="flex items-center gap-2 text-right truncate max-w-[60%] opacity-80 hover:opacity-100 transition-opacity cursor-default">
        {weather}
      </span>
    </div>
  );
};

export default StatusBar;
