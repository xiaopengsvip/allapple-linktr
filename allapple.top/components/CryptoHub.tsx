
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign, Layers } from 'lucide-react';
import { STYLES, CRYPTO_DATA, TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface CryptoHubProps {
  lang: Language;
}

const CryptoHub: React.FC<CryptoHubProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].crypto;
  const [points, setPoints] = useState<number[]>([]);

  // 模拟 K 线图数据生成
  useEffect(() => {
    // 初始化点位
    const initialPoints = Array.from({ length: 20 }, () => Math.random() * 50 + 25);
    setPoints(initialPoints);

    const interval = setInterval(() => {
      setPoints(prev => {
        const newPoint = Math.random() * 50 + 25;
        const newPoints = [...prev.slice(1), newPoint];
        return newPoints;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 生成 SVG 路径
  const getPath = () => {
    if (points.length === 0) return '';
    const width = 100;
    const step = width / (points.length - 1);
    const path = points.map((p, i) => {
      const x = i * step;
      const y = 100 - p; // 翻转 Y 轴
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    return path;
  };

  return (
    <div className={`${STYLES.glassPanel} rounded-3xl p-6 md:p-10 w-full relative overflow-hidden group`}>
       {/* 装饰背景 */}
       <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(0,113,227,0.15),transparent_70%)] pointer-events-none"></div>
       
       <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-orbitron flex items-center gap-3">
               <Layers className="text-accent" /> {t.title}
            </h2>
            <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest pl-1">{t.subtitle}</p>
          </div>
          <div className="animate-pulse flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs font-mono">
             <Activity size={12} /> MARKET OPEN
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* 左侧：实时 K 线可视化 */}
          <div className="lg:col-span-2 bg-black/30 border border-white/10 rounded-2xl p-6 h-64 flex flex-col justify-between relative overflow-hidden">
             {/* 模拟网格 */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
             
             <div className="relative z-10 flex justify-between text-xs text-gray-400 font-mono mb-4">
                <span>BTC/USD</span>
                <span>1H INTERVAL</span>
             </div>

             {/* SVG 图表 */}
             <div className="relative w-full h-full">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                   {/* 填充渐变 */}
                   <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                         <stop offset="0%" stopColor="#0071e3" stopOpacity="0.5" />
                         <stop offset="100%" stopColor="#0071e3" stopOpacity="0" />
                      </linearGradient>
                   </defs>
                   <path d={`${getPath()} V 100 H 0 Z`} fill="url(#gradient)" className="transition-all duration-500 ease-linear" />
                   <path d={getPath()} fill="none" stroke="#0071e3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-500 ease-linear filter drop-shadow-[0_0_10px_rgba(0,113,227,0.8)]" />
                   
                   {/* 最后的闪烁点 */}
                   {points.length > 0 && (
                      <circle 
                        cx="100" 
                        cy={100 - points[points.length - 1]} 
                        r="3" 
                        fill="white" 
                        className="animate-ping" 
                      />
                   )}
                </svg>
             </div>
             
             <div className="flex justify-between mt-4 text-xs font-mono text-gray-500">
                <span>10:00</span>
                <span>12:00</span>
                <span>14:00</span>
                <span>16:00</span>
                <span>NOW</span>
             </div>
          </div>

          {/* 右侧：资产列表 */}
          <div className="flex flex-col gap-4 h-64 overflow-y-auto custom-scrollbar pr-2">
             {CRYPTO_DATA.map((coin, idx) => (
                <div key={coin.symbol} className="bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 hover:border-accent/30 transition-all flex items-center justify-between group/item cursor-pointer">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center font-bold text-xs text-white border border-white/10 group-hover/item:border-accent">
                         {coin.symbol}
                      </div>
                      <div>
                         <div className="font-bold text-gray-200">{coin.name}</div>
                         <div className="text-xs text-gray-500 font-mono">Vol: {(Math.random() * 10).toFixed(2)}M</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="font-mono text-white font-medium">{coin.price}</div>
                      <div className={`text-xs font-mono flex items-center justify-end gap-1 ${coin.isUp ? 'text-green-400' : 'text-red-400'}`}>
                         {coin.isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                         {coin.change}
                      </div>
                   </div>
                </div>
             ))}
             
             {/* 模拟市场数据概览 */}
             <div className="mt-auto pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-center">
                <div className="bg-black/20 rounded-lg p-2">
                   <div className="text-[10px] text-gray-500 uppercase">{t.marketCap}</div>
                   <div className="text-sm font-mono text-accent">$2.4T</div>
                </div>
                <div className="bg-black/20 rounded-lg p-2">
                   <div className="text-[10px] text-gray-500 uppercase">{t.volume}</div>
                   <div className="text-sm font-mono text-white">$85B</div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default CryptoHub;
