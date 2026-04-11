import React, { useRef, useEffect, useState } from 'react';
import { Loader2, Play, Image as ImageIcon, Mic, Radio, Music } from 'lucide-react';
import { MediaType } from '../types';

interface VideoPlayerProps {
  src: string;
  type: MediaType;
  isActive: boolean;
  isMuted: boolean;
  playbackRate: number;
  onEnded: () => void;
  togglePlay: () => void;
  isPlayingGlobal: boolean;
  objectFit?: 'cover' | 'contain';
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

const IMAGE_DURATION = 5; // Seconds to show an image before auto-advancing

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src, 
  type,
  isActive, 
  isMuted, 
  playbackRate, 
  onEnded,
  togglePlay,
  isPlayingGlobal,
  objectFit = 'cover',
  onTimeUpdate
}) => {
  // Use HTMLMediaElement to support both Video and Audio
  const mediaRef = useRef<HTMLMediaElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Image specific state
  const imageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [imageProgress, setImageProgress] = useState(0);

  // --- Media Logic (Video & Audio) ---
  useEffect(() => {
    if (type === 'image') return;

    const media = mediaRef.current;
    if (!media) return;

    if (isActive && isPlayingGlobal) {
      media.play().catch((e) => console.debug("Autoplay blocked", e));
    } else {
      media.pause();
    }
  }, [isActive, isPlayingGlobal, type]);

  useEffect(() => {
    if (type !== 'image' && mediaRef.current) {
      mediaRef.current.muted = isMuted;
    }
  }, [isMuted, type]);

  useEffect(() => {
    if (type !== 'image' && mediaRef.current) {
      mediaRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, type]);

  // --- Image Logic ---
  useEffect(() => {
    if (type !== 'image') return;
    
    // Reset state when not active
    if (!isActive) {
        if (imageTimerRef.current) clearInterval(imageTimerRef.current);
        setImageProgress(0);
        return;
    }

    // Start timer if active and playing
    if (isActive && isPlayingGlobal) {
        let startTime = Date.now();
        setImageProgress(0);
        
        // Notify parent that "video" started
        if(onTimeUpdate) onTimeUpdate(0, IMAGE_DURATION);

        imageTimerRef.current = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = elapsed;
            
            setImageProgress(progress);
            if(onTimeUpdate) onTimeUpdate(progress, IMAGE_DURATION);

            if (elapsed >= IMAGE_DURATION) {
                if (imageTimerRef.current) clearInterval(imageTimerRef.current);
                onEnded();
            }
        }, 100);
    } else {
        if (imageTimerRef.current) clearInterval(imageTimerRef.current);
    }

    return () => {
        if (imageTimerRef.current) clearInterval(imageTimerRef.current);
    };
  }, [isActive, isPlayingGlobal, type, onEnded, onTimeUpdate]);


  const renderContent = () => {
    if (type === 'image') {
        return (
            <>
                <img 
                    src={src}
                    alt="Content"
                    className={`w-full h-full transition-all duration-500 ${objectFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setHasError(true);
                        setIsLoading(false);
                    }}
                    onClick={togglePlay}
                />
                {/* Image Progress Indicator Overlay */}
                {isActive && !isLoading && (
                     <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full z-20">
                         <div 
                            className="h-full bg-emerald-500 transition-all duration-100 ease-linear"
                            style={{ width: `${Math.min(100, (imageProgress / IMAGE_DURATION) * 100)}%` }} 
                         />
                     </div>
                )}
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-xs text-white/70 flex items-center gap-1 z-20 pointer-events-none">
                    <ImageIcon size={12} />
                    <span>Image</span>
                </div>
            </>
        );
    }

    // --- Audio Visualizer UI ---
    if (type === 'audio') {
        return (
            <div className="w-full h-full relative bg-gradient-to-br from-indigo-900 via-purple-900 to-black overflow-hidden" onClick={togglePlay}>
                {/* Audio Element (Invisible but functional) */}
                <audio
                    ref={mediaRef as React.RefObject<HTMLAudioElement>}
                    src={src}
                    loop={false}
                    onEnded={onEnded}
                    onWaiting={() => setIsLoading(true)}
                    onCanPlay={() => setIsLoading(false)}
                    onTimeUpdate={(e) => {
                        if(onTimeUpdate) onTimeUpdate(e.currentTarget.currentTime, e.currentTarget.duration);
                    }}
                    onError={() => {
                        setHasError(true);
                        setIsLoading(false);
                    }}
                />
                
                {/* Visualizer Animations */}
                {!isLoading && !hasError && (
                    <>
                        {/* Animated Background Circles */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl transition-transform duration-1000 ${isActive && isPlayingGlobal ? 'animate-pulse scale-125' : 'scale-100'}`} />
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl transition-transform delay-75 duration-1000 ${isActive && isPlayingGlobal ? 'animate-pulse scale-150' : 'scale-100'}`} />
                        
                        {/* Central Icon */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-6">
                            <div className={`relative w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md shadow-2xl transition-all duration-300 ${isActive && isPlayingGlobal ? 'scale-110 border-emerald-500/50 shadow-emerald-900/40' : ''}`}>
                                {isActive && isPlayingGlobal ? (
                                    <div className="flex gap-1 items-end h-8">
                                        {[...Array(5)].map((_, i) => (
                                            <div 
                                                key={i} 
                                                className="w-1.5 bg-emerald-400 rounded-full animate-[bounce_1s_infinite]"
                                                style={{ animationDelay: `${i * 0.1}s`, height: `${Math.random() * 100 + 40}%` }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <Mic size={40} className="text-white/80" />
                                )}
                            </div>
                            
                            <div className="text-center space-y-1">
                                <h3 className="text-lg font-bold text-white tracking-wide flex items-center justify-center gap-2">
                                    <Radio size={16} className="text-emerald-400" />
                                    <span>御姐语音</span>
                                </h3>
                                <p className="text-xs text-white/50 font-mono">沉浸式音频体验</p>
                            </div>
                        </div>

                        {/* Floating Particles (CSS only for simplicity) */}
                        <div className="absolute inset-0 opacity-30 pointer-events-none">
                            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping duration-[3s]" />
                            <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping duration-[4s]" />
                        </div>
                    </>
                )}

                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-xs text-white/70 flex items-center gap-1 z-20 pointer-events-none">
                    <Music size={12} />
                    <span>Audio</span>
                </div>
            </div>
        );
    }

    return (
        <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            className={`w-full h-full max-w-full max-h-full transition-all duration-500 ${objectFit === 'contain' ? 'object-contain' : 'object-cover'}`}
            src={src}
            playsInline
            webkit-playsinline="true"
            loop={false} 
            onEnded={onEnded}
            onWaiting={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
            onTimeUpdate={(e) => {
                if(onTimeUpdate) onTimeUpdate(e.currentTarget.currentTime, e.currentTarget.duration);
            }}
            onError={() => {
                setHasError(true);
                setIsLoading(false);
            }}
            onClick={togglePlay}
        />
    );
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      {/* Loading */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40 backdrop-blur-sm">
          <Loader2 className="w-10 h-10 text-white/50 animate-spin" />
        </div>
      )}

      {/* Error */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white/60 bg-black">
          <p>Unable to load content</p>
          <button 
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
              if (type !== 'image' && mediaRef.current) mediaRef.current.load();
            }}
            className="mt-3 px-6 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {renderContent()}
      
      {/* Play Icon Overlay */}
      {!isPlayingGlobal && isActive && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] z-20 pointer-events-none animate-in fade-in">
            <div className="bg-black/50 p-6 rounded-full backdrop-blur-md shadow-2xl scale-100 transition-transform">
                <Play className="w-10 h-10 text-white fill-white" />
            </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;