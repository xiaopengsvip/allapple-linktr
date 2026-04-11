import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CATEGORY_CONFIGS, HISTORY_KEY } from './constants';
import { Category, VideoItem, VideoHistoryItem } from './types';
import VideoPlayer from './components/VideoPlayer';
import Controls from './components/Controls';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import HistoryModal from './components/HistoryModal';
import { Loader2, Maximize2, Minimize2 } from 'lucide-react';

const BATCH_SIZE = 3;

function App() {
  const [category, setCategory] = useState<Category>('sbkl'); // Default to new Featured category
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Player State
  const [isPlaying, setIsPlaying] = useState(false); 
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isCleanMode, setIsCleanMode] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false); // PC Immersive Mode
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Current Video Status
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // --- Data Loading ---
  
  const generateVideo = useCallback((cat: Category): VideoItem => {
    const config = CATEGORY_CONFIGS[cat];
    const uniqueQuery = `?v=${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    let finalUrl = config.url;
    if (finalUrl.includes('?')) {
        finalUrl = `${finalUrl}&v=${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    } else {
        finalUrl = `${finalUrl}${uniqueQuery}`;
    }

    return {
      id: uniqueQuery,
      url: finalUrl,
      category: cat,
      type: config.type
    };
  }, []);

  const loadMoreVideos = useCallback((count: number, reset = false) => {
    setIsLoading(true);
    // Simulate slight network delay
    setTimeout(() => {
        const newVideos: VideoItem[] = [];
        for (let i = 0; i < count; i++) {
          newVideos.push(generateVideo(category));
        }
        setVideos(prev => reset ? newVideos : [...prev, ...newVideos]);
        setIsLoading(false);
    }, 300);
  }, [category, generateVideo]);

  // Initial load
  useEffect(() => {
    loadMoreVideos(4, true);
    setIsPlaying(true); 
    setActiveIndex(0);
  }, [category, loadMoreVideos]);

  // --- Scroll & Intersection Handling ---

  useEffect(() => {
    const options = {
      root: containerRef.current,
      threshold: 0.6 
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-index'));
          setActiveIndex(index);
          
          if (index >= videos.length - 2) {
            loadMoreVideos(BATCH_SIZE);
          }
        }
      });
    }, options);

    const videoElements = document.querySelectorAll('.video-card-wrapper');
    videoElements.forEach(el => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [videos, loadMoreVideos]);

  // --- History Management ---

  const saveToHistory = useCallback((item: VideoItem) => {
    try {
      const existing = localStorage.getItem(HISTORY_KEY);
      const list: VideoHistoryItem[] = existing ? JSON.parse(existing) : [];
      if (list.length > 0 && list[0].url === item.url) return;
      const newItem: VideoHistoryItem = { 
          url: item.url, 
          timestamp: Date.now(),
          type: item.type
      };
      const updated = [newItem, ...list].slice(0, 50); 
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("History save failed", e);
    }
  }, []);

  useEffect(() => {
    const currentVid = videos[activeIndex];
    if (currentVid) {
        setCurrentTime(0);
        setDuration(0);
        const timer = setTimeout(() => {
            saveToHistory(currentVid);
        }, 2000); 
        return () => clearTimeout(timer);
    }
  }, [activeIndex, videos, saveToHistory]);

  // --- Controls Handlers ---

  const togglePlay = useCallback(() => setIsPlaying(p => !p), []);
  const toggleMute = useCallback(() => setIsMuted(m => !m), []);
  
  const cycleSpeed = useCallback(() => {
    const speeds = [0.5, 1.0, 1.5, 2.0];
    setPlaybackRate(prev => {
        const idx = speeds.indexOf(prev);
        return speeds[(idx + 1) % speeds.length];
    });
  }, []);

  const handleVideoEnded = useCallback(() => {
    const nextIndex = activeIndex + 1;
    if (nextIndex < videos.length) {
      const nextElement = document.querySelector(`[data-index="${nextIndex}"]`);
      nextElement?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeIndex, videos.length]);

  const downloadVideo = () => {
    const currentVid = videos[activeIndex];
    if (currentVid) {
      const a = document.createElement('a');
      a.href = currentVid.url;
      a.download = `${currentVid.type}_${Date.now()}.${currentVid.type === 'video' ? 'mp4' : 'jpg'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleSeek = (time: number) => {
    if (videos[activeIndex]?.type === 'image') return;
    const container = document.querySelector(`[data-index-video="${activeIndex}"]`);
    const vid = container?.querySelector('video');
    if (vid) {
        vid.currentTime = time;
        setCurrentTime(time);
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (historyOpen) return;
        switch(e.code) {
            case 'Space': 
            case 'KeyK': e.preventDefault(); togglePlay(); break;
            case 'ArrowUp': e.preventDefault(); document.querySelector(`[data-index="${activeIndex - 1}"]`)?.scrollIntoView({ behavior: 'smooth' }); break;
            case 'ArrowDown': e.preventDefault(); document.querySelector(`[data-index="${activeIndex + 1}"]`)?.scrollIntoView({ behavior: 'smooth' }); break;
            case 'KeyM': e.preventDefault(); toggleMute(); break;
            case 'KeyF': 
                e.preventDefault(); 
                const container = document.querySelector(`[data-index-video="${activeIndex}"]`);
                const mediaEl = container?.querySelector('video') || container?.querySelector('img');
                if (mediaEl) {
                    if (!document.fullscreenElement) mediaEl.requestFullscreen().catch(() => {});
                    else document.exitFullscreen().catch(() => {});
                }
                break;
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, videos.length, historyOpen, togglePlay, toggleMute]);

  // Determine object fit: For images in PC Immersive/Normal mode, generally prefer 'contain' to see full art.
  // For videos, 'cover' is usually better for immersion unless explicitly requested otherwise.
  const getObjectFit = (type: string) => {
      // If image, always contain to show full picture
      if (type === 'image') return 'contain';
      // For video
      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
          return isImmersive ? 'contain' : 'cover';
      }
      return 'cover';
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-white overflow-hidden font-sans select-none relative transition-colors duration-700">
      
      {/* PC Ambient Background */}
      <div className="hidden md:block absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[#0a0a0a]" />
          <div className={`absolute inset-0 opacity-20 blur-[120px] transition-colors duration-1000 ease-in-out
               ${['zzxjj','lo','tianmei'].includes(category) ? 'bg-gradient-to-tr from-purple-900 to-pink-900' : ''}
               ${['xgg','jks','sbkl'].includes(category) ? 'bg-gradient-to-tr from-blue-900 to-cyan-900' : ''}
               ${['yuzu','heis','ndym'].includes(category) ? 'bg-gradient-to-tr from-emerald-900 to-teal-900' : ''}
               ${['manyao','shwd','gzl_acg'].includes(category) ? 'bg-gradient-to-tr from-orange-900 to-red-900' : ''}
          `} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0a0a0a_100%)]" />
      </div>

      {/* Desktop Sidebar */}
      <div className={`hidden md:block h-full z-50 transition-all duration-500 ease-in-out ${isImmersive ? 'w-0 opacity-0 -ml-10' : 'w-64 opacity-100'}`}>
          <div className="w-64 h-full">
            <Sidebar 
                currentCategory={category}
                onCategoryChange={(c) => {
                    setCategory(c);
                    if(containerRef.current) containerRef.current.scrollTop = 0;
                }}
                onRefresh={() => loadMoreVideos(4, true)}
                onOpenHistory={() => setHistoryOpen(true)}
            />
          </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col md:items-center justify-center z-10 transition-all duration-500">
          
          {/* PC Immersive Toggle */}
          <button 
             onClick={() => setIsImmersive(!isImmersive)}
             className="hidden md:flex absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/5 transition-all active:scale-95 text-white/80 hover:text-white group"
             title={isImmersive ? "退出影院模式" : "进入影院模式"}
          >
             {isImmersive ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          {/* Mobile Top Bar */}
          <TopBar 
            currentCategory={category}
            onCategoryChange={(c) => {
                setCategory(c);
                if(containerRef.current) containerRef.current.scrollTop = 0;
            }}
            onRefresh={() => loadMoreVideos(4, true)}
            onOpenHistory={() => setHistoryOpen(true)}
            isCleanMode={isCleanMode}
          />

          {/* Video Feed Container */}
          <div 
            ref={containerRef}
            className={`
                relative overflow-y-scroll snap-y snap-mandatory no-scrollbar transition-all duration-500 ease-in-out
                w-full h-full
                ${isImmersive 
                   ? 'md:w-full md:h-full md:rounded-none md:border-0 md:bg-black/90' 
                   : 'md:w-[500px] md:h-[calc(100vh-32px)] md:rounded-[24px] md:border-[1px] md:border-white/10 md:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.9)] md:bg-black'
                }
            `}
          >
            {videos.length === 0 && isLoading && (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="animate-spin text-white/50 w-8 h-8" />
                </div>
            )}
            
            {videos.map((video, index) => (
              <div 
                key={video.id}
                data-index={index}
                className="video-card-wrapper w-full h-full snap-start relative bg-black flex items-center justify-center overflow-hidden"
              >
                 {/* Desktop Inner Blur Effect */}
                 <div className={`hidden md:block absolute inset-0 pointer-events-none transition-opacity duration-500 ${isImmersive ? 'opacity-20 blur-xl' : 'opacity-40 blur-3xl scale-110'}`}>
                     <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black" />
                 </div>

                 {/* Media Area */}
                 <div className="relative w-full h-full z-20" data-index-video={index}>
                    {Math.abs(activeIndex - index) < 3 && (
                    <>
                        <VideoPlayer
                            src={video.url}
                            type={video.type}
                            isActive={index === activeIndex}
                            isMuted={isMuted}
                            playbackRate={playbackRate}
                            onEnded={handleVideoEnded}
                            togglePlay={togglePlay}
                            isPlayingGlobal={isPlaying}
                            objectFit={getObjectFit(video.type)}
                            onTimeUpdate={(curr, dur) => {
                                if (index === activeIndex) {
                                    setCurrentTime(curr);
                                    setDuration(dur);
                                }
                            }}
                        />
                        
                        {index === activeIndex && (
                            <Controls 
                                isPlaying={isPlaying}
                                togglePlay={togglePlay}
                                isMuted={isMuted}
                                toggleMute={toggleMute}
                                playbackRate={playbackRate}
                                changeSpeed={cycleSpeed}
                                isCleanMode={isCleanMode}
                                toggleCleanMode={() => setIsCleanMode(!isCleanMode)}
                                downloadVideo={downloadVideo}
                                currentVideoDuration={duration}
                                currentVideoTime={currentTime}
                                onSeek={handleSeek}
                                mediaType={video.type}
                            />
                        )}
                    </>
                    )}
                 </div>
              </div>
            ))}
          </div>

          {/* PC Keyboard Hints */}
          <div className={`hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 items-center gap-6 text-[10px] text-white/20 uppercase tracking-widest pointer-events-none transition-opacity duration-300 ${isImmersive ? 'opacity-0' : 'opacity-100'}`}>
              <span>空格播放</span>
              <span>↑↓ 切换</span>
              <span>F 全屏</span>
          </div>
      </div>

      <HistoryModal 
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={localStorage.getItem(HISTORY_KEY) ? JSON.parse(localStorage.getItem(HISTORY_KEY)!) : []}
        onClear={() => {
            localStorage.removeItem(HISTORY_KEY);
            setHistoryOpen(false); 
            setTimeout(() => setHistoryOpen(true), 0);
        }}
      />
    </div>
  );
}

export default App;