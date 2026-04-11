import React, { useState, useEffect } from 'react';
import { 
  Compass, History, RefreshCcw, PlaySquare, 
  Sparkles, Music2, Image as ImageIcon,
  GraduationCap, Heart, Fan, Gem, 
  Laugh, Clapperboard, Video, Gamepad2, Camera, Flame, Mic2, 
  Zap, Crown, Baby, Star, BarChart3, Clock, Calendar
} from 'lucide-react';
import { Category, CategoryConfig } from '../types';
import { CATEGORY_CONFIGS } from '../constants';

interface SidebarProps {
  currentCategory: Category;
  onCategoryChange: (c: Category) => void;
  onRefresh: () => void;
  onOpenHistory: () => void;
}

// 辅助函数：格式化数字
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(num);
};

const Sidebar: React.FC<SidebarProps> = ({ currentCategory, onCategoryChange, onRefresh, onOpenHistory }) => {
  // --- Stats State ---
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionDuration, setSessionDuration] = useState(0);
  
  // 模拟的统计数据 (基于时间生成初始种子)
  const [stats, setStats] = useState(() => {
    const now = new Date();
    const daySeed = now.getDate() + now.getMonth() * 30;
    return {
      daily: 12500 + (now.getHours() * 800) + Math.floor(Math.random() * 500),
      monthly: 450000 + (daySeed * 2000),
      quarterly: 1250000 + (daySeed * 5000),
      yearly: 8900000 + (daySeed * 15000),
    };
  });

  useEffect(() => {
    // Clock, Session Timer & Real-time Stats Simulation
    const timer = setInterval(() => {
      // 1. Update Clock
      setCurrentTime(new Date());
      
      // 2. Update Session Duration
      setSessionDuration(prev => prev + 1);

      // 3. Update Real-time Stats (Simulate traffic)
      // 70% chance to increment per second
      if (Math.random() > 0.3) {
          const increment = Math.floor(Math.random() * 3) + 1; // Randomly add 1-3 views
          setStats(prev => ({
              daily: prev.daily + increment,
              monthly: prev.monthly + increment,
              quarterly: prev.quarterly + increment,
              yearly: prev.yearly + increment
          }));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 格式化时长 HH:MM:SS
  const formatDuration = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  const getIcon = (cat: Category) => {
    switch(cat) {
      case 'sbkl': return <Zap size={18} className="text-yellow-400" />;
      case 'ndym': return <Crown size={18} className="text-purple-400" />;
      case 'tianmei': return <Heart size={18} className="text-pink-400" />;
      case 'luoli': return <Baby size={18} />;
      case 'shwd': return <Star size={18} />;
      case 'xiaoxin': return <Mic2 size={18} />;
      
      case 'zzxjj': return <Heart size={18} />;
      case 'xgg': return <Compass size={18} />;
      case 'yuzu': return <Gem size={18} />;
      case 'manyao': return <Music2 size={18} />;
      case 'diaodai': return <Flame size={18} />;
      case 'nvda': return <GraduationCap size={18} />;
      case 'yujie': return <Mic2 size={18} />;
      case 'jiepai': return <Camera size={18} />;
      case 'hanfu': return <Fan size={18} />;
      case 'wudao': return <Music2 size={18} />;
      case 'bianzhuang': return <Clapperboard size={18} />;
      case 'gaoxiao': return <Laugh size={18} />;
      case 'dongman': return <Video size={18} />;
      case 'game': return <Gamepad2 size={18} />;
      case 'gzl_acg': return <ImageIcon size={18} />;
      default: return <Sparkles size={18} />;
    }
  };

  // Group Definitions
  const groups: {id: string, label: string, type: CategoryConfig['group']}[] = [
    { id: 'featured', label: '热门精选', type: 'featured' },
    { id: 'core', label: '核心频道', type: 'core' },
    { id: 'audio', label: '听觉盛宴', type: 'audio' },
    { id: 'image', label: '美图专区', type: 'image' },
    { id: 'style', label: '更多风格', type: 'style' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 h-full bg-black/60 border-r border-white/10 z-50 backdrop-blur-2xl text-white/90">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
        <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/40">
          <PlaySquare size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">Immersive</h1>
          <div className="text-[10px] text-white/40 font-mono tracking-widest uppercase">Video Platform</div>
        </div>
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-2">
        {groups.map((group) => (
          <div key={group.id} className="mb-4">
            <h3 className="px-6 py-2 text-[10px] font-bold text-white/30 uppercase tracking-widest sticky top-0 bg-[#0a0a0a]/50 backdrop-blur-md z-10">
              {group.label}
            </h3>
            <div className="px-3 space-y-1">
              {Object.entries(CATEGORY_CONFIGS)
                .filter(([_, config]) => config.group === group.type)
                .map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => onCategoryChange(key as Category)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                      currentCategory === key 
                        ? 'bg-white/10 text-white shadow-inner font-medium' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {currentCategory === key && (
                       <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 bg-emerald-500 rounded-r-full" />
                    )}
                    <span className={`transition-colors ${currentCategory === key ? 'text-emerald-400' : 'text-gray-500 group-hover:text-white'}`}>
                        {getIcon(key as Category)}
                    </span>
                    <span className="text-sm">{config.label}</span>
                  </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Stats Footer */}
      <div className="mt-auto bg-black/40 border-t border-white/10 p-4 space-y-4">
          
          {/* Time & Duration */}
          <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 rounded-lg p-2 flex flex-col gap-1 items-center justify-center border border-white/5">
                  <div className="flex items-center gap-1 text-white/50"><Clock size={10} /> <span>当前时间</span></div>
                  <div className="font-mono text-emerald-400 font-bold">
                    {currentTime.toLocaleTimeString('en-US', {hour12:false, hour:'2-digit', minute:'2-digit'})}
                  </div>
                  <div className="text-[9px] text-white/30 scale-90">{currentTime.toLocaleDateString()}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2 flex flex-col gap-1 items-center justify-center border border-white/5">
                  <div className="flex items-center gap-1 text-white/50"><BarChart3 size={10} /> <span>观看时长</span></div>
                  <div className="font-mono text-blue-400 font-bold">{formatDuration(sessionDuration)}</div>
                  <div className="text-[9px] text-white/30 scale-90">本次会话</div>
              </div>
          </div>

          {/* Site Stats */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest animate-pulse">
                <Calendar size={10} className="text-emerald-500" /> <span>全站访问实时数据</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-gray-400">
                <div className="flex justify-between items-center">
                    <span>今日</span> 
                    <span className="text-white font-mono tabular-nums transition-colors duration-300 hover:text-emerald-400">
                        {formatNumber(stats.daily)}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span>本月</span> 
                    <span className="text-white font-mono tabular-nums transition-colors duration-300 hover:text-emerald-400">
                        {formatNumber(stats.monthly)}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span>本季</span> 
                    <span className="text-white font-mono tabular-nums transition-colors duration-300 hover:text-emerald-400">
                        {formatNumber(stats.quarterly)}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span>本年</span> 
                    <span className="text-white font-mono tabular-nums transition-colors duration-300 hover:text-emerald-400">
                        {formatNumber(stats.yearly)}
                    </span>
                </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t border-white/10">
             <button onClick={onOpenHistory} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs transition-colors">
                <History size={14} /> 历史
             </button>
             <button onClick={onRefresh} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs transition-colors">
                <RefreshCcw size={14} /> 刷新
             </button>
          </div>
      </div>
    </div>
  );
};

export default Sidebar;