
import React, { useState, useEffect } from 'react';
import { Clock, Map, Wind, Droplets, Thermometer, Eye, Gauge, Globe } from 'lucide-react';
import { TRANSLATIONS, STYLES } from '../constants';
import { Language } from '../types';

interface GlobalDashboardProps {
  lang: Language;
}

const GlobalDashboard: React.FC<GlobalDashboardProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].dashboard;
  const [time, setTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState<any>(null);

  // 世界时钟配置
  const timeZones = [
    { city: 'New York', zone: 'America/New_York' },
    { city: 'London', zone: 'Europe/London' },
    { city: 'Tokyo', zone: 'Asia/Tokyo' },
    { city: 'Sydney', zone: 'Australia/Sydney' },
  ];

  // 城市名称翻译
  const cityLabels: Record<string, { zh: string; en: string }> = {
    'New York': { zh: '纽约', en: 'NYC' },
    'London': { zh: '伦敦', en: 'LDN' },
    'Tokyo': { zh: '东京', en: 'TKY' },
    'Sydney': { zh: '悉尼', en: 'SYD' },
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDetailedWeather = async (lat?: number, lon?: number) => {
      try {
        // 使用 wttr.in 的 JSON 格式获取详细数据
        const query = lat && lon ? `${lat},${lon}` : '';
        const res = await fetch(`https://wttr.in/${query}?format=j1&lang=${lang}`);
        const data = await res.json();
        
        if (data && data.current_condition && data.current_condition[0]) {
          const current = data.current_condition[0];
          const area = data.nearest_area && data.nearest_area[0] ? data.nearest_area[0] : null;
          
          setWeatherData({
            temp: current.temp_C,
            desc: current.lang_zh && lang === 'zh' ? current.lang_zh[0].value : current.weatherDesc[0].value,
            humidity: current.humidity,
            windSpeed: current.windspeedKmph,
            feelsLike: current.FeelsLikeC,
            visibility: current.visibility,
            pressure: current.pressure,
            location: area ? (lang === 'zh' ? area.areaName[0].value : area.areaName[0].value) : 'Unknown'
          });
        }
      } catch (e) {
        console.error("Failed to fetch dashboard weather", e);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchDetailedWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchDetailedWeather() // 失败回退
      );
    } else {
      fetchDetailedWeather();
    }
  }, [lang]);

  const getTimeInZone = (zone: string) => {
    return time.toLocaleTimeString('en-US', {
      timeZone: zone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className={`${STYLES.glassPanel} rounded-3xl p-6 md:p-10 w-full relative overflow-hidden`}>
      {/* 装饰性背景网格 */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-orbitron flex items-center gap-3">
             <Map className="text-accent" /> {t.title}
          </h2>
          <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest pl-1">{t.subtitle}</p>
        </div>
        <div className="px-4 py-1.5 bg-accent/10 border border-accent/50 rounded-full text-xs font-mono text-accent animate-pulse flex items-center gap-2">
          <span className="w-2 h-2 bg-accent rounded-full"></span>
          LIVE DATA STREAM
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* 左侧：世界时区板块 */}
        <div className="bg-black/20 rounded-2xl p-6 border border-white/5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
             <h3 className="text-lg font-bold font-orbitron flex items-center gap-2 text-gray-200">
               <Globe size={18} className="text-blue-400" /> {t.timeZone}
             </h3>
             <span className="text-[10px] text-gray-500 font-mono">UTC SYNC</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 flex-grow">
            {timeZones.map((tz) => (
              <div key={tz.city} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-accent/30 hover:bg-white/10 transition-all group flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider group-hover:text-accent transition-colors font-bold">
                    {cityLabels[tz.city][lang]}
                  </span>
                  <Clock size={12} className="text-gray-600 group-hover:text-accent/50" />
                </div>
                <div className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tighter">
                  {getTimeInZone(tz.zone)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：天气监测板块 */}
        <div className="bg-gradient-to-br from-blue-900/10 to-black/30 rounded-2xl p-6 border border-white/5 relative overflow-hidden flex flex-col h-full">
          {/* 背景大图标装饰 */}
          <div className="absolute top-[-20px] right-[-20px] p-4 opacity-[0.05] pointer-events-none">
            <Wind size={150} />
          </div>
          
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5 relative z-10">
             <h3 className="text-lg font-bold font-orbitron flex items-center gap-2 text-gray-200">
               <Thermometer size={18} className="text-orange-400" /> {t.weather}
             </h3>
             <span className="text-[10px] text-gray-500 font-mono">SENSOR ARRAY</span>
          </div>

          {weatherData ? (
            <div className="relative z-10 flex flex-col justify-between flex-grow">
              <div className="flex items-end gap-6 mb-8">
                 <div className="text-7xl md:text-8xl font-bold text-white tracking-tighter leading-none">
                   {weatherData.temp}°
                 </div>
                 <div className="mb-2">
                   <div className="text-xl font-bold text-accent mb-1 flex items-center gap-2">
                     <MapPin size={16} /> {weatherData.location}
                   </div>
                   <div className="text-gray-300 text-sm font-medium bg-white/10 px-2 py-1 rounded-md inline-block">
                     {weatherData.desc}
                   </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-black/20 p-3 rounded-lg backdrop-blur-sm border border-white/5">
                   <div className="flex items-center gap-1.5 text-gray-400 text-[10px] mb-1 font-bold uppercase"><Droplets size={12} className="text-blue-300"/> {t.humidity}</div>
                   <div className="text-lg font-mono text-gray-100">{weatherData.humidity}%</div>
                </div>
                <div className="bg-black/20 p-3 rounded-lg backdrop-blur-sm border border-white/5">
                   <div className="flex items-center gap-1.5 text-gray-400 text-[10px] mb-1 font-bold uppercase"><Wind size={12} className="text-gray-300"/> {t.wind}</div>
                   <div className="text-lg font-mono text-gray-100">{weatherData.windSpeed} <span className="text-[10px]">km/h</span></div>
                </div>
                <div className="bg-black/20 p-3 rounded-lg backdrop-blur-sm border border-white/5">
                   <div className="flex items-center gap-1.5 text-gray-400 text-[10px] mb-1 font-bold uppercase"><Eye size={12} className="text-yellow-300"/> Vis</div>
                   <div className="text-lg font-mono text-gray-100">{weatherData.visibility} <span className="text-[10px]">km</span></div>
                </div>
                <div className="bg-black/20 p-3 rounded-lg backdrop-blur-sm border border-white/5">
                   <div className="flex items-center gap-1.5 text-gray-400 text-[10px] mb-1 font-bold uppercase"><Gauge size={12} className="text-red-300"/> Pres</div>
                   <div className="text-lg font-mono text-gray-100">{weatherData.pressure}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-gray-500 font-mono animate-pulse gap-2">
               <Globe className="animate-spin-slow opacity-50" size={32} />
               <span>ESTABLISHING UPLINK...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 辅助组件：地图定位图标
const MapPin = ({ size }: { size: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default GlobalDashboard;
