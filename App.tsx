import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Video, 
  NotebookPen, 
  Share2, 
  Facebook, 
  Send, 
  Mail, 
  ExternalLink,
  QrCode,
  BadgeCheck,
  Zap,
  ChevronRight,
  ZoomIn,
  X,
  Info,
  ChevronLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  Lock // 用于显示不可删除的图标
} from 'lucide-react';
import GlassCard from './components/GlassCard';
import StatusBar from './components/StatusBar';
import QRCodeModal from './components/QRCodeModal';
import ShareOptionsModal from './components/ShareOptionsModal';
import ContentModal from './components/ContentModal';
import { PreviewItem, ContentItem } from './types';
import { Language, translations } from './translations';

// --- 资源路径配置 (请在此处替换为您的本地文件路径) ---
const ASSETS = {
  avatar: '/assets/avatar.png',       // 护照图片/头像 (Passport/Profile Image)
  bgVideo: '/assets/background.mp4',  // 网站背景视频 (Website Background Video)
  bgImage: '/assets/background.jpg',  // 背景图片/视频备用图 (Fallback Background Image)
  logo: '/assets/logo.png',           // Logo (显示在二维码卡片中)
  badge: '/assets/badge.png',         // 徽标/认证图标 (Verification Badge)
};

// 自定义 X (Twitter) 图标组件
const XIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231h0.001Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
  </svg>
);

const App: React.FC = () => {
  // --- 状态管理 (State Management) ---
  const [lang, setLang] = useState<Language>('zh');
  const [showQR, setShowQR] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // 灯箱/图片预览状态 (Lightbox State)
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
  
  // 通用内容模态框状态 (Generic Content Modal State)
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  // 图库状态 (Gallery State) - 允许用户删除
  const [galleryItems, setGalleryItems] = useState<string[]>([
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1965&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519681393798-3828fb4090bb?q=80&w=1974&auto=format&fit=crop',
  ]);
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // 背景控制状态
  const [useGalleryBg, setUseGalleryBg] = useState(false); // 是否使用图库作为背景
  const [bgImageIndex, setBgImageIndex] = useState(0);

  // 网站预览状态 (Website Preview State) - 包含内置标记 isBuiltIn
  const [previews, setPreviews] = useState<PreviewItem[]>([
    { id: '1', title: 'allapple.top', url: 'https://allapple.top', isBuiltIn: true },
    { id: '2', title: 'all.allapple.top', url: 'https://all.allapple.top', isBuiltIn: true },
    { id: '3', title: 'notes.allapple.top', url: 'https://notes.allapple.top', isBuiltIn: true },
  ]);
  const [showAddSiteModal, setShowAddSiteModal] = useState(false);
  const [newSiteData, setNewSiteData] = useState({ title: '', url: '' });
  
  const t = translations[lang];

  // --- 背景轮播逻辑 (Background Logic) ---
  // 1. 如果检测到需要使用图库背景，启动定时器
  // 2. 如果图片数量变化，确保索引有效
  useEffect(() => {
    if (useGalleryBg && galleryItems.length > 0) {
      const timer = setInterval(() => {
        setBgImageIndex((prev) => (prev + 1) % galleryItems.length);
      }, 8000); // 8秒切换一次
      return () => clearInterval(timer);
    }
  }, [useGalleryBg, galleryItems.length]);

  // --- 自动清理失效图片 (Auto Clean Broken Images) ---
  const handleRemoveInvalidImage = (invalidUrl: string) => {
    console.log(`Removing invalid image: ${invalidUrl}`);
    setGalleryItems(prev => prev.filter(item => item !== invalidUrl));
    
    // 如果该图片当前正在背景中显示，立即切换
    if (useGalleryBg && galleryItems[bgImageIndex] === invalidUrl) {
      setBgImageIndex(prev => (prev + 1) % Math.max(1, galleryItems.length - 1));
    }
  };

  // --------------------------------------------------------------------------
  // 配置数据 (Data & Content Configuration)
  // --------------------------------------------------------------------------

  // 社交链接配置 (Social Links Configuration)
  // 您可以在此处添加或修改社交链接，保留 '#' 作为占位符
  const socialLinks = [
    { icon: <XIcon size={20} />, href: "https://x.com/XIAO2027btc", label: "X (Twitter)" },
    { icon: <Mail size={20} />, href: "mailto:xiaopengsvip@gmail.com", label: "Email" },
    { icon: <Facebook size={20} />, href: "#", label: "Facebook" }, // 占位符示例 (Placeholder)
    { icon: <Send size={20} />, href: "#", label: "Telegram" },    // 占位符示例 (Placeholder)
  ];

  // 项目详情数据 (Project Details)
  const projectDetails: Record<string, ContentItem> = {
    'official': {
      id: 'p1',
      type: 'project',
      title: 'allapple.top Official',
      subtitle: 'Aggregation Hub',
      tags: ['Web', 'Hub', 'React'],
      image: 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=1974&auto=format&fit=crop',
      link: 'https://allapple.top',
      content: `The main hub for the AllApple ecosystem.\n\nDesigned with the "Human Interface Guidelines" in mind, this landing page serves as the central point for all our services. \n\nFeatures:\n- Glassmorphism UI\n- Dynamic animations\n- Responsive design\n- Integrated weather and social feeds.`
    },
    'short': {
      id: 'p2',
      type: 'project',
      title: 'Short Video Platform',
      subtitle: 'Streaming Service',
      tags: ['Video', 'Streaming', 'Mobile'],
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop',
      link: 'https://all.allapple.top',
      content: `A dedicated platform for short-form video content.\n\nExperience seamless infinite scrolling, high-definition playback, and a creator-first algorithm. Built for the modern mobile web.`
    },
    'notes': {
      id: 'p3',
      type: 'project',
      title: 'Apple Style Notes',
      subtitle: 'Blogging & Documentation',
      tags: ['Writing', 'Minimalism', 'Markdown'],
      image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070&auto=format&fit=crop',
      link: 'https://notes.allapple.top',
      content: `A minimalist space for thoughts, documentation, and stories.\n\nFocus on your writing with our distraction-free editor. Supports Markdown, code syntax highlighting, and dark mode out of the box.`
    }
  };

  // 新闻数据 (News Items)
  const newsItems: ContentItem[] = [
    { 
      id: 1, 
      type: 'news',
      title: 'AllApple.top v2.0 Released', 
      subtitle: '2023-10-27',
      tags: ['Update', 'Major Release'],
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
      content: `We are thrilled to announce the official release of AllApple.top v2.0! \n\nThis major update brings a complete visual overhaul inspired by the latest Apple Design Language. We have introduced dynamic backgrounds that shift elegantly as you navigate, along with glassmorphism effects that provide depth and context.`
    },
    { 
      id: 2, 
      type: 'news',
      title: 'New "Notes" platform is now live', 
      subtitle: '2023-10-15',
      tags: ['Product Launch'],
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1973&auto=format&fit=crop',
      content: `Introducing notes.allapple.top — a minimalist blogging platform designed for clarity.\n\nWhether you are writing technical documentation, daily journals, or creative stories, Notes provides a distraction-free environment.`
    },
  ];

  // --- 事件处理函数 (Handlers) ---

  // 系统分享 (System Share)
  const handleSystemShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.title,
          text: t.shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing or user cancelled', error);
      }
    } else {
      setShowShareModal(true);
    }
  };

  // 灯箱控制 (Lightbox Controls)
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(-1);
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % galleryItems.length);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  // 图库滚动 (Gallery Scroll - PC)
  const scrollGallery = (direction: 'left' | 'right') => {
    if (galleryScrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = galleryScrollRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      galleryScrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // 删除图库图片 (Delete Gallery Item)
  const handleDeleteGalleryItem = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setGalleryItems(prev => prev.filter((_, i) => i !== index));
    if (lightboxIndex === index) {
      closeLightbox();
    } else if (lightboxIndex > index) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  // 添加图库图片
  const handleAddGalleryItem = () => {
    if (newGalleryUrl && galleryItems.length < 1000) {
      let finalUrl = newGalleryUrl.trim();
      setGalleryItems(prev => [...prev, finalUrl]);
      setNewGalleryUrl('');
      setShowAddGalleryModal(false);
    }
  };

  // 网站管理 (Website Management)
  const handleAddSite = () => {
    if (newSiteData.url) {
      let finalUrl = newSiteData.url.trim();
      let finalTitle = newSiteData.title.trim();

      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }

      if (!finalTitle) {
        try {
          const hostname = new URL(finalUrl).hostname;
          finalTitle = hostname.replace('www.', '');
          finalTitle = finalTitle.charAt(0).toUpperCase() + finalTitle.slice(1);
        } catch (e) {
          finalTitle = finalUrl;
        }
      }

      const newItem: PreviewItem = {
        id: Date.now().toString(),
        title: finalTitle,
        url: finalUrl,
        isBuiltIn: false 
      };
      
      setPreviews([...previews, newItem]);
      setNewSiteData({ title: '', url: '' });
      setShowAddSiteModal(false);
    }
  };

  const handleDeleteSite = (item: PreviewItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.isBuiltIn) {
      alert("System built-in sites cannot be deleted. (系统内置站点不可删除)");
      return;
    }
    setPreviews(previews.filter(p => p.id !== item.id));
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden font-sans text-white selection:bg-pink-500/30">
      
      {/* 背景系统 (Background System) */}
      <div className="fixed inset-0 -z-20 bg-black">
         <AnimatePresence mode='wait'>
            {!useGalleryBg ? (
               /* 默认：视频背景 */
               <motion.div
                 key="video-bg"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0"
               >
                 <video
                   autoPlay
                   loop
                   muted
                   playsInline
                   className="absolute inset-0 w-full h-full object-cover"
                   poster={ASSETS.bgImage}
                   onError={() => {
                     console.log("Background video failed to load, switching to gallery mode.");
                     setUseGalleryBg(true); // 切换到画廊模式
                   }}
                 >
                   <source src={ASSETS.bgVideo} type="video/mp4" />
                   {/* 如果视频源全部失败，也会触发 onError */}
                 </video>
                 {/* 如果视频未加载，尝试加载图片做兜底 */}
                 <img 
                    src={ASSETS.bgImage} 
                    className="absolute inset-0 w-full h-full object-cover -z-10"
                    alt="Background Fallback"
                    onError={(e) => {
                        // 如果连背景图也挂了，直接切换画廊
                        (e.target as HTMLImageElement).style.display = 'none';
                        setUseGalleryBg(true);
                    }}
                 />
               </motion.div>
            ) : (
               /* 回退：画廊图片轮播 */
               <motion.div 
                 key="gallery-bg"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0"
               >
                 <AnimatePresence mode='popLayout'>
                    {galleryItems.length > 0 && (
                      <motion.img
                        key={galleryItems[bgImageIndex]}
                        src={galleryItems[bgImageIndex]}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Gallery Background"
                        onError={() => handleRemoveInvalidImage(galleryItems[bgImageIndex])}
                      />
                    )}
                 </AnimatePresence>
               </motion.div>
            )}
         </AnimatePresence>
         
         {/* 统一遮罩层 */}
         <div className="absolute inset-0 bg-black/40" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
      </div>

      <StatusBar lang={lang} setLang={setLang} />

      <main className="w-full max-w-md md:max-w-2xl px-6 pt-32 pb-20 flex flex-col items-center gap-8 relative z-10">
        
        {/* 个人资料区域 (Profile Section) */}
        <div className="flex flex-col items-center text-center space-y-4 mb-2">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="relative group cursor-pointer"
            onClick={() => setShowQR(true)}
          >
            <div className="absolute -inset-4 bg-white/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="w-28 h-28 rounded-full p-1.5 bg-white/10 backdrop-blur-sm border border-white/20 relative z-10">
              {/* 护照图片/头像 (Avatar) */}
              <img 
                src={ASSETS.avatar} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover shadow-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://picsum.photos/200';
                }}
              />
            </div>
            {/* 徽标/认证图标 (Badge) */}
            <div className="absolute bottom-2 right-2 z-20 shadow-lg">
               {ASSETS.badge ? (
                 <img src={ASSETS.badge} alt="Verified" className="w-6 h-6 rounded-full border border-black/20" />
               ) : (
                 <div className="bg-blue-500 text-white p-1 rounded-full ring-2 ring-black/50">
                   <BadgeCheck size={14} fill="currentColor" className="text-white" />
                 </div>
               )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md flex items-center justify-center gap-2">
              {t.title}
            </h1>
            <p className="text-white/80 text-sm font-medium max-w-xs mx-auto leading-relaxed tracking-wide shadow-black/50 drop-shadow-sm">
              {t.subtitle}
            </p>
          </motion.div>
        </div>

        {/* 操作按钮 (Action Buttons) */}
        <div className="flex gap-3 w-full">
           <button 
             onClick={() => setShowQR(true)}
             className="flex-1 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold transition-all active:scale-95 group backdrop-blur-md"
           >
             <QrCode size={16} className="text-white/90" /> 
             <span>{t.genQR}</span>
           </button>
           <button 
             onClick={handleSystemShare}
             className="flex-1 py-3 bg-white text-black hover:bg-white/90 border border-white rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
           >
             <Share2 size={16} /> {t.shareTitle}
           </button>
        </div>

        {/* 主要链接 (Main Links) */}
        <div className="w-full flex flex-col gap-3">
          <LinkButton 
            href="https://allapple.top" 
            icon={<Globe size={20} />} 
            title={t.officialWebTitle} 
            desc={t.officialWebDesc} 
            delay={0.1}
            onInfo={() => setSelectedContent(projectDetails['official'])}
          />
          <LinkButton 
            href="https://all.allapple.top" 
            icon={<Video size={20} />} 
            title={t.shortVideoTitle} 
            desc={t.shortVideoDesc}
            delay={0.2}
            onInfo={() => setSelectedContent(projectDetails['short'])}
          />
          <LinkButton 
            href="https://notes.allapple.top" 
            icon={<NotebookPen size={20} />} 
            title={t.notesTitle} 
            desc={t.notesDesc}
            delay={0.3}
            onInfo={() => setSelectedContent(projectDetails['notes'])}
          />
        </div>

        {/* 新闻区域 (News Section) */}
        <GlassCard className="w-full !bg-black/30 !border-white/10" delay={0.4} noPadding>
          <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-white/5">
            <div className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-400">
               <Zap size={14} fill="currentColor" />
            </div>
            <span className="text-sm font-semibold text-white/90">{t.newsTitle}</span>
          </div>
          <div className="p-2">
            {newsItems.map((item) => (
              <motion.div 
                key={item.id} 
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)', scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedContent(item)}
                className="flex items-center justify-between p-3.5 rounded-xl transition-all cursor-pointer group"
              >
                <div className="flex flex-col gap-1 min-w-0 pr-4">
                  <span className="text-sm text-white/90 group-hover:text-white transition-colors truncate font-medium">
                    {item.title}
                  </span>
                  <span className="text-xs text-white/50 font-medium">
                    {item.subtitle}
                  </span>
                </div>
                <div className="text-white/30 group-hover:text-white/80 group-hover:translate-x-1 transition-all">
                  <ChevronRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* 图库区域 (Gallery Section) */}
        <div className="w-full space-y-4">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2 shadow-black drop-shadow-sm">
                {t.galleryTitle}
              </h3>
              
              {/* PC端导航控制 (PC Navigation Controls) */}
              <div className="flex gap-2">
                 <button 
                   onClick={() => scrollGallery('left')}
                   className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white hidden sm:flex transition-colors"
                 >
                   <ChevronLeft size={16} />
                 </button>
                 <button 
                   onClick={() => scrollGallery('right')}
                   className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white hidden sm:flex transition-colors"
                 >
                   <ChevronRight size={16} />
                 </button>
              </div>
           </div>
           
           {/* 水平滚动容器 (Horizontal Scroll Container) */}
           <div 
             ref={galleryScrollRef}
             className="
               flex overflow-x-auto gap-4 pb-4 px-1 snap-x snap-mandatory 
               scrollbar-hide cursor-grab active:cursor-grabbing
               -mx-4 px-4 sm:mx-0 sm:px-0
             "
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
           >
             {galleryItems.map((img, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.1 * (i % 3) }} // Staggered slightly
                 className="
                   relative group flex-shrink-0 
                   w-[45%] sm:w-[32%] aspect-[4/3] 
                   snap-center
                 "
                 onClick={() => openLightbox(i)}
               >
                 <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-black/20 shadow-lg relative">
                   <img 
                      src={img} 
                      alt={`Gallery ${i+1}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      onError={() => handleRemoveInvalidImage(img)}
                   />
                   
                   {/* 遮罩层 (Overlay) */}
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ZoomIn className="text-white drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                   </div>

                   {/* 删除按钮 (Delete Button) - 用户有权直接清除 */}
                   <button 
                      onClick={(e) => handleDeleteGalleryItem(i, e)}
                      className="
                        absolute top-2 right-2 p-1.5 rounded-full 
                        bg-black/40 hover:bg-red-500/80 text-white/70 hover:text-white 
                        backdrop-blur-md transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                      "
                      title={t.delete}
                   >
                     <Trash2 size={12} />
                   </button>
                 </div>
               </motion.div>
             ))}
             
             {/* 添加图片按钮 - 仅当数量少于1000时显示 */}
             {galleryItems.length < 1000 && (
               <motion.div
                 whileHover={{ scale: 0.98 }}
                 whileTap={{ scale: 0.95 }}
                 className="flex-shrink-0 w-[45%] sm:w-[32%] aspect-[4/3] snap-center cursor-pointer"
                 onClick={() => setShowAddGalleryModal(true)}
               >
                  <div className="w-full h-full rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center gap-3 transition-colors">
                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <Plus size={24} className="text-white/60" />
                     </div>
                     <span className="text-xs font-medium text-white/40 uppercase tracking-widest">{t.add}</span>
                  </div>
               </motion.div>
             )}

             {/* 占位符/间隔 (Spacer) */}
             <div className="w-2 flex-shrink-0" />
           </div>
        </div>

        {/* 精选网站预览 (Featured Websites Previews) */}
        <div className="w-full space-y-4 pt-4">
             <div className="w-full flex items-center gap-4">
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
                <span className="text-xs font-medium text-white/60 uppercase tracking-widest shadow-black drop-shadow-md">{t.featuredSites}</span>
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
             </div>
             
             <div className="grid grid-cols-1 gap-6">
                <AnimatePresence>
                  {previews.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative"
                    >
                      <div className="bg-[#121212] rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-black/20 transition-transform duration-500 group-hover:-translate-y-1">
                        <div className="h-10 bg-[#1c1c1c] border-b border-white/5 flex items-center px-4 justify-between relative">
                           {/* 窗口控制点 (Window Controls) */}
                           <div className="flex items-center gap-2">
                             <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                             <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                             <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                           </div>
                           
                           {/* 居中标题 (Centered Title) */}
                           <div className="absolute left-1/2 -translate-x-1/2 text-[11px] font-medium text-white/40 uppercase tracking-wider flex items-center gap-2 pointer-events-none">
                             {item.title}
                           </div>
                           
                           {/* 操作按钮 (Action Buttons) */}
                           <div className="flex items-center gap-2 z-20">
                             {/* 外部链接 (External Link) */}
                             <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-1.5 rounded-md hover:bg-white/10 text-white/20 hover:text-white transition-colors"
                                title={t.openInNewTab}
                             >
                               <ExternalLink size={14} />
                             </a>

                             {/* 删除按钮 (Delete Button) - 区分内置与用户添加 */}
                             {item.isBuiltIn ? (
                               <div className="p-1.5 text-white/10 cursor-not-allowed" title="Built-in site (内置站点)">
                                 <Lock size={14} />
                               </div>
                             ) : (
                               <button 
                                  onClick={(e) => handleDeleteSite(item, e)}
                                  className="p-1.5 rounded-md hover:bg-red-500/20 text-white/20 hover:text-red-400 transition-colors"
                                  title={t.delete}
                               >
                                 <Trash2 size={14} />
                               </button>
                             )}
                           </div>
                        </div>
                        <div className="relative h-[250px] bg-white group-hover:opacity-100 transition-opacity">
                           <iframe 
                             src={item.url} 
                             className="w-full h-full border-0"
                             title={item.title}
                             loading="lazy"
                           />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* 添加网站按钮 (Add Website Button) */}
                <motion.button
                   onClick={() => setShowAddSiteModal(true)}
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="h-[100px] rounded-2xl border-2 border-dashed border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center gap-3 text-white/40 hover:text-white transition-all group"
                >
                   <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10">
                      <Plus size={24} />
                   </div>
                   <span className="text-xs font-medium uppercase tracking-widest">{t.addSite}</span>
                </motion.button>
             </div>
        </div>

        {/* 联系/关注区域 (Contact/Follow Section) - 使用配置化渲染 (Configured Rendering) */}
        <div className="w-full pt-6">
           <h3 className="text-center text-xs font-semibold text-white/40 uppercase tracking-widest mb-6 shadow-black drop-shadow-sm">{t.contact}</h3>
           <div className="flex justify-center gap-6">
             {socialLinks.map((link, index) => (
               <SocialIcon 
                 key={index} 
                 icon={link.icon} 
                 href={link.href} 
                 label={link.label} 
               />
             ))}
           </div>
        </div>

        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white/30 text-[10px] font-light tracking-widest uppercase pb-10 mt-8 shadow-black drop-shadow-sm"
        >
          {t.footer.replace('{year}', new Date().getFullYear().toString())}
        </motion.footer>

      </main>

      {/* 增强型灯箱模态框 (Enhanced Lightbox Modal) */}
      <AnimatePresence>
        {lightboxIndex >= 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button 
              className="absolute top-6 right-6 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-[210]"
              onClick={closeLightbox}
            >
              <X size={24} />
            </button>
            <button
              className="absolute left-4 sm:left-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-[210] hidden sm:block"
              onClick={prevImage}
            >
              <ChevronLeft size={32} />
            </button>
            <button
              className="absolute right-4 sm:right-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-[210] hidden sm:block"
              onClick={nextImage}
            >
              <ChevronRight size={32} />
            </button>
            <motion.div
               key={lightboxIndex}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
               className="relative max-w-full max-h-[85vh]"
               onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={galleryItems[lightboxIndex]} 
                alt={`Lightbox ${lightboxIndex}`} 
                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain select-none"
                onError={() => {
                   handleRemoveInvalidImage(galleryItems[lightboxIndex]);
                   closeLightbox();
                }}
              />
              <div className="absolute inset-y-0 left-0 w-1/4 sm:hidden" onClick={prevImage} />
              <div className="absolute inset-y-0 right-0 w-1/4 sm:hidden" onClick={nextImage} />
              <div className="absolute -bottom-10 left-0 right-0 text-center text-white/50 text-sm font-medium">
                {lightboxIndex + 1} / {galleryItems.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 添加网站模态框 (Add Website Modal) */}
      <AnimatePresence>
        {showAddSiteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAddSiteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1c1c1e] w-full max-w-sm rounded-[24px] p-6 shadow-2xl border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-4">{t.addSite}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/50 uppercase font-bold tracking-wider mb-1.5 block">{t.siteUrl}</label>
                  <input 
                    type="text" 
                    value={newSiteData.url}
                    onChange={(e) => setNewSiteData({...newSiteData, url: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="example.com"
                  />
                  <p className="text-[10px] text-white/30 mt-1.5 ml-1">
                    {t.siteUrlHint}
                  </p>
                </div>
                {/* 可选标题输入 (Optional Title Input) */}
                <div>
                  <label className="text-xs text-white/50 uppercase font-bold tracking-wider mb-1.5 block">{t.siteTitle} <span className="opacity-50 font-normal normal-case">({t.optional})</span></label>
                  <input 
                    type="text" 
                    value={newSiteData.title}
                    onChange={(e) => setNewSiteData({...newSiteData, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder={t.autoTitle}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowAddSiteModal(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                >
                  {t.cancel}
                </button>
                <button 
                  onClick={handleAddSite}
                  disabled={!newSiteData.url}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-bold transition-colors"
                >
                  {t.add}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 添加图片模态框 (Add Gallery Modal) */}
      <AnimatePresence>
        {showAddGalleryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAddGalleryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1c1c1e] w-full max-w-sm rounded-[24px] p-6 shadow-2xl border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-4">{t.addGalleryImage}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/50 uppercase font-bold tracking-wider mb-1.5 block">{t.imageUrl}</label>
                  <input 
                    type="text" 
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowAddGalleryModal(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                >
                  {t.cancel}
                </button>
                <button 
                  onClick={handleAddGalleryItem}
                  disabled={!newGalleryUrl}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-bold transition-colors"
                >
                  {t.add}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContentModal 
        item={selectedContent} 
        onClose={() => setSelectedContent(null)} 
      />

      <QRCodeModal isOpen={showQR} onClose={() => setShowQR(false)} url={window.location.href} lang={lang} logoUrl={ASSETS.logo} />
      <ShareOptionsModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} url={window.location.href} lang={lang} />

    </div>
  );
};

// --- 子组件 (Sub-components) ---

interface LinkButtonProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay?: number;
  onInfo?: () => void;
}

const LinkButton: React.FC<LinkButtonProps> = ({ href, icon, title, desc, delay = 0, onInfo }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="flex gap-2"
  >
    {/* 主要链接区域 (Main Link Area) */}
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer"
      className="group flex-1 flex items-center p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden active:scale-[0.98] backdrop-blur-md"
    >
      <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent rounded-xl text-white group-hover:scale-105 transition-transform shadow-inner border border-white/5">
        {icon}
      </div>
      <div className="ml-4 flex-1 flex flex-col justify-center">
        <h3 className="font-semibold text-base text-white/95 group-hover:text-white transition-colors tracking-tight shadow-black drop-shadow-sm">{title}</h3>
        <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors shadow-black drop-shadow-sm">{desc}</p>
      </div>
      <div className="mr-2 text-white/30 group-hover:text-white/80 group-hover:translate-x-1 transition-all duration-300">
        <ChevronRight size={18} />
      </div>
    </a>

    {/* 详情按钮 (Info Button - if provided) */}
    {onInfo && (
      <button 
        onClick={(e) => { e.preventDefault(); onInfo(); }}
        className="w-16 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/20 border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all active:scale-95 backdrop-blur-md"
        title="View Details"
      >
        <Info size={20} />
      </button>
    )}
  </motion.div>
);

const SocialIcon: React.FC<{ icon: React.ReactNode; href: string; label: string }> = ({ icon, href, label }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noreferrer" 
    aria-label={label}
    className="w-12 h-12 flex items-center justify-center bg-black/20 rounded-full hover:bg-white hover:text-black hover:-translate-y-1 transition-all duration-300 text-white/70 border border-white/10 shadow-lg backdrop-blur-sm"
  >
    {icon}
  </a>
);

export default App;