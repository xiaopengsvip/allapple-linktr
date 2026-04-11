import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, History, PlaySquare, X, Menu, 
  Zap, Crown, Heart, Baby, Star, Mic2, Compass, Gem, 
  Music2, Flame, GraduationCap, Camera, Fan, Clapperboard, 
  Laugh, Video, Gamepad2, Image as ImageIcon, Sparkles 
} from 'lucide-react';
import { Category, CategoryConfig } from '../types';
import { CATEGORY_LABELS, CATEGORY_CONFIGS } from '../constants';

interface TopBarProps {
  currentCategory: Category;
  onCategoryChange: (c: Category) => void;
  onRefresh: () => void;
  onOpenHistory: () => void;
  isCleanMode: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  currentCategory,
  onCategoryChange,
  onOpenHistory,
  isCleanMode
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for top bar background
  useEffect(() => {
    const handleScroll = () => {
        setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const getIcon = (cat: Category) => {
    switch(cat) {
      case 'sbkl': return <Zap size={16} className="text-yellow-400" />;
      case 'ndym': return <Crown size={16} className="text-purple-400" />;
      case 'tianmei': return <Heart size={16} className="text-pink-400" />;
      case 'luoli': return <Baby size={16} />;
      case 'shwd': return <Star size={16} />;
      case 'xiaoxin': return <Mic2 size={16} />;
      
      case 'zzxjj': return <Heart size={16} />;
      case 'xgg': return <Compass size={16} />;
      case 'yuzu': return <Gem size={16} />;
      case 'manyao': return <Music2 size={16} />;
      case 'diaodai': return <Flame size={16} />;
      case 'nvda': return <GraduationCap size={16} />;
      case 'yujie': return <Mic2 size={16} />;
      case 'jiepai': return <Camera size={16} />;
      case 'hanfu': return <Fan size={16} />;
      case 'wudao': return <Music2 size={16} />;
      case 'bianzhuang': return <Clapperboard size={16} />;
      case 'gaoxiao': return <Laugh size={16} />;
      case 'dongman': return <Video size={16} />;
      case 'game': return <Gamepad2 size={16} />;
      case 'gzl_acg': return <ImageIcon size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  const groups: {id: string, label: string, type: CategoryConfig['group']}[] = [
    { id: 'featured', label: '热门精选', type: 'featured' },
    { id: 'core', label: '核心频道', type: 'core' },
    { id: 'audio', label: '听觉盛宴', type: 'audio' },
    { id: 'image', label: '美图专区', type: 'image' },
    { id: 'style', label: '更多风格', type: 'style' },
  ];

  if (isCleanMode) return null;

  return (
    <>
        {/* Mobile Header Bar */}
        <div className={`md:hidden absolute top-0 left-0 right-0 z-40 px-4 py-3 flex justify-between items-center transition-all duration-300 ${scrolled || isMenuOpen ? 'bg-black/80 backdrop-blur-md border-b border-white/5' : 'bg-gradient-to-b from-black/90 to-transparent'}`}>
            
            {/* Logo Area */}
            <div className="flex items-center gap-2.5 pointer-events-auto">
                <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/30">
                    <PlaySquare size={16} className="text-white fill-white/20" />
                </div>
                <div className="flex flex-col leading-none">
                    <span className="font-bold text-base tracking-tight text-white/95">Immersive</span>
                    <span className="text-[9px] text-white/50 font-mono tracking-wider uppercase">Mobile</span>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 pointer-events-auto">
                 <button 
                    onClick={onOpenHistory} 
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 active:scale-95 transition-transform"
                 >
                     <History size={18} />
                 </button>
                 
                 <button 
                    onClick={() => setIsMenuOpen(true)}
                    className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/90 active:bg-white/20 transition-colors"
                 >
                    <span className="text-xs font-medium max-w-[4rem] truncate">{CATEGORY_LABELS[currentCategory]}</span>
                    <ChevronDown size={14} className="text-white/50" />
                 </button>
            </div>
        </div>

        {/* Full Screen Menu Overlay */}
        <div className={`fixed inset-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-2xl transition-all duration-300 flex flex-col ${isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            
            {/* Menu Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-white/90">
                    <Menu size={20} />
                    <span className="text-lg font-bold">频道列表</span>
                </div>
                <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Menu Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
                {groups.map((group) => (
                    <div key={group.id} className="animate-in slide-in-from-bottom-2 duration-500 fade-in fill-mode-backwards" style={{ animationDelay: '100ms' }}>
                        <div className="flex items-center gap-2 mb-3 px-2">
                            <span className="text-xs font-bold text-white/30 uppercase tracking-widest">{group.label}</span>
                            <div className="h-px flex-1 bg-white/5"></div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(CATEGORY_CONFIGS)
                                .filter(([_, config]) => config.group === group.type)
                                .map(([key, config]) => (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            onCategoryChange(key as Category);
                                            setIsMenuOpen(false);
                                        }}
                                        className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all duration-200 text-left ${
                                            currentCategory === key 
                                            ? 'bg-gradient-to-br from-emerald-900/40 to-cyan-900/40 border-emerald-500/30 text-emerald-100 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]' 
                                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        <div className={`${currentCategory === key ? 'text-emerald-400' : 'text-gray-500'}`}>
                                            {getIcon(key as Category)}
                                        </div>
                                        <span className="text-sm font-medium">{config.label}</span>
                                    </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Menu Footer decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </div>
    </>
  );
};

export default TopBar;