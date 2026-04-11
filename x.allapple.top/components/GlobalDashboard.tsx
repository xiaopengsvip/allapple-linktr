
import React, { useState, useEffect } from 'react';
import { Clock, Map, Wind, Droplets, Thermometer, Eye, Gauge } from 'lucide-react';
import { TRANSLATIONS, STYLES } from '../constants';
import { Language } from '../types';

interface GlobalDashboardProps {
  lang: Language;
}

const GlobalDashboard: React.FC<GlobalDashboardProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].dashboard;
  const [time, setTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState<any>(null);

  // World Clocks Configuration
  const timeZones = [
    { city: 'New York', zone: 'America/New_York' },
    { city: 'London', zone: 'Europe/London' },
    { city: 'Tokyo', zone: 'Asia/Tokyo' },
    { city: 'Sydney', zone: 'Australia/Sydney' },
  ];

  // Labels
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
        // wttr.in JSON format
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
        () => fetchDetailedWeather()
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
    <div className={`${STYLES.glassPanel} rounded-3xl p-6 md:p-10 w-full`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-orbitron flex items-center gap-3">
             <Map className="text-accent" /> {t.title}
          </h2>
          <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest">{t.subtitle}</p>
        </div>
        <div className="px-3 py-1 bg-accent/20 border border-accent/50 rounded-full text-xs font-mono text-accent animate-pulse">
          LIVE DATA STREAM
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Time Zone Column */}
        <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-bold mb-6 font-orbitron flex items-center gap-2 text-gray-200">
            <Clock size={18} /> {t.timeZone}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {timeZones.map((tz) => (
              <div key={tz.city} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-accent/30 transition-colors group">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1 group-hover:text-accent transition-colors">
                  {cityLabels[tz.city][lang]}
                </div>
                <div className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tighter">
                  {getTimeInZone(tz.zone)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Column */}
        <div className="bg-gradient-to-br from-blue-900/20 to-black/20 rounded-2xl p-6 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wind size={100} />
          </div>
          
          <h3 className="text-lg font-bold mb-6 font-orbitron flex items-center gap-2 text-gray-200 relative z-10">
            <Thermometer size={18} /> {t.weather}
          </h3>

          {weatherData ? (
            <div className="relative z-10">
              <div className="flex items-end gap-4 mb-6">
                 <div className="text-6xl md:text-7xl font-bold text-white tracking-tighter">
                   {weatherData.temp}°
                 </div>
                 <div className="mb-2">
                   <div className="text-xl font-bold text-accent">{weatherData.location}</div>
                   <div className="text-gray-300 text-sm">{weatherData.desc}</div>
                 </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-black/20 p-3 rounded-lg backdrop-blur-sm">
                   <div className="flex items-center gap-1 text-gray-400 text-[10px] mb-1"><Droplets size={12}/> {t.humidity}</div>
                   <div className="text-lg font-mono">{weatherData.humidity}%</div>
                </div>
                <div className="bg-black/20 p-3 rounded-lg backdrop-blur-sm">
                   <div className="flex items-center gap-1 text-gray-400 text-[10px] mb-1"><Wind size={12}/> {t.wind}</div>
                   <div className="text-lg font-mono">{weatherData.windSpeed} <span className="text-xs">km/h</span></div>
                </div>
                <div className="bg-black/20 p-3 rounded-lg backdrop-blur-sm">
                   <div className="flex items-center gap-1 text-gray-400 text-[10px] mb-1"><Eye size={12}/> Vis</div>
                   <div className="text-lg font-mono">{weatherData.visibility} <span className="text-xs">km</span></div>
                </div>
                <div className="bg-black/20 p-3 rounded-lg backdrop-blur-sm">
                   <div className="flex items-center gap-1 text-gray-400 text-[10px] mb-1"><Gauge size={12}/> hPa</div>
                   <div className="text-lg font-mono">{weatherData.pressure}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-500 font-mono animate-pulse">
               CONNECTING SATELLITE...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalDashboard;
